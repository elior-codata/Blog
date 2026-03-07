// ========================================
// Local Data Service
// Uses local JSON files + localStorage for persistence
// Drop-in replacement for CodataAPI
// ========================================

const LocalDataService = {
    // Cache fetched data in memory
    _cache: {},

    // ---- Generic helpers ----

    async _fetchJSON(file) {
        if (this._cache[file]) return this._cache[file];
        try {
            const res = await fetch(`data/${file}`);
            if (!res.ok) return [];
            const data = await res.json();
            this._cache[file] = data;
            return data;
        } catch {
            return [];
        }
    },

    _getLocal(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    },

    _setLocal(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Merge: local edits on top of static JSON seed data
    async _getMerged(file, localKey, idField = 'id') {
        const seed = await this._fetchJSON(file);
        const local = this._getLocal(localKey);
        const deletedIds = this._getLocal(`${localKey}_deleted`);

        // Index local items by id for fast lookup
        const localMap = {};
        local.forEach(item => { localMap[item[idField]] = item; });

        // Start with seed, override with local copies, skip deleted
        const merged = seed
            .filter(item => !deletedIds.includes(item[idField]))
            .map(item => localMap[item[idField]] || item);

        // Add locally-created items (not in seed)
        const seedIds = new Set(seed.map(item => item[idField]));
        local.forEach(item => {
            if (!seedIds.has(item[idField]) && !deletedIds.includes(item[idField])) {
                merged.push(item);
            }
        });

        return merged;
    },

    // ---- Posts ----

    async getPosts(filters = {}) {
        let posts = await this._getMerged('posts.json', 'local_posts');
        if (filters.status) {
            posts = posts.filter(p => p.status === filters.status);
        }
        if (filters.destination) {
            posts = posts.filter(p => p.destination === filters.destination);
        }
        if (filters.category) {
            posts = posts.filter(p => p.category === filters.category);
        }
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async getPost(id) {
        const posts = await this._getMerged('posts.json', 'local_posts');
        return posts.find(p => p.id === id) || null;
    },

    async createPost(post) {
        const local = this._getLocal('local_posts');
        post.createdAt = post.createdAt || new Date().toISOString();
        post.updatedAt = new Date().toISOString();
        local.push(post);
        this._setLocal('local_posts', local);
        return post;
    },

    async updatePost(id, updates) {
        const local = this._getLocal('local_posts');
        updates.updatedAt = new Date().toISOString();
        const idx = local.findIndex(p => p.id === id);
        if (idx >= 0) {
            local[idx] = { ...local[idx], ...updates };
        } else {
            // Item exists in seed — save local override
            const seed = await this._fetchJSON('posts.json');
            const original = seed.find(p => p.id === id);
            local.push({ ...original, ...updates });
        }
        this._setLocal('local_posts', local);
        return updates;
    },

    async deletePost(id) {
        // Remove from local array
        let local = this._getLocal('local_posts');
        local = local.filter(p => p.id !== id);
        this._setLocal('local_posts', local);
        // Track deletion so seed items stay hidden
        const deleted = this._getLocal('local_posts_deleted');
        if (!deleted.includes(id)) deleted.push(id);
        this._setLocal('local_posts_deleted', deleted);
        return true;
    },

    // ---- Itineraries ----

    async getItineraries(destinationSlug = null) {
        let items = await this._getMerged('itineraries.json', 'local_itineraries');
        if (destinationSlug) {
            items = items.filter(it => it.destination === destinationSlug);
        }
        return items;
    },

    async getItinerary(id) {
        const items = await this._getMerged('itineraries.json', 'local_itineraries');
        return items.find(it => it.id === id) || null;
    },

    async createItinerary(itinerary) {
        const local = this._getLocal('local_itineraries');
        itinerary.createdAt = itinerary.createdAt || new Date().toISOString();
        itinerary.updatedAt = new Date().toISOString();
        local.push(itinerary);
        this._setLocal('local_itineraries', local);
        return itinerary;
    },

    async updateItinerary(id, updates) {
        const local = this._getLocal('local_itineraries');
        updates.updatedAt = new Date().toISOString();
        const idx = local.findIndex(it => it.id === id);
        if (idx >= 0) {
            local[idx] = { ...local[idx], ...updates };
        } else {
            const seed = await this._fetchJSON('itineraries.json');
            const original = seed.find(it => it.id === id);
            local.push({ ...original, ...updates });
        }
        this._setLocal('local_itineraries', local);
        return updates;
    },

    async deleteItinerary(id) {
        let local = this._getLocal('local_itineraries');
        local = local.filter(it => it.id !== id);
        this._setLocal('local_itineraries', local);
        const deleted = this._getLocal('local_itineraries_deleted');
        if (!deleted.includes(id)) deleted.push(id);
        this._setLocal('local_itineraries_deleted', deleted);
        return true;
    },

    // ---- Newsletter ----

    async subscribeNewsletter(email, preferences = {}) {
        const subs = this._getLocal('local_newsletters');
        if (subs.find(s => s.email === email)) {
            return { success: true, message: 'Already subscribed' };
        }
        subs.push({
            email,
            preferences,
            subscribedAt: new Date().toISOString()
        });
        this._setLocal('local_newsletters', subs);
        return { success: true, message: 'Subscribed successfully' };
    },

    // ---- Init (no-op, keeps same interface) ----
    async init() {
        console.log('LocalDataService initialized (local JSON files + localStorage)');
        return this;
    }
};

// Expose as CodataAPI alias so existing code works without changes
const CodataAPI = LocalDataService;

// Auto-init
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        LocalDataService.init();
    });
}
