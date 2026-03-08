// ========================================
// WANDERLUST & WONDER - Travel Blog
// JavaScript Functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initImageLazyLoad();
    initNewsletterForm();
    initFilmStrip();
    initWhereToGo();
    initSearch();
    initImageProtection();
    initImageEditMode();
});

// ========================================
// Image Protection
// ========================================
function initImageProtection() {
    // Replace image src with canvas-rendered low-res version on any extraction attempt
    function degradeImage(img) {
        const canvas = document.createElement('canvas');
        // Render at very low resolution
        const scale = 0.15;
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.1);
    }

    // Override toDataURL and toBlob on all canvases to prevent high-res extraction
    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function(...args) {
        if (this._isProtected) {
            const ctx = this.getContext('2d');
            ctx.filter = 'blur(8px)';
            ctx.drawImage(this, 0, 0);
        }
        return origToDataURL.apply(this, args);
    };

    // Prevent right-click on images and image containers
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || 
            e.target.closest('.hero-image') || 
            e.target.closest('.film-photo') ||
            e.target.closest('.destination-card-month') ||
            e.target.closest('.adventure-image')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevent dragging images
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable keyboard shortcuts for saving images
    document.addEventListener('keydown', (e) => {
        // Disable Ctrl+S / Cmd+S
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            return false;
        }
        // Disable F12 and Ctrl+Shift+I (Developer Tools)
        if (e.key === 'F12' || 
            ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
            return false;
        }
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// Search Functionality
// ========================================
function initSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    const navSearchInput = document.getElementById('navSearchInput');
    
    // Destination keyword map
    const destinationMap = {
        'italy': 'italy', 'rome': 'italy', 'venice': 'italy', 'florence': 'italy', 'amalfi': 'italy', 'tuscany': 'italy', 'cinque terre': 'italy',
        'japan': 'japan', 'tokyo': 'japan', 'kyoto': 'japan', 'osaka': 'japan',
        'bali': 'bali', 'indonesia': 'bali', 'ubud': 'bali',
        'greece': 'greece', 'santorini': 'greece', 'athens': 'greece', 'mykonos': 'greece',
        'thailand': 'thailand', 'bangkok': 'thailand', 'phuket': 'thailand', 'phi phi': 'thailand',
        'mexico': 'mexico', 'tulum': 'mexico', 'cancun': 'mexico',
        'iceland': 'iceland', 'reykjavik': 'iceland',
        'portugal': 'portugal', 'lisbon': 'portugal', 'porto': 'portugal', 'algarve': 'portugal',
        'spain': 'spain', 'barcelona': 'spain', 'madrid': 'spain',
        'france': 'france', 'paris': 'france', 'provence': 'france',
        'vietnam': 'vietnam', 'hanoi': 'vietnam', 'ho chi minh': 'vietnam',
        'sri lanka': 'srilanka', 'srilanka': 'srilanka',
        'costa rica': 'costarica', 'costarica': 'costarica',
        'peru': 'peru', 'machu picchu': 'peru', 'cusco': 'peru',
        'colombia': 'colombia', 'medellin': 'colombia',
        'maldives': 'maldives',
        'morocco': 'morocco', 'marrakech': 'morocco',
        'australia': 'australia', 'sydney': 'australia',
        'india': 'india',
        'egypt': 'egypt',
        'brazil': 'brazil',
        'netherlands': 'netherlands', 'amsterdam': 'netherlands',
        'croatia': 'croatia', 'dubrovnik': 'croatia',
        'norway': 'norway',
        'new zealand': 'newzealand',
        'tanzania': 'tanzania', 'kilimanjaro': 'tanzania'
    };
    
    function performSearch(query) {
        query = query.trim().toLowerCase();
        if (!query) return;
        
        // Find matching destination
        for (const [key, dest] of Object.entries(destinationMap)) {
            if (query.includes(key)) {
                window.location.href = `destination.html?d=${dest}`;
                return;
            }
        }
        
        // If no exact match, go to destinations page with search query
        window.location.href = `destinations.html?search=${encodeURIComponent(query)}`;
    }
    
    // Inline navbar search
    if (navSearchInput) {
        navSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(navSearchInput.value);
            }
        });
    }
    
    // Search overlay close
    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });
    
    // Handle search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch(searchInput.value);
        });
    }
}

