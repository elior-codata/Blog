// ========================================
// Codata Backend API Service
// With IndexedDB fallback for offline support
// ========================================

const CodataAPI = {
    // Configuration
    config: {
        baseUrl: 'https://codata.io/api/v1',
        workspace: '69931b46e6e07418fad67635',
        // Enable/disable remote Codata backend (uses IndexedDB when disabled or offline)
        enabled: true, // Codata backend is now enabled
        // API key for authentication (set via environment or configuration)
        apiKey: null, // Will be set during initialization
        // Request timeout in milliseconds
        timeout: 10000,
        // IndexedDB database name
        dbName: 'ItinerantPixelsDB',
        dbVersion: 2,
        // Retry configuration
        maxRetries: 3,
        retryDelay: 1000
    },

    // Track online/offline status
    isOnline: navigator.onLine,

    // Initialize the API service
    async init(apiKey = null) {
        // Set API key if provided
        if (apiKey) {
            this.config.apiKey = apiKey;
        }

        // Try to load API key from localStorage if not provided
        if (!this.config.apiKey) {
            this.config.apiKey = localStorage.getItem('codata_api_key');
        }

        // Setup online/offline listeners
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('Codata: Back online, syncing data...');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('Codata: Offline mode activated');
        });

        // Initialize IndexedDB for offline support
        await this.initDB();

        console.log('CodataAPI initialized', {
            enabled: this.config.enabled,
            online: this.isOnline,
            workspace: this.config.workspace
        });

        return this;
    },

    // Set API key
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
        localStorage.setItem('codata_api_key', apiKey);
    },

    // IndexedDB instance
    db: null,

    // Initialize IndexedDB
    async initDB() {
        if (this.db) return this.db;
        
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, this.config.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores (collections)
                if (!db.objectStoreNames.contains('itineraries')) {
                    const itineraryStore = db.createObjectStore('itineraries', { keyPath: 'id' });
                    itineraryStore.createIndex('destination', 'destination', { unique: false });
                    itineraryStore.createIndex('createdAt', 'createdAt', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('posts')) {
                    const postStore = db.createObjectStore('posts', { keyPath: 'id' });
                    postStore.createIndex('destination', 'destination', { unique: false });
                    postStore.createIndex('category', 'category', { unique: false });
                    postStore.createIndex('createdAt', 'createdAt', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('destinations')) {
                    db.createObjectStore('destinations', { keyPath: 'slug' });
                }
                
                if (!db.objectStoreNames.contains('newsletters')) {
                    const newsletterStore = db.createObjectStore('newsletters', { keyPath: 'email' });
                    newsletterStore.createIndex('subscribedAt', 'subscribedAt', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('sections')) {
                    const sectionStore = db.createObjectStore('sections', { keyPath: 'id' });
                    sectionStore.createIndex('destination', 'destination', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('analytics')) {
                    const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
                    analyticsStore.createIndex('page', 'page', { unique: false });
                    analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Offline queue for sync operations
                if (!db.objectStoreNames.contains('offlineQueue')) {
                    const queueStore = db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
                    queueStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Cache for remote data
                if (!db.objectStoreNames.contains('cache')) {
                    const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
                    cacheStore.createIndex('expiry', 'expiry', { unique: false });
                }
            };
        });
    },

    // Generic IndexedDB operations
    async dbGet(storeName, key) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async dbGetAll(storeName, indexName = null, query = null) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            let request;
            
            if (indexName && query) {
                const index = store.index(indexName);
                request = index.getAll(query);
            } else {
                request = store.getAll();
            }
            
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    async dbPut(storeName, data) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async dbDelete(storeName, key) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },

    // Queue for offline operations
    offlineQueue: [],

    // Add operation to offline queue
    async queueOfflineOperation(operation) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('offlineQueue', 'readwrite');
            const store = transaction.objectStore('offlineQueue');
            const request = store.add({
                ...operation,
                timestamp: new Date().toISOString()
            });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Sync offline data when back online
    async syncOfflineData() {
        if (!this.isOnline || !this.config.enabled) return;

        try {
            await this.initDB();
            const transaction = this.db.transaction('offlineQueue', 'readonly');
            const store = transaction.objectStore('offlineQueue');
            const request = store.getAll();

            request.onsuccess = async () => {
                const operations = request.result || [];
                
                for (const op of operations) {
                    try {
                        await this.request(op.endpoint, op.method, op.data, false);
                        // Remove from queue after successful sync
                        const deleteTx = this.db.transaction('offlineQueue', 'readwrite');
                        deleteTx.objectStore('offlineQueue').delete(op.id);
                    } catch (error) {
                        console.warn('Failed to sync operation:', op, error);
                    }
                }

                if (operations.length > 0) {
                    console.log(`Synced ${operations.length} offline operations`);
                }
            };
        } catch (error) {
            console.error('Error syncing offline data:', error);
        }
    },

    // Helper to make remote API requests with timeout and retry
    async request(endpoint, method = 'GET', data = null, allowOfflineQueue = true, retryCount = 0) {
        if (!this.config.enabled) {
            throw new Error('Remote Codata API is disabled - using local IndexedDB');
        }

        // If offline and it's a write operation, queue it
        if (!this.isOnline && method !== 'GET' && allowOfflineQueue) {
            await this.queueOfflineOperation({ endpoint, method, data });
            throw new Error('Offline - operation queued for sync');
        }
        
        const url = `${this.config.baseUrl}/workspaces/${this.config.workspace}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Workspace-Id': this.config.workspace
            },
            signal: controller.signal
        };

        // Add API key if available
        if (this.config.apiKey) {
            options.headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorBody}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return { success: true };
        } catch (error) {
            clearTimeout(timeoutId);
            
            // Retry logic for transient failures
            if (retryCount < this.config.maxRetries && 
                (error.name === 'AbortError' || error.message.includes('fetch'))) {
                console.warn(`Codata API retry ${retryCount + 1}/${this.config.maxRetries}`);
                await new Promise(r => setTimeout(r, this.config.retryDelay * (retryCount + 1)));
                return this.request(endpoint, method, data, allowOfflineQueue, retryCount + 1);
            }
            
            if (error.name === 'AbortError') {
                console.error('Codata API request timed out');
                throw new Error('Request timed out');
            }
            console.error('Codata API error:', error);
            throw error;
        }
    },

    // ========================================
    // Cache Management
    // ========================================

    async getCached(key, maxAgeMs = 5 * 60 * 1000) {
        try {
            const cached = await this.dbGet('cache', key);
            if (cached && cached.expiry > Date.now()) {
                return cached.data;
            }
            return null;
        } catch {
            return null;
        }
    },

    async setCache(key, data, maxAgeMs = 5 * 60 * 1000) {
        try {
            await this.dbPut('cache', {
                key,
                data,
                expiry: Date.now() + maxAgeMs
            });
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    },

    // ========================================
    // Destinations
    // ========================================

    async getDestinations() {
        // Try cache first
        const cached = await this.getCached('destinations');
        if (cached) return cached;

        try {
            const result = await this.request('/collections/destinations/records');
            const data = result.data || result.records || result;
            await this.setCache('destinations', data);
            // Also store in IndexedDB for offline
            if (Array.isArray(data)) {
                for (const dest of data) {
                    await this.dbPut('destinations', dest);
                }
            }
            return data;
        } catch (error) {
            console.warn('Failed to fetch destinations from Codata, using IndexedDB fallback');
            return await this.dbGetAll('destinations');
        }
    },

    async getDestination(slug) {
        // Try cache first
        const cached = await this.getCached(`destination_${slug}`);
        if (cached) return cached;

        try {
            const result = await this.request(`/collections/destinations/records/${slug}`);
            const data = result.data || result;
            await this.setCache(`destination_${slug}`, data);
            await this.dbPut('destinations', data);
            return data;
        } catch (error) {
            console.warn(`Failed to fetch destination ${slug} from Codata, using IndexedDB`);
            return await this.dbGet('destinations', slug);
        }
    },

    async saveDestination(destination) {
        if (!destination.slug) {
            destination.slug = destination.name.toLowerCase().replace(/\s+/g, '-');
        }
        
        try {
            const result = await this.request('/collections/destinations/records', 'POST', destination);
            const data = result.data || result;
            await this.dbPut('destinations', data);
            return data;
        } catch (error) {
            // Save locally if offline
            await this.dbPut('destinations', destination);
            if (error.message.includes('Offline')) {
                return destination;
            }
            throw error;
        }
    },

    async updateDestination(slug, updates) {
        try {
            const result = await this.request(`/collections/destinations/records/${slug}`, 'PUT', updates);
            const data = result.data || result;
            await this.dbPut('destinations', { slug, ...data });
            return data;
        } catch (error) {
            // Update locally if offline
            const existing = await this.dbGet('destinations', slug);
            const updated = { ...existing, ...updates };
            await this.dbPut('destinations', updated);
            if (error.message.includes('Offline')) {
                return updated;
            }
            throw error;
        }
    },

    async deleteDestination(slug) {
        try {
            await this.request(`/collections/destinations/records/${slug}`, 'DELETE');
            await this.dbDelete('destinations', slug);
            return true;
        } catch (error) {
            if (error.message.includes('Offline')) {
                await this.dbDelete('destinations', slug);
                return true;
            }
            throw error;
        }
    },

    // ========================================
    // Itineraries
    // ========================================

    async getItineraries(destinationSlug = null) {
        const cacheKey = destinationSlug ? `itineraries_${destinationSlug}` : 'itineraries_all';
        const cached = await this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const endpoint = destinationSlug 
                ? `/collections/itineraries/records?filter=destination:${destinationSlug}` 
                : '/collections/itineraries/records';
            const result = await this.request(endpoint);
            const data = result.data || result.records || result;
            await this.setCache(cacheKey, data);
            // Store in IndexedDB
            if (Array.isArray(data)) {
                for (const it of data) {
                    await this.dbPut('itineraries', it);
                }
            }
            return data;
        } catch (error) {
            console.warn('Failed to fetch itineraries from Codata, using IndexedDB fallback');
            if (destinationSlug) {
                return await this.dbGetAll('itineraries', 'destination', destinationSlug);
            }
            return await this.dbGetAll('itineraries');
        }
    },

    async getItinerary(id) {
        const cached = await this.getCached(`itinerary_${id}`);
        if (cached) return cached;

        try {
            const result = await this.request(`/collections/itineraries/records/${id}`);
            const data = result.data || result;
            await this.setCache(`itinerary_${id}`, data);
            await this.dbPut('itineraries', data);
            return data;
        } catch (error) {
            console.warn(`Failed to fetch itinerary ${id} from Codata, using IndexedDB`);
            return await this.dbGet('itineraries', id);
        }
    },

    async createItinerary(itinerary) {
        // Ensure itinerary has an ID
        if (!itinerary.id) {
            itinerary.id = `it-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        itinerary.createdAt = itinerary.createdAt || new Date().toISOString();
        
        try {
            const result = await this.request('/collections/itineraries/records', 'POST', itinerary);
            const data = result.data || result;
            await this.dbPut('itineraries', data);
            return data;
        } catch (error) {
            // Save locally if offline
            await this.dbPut('itineraries', itinerary);
            if (error.message.includes('Offline')) {
                return itinerary;
            }
            throw error;
        }
    },

    async updateItinerary(id, updates) {
        updates.updatedAt = new Date().toISOString();
        
        try {
            const result = await this.request(`/collections/itineraries/records/${id}`, 'PUT', updates);
            const data = result.data || result;
            await this.dbPut('itineraries', { id, ...data });
            return data;
        } catch (error) {
            // Update locally if offline
            const existing = await this.dbGet('itineraries', id);
            const updated = { ...existing, ...updates };
            await this.dbPut('itineraries', updated);
            if (error.message.includes('Offline')) {
                return updated;
            }
            throw error;
        }
    },

    async deleteItinerary(id) {
        try {
            await this.request(`/collections/itineraries/records/${id}`, 'DELETE');
            await this.dbDelete('itineraries', id);
            return true;
        } catch (error) {
            if (error.message.includes('Offline')) {
                await this.dbDelete('itineraries', id);
                return true;
            }
            throw error;
        }
    },

    // ========================================
    // Posts / Travel Guides
    // ========================================

    async getPosts(filters = {}) {
        const cacheKey = `posts_${JSON.stringify(filters)}`;
        const cached = await this.getCached(cacheKey);
        if (cached) return cached;

        try {
            let endpoint = '/collections/posts/records';
            const params = new URLSearchParams();
            
            if (filters.destination) params.append('filter', `destination:${filters.destination}`);
            if (filters.category) params.append('filter', `category:${filters.category}`);
            if (filters.limit) params.append('limit', filters.limit);
            
            if (params.toString()) {
                endpoint += '?' + params.toString();
            }
            
            const result = await this.request(endpoint);
            const data = result.data || result.records || result;
            await this.setCache(cacheKey, data);
            // Store in IndexedDB
            if (Array.isArray(data)) {
                for (const post of data) {
                    await this.dbPut('posts', post);
                }
            }
            return data;
        } catch (error) {
            console.warn('Failed to fetch posts from Codata, using IndexedDB');
            let posts = await this.dbGetAll('posts');
            if (filters.destination) {
                posts = posts.filter(p => p.destination === filters.destination);
            }
            if (filters.category) {
                posts = posts.filter(p => p.category === filters.category);
            }
            if (filters.limit) {
                posts = posts.slice(0, filters.limit);
            }
            return posts;
        }
    },

    async getPost(id) {
        const cached = await this.getCached(`post_${id}`);
        if (cached) return cached;

        try {
            const result = await this.request(`/collections/posts/records/${id}`);
            const data = result.data || result;
            await this.setCache(`post_${id}`, data);
            await this.dbPut('posts', data);
            return data;
        } catch (error) {
            console.warn(`Failed to fetch post ${id} from Codata, using IndexedDB`);
            return await this.dbGet('posts', id);
        }
    },

    async createPost(post) {
        if (!post.id) {
            post.id = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        post.createdAt = post.createdAt || new Date().toISOString();
        
        try {
            const result = await this.request('/collections/posts/records', 'POST', post);
            const data = result.data || result;
            await this.dbPut('posts', data);
            return data;
        } catch (error) {
            await this.dbPut('posts', post);
            if (error.message.includes('Offline')) {
                return post;
            }
            throw error;
        }
    },

    async updatePost(id, updates) {
        updates.updatedAt = new Date().toISOString();
        
        try {
            const result = await this.request(`/collections/posts/records/${id}`, 'PUT', updates);
            const data = result.data || result;
            await this.dbPut('posts', { id, ...data });
            return data;
        } catch (error) {
            const existing = await this.dbGet('posts', id);
            const updated = { ...existing, ...updates };
            await this.dbPut('posts', updated);
            if (error.message.includes('Offline')) {
                return updated;
            }
            throw error;
        }
    },

    async deletePost(id) {
        try {
            await this.request(`/collections/posts/records/${id}`, 'DELETE');
            await this.dbDelete('posts', id);
            return true;
        } catch (error) {
            if (error.message.includes('Offline')) {
                await this.dbDelete('posts', id);
                return true;
            }
            throw error;
        }
    },

    // ========================================
    // Custom Sections
    // ========================================

    async getCustomSections(destinationSlug) {
        const cacheKey = `sections_${destinationSlug}`;
        const cached = await this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const result = await this.request(`/collections/sections/records?filter=destination:${destinationSlug}`);
            const data = result.data || result.records || result;
            await this.setCache(cacheKey, data);
            if (Array.isArray(data)) {
                for (const section of data) {
                    await this.dbPut('sections', section);
                }
            }
            return data;
        } catch (error) {
            console.warn('Failed to fetch custom sections from Codata, using IndexedDB');
            return await this.dbGetAll('sections', 'destination', destinationSlug);
        }
    },

    async saveCustomSection(section) {
        if (!section.id) {
            section.id = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        section.createdAt = section.createdAt || new Date().toISOString();

        try {
            const result = await this.request('/collections/sections/records', 'POST', section);
            const data = result.data || result;
            await this.dbPut('sections', data);
            return data;
        } catch (error) {
            await this.dbPut('sections', section);
            if (error.message.includes('Offline')) {
                return section;
            }
            throw error;
        }
    },

    async updateCustomSection(id, updates) {
        updates.updatedAt = new Date().toISOString();
        
        try {
            const result = await this.request(`/collections/sections/records/${id}`, 'PUT', updates);
            const data = result.data || result;
            await this.dbPut('sections', { id, ...data });
            return data;
        } catch (error) {
            const existing = await this.dbGet('sections', id);
            const updated = { ...existing, ...updates };
            await this.dbPut('sections', updated);
            if (error.message.includes('Offline')) {
                return updated;
            }
            throw error;
        }
    },

    async deleteCustomSection(id) {
        try {
            await this.request(`/collections/sections/records/${id}`, 'DELETE');
            await this.dbDelete('sections', id);
            return true;
        } catch (error) {
            if (error.message.includes('Offline')) {
                await this.dbDelete('sections', id);
                return true;
            }
            throw error;
        }
    },

    // ========================================
    // Newsletter Subscriptions
    // ========================================

    async subscribeNewsletter(email, preferences = {}) {
        const subscription = {
            email,
            preferences,
            subscribedAt: new Date().toISOString()
        };

        try {
            const result = await this.request('/collections/newsletters/records', 'POST', subscription);
            const data = result.data || result;
            await this.dbPut('newsletters', data);
            return data;
        } catch (error) {
            await this.dbPut('newsletters', subscription);
            if (error.message.includes('Offline')) {
                return subscription;
            }
            throw error;
        }
    },

    async getNewsletterSubscribers() {
        try {
            const result = await this.request('/collections/newsletters/records');
            return result.data || result.records || result;
        } catch (error) {
            return await this.dbGetAll('newsletters');
        }
    },

    async unsubscribeNewsletter(email) {
        try {
            await this.request(`/collections/newsletters/records/${email}`, 'DELETE');
            await this.dbDelete('newsletters', email);
            return true;
        } catch (error) {
            if (error.message.includes('Offline')) {
                await this.dbDelete('newsletters', email);
                return true;
            }
            throw error;
        }
    },

    // ========================================
    // Analytics
    // ========================================

    async trackPageView(page, metadata = {}) {
        const analytics = {
            page,
            metadata,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || null
        };

        try {
            await this.request('/collections/analytics/records', 'POST', analytics);
        } catch (error) {
            // Store locally for later sync
            await this.dbPut('analytics', analytics);
        }
    },

    async getAnalytics(filters = {}) {
        try {
            let endpoint = '/collections/analytics/records';
            const params = new URLSearchParams();
            
            if (filters.page) params.append('filter', `page:${filters.page}`);
            if (filters.startDate) params.append('filter', `timestamp>=${filters.startDate}`);
            if (filters.endDate) params.append('filter', `timestamp<=${filters.endDate}`);
            if (filters.limit) params.append('limit', filters.limit);
            
            if (params.toString()) {
                endpoint += '?' + params.toString();
            }
            
            const result = await this.request(endpoint);
            return result.data || result.records || result;
        } catch (error) {
            return await this.dbGetAll('analytics');
        }
    },

    // ========================================
    // Data Sync / Migration Helpers
    // ========================================

    // Migrate localStorage data to Codata
    async migrateLocalStorageData() {
        console.log('Starting migration from localStorage to Codata...');
        let migrationReport = { itineraries: 0, posts: 0, errors: [] };
        
        // Migrate itineraries for all destinations
        const destinations = ['italy', 'greece', 'portugal', 'spain', 'france', 'bali', 'japan', 'thailand', 'mexico', 'iceland', 'vietnam', 'srilanka', 'costarica', 'peru', 'colombia'];
        
        for (const dest of destinations) {
            const stored = localStorage.getItem(`itineraries_${dest}`);
            if (stored) {
                try {
                    const itineraries = JSON.parse(stored);
                    for (const itinerary of itineraries) {
                        itinerary.destination = dest;
                        await this.createItinerary(itinerary);
                        migrationReport.itineraries++;
                    }
                    console.log(`Migrated ${itineraries.length} itineraries for ${dest}`);
                } catch (error) {
                    console.error(`Failed to migrate itineraries for ${dest}:`, error);
                    migrationReport.errors.push({ type: 'itinerary', dest, error: error.message });
                }
            }
        }

        // Migrate custom itineraries
        const customItineraries = localStorage.getItem('customItineraries');
        if (customItineraries) {
            try {
                const items = JSON.parse(customItineraries);
                for (const item of items) {
                    await this.createItinerary(item);
                    migrationReport.itineraries++;
                }
                console.log(`Migrated ${items.length} custom itineraries`);
            } catch (error) {
                console.error('Failed to migrate custom itineraries:', error);
                migrationReport.errors.push({ type: 'customItineraries', error: error.message });
            }
        }

        // Migrate posts
        const posts = localStorage.getItem('blog_posts');
        if (posts) {
            try {
                const items = JSON.parse(posts);
                for (const item of items) {
                    await this.createPost(item);
                    migrationReport.posts++;
                }
                console.log(`Migrated ${items.length} posts`);
            } catch (error) {
                console.error('Failed to migrate posts:', error);
                migrationReport.errors.push({ type: 'posts', error: error.message });
            }
        }

        console.log('Migration complete!', migrationReport);
        return migrationReport;
    },

    // Clear local cache
    async clearCache() {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('cache', 'readwrite');
            const store = transaction.objectStore('cache');
            const request = store.clear();
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },

    // Get status of the API service
    getStatus() {
        return {
            enabled: this.config.enabled,
            online: this.isOnline,
            workspace: this.config.workspace,
            baseUrl: this.config.baseUrl,
            hasApiKey: !!this.config.apiKey
        };
    },

    // Health check
    async healthCheck() {
        try {
            const result = await this.request('/health', 'GET', null, false);
            return { status: 'ok', ...result };
        } catch (error) {
            return { status: 'error', message: error.message, online: this.isOnline };
        }
    },

    // Search across all collections
    async search(query, collections = ['itineraries', 'posts', 'destinations']) {
        const results = { query, matches: [] };
        const searchTerms = query.toLowerCase().split(' ');

        for (const collection of collections) {
            try {
                let items = [];
                
                switch (collection) {
                    case 'itineraries':
                        items = await this.getItineraries();
                        break;
                    case 'posts':
                        items = await this.getPosts();
                        break;
                    case 'destinations':
                        items = await this.getDestinations();
                        break;
                }

                if (Array.isArray(items)) {
                    const matches = items.filter(item => {
                        const searchableText = JSON.stringify(item).toLowerCase();
                        return searchTerms.some(term => searchableText.includes(term));
                    });

                    results.matches.push(...matches.map(item => ({
                        ...item,
                        _collection: collection
                    })));
                }
            } catch (error) {
                console.warn(`Search failed for collection ${collection}:`, error);
            }
        }

        return results;
    }
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        CodataAPI.init().then(() => {
            console.log('CodataAPI ready');
        }).catch(error => {
            console.error('CodataAPI initialization failed:', error);
        });
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodataAPI;
}