// ========================================
// Mobile Menu Toggle
// ========================================
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    
                    const spans = navToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.destination-card, .post-card, .tip-card, .shop-item, .about-grid > *, .section-header'
    );
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// ========================================
// Lazy Load Images
// ========================================
function initImageLazyLoad() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => img.classList.add('loaded'));
    }
}

// ========================================
// Newsletter Form Handling
// ========================================
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button');
            const email = emailInput.value.trim();
            
            if (!email) return;
            
            // Disable button and show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            try {
                // Subscribe via local data backend
                if (typeof CodataAPI !== 'undefined') {
                    await CodataAPI.subscribeNewsletter(email, {
                        source: 'homepage',
                        subscribedAt: new Date().toISOString()
                    });
                }
                
                // Show success message
                submitBtn.textContent = 'Subscribed! ✓';
                submitBtn.style.background = '#4CAF50';
                emailInput.value = '';
            } catch (error) {
                console.error('Newsletter subscription failed:', error);
                submitBtn.textContent = 'Try Again';
                submitBtn.style.background = '#e74c3c';
            }
            
            // Reset after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }
}

// ========================================
// Film Strip - Infinite Scroll Photography
// ========================================
function initFilmStrip() {
    const track = document.getElementById('filmTrack');
    const prevBtn = document.getElementById('filmPrev');
    const nextBtn = document.getElementById('filmNext');
    
    if (!track) return;
    
    const frames = Array.from(track.querySelectorAll('.film-frame'));
    if (frames.length === 0) return;
    
    // Clone all frames for seamless infinite scroll
    frames.forEach(frame => {
        const clone = frame.cloneNode(true);
        clone.classList.add('cloned-frame');
        track.appendChild(clone);
    });
    
    // Remove CSS animation — we drive everything from JS
    track.style.animation = 'none';
    
    let position = 0;           // current translateX in px
    let paused = false;          // whether auto-scroll is paused
    let manualAnimating = false; // whether a manual click transition is running
    let lastTime = null;
    const speed = 0.03;          // px per ms  (slow gentle drift)
    
    function getFrameWidth() {
        const frame = track.querySelector('.film-frame');
        return frame ? frame.offsetWidth : 280;
    }
    
    function getHalfWidth() {
        // total width of original frames = half the track (since we cloned)
        return getFrameWidth() * frames.length;
    }
    
    // Wrap position so it stays in [-halfWidth, 0]
    function wrapPosition() {
        const half = getHalfWidth();
        while (position < -half) position += half;
        while (position > 0) position -= half;
    }
    
    function applyPosition() {
        track.style.transform = `translateX(${position}px)`;
    }
    
    // Continuous auto-scroll loop driven by requestAnimationFrame
    function tick(timestamp) {
        if (!paused && !manualAnimating) {
            if (lastTime !== null) {
                const dt = timestamp - lastTime;
                position -= speed * dt;
                wrapPosition();
                applyPosition();
            }
            lastTime = timestamp;
        } else {
            lastTime = null; // reset so we don't get a big jump on resume
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    
    // Manual scroll on arrow click — smooth transition, then auto-scroll resumes from new position
    function manualScroll(count) {
        if (manualAnimating) return;
        manualAnimating = true;
        
        const scrollAmount = getFrameWidth() * count;
        let target = position - scrollAmount;
        // wrap target
        const half = getHalfWidth();
        while (target < -half) target += half;
        while (target > 0) target -= half;
        
        track.style.transition = 'transform 0.6s ease';
        track.style.transform = `translateX(${target}px)`;
        
        setTimeout(() => {
            track.style.transition = 'none';
            position = target;
            lastTime = null;  // reset so auto-scroll resumes smoothly at same speed
            manualAnimating = false;
        }, 620);
    }
    
    // Arrow buttons: hover pauses, click scrolls manually
    [prevBtn, nextBtn].forEach((btn, i) => {
        if (!btn) return;
        const count = i === 0 ? -2 : 2;
        btn.addEventListener('click', () => manualScroll(count));
        btn.addEventListener('mouseenter', () => { paused = true; });
        btn.addEventListener('mouseleave', () => { paused = false; });
    });
    
    // Pause on track hover too
    track.addEventListener('mouseenter', () => { paused = true; });
    track.addEventListener('mouseleave', () => { paused = false; });
}

// ========================================
// Where to Go - Month Based Recommendations
// ========================================
function initWhereToGo() {
    const monthButtons = document.getElementById('monthButtons');
    const destinationsGrid = document.getElementById('monthDestinations');
    const monthNameSpan = document.getElementById('selectedMonthName');
    
    if (!monthButtons || !destinationsGrid || !monthNameSpan) return;
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Destination data by month
    const destinationsByMonth = {
        0: [ // January
            { name: 'Thailand', flag: '🇹🇭', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80', weather: '☀️ 28°C', reason: 'Dry season, perfect beaches', link: 'destination.html?d=thailand' },
            { name: 'Maldives', flag: '🇲🇻', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', weather: '☀️ 29°C', reason: 'Peak season, crystal waters', link: 'destination.html?d=maldives' },
            { name: 'Costa Rica', flag: '🇨🇷', image: 'https://images.unsplash.com/photo-1518259102261-b40117eabbc8?w=600&q=80', weather: '☀️ 27°C', reason: 'Dry season, wildlife viewing', link: 'destination.html?d=costarica' },
            { name: 'Australia', flag: '🇦🇺', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80', weather: '☀️ 26°C', reason: 'Summer vibes, beach life', link: 'destination.html?d=australia' }
        ],
        1: [ // February
            { name: 'Vietnam', flag: '🇻🇳', image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&q=80', weather: '☀️ 25°C', reason: 'Tet Festival celebrations', link: 'destination.html?d=vietnam' },
            { name: 'Brazil', flag: '🇧🇷', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80', weather: '☀️ 30°C', reason: 'Carnival season!', link: 'destination.html?d=brazil' },
            { name: 'Sri Lanka', flag: '🇱🇰', image: 'https://images.unsplash.com/photo-1586613835259-4f434582ad11?w=600&q=80', weather: '☀️ 28°C', reason: 'Whale watching season', link: 'destination.html?d=srilanka' },
            { name: 'Egypt', flag: '🇪🇬', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600&q=80', weather: '☀️ 22°C', reason: 'Perfect weather for pyramids', link: 'destination.html?d=egypt' }
        ],
        2: [ // March
            { name: 'Japan', flag: '🇯🇵', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80', weather: '🌸 15°C', reason: 'Cherry blossom season begins', link: 'destination.html?d=japan' },
            { name: 'Morocco', flag: '🇲🇦', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80', weather: '☀️ 20°C', reason: 'Spring colors in the medinas', link: 'destination.html?d=morocco' },
            { name: 'Peru', flag: '🇵🇪', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80', weather: '⛅ 18°C', reason: 'End of wet season, fewer crowds', link: 'destination.html?d=peru' },
            { name: 'India', flag: '🇮🇳', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', weather: '☀️ 28°C', reason: 'Holi Festival celebrations', link: 'destination.html?d=india' }
        ],
        3: [ // April
            { name: 'Greece', flag: '🇬🇷', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80', weather: '☀️ 20°C', reason: 'Easter celebrations, spring blooms', link: 'destination.html?d=greece' },
            { name: 'Netherlands', flag: '🇳🇱', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80', weather: '🌷 14°C', reason: 'Tulip season in full bloom', link: 'destination.html?d=netherlands' },
            { name: 'Jordan', flag: '🇯🇴', image: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=600&q=80', weather: '☀️ 24°C', reason: 'Perfect weather for Petra', link: 'destination.html?d=jordan' },
            { name: 'Mexico', flag: '🇲🇽', image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&q=80', weather: '☀️ 30°C', reason: 'Dry season, beach perfection', link: 'destination.html?d=mexico' }
        ],
        4: [ // May
            { name: 'Italy', flag: '🇮🇹', image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80', weather: '☀️ 22°C', reason: 'Perfect spring weather', link: 'destination.html?d=italy' },
            { name: 'Iceland', flag: '🇮🇸', image: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=600&q=80', weather: '⛅ 10°C', reason: 'Midnight sun begins', link: 'destination.html?d=iceland' },
            { name: 'Bali', flag: '🇮🇩', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', weather: '☀️ 28°C', reason: 'Dry season starts', link: 'destination.html?d=bali' },
            { name: 'Portugal', flag: '🇵🇹', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80', weather: '☀️ 21°C', reason: 'Sunny days, fewer tourists', link: 'destination.html?d=portugal' }
        ],
        5: [ // June
            { name: 'Norway', flag: '🇳🇴', image: 'https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f7?w=600&q=80', weather: '☀️ 16°C', reason: 'Midnight sun, fjord cruises', link: 'destination.html?d=norway' },
            { name: 'Croatia', flag: '🇭🇷', image: 'https://images.unsplash.com/photo-1555990538-1e6c89c23c98?w=600&q=80', weather: '☀️ 26°C', reason: 'Beach season begins', link: 'destination.html?d=croatia' },
            { name: 'Tanzania', flag: '🇹🇿', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80', weather: '☀️ 25°C', reason: 'Great Migration begins', link: 'destination.html?d=tanzania' },
            { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', image: 'https://images.unsplash.com/photo-1506377585622-bedcbb5f7311?w=600&q=80', weather: '⛅ 15°C', reason: 'Longest days, highland hikes', link: 'destination.html?d=scotland' }
        ],
        6: [ // July
            { name: 'France', flag: '🇫🇷', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', weather: '☀️ 25°C', reason: 'Lavender fields in Provence', link: 'destination.html?d=france' },
            { name: 'Canada', flag: '🇨🇦', image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&q=80', weather: '☀️ 22°C', reason: 'Perfect for national parks', link: 'destination.html?d=canada' },
            { name: 'Kenya', flag: '🇰🇪', image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80', weather: '☀️ 24°C', reason: 'Wildebeest migration peak', link: 'destination.html?d=kenya' },
            { name: 'Switzerland', flag: '🇨🇭', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', weather: '☀️ 20°C', reason: 'Alpine hiking paradise', link: 'destination.html?d=switzerland' }
        ],
        7: [ // August
            { name: 'Spain', flag: '🇪🇸', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80', weather: '☀️ 30°C', reason: 'La Tomatina festival', link: 'destination.html?d=spain' },
            { name: 'Indonesia', flag: '🇮🇩', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80', weather: '☀️ 27°C', reason: 'Dry season, island hopping', link: 'destination.html?d=bali' },
            { name: 'Alaska', flag: '🇺🇸', image: 'https://images.unsplash.com/photo-1531176175280-33e68ae69d9f?w=600&q=80', weather: '⛅ 15°C', reason: 'Bear watching, salmon run', link: 'destination.html?d=alaska' },
            { name: 'Austria', flag: '🇦🇹', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80', weather: '☀️ 24°C', reason: 'Salzburg Festival season', link: 'destination.html?d=austria' }
        ],
        8: [ // September
            { name: 'Italy', flag: '🇮🇹', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80', weather: '☀️ 24°C', reason: 'Grape harvest, wine festivals', link: 'destination.html?d=italy' },
            { name: 'China', flag: '🇨🇳', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80', weather: '☀️ 22°C', reason: 'Mid-Autumn Festival', link: 'destination.html?d=china' },
            { name: 'Turkey', flag: '🇹🇷', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80', weather: '☀️ 26°C', reason: 'Perfect weather, fewer crowds', link: 'destination.html?d=turkey' },
            { name: 'New Zealand', flag: '🇳🇿', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=600&q=80', weather: '🌸 14°C', reason: 'Spring blooms begin', link: 'destination.html?d=newzealand' }
        ],
        9: [ // October
            { name: 'Japan', flag: '🇯🇵', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80', weather: '🍂 18°C', reason: 'Autumn foliage spectacular', link: 'destination.html?d=japan' },
            { name: 'Mexico', flag: '🇲🇽', image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&q=80', weather: '☀️ 26°C', reason: 'Día de los Muertos', link: 'destination.html?d=mexico' },
            { name: 'Argentina', flag: '🇦🇷', image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=600&q=80', weather: '🌸 18°C', reason: 'Spring in Patagonia', link: 'destination.html?d=argentina' },
            { name: 'Rwanda', flag: '🇷🇼', image: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600&q=80', weather: '⛅ 20°C', reason: 'Gorilla trekking season', link: 'destination.html?d=rwanda' }
        ],
        10: [ // November
            { name: 'India', flag: '🇮🇳', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', weather: '☀️ 25°C', reason: 'Diwali celebrations', link: 'destination.html?d=india' },
            { name: 'Vietnam', flag: '🇻🇳', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80', weather: '☀️ 26°C', reason: 'Dry season in the south', link: 'destination.html?d=vietnam' },
            { name: 'Dubai', flag: '🇦🇪', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', weather: '☀️ 28°C', reason: 'Perfect weather, festivals', link: 'destination.html?d=dubai' },
            { name: 'Cuba', flag: '🇨🇺', image: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=600&q=80', weather: '☀️ 27°C', reason: 'Dry season begins', link: 'destination.html?d=cuba' }
        ],
        11: [ // December
            { name: 'Lapland', flag: '🇫🇮', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', weather: '❄️ -10°C', reason: 'Northern lights, Santa!', link: 'destination.html?d=finland' },
            { name: 'New Zealand', flag: '🇳🇿', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80', weather: '☀️ 22°C', reason: 'Summer adventures begin', link: 'destination.html?d=newzealand' },
            { name: 'Austria', flag: '🇦🇹', image: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=600&q=80', weather: '❄️ 2°C', reason: 'Christmas markets magic', link: 'destination.html?d=austria' },
            { name: 'Thailand', flag: '🇹🇭', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', weather: '☀️ 28°C', reason: 'Peak beach season', link: 'destination.html?d=thailand' }
        ]
    };
    
    // Get current month
    const currentMonth = new Date().getMonth();
    
    // Set initial active button and display
    function setActiveMonth(month) {
        // Update buttons
        const buttons = monthButtons.querySelectorAll('.month-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.month) === month);
        });
        
        // Update title
        monthNameSpan.textContent = monthNames[month];
        
        // Update destinations
        renderDestinations(month);
    }
    
    // Render destination cards
    function renderDestinations(month) {
        const destinations = destinationsByMonth[month];
        
        destinationsGrid.innerHTML = destinations.map(dest => `
            <a href="${dest.link}" class="destination-card-month">
                <img src="${dest.image}" alt="${dest.name}">
                <div class="overlay">
                    <h3>${dest.name}</h3>
                    <span class="weather">${dest.weather}</span>
                    <p class="reason">${dest.reason}</p>
                </div>
            </a>
        `).join('');
    }
    
    // Add click listeners to month buttons
    const buttons = monthButtons.querySelectorAll('.month-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const month = parseInt(btn.dataset.month);
            setActiveMonth(month);
        });
    });
    
    // Initialize with current month
    setActiveMonth(currentMonth);
}

// ========================================
// Parallax Effect for Hero
// ========================================
function initParallax() {
    const hero = document.querySelector('.hero-image img');
    
    if (hero && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// ========================================
// Dropdown Menu Enhancement (for touch devices)
// ========================================
document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
            }
        }
    });
});

// ========================================
// Image Gallery Lightbox (Optional Enhancement)
// ========================================
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const src = img.src.replace('w=600', 'w=1200');
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${src}" alt="${img.alt}">
                    <button class="lightbox-close">×</button>
                </div>
            `;
            
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                cursor: pointer;
            `;
            
            const content = lightbox.querySelector('.lightbox-content');
            content.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                position: relative;
            `;
            
            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Close lightbox
            const closeLightbox = () => {
                lightbox.remove();
                document.body.style.overflow = '';
            };
            
            lightbox.addEventListener('click', closeLightbox);
            closeBtn.addEventListener('click', closeLightbox);
        });
    });
}

// Initialize lightbox if desired
// initGalleryLightbox();

// ========================================
// Utility: Debounce Function
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Utility: Throttle Function
// ========================================
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Console Easter Egg
// ========================================
console.log(
    '%c✈️ Itinerant Pixels',
    'font-size: 24px; font-weight: bold; color: #2c3e50;'
);
console.log(
    '%cBeyond the Beaten Path',
    'font-size: 14px; color: #8b7355;'
);

// ========================================
// Image Edit Mode System
// ========================================

let siteEditMode = false;

function initImageEditMode() {
    const editBtn = document.getElementById('siteEditBtn');
    if (!editBtn) return;

    // Check auth
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    if (isAuth) {
        editBtn.style.display = 'flex';
    }

    editBtn.addEventListener('click', toggleSiteEditMode);
}

function toggleSiteEditMode() {
    siteEditMode = !siteEditMode;
    document.body.classList.toggle('site-edit-mode', siteEditMode);

    const editBtn = document.getElementById('siteEditBtn');
    if (editBtn) editBtn.classList.toggle('active', siteEditMode);

    if (siteEditMode) {
        addEditOverlays();
    } else {
        removeEditOverlays();
    }
}

function addEditOverlays() {
    // Film strip frames — prevent link navigation in edit mode
    document.querySelectorAll('.film-frame:not(.cloned-frame)').forEach((frame, i) => {
        frame.addEventListener('click', filmEditBlocker);
        const photo = frame.querySelector('.film-photo');
        if (photo && !photo.querySelector('.edit-image-overlay')) {
            const overlay = createEditOverlay('film', i);
            photo.appendChild(overlay);
        }
    });

    // Gallery items
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        if (item.querySelector('.edit-image-overlay')) return;
        const overlay = createEditOverlay('gallery', i);
        item.appendChild(overlay);
    });
}

function filmEditBlocker(e) {
    if (document.body.classList.contains('site-edit-mode')) {
        e.preventDefault();
    }
}

function removeEditOverlays() {
    document.querySelectorAll('.edit-image-overlay').forEach(el => el.remove());
}

function createEditOverlay(type, index) {
    const overlay = document.createElement('div');
    overlay.className = 'edit-image-overlay';
    overlay.innerHTML = `
        <button class="edit-image-btn" title="Replace image">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Replace</span>
        </button>
    `;
    overlay.querySelector('.edit-image-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerImageUpload(type, index);
    });
    return overlay;
}

function triggerImageUpload(type, index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (!file) return;
        input.remove();

        const targetImg = getTargetImage(type, index);
        if (!targetImg) return;

        targetImg.style.opacity = '0.5';

        // Read file as data URL — no server needed
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            replaceImage(type, index, dataUrl);
            saveImageEdit(type, index, dataUrl);
        };
        reader.onerror = () => {
            targetImg.style.opacity = '1';
            alert('Failed to read image file.');
        };
        reader.readAsDataURL(file);
    });

    input.click();
}

function getTargetImage(type, index) {
    if (type === 'film') {
        const frames = document.querySelectorAll('.film-frame:not(.cloned-frame) .film-photo img');
        return frames[index] || null;
    } else if (type === 'gallery') {
        const items = document.querySelectorAll('.gallery-item img');
        return items[index] || null;
    }
    return null;
}

function replaceImage(type, index, newSrc) {
    if (type === 'film') {
        // Replace in original frames
        const origFrames = document.querySelectorAll('.film-frame:not(.cloned-frame) .film-photo img');
        if (origFrames[index]) {
            origFrames[index].src = newSrc;
            origFrames[index].style.opacity = '1';
        }
        // Also replace in cloned frames (film strip clones for infinite scroll)
        const clonedFrames = document.querySelectorAll('.cloned-frame .film-photo img');
        if (clonedFrames[index]) {
            clonedFrames[index].src = newSrc;
        }
    } else if (type === 'gallery') {
        const items = document.querySelectorAll('.gallery-item img');
        if (items[index]) {
            items[index].src = newSrc;
            items[index].style.opacity = '1';
        }
    }
}

function saveImageEdit(type, index, url) {
    const edits = JSON.parse(localStorage.getItem('imageEdits') || '{}');
    const key = `${type}_${index}`;
    edits[key] = url;
    localStorage.setItem('imageEdits', JSON.stringify(edits));
}

function loadSavedImageEdits() {
    const edits = JSON.parse(localStorage.getItem('imageEdits') || '{}');
    for (const [key, url] of Object.entries(edits)) {
        const [type, indexStr] = key.split('_');
        const index = parseInt(indexStr, 10);
        replaceImage(type, index, url);
    }
}

// Load saved edits on every page load
document.addEventListener('DOMContentLoaded', loadSavedImageEdits);

// Make functions globally available
window.toggleSiteEditMode = toggleSiteEditMode;

// ========================================
// Admin Authentication (Site-wide)
// ========================================
const ADMIN_PASSWORD = 'itinerant2026';

function showAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('adminPasswordHome').focus();
    }
}

function hideAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('adminPasswordHome').value = '';
        document.getElementById('loginErrorHome').style.display = 'none';
    }
}

function attemptAdminLogin() {
    const password = document.getElementById('adminPasswordHome').value;
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_authenticated', 'true');
        hideAdminLogin();
        alert('✅ Admin mode activated! You can now edit pages across the site.');
    } else {
        document.getElementById('loginErrorHome').style.display = 'block';
        document.getElementById('adminPasswordHome').value = '';
        document.getElementById('adminPasswordHome').focus();
    }
}

function logoutAdmin() {
    localStorage.removeItem('admin_authenticated');
    window.location.reload();
}

// Secret keyboard shortcut: Ctrl+Shift+L to open admin login
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        const isAuth = localStorage.getItem('admin_authenticated') === 'true';
        if (!isAuth) {
            showAdminLogin();
        }
    }
});

// Close modal on background click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('adminLoginModal');
    if (e.target === modal) {
        hideAdminLogin();
    }
    
    // Close home edit menu when clicking outside
    const editMenu = document.getElementById('homeEditMenu');
    const editBtn = document.getElementById('homeEditBtn');
    if (editMenu && !editMenu.contains(e.target) && !editBtn.contains(e.target)) {
        editMenu.classList.remove('active');
        editBtn.classList.remove('active');
    }
});

// Toggle home edit menu
function toggleHomeEditMenu() {
    const menu = document.getElementById('homeEditMenu');
    const btn = document.getElementById('homeEditBtn');
    menu.classList.toggle('active');
    btn.classList.toggle('active');
}

// Make functions globally available
window.toggleHomeEditMenu = toggleHomeEditMenu;
