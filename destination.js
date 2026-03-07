// ========================================
// Destination Page - JavaScript
// ========================================

// Destinations Data
const destinationsData = {
    italy: {
        name: 'Italy',
        flag: '🇮🇹',
        tagline: 'Discover the beauty of la dolce vita',
        heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920&q=80',
        region: 'europe'
    },
    greece: {
        name: 'Greece',
        flag: '🇬🇷',
        tagline: 'Ancient wonders and island paradise',
        heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=80',
        region: 'europe'
    },
    portugal: {
        name: 'Portugal',
        flag: '🇵🇹',
        tagline: 'Where the Atlantic meets rich heritage',
        heroImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1920&q=80',
        region: 'europe'
    },
    spain: {
        name: 'Spain',
        flag: '🇪🇸',
        tagline: 'Passion, culture, and endless sunshine',
        heroImage: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1920&q=80',
        region: 'europe'
    },
    france: {
        name: 'France',
        flag: '🇫🇷',
        tagline: 'Romance, art, and culinary excellence',
        heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80',
        region: 'europe'
    },
    bali: {
        name: 'Bali',
        flag: '🇮🇩',
        tagline: 'Island of the gods',
        heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80',
        region: 'asia'
    },
    japan: {
        name: 'Japan',
        flag: '🇯🇵',
        tagline: 'Where tradition meets the future',
        heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80',
        region: 'asia'
    },
    thailand: {
        name: 'Thailand',
        flag: '🇹🇭',
        tagline: 'The land of smiles',
        heroImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80',
        region: 'asia'
    },
    mexico: {
        name: 'Mexico',
        flag: '🇲🇽',
        tagline: 'Ancient ruins and vibrant culture',
        heroImage: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1920&q=80',
        region: 'americas'
    },
    iceland: {
        name: 'Iceland',
        flag: '🇮🇸',
        tagline: 'Land of fire and ice',
        heroImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1920&q=80',
        region: 'europe'
    }
};

// Mock Italy Itineraries
const mockItalyItineraries = [
    {
        id: 'it-1',
        destination: 'italy',
        title: 'The Classic 2-Week Italy Itinerary',
        duration: '2 Weeks',
        durationCode: '2weeks',
        regions: 'Rome, Florence, Venice, Cinque Terre',
        description: 'The perfect introduction to Italy covering the must-see destinations. From ancient Roman ruins to Renaissance art, floating cities to colorful coastal villages.',
        coverImage: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&q=80',
        highlights: ['Colosseum', 'Vatican City', 'Uffizi Gallery', 'Gondola Ride', 'Cinque Terre Hike'],
        days: [
            {
                dayNumber: 1,
                title: 'Arrival in Rome',
                description: 'Arrive at Rome Fiumicino Airport and transfer to your hotel in the historic center. Take an evening stroll through the cobblestone streets, toss a coin in the Trevi Fountain, and enjoy your first authentic Italian dinner in Trastevere.'
            },
            {
                dayNumber: 2,
                title: 'Ancient Rome',
                description: 'Start early at the Colosseum (book skip-the-line tickets!), then explore the Roman Forum and Palatine Hill. Afternoon at Piazza Navona and the Pantheon. End with aperitivo near Campo de\' Fiori.'
            },
            {
                dayNumber: 3,
                title: 'Vatican City',
                description: 'Full day at Vatican City. Morning at the Vatican Museums and Sistine Chapel (book first entry at 8am). Afternoon climbing St. Peter\'s Dome for panoramic views. Evening in the charming Prati neighborhood.'
            },
            {
                dayNumber: 4,
                title: 'Rome to Florence',
                description: 'Morning train to Florence (1.5 hours on high-speed train). Check in and explore the Duomo, climb Giotto\'s Bell Tower. Sunset at Piazzale Michelangelo with views over the entire city.'
            },
            {
                dayNumber: 5,
                title: 'Florence Art & Culture',
                description: 'Morning at the Uffizi Gallery (Botticelli\'s Birth of Venus awaits!). Afternoon at the Accademia to see Michelangelo\'s David. Cross the Ponte Vecchio and get lost in the Oltrarno artisan quarter.'
            },
            {
                dayNumber: 6,
                title: 'Tuscan Day Trip',
                description: 'Day trip to the Tuscan countryside. Visit San Gimignano\'s medieval towers, wine tasting in Chianti, and the beautiful town of Siena. Return to Florence for a final Florentine steak dinner.'
            },
            {
                dayNumber: 7,
                title: 'Florence to Cinque Terre',
                description: 'Train to Cinque Terre (2.5 hours). Base yourself in Monterosso or Manarola. Afternoon exploring the colorful villages by train. Fresh seafood dinner watching the sunset over the Mediterranean.'
            },
            {
                dayNumber: 8,
                title: 'Cinque Terre Hiking',
                description: 'Hike the famous coastal trail between villages (Monterosso to Vernazza is the most scenic). Swim at Monterosso beach, enjoy focaccia and pesto, and watch the sunset from Riomaggiore.'
            },
            {
                dayNumber: 9,
                title: 'Cinque Terre to Venice',
                description: 'Morning train to Venice (4 hours, scenic route). Arrive and immediately get lost in the magical maze of canals and bridges. Evening gondola ride through quiet back canals.'
            },
            {
                dayNumber: 10,
                title: 'Venice Highlights',
                description: 'St. Mark\'s Square and Basilica in the morning (arrive early!). Doge\'s Palace and Bridge of Sighs. Afternoon exploring Dorsoduro and the Peggy Guggenheim Collection. Spritz at sunset.'
            },
            {
                dayNumber: 11,
                title: 'Venice Islands',
                description: 'Day trip to Murano (glass-blowing) and Burano (colorful houses and lace-making). Pack a picnic and enjoy the slower pace of island life. Return for dinner in Cannaregio, away from tourists.'
            },
            {
                dayNumber: 12,
                title: 'Venice to Lake Como',
                description: 'Train to Lake Como (2.5 hours). Base in Varenna or Bellagio. Afternoon exploring your village, gelato by the lake, and dinner with mountain views.'
            },
            {
                dayNumber: 13,
                title: 'Lake Como Exploration',
                description: 'Ferry hop between villages: Bellagio, Varenna, Menaggio. Visit Villa del Balbianello (Star Wars filming location). Swim in the crystal-clear lake. Final Italian sunset.'
            },
            {
                dayNumber: 14,
                title: 'Departure',
                description: 'Depending on your flight, morning coffee by the lake before transferring to Milan Malpensa Airport (1 hour). Arrivederci, Italia!'
            }
        ],
        author: 'Sarah & Alex',
        createdAt: '2025-06-15'
    },
    {
        id: 'it-2',
        destination: 'italy',
        title: 'Ultimate Amalfi Coast & Southern Italy',
        duration: '10 Days',
        durationCode: '10days',
        regions: 'Naples, Amalfi Coast, Puglia',
        description: 'Escape the crowds and discover the soul of Southern Italy. Dramatic coastlines, ancient ruins, whitewashed villages, and the best food you\'ll ever taste.',
        coverImage: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=80',
        highlights: ['Positano', 'Pompeii', 'Trulli Houses', 'Amalfi Drive', 'Naples Pizza'],
        days: [
            {
                dayNumber: 1,
                title: 'Arrival in Naples',
                description: 'Arrive in Naples and dive straight into the chaos. Check into your hotel in the historic center. Evening pizza pilgrimage to L\'Antica Pizzeria da Michele or Sorbillo.'
            },
            {
                dayNumber: 2,
                title: 'Naples & Pompeii',
                description: 'Morning exploring Naples: Naples Archaeological Museum, Spaccanapoli. Afternoon train to Pompeii (30 min) to walk the ancient streets frozen in time. Return to Naples for sfogliatella.'
            },
            {
                dayNumber: 3,
                title: 'Naples to Positano',
                description: 'Ferry to Positano (2 hours, scenic route). Check into your cliffside hotel. Afternoon at the beach, boutique shopping, and sunset dinner overlooking the twinkling village lights.'
            },
            {
                dayNumber: 4,
                title: 'Amalfi Coast Adventure',
                description: 'Rent a boat and explore hidden coves along the coast. Visit Amalfi town and the stunning cathedral. Limoncello tasting in a lemon grove. Path of the Gods hike if you\'re feeling active.'
            },
            {
                dayNumber: 5,
                title: 'Ravello & Capri',
                description: 'Morning trip to Ravello\'s clifftop gardens (Villa Rufolo). Afternoon ferry to Capri for Blue Grotto, designer shopping, and glamorous people-watching at La Piazzetta.'
            },
            {
                dayNumber: 6,
                title: 'Transfer to Puglia',
                description: 'Long travel day to Puglia (train or rental car, 4-5 hours). Base in the beautiful town of Ostuni, the "White City." Evening passeggiata and dinner in the old town.'
            },
            {
                dayNumber: 7,
                title: 'Alberobello & Trulli',
                description: 'Day trip to Alberobello\'s UNESCO World Heritage trulli houses. Lunch in Locorotondo, one of Italy\'s most beautiful villages. Wine tasting at a local masseria.'
            },
            {
                dayNumber: 8,
                title: 'Puglia Beaches & Lecce',
                description: 'Morning at the stunning beaches near Polignano a Mare (cliff diving optional!). Afternoon in Lecce, the "Florence of the South," exploring baroque architecture.'
            },
            {
                dayNumber: 9,
                title: 'Matera (UNESCO)',
                description: 'Day trip to Matera\'s ancient cave dwellings (sassi). This haunting city is one of Italy\'s most unique. Book a cave restaurant for an unforgettable lunch.'
            },
            {
                dayNumber: 10,
                title: 'Departure from Bari',
                description: 'Morning in Ostuni or quick stop in Bari. Transfer to Bari Airport for departure. Take home olive oil, orecchiette pasta, and a tan.'
            }
        ],
        author: 'Sarah & Alex',
        createdAt: '2025-08-20'
    },
    {
        id: 'it-3',
        destination: 'italy',
        title: 'One Week in Northern Italy',
        duration: '1 Week',
        durationCode: 'week',
        regions: 'Milan, Lake Como, Verona, Dolomites',
        description: 'Mountains, lakes, and sophisticated cities. This Northern Italy route is perfect for those seeking stunning Alpine scenery combined with Italian elegance.',
        coverImage: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80',
        highlights: ['Lake Como', 'Dolomites', 'Verona', 'Milan Cathedral', 'Alpine Hiking'],
        days: [
            {
                dayNumber: 1,
                title: 'Arrival in Milan',
                description: 'Arrive at Milan Malpensa Airport. Visit the magnificent Duomo and climb to the rooftop. Afternoon in the elegant Galleria Vittorio Emanuele II. Evening aperitivo in Navigli district.'
            },
            {
                dayNumber: 2,
                title: 'Milan to Lake Como',
                description: 'Train to Varenna (1 hour). Explore this romantic lakeside village, visit Villa Monastero gardens. Ferry to Bellagio for lunch. Return for sunset drinks by the water.'
            },
            {
                dayNumber: 3,
                title: 'Lake Como Full Day',
                description: 'Visit Villa del Balbianello (book ahead!). Ferry to Menaggio for lunch. Kayaking or swimming in the afternoon. Fancy dinner at a Michelin-starred lakeside restaurant.'
            },
            {
                dayNumber: 4,
                title: 'Lake Como to Verona',
                description: 'Train to Verona (2.5 hours via Milan). Romeo and Juliet\'s balcony, the Roman Arena, and Piazza delle Erbe. If summer, catch an opera in the ancient arena.'
            },
            {
                dayNumber: 5,
                title: 'Verona to Dolomites',
                description: 'Rent a car and drive into the Dolomites (2 hours). Base in Ortisei or Cortina d\'Ampezzo. Afternoon cable car rides with jaw-dropping mountain views.'
            },
            {
                dayNumber: 6,
                title: 'Dolomites Adventure',
                description: 'Full day of hiking. Choose from easy walks to challenging trails. Tre Cime di Lavaredo is iconic. Lunch at a mountain rifugio. Drive scenic passes like Passo Gardena.'
            },
            {
                dayNumber: 7,
                title: 'Return to Milan & Departure',
                description: 'Morning drive back to Milan (3-4 hours depending on route). Quick visit to The Last Supper (book months ahead!) or more shopping. Transfer to airport.'
            }
        ],
        author: 'Sarah & Alex',
        createdAt: '2025-04-10'
    },
    {
        id: 'it-4',
        destination: 'italy',
        title: 'Tuscany & Umbria Road Trip',
        duration: '10 Days',
        durationCode: '10days',
        regions: 'Florence, Siena, Val d\'Orcia, Umbria',
        description: 'The quintessential Italian road trip through rolling hills, cypress-lined roads, medieval hill towns, world-class wine, and Renaissance treasures.',
        coverImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
        highlights: ['Val d\'Orcia', 'Brunello Wine', 'Orvieto', 'Assisi', 'Truffle Hunting'],
        days: [
            {
                dayNumber: 1,
                title: 'Florence Arrival',
                description: 'Pick up rental car at Florence Airport. Avoid driving in Florence - park outside and take the bus in. Evening exploring the Duomo and dinner in Santo Spirito.'
            },
            {
                dayNumber: 2,
                title: 'Florence Art Day',
                description: 'Full day in Florence. Morning: Uffizi Gallery. Afternoon: Accademia (David) and leather shopping at San Lorenzo Market. Sunset at Piazzale Michelangelo.'
            },
            {
                dayNumber: 3,
                title: 'Chianti Wine Country',
                description: 'Drive the SR222 (Chiantigiana) through the heart of Chianti. Stop in Greve in Chianti, visit a castle winery, lunch in Radda. Evening in charming Castellina.'
            },
            {
                dayNumber: 4,
                title: 'Siena',
                description: 'Full day in Siena. The stunning Piazza del Campo, the Duomo, getting lost in medieval streets. Stay overnight - Siena is magical when the day-trippers leave.'
            },
            {
                dayNumber: 5,
                title: 'San Gimignano & Volterra',
                description: 'Morning in San Gimignano (medieval Manhattan with its towers). Afternoon in Volterra for Etruscan history and alabaster crafts. Agriturismo stay in the countryside.'
            },
            {
                dayNumber: 6,
                title: 'Val d\'Orcia',
                description: 'The most photogenic landscape in Italy. Pienza (pecorino cheese town), Montalcino (Brunello wine tasting), the famous cypress-lined roads. Stay in a converted farmhouse.'
            },
            {
                dayNumber: 7,
                title: 'Val d\'Orcia & Montepulciano',
                description: 'Morning at the Bagno Vignoni thermal springs. Afternoon exploring Montepulciano and tasting Vino Nobile. Drive the scenic SS146.'
            },
            {
                dayNumber: 8,
                title: 'Into Umbria - Orvieto',
                description: 'Cross into Umbria and visit Orvieto, perched on a volcanic cliff. The incredible Duomo, underground caves tour, and excellent local wines.'
            },
            {
                dayNumber: 9,
                title: 'Assisi & Perugia',
                description: 'Morning in the spiritual town of Assisi (Basilica of St. Francis). Afternoon in the vibrant university town of Perugia. Chocolate tasting at Perugina.'
            },
            {
                dayNumber: 10,
                title: 'Return & Departure',
                description: 'Drive back to Florence or Rome for your flight. If time, stop at an outlet mall (The Mall or Valdichiana) for Italian designer shopping.'
            }
        ],
        author: 'Sarah & Alex',
        createdAt: '2025-09-05'
    }
];

// State
let currentDestination = null;
let itineraries = [];
let isAdminMode = false;
let editingItinerary = null;

// DOM Elements
const elements = {
    pageTitle: document.getElementById('pageTitle'),
    destinationHero: document.getElementById('destinationHero'),
    destinationFlag: document.getElementById('destinationFlag'),
    destinationName: document.getElementById('destinationName'),
    destinationTagline: document.getElementById('destinationTagline'),
    itineraryCount: document.getElementById('itineraryCount'),
    itinerariesGrid: document.getElementById('itinerariesGrid'),
    adminBar: document.getElementById('adminBar')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const destinationSlug = urlParams.get('d') || urlParams.get('country') || 'italy';
    
    loadDestination(destinationSlug);
    initEventListeners();
    initAdminMode();
    initAuth();
    
    // Secret admin login: Ctrl+Shift+L
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            if (!isAuthenticated) {
                showLoginModal();
            }
        }
    });
    
    // Load any custom edits
    loadCustomData();
});

// ========================================
// Data Loading
// ========================================

function loadDestination(slug) {
    currentDestination = destinationsData[slug] || destinationsData.italy;
    
    // Update page
    document.title = `${currentDestination.name} Travel Guide - Itinerant Pixels`;
    elements.destinationHero.style.backgroundImage = `url(${currentDestination.heroImage})`;
    elements.destinationFlag.textContent = currentDestination.flag;
    elements.destinationName.textContent = currentDestination.name;
    elements.destinationTagline.textContent = currentDestination.tagline;
    
    // Update section titles dynamically
    updateSectionTitles(currentDestination.name);
    
    // Update affiliate links
    updateAffiliateLinks(slug, currentDestination.name);
    
    // Load itineraries
    loadItineraries(slug);
}

function updateSectionTitles(countryName) {
    // Update all section titles with country name
    const itinerariesTitle = document.getElementById('itinerariesTitle');
    const mapTitle = document.getElementById('mapSectionTitle');
    
    if (itinerariesTitle) itinerariesTitle.textContent = `${countryName} Itineraries`;
    if (mapTitle) mapTitle.textContent = `${countryName} Interactive Map`;
}

function updateAffiliateLinks(slug, countryName) {
    // Affiliate URLs - replace with your actual affiliate IDs
    const affiliateLinks = {
        hotel: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(countryName)}&aid=YOUR_BOOKING_AFFILIATE_ID`,
        car: `https://www.rentalcars.com/search?country=${encodeURIComponent(countryName)}&affiliateCode=YOUR_RENTALCARS_ID`,
        tours: `https://www.getyourguide.com/s/?q=${encodeURIComponent(countryName)}&partner_id=YOUR_GYG_ID`
    };
    
    const hotelLink = document.getElementById('hotelAffiliateLink');
    const carLink = document.getElementById('carAffiliateLink');
    const toursLink = document.getElementById('toursAffiliateLink');
    
    if (hotelLink) hotelLink.href = affiliateLinks.hotel;
    if (carLink) carLink.href = affiliateLinks.car;
    if (toursLink) toursLink.href = affiliateLinks.tours;
}

async function loadItineraries(destinationSlug) {
    // Load from local data service, fallback to localStorage
    let fetchedItineraries = null;
    
    if (typeof CodataAPI !== 'undefined') {
        try {
            fetchedItineraries = await CodataAPI.getItineraries(destinationSlug);
        } catch (error) {
            console.warn('Data service unavailable, using localStorage fallback');
        }
    }
    
    if (fetchedItineraries && Array.isArray(fetchedItineraries) && fetchedItineraries.length > 0) {
        itineraries = fetchedItineraries;
    } else {
        // Fallback to localStorage
        const stored = localStorage.getItem(`itineraries_${destinationSlug}`);
        
        if (stored) {
            itineraries = JSON.parse(stored);
        } else if (destinationSlug === 'italy') {
            // Initialize with mock Italy data
            itineraries = [...mockItalyItineraries];
            saveItineraries(destinationSlug);
        } else {
            itineraries = [];
        }
        
        // Also load custom itineraries from the editor
        const customItineraries = JSON.parse(localStorage.getItem('customItineraries') || '[]');
        const customForDestination = customItineraries.filter(it => it.destination === destinationSlug);
        
        // Merge custom itineraries (avoid duplicates)
        customForDestination.forEach(customIt => {
            if (!itineraries.find(it => it.id === customIt.id)) {
                itineraries.unshift(customIt);
            }
        });
    }
    
    // Update counts
    elements.itineraryCount.textContent = itineraries.length;
    
    renderItineraries();
    
    // Initialize map unlock
    initMapUnlock(destinationSlug);
}

async function saveItineraries(destinationSlug = null) {
    const slug = destinationSlug || new URLSearchParams(window.location.search).get('d') || 'italy';
    
    // Save to localStorage as backup
    localStorage.setItem(`itineraries_${slug}`, JSON.stringify(itineraries));
    
    // Also save to local data if available
    if (typeof CodataAPI !== 'undefined') {
        try {
            // Update each itinerary in local data
            for (const itinerary of itineraries) {
                if (itinerary._isNew) {
                    delete itinerary._isNew;
                    await CodataAPI.createItinerary(itinerary);
                } else if (itinerary._isDirty) {
                    delete itinerary._isDirty;
                    await CodataAPI.updateItinerary(itinerary.id, itinerary);
                }
            }
        } catch (error) {
            console.error('Failed to save to local data:', error);
        }
    }
}

// ========================================
// Rendering
// ========================================

function renderItineraries(filter = 'all') {
    const filtered = filter === 'all' 
        ? itineraries 
        : itineraries.filter(it => it.durationCode === filter);
    
    if (filtered.length === 0) {
        elements.itinerariesGrid.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <h3>No Itineraries Yet</h3>
                <p>Be the first to create an itinerary for ${currentDestination.name}!</p>
                ${isAdminMode ? '<button class="btn-primary" onclick="openAddItinerary()">Create Itinerary</button>' : ''}
            </div>
        `;
        return;
    }
    
    elements.itinerariesGrid.innerHTML = filtered.map(it => `
        <div class="itinerary-card" data-id="${it.id}">
            <div class="card-admin-actions">
                <button class="card-edit-btn" onclick="event.stopPropagation(); editItinerary('${it.id}')" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="card-delete-btn" onclick="event.stopPropagation(); deleteItinerary('${it.id}')" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
            <div class="itinerary-card-image">
                <img src="${it.coverImage || 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&q=80'}" alt="${it.title}">
                <span class="itinerary-duration">${it.duration}</span>
            </div>
            <div class="itinerary-card-content">
                <h3>${it.title}</h3>
                <p>${it.description}</p>
                <div class="itinerary-highlights">
                    ${(it.highlights || []).slice(0, 3).map(h => `<span class="highlight-tag">${h}</span>`).join('')}
                </div>
                <div class="itinerary-meta">
                    <span>${it.regions}</span>
                    <span>${formatDate(it.createdAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for viewing
    document.querySelectorAll('.itinerary-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            viewItinerary(id);
        });
    });
}

function viewItinerary(id) {
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('d') || urlParams.get('country') || 'italy';
    
    // Navigate to dedicated itinerary page
    window.location.href = `itinerary.html?d=${destination}&id=${id}`;
}

// ========================================
// Admin Mode & CRUD
// ========================================

function initAdminMode() {
    // Check if admin mode was previously enabled
    isAdminMode = localStorage.getItem('admin_mode') === 'true';
    updateAdminUI();
    
    // Secret key combo: Ctrl+Shift+A to toggle admin
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            toggleAdminMode();
        }
    });
}

function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    localStorage.setItem('admin_mode', isAdminMode);
    updateAdminUI();
}

function updateAdminUI() {
    elements.adminBar.classList.toggle('active', isAdminMode);
    document.body.classList.toggle('admin-mode', isAdminMode);
}

function openAddItinerary() {
    // Redirect to the new itinerary editor
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('d') || 'italy';
    window.location.href = `itinerary-editor.html?d=${destination}`;
}

function editItinerary(id) {
    // Redirect to the itinerary editor with the itinerary ID
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('d') || 'italy';
    window.location.href = `itinerary-editor.html?d=${destination}&id=${id}`;
}

async function deleteItinerary(id) {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    
    // Delete from local data if available
    if (typeof CodataAPI !== 'undefined') {
        try {
            await CodataAPI.deleteItinerary(id);
        } catch (error) {
            console.error('Failed to delete from local data:', error);
        }
    }
    
    itineraries = itineraries.filter(it => it.id !== id);
    saveItineraries();
    renderItineraries();
    elements.itineraryCount.textContent = itineraries.length;
}

function addDayEditor(dayData = null) {
    const dayNumber = elements.daysContainer.children.length + 1;
    
    const dayEditor = document.createElement('div');
    dayEditor.className = 'day-editor';
    dayEditor.innerHTML = `
        <div class="day-editor-header">
            <strong>Day ${dayNumber}</strong>
            <button type="button" class="remove-day-btn" onclick="this.closest('.day-editor').remove(); updateDayNumbers()">×</button>
        </div>
        <div class="form-group">
            <label>Day Title</label>
            <input type="text" class="day-title" value="${dayData?.title || ''}" placeholder="e.g., Arrival in Rome">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="day-description" rows="3" placeholder="Describe the day's activities...">${dayData?.description || ''}</textarea>
        </div>
    `;
    
    elements.daysContainer.appendChild(dayEditor);
}

function updateDayNumbers() {
    document.querySelectorAll('.day-editor').forEach((editor, index) => {
        editor.querySelector('strong').textContent = `Day ${index + 1}`;
    });
}

function saveItineraryForm() {
    const formData = {
        id: editingItinerary?.id || `it-${Date.now()}`,
        destination: new URLSearchParams(window.location.search).get('d') || 'italy',
        coverImage: document.getElementById('itCoverImage').value.trim(),
        title: document.getElementById('itTitle').value.trim(),
        duration: document.getElementById('itDuration').value,
        durationCode: getDurationCode(document.getElementById('itDuration').value),
        regions: document.getElementById('itRegions').value.trim(),
        description: document.getElementById('itDescription').value.trim(),
        highlights: document.getElementById('itHighlights').value.split(',').map(h => h.trim()).filter(h => h),
        days: [],
        author: 'Sarah & Alex',
        createdAt: editingItinerary?.createdAt || new Date().toISOString().split('T')[0]
    };
    
    // Collect days
    document.querySelectorAll('.day-editor').forEach((editor, index) => {
        const title = editor.querySelector('.day-title').value.trim();
        const description = editor.querySelector('.day-description').value.trim();
        if (title || description) {
            formData.days.push({
                dayNumber: index + 1,
                title: title || `Day ${index + 1}`,
                description: description
            });
        }
    });
    
    // Update or add
    if (editingItinerary) {
        const index = itineraries.findIndex(it => it.id === editingItinerary.id);
        if (index >= 0) {
            itineraries[index] = formData;
        }
    } else {
        itineraries.unshift(formData);
    }
    
    saveItineraries();
    renderItineraries();
    elements.itineraryCount.textContent = itineraries.length;
    elements.editItineraryModal.classList.remove('active');
}

function getDurationCode(duration) {
    const map = {
        '5 Days': 'week',
        '1 Week': 'week',
        '10 Days': '10days',
        '2 Weeks': '2weeks',
        '3 Weeks': '3weeks',
        '1 Month': '3weeks'
    };
    return map[duration] || 'week';
}

// ========================================
// Inline Edit Mode System
// ========================================

let isEditMode = false;

// Simple Authentication
// NOTE: This is frontend-only auth - NOT secure for sensitive data
// Change this password to your own
const ADMIN_PASSWORD = 'itinerant2026';
let isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';

function checkAuth() {
    return isAuthenticated;
}

function initAuth() {
    // Always show edit button - no auth required
    const editBtn = document.getElementById('floatingEditBtn');
    if (editBtn) {
        editBtn.style.display = 'flex';
    }
}

function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('adminPassword').focus();
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
}

function attemptLogin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        isAuthenticated = true;
        localStorage.setItem('admin_authenticated', 'true');
        hideLoginModal();
        initAuth(); // Show edit button
    } else {
        document.getElementById('loginError').style.display = 'block';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

function logout() {
    isAuthenticated = false;
    localStorage.removeItem('admin_authenticated');
    if (isEditMode) {
        toggleEditMode();
    }
    initAuth(); // Hide edit button
    window.location.reload(); // Reload to ensure clean state
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode', isEditMode);
    document.getElementById('editToolbar').classList.toggle('active', isEditMode);
    document.getElementById('floatingEditBtn').classList.toggle('active', isEditMode);
    
    if (isEditMode) {
        enableEditableElements();
    } else {
        disableEditableElements();
    }
}

function enableEditableElements() {
    document.querySelectorAll('.editable').forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.addEventListener('blur', handleEditableBlur);
        el.addEventListener('keydown', handleEditableKeydown);
    });
}

function disableEditableElements() {
    document.querySelectorAll('.editable').forEach(el => {
        el.removeAttribute('contenteditable');
        el.removeEventListener('blur', handleEditableBlur);
        el.removeEventListener('keydown', handleEditableKeydown);
    });
}

function handleEditableBlur(e) {
    // Auto-save on blur
    const field = e.target.dataset.field;
    const value = e.target.textContent.trim();
    
    // Save to destination data
    if (field && currentDestination) {
        saveFieldEdit(field, value);
    }
}

function handleEditableKeydown(e) {
    // Prevent line breaks in single-line fields
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.target.blur();
    }
}

function saveFieldEdit(field, value) {
    const slug = new URLSearchParams(window.location.search).get('d') || 
                 new URLSearchParams(window.location.search).get('country') || 'italy';
    
    // Load custom data or create new
    let customData = JSON.parse(localStorage.getItem(`destination_custom_${slug}`) || '{}');
    customData[field] = value;
    localStorage.setItem(`destination_custom_${slug}`, JSON.stringify(customData));
    
    showSaveIndicator();
}

function showSaveIndicator() {
    // Brief visual feedback that changes were saved
    const saveBtn = document.getElementById('saveChangesBtn');
    if (saveBtn) {
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ Saved!';
        saveBtn.style.background = '#27ae60';
        setTimeout(() => {
            saveBtn.textContent = originalText;
        }, 1500);
    }
}

function saveAllChanges() {
    // Collect all editable content and save
    const slug = new URLSearchParams(window.location.search).get('d') || 
                 new URLSearchParams(window.location.search).get('country') || 'italy';
    
    let customData = JSON.parse(localStorage.getItem(`destination_custom_${slug}`) || '{}');
    
    document.querySelectorAll('.editable').forEach(el => {
        const field = el.dataset.field;
        if (field) {
            customData[field] = el.textContent.trim();
        }
    });
    
    localStorage.setItem(`destination_custom_${slug}`, JSON.stringify(customData));
    
    showSaveIndicator();
    alert('All changes saved successfully!');
}

function loadCustomData() {
    const slug = new URLSearchParams(window.location.search).get('d') || 
                 new URLSearchParams(window.location.search).get('country') || 'italy';
    
    const customData = JSON.parse(localStorage.getItem(`destination_custom_${slug}`) || '{}');
    
    // Apply custom data to editable elements
    Object.keys(customData).forEach(field => {
        const el = document.querySelector(`[data-field="${field}"]`);
        if (el && customData[field]) {
            el.textContent = customData[field];
        }
    });
    
    // Load and render custom sections
    loadCustomSections();
}

// ========================================
// Add Section System
// ========================================

let customSections = [];
let currentSectionType = null;
let currentSectionPosition = null;

function toggleSectionMenu(btn) {
    // Close all other menus first
    document.querySelectorAll('.section-type-menu.active').forEach(menu => {
        if (menu !== btn.nextElementSibling) {
            menu.classList.remove('active');
        }
    });
    
    // Toggle this menu
    const menu = btn.nextElementSibling;
    menu.classList.toggle('active');
}

function addSectionDirect(position, type) {
    currentSectionPosition = position;
    currentSectionType = type;
    
    // Close the menu
    document.querySelectorAll('.section-type-menu.active').forEach(menu => {
        menu.classList.remove('active');
    });
    
    // Create inline editable section directly
    createInlineSection(position, type);
}

function createInlineSection(position, type) {
    const slug = new URLSearchParams(window.location.search).get('d') || 
                 new URLSearchParams(window.location.search).get('country') || 'italy';
    
    const sectionId = 'section_' + Date.now();
    const sectionEl = document.createElement('section');
    sectionEl.className = 'content-section custom-section active inline-editing';
    sectionEl.id = sectionId;
    sectionEl.dataset.type = type;
    sectionEl.dataset.position = position;
    
    let html = '';
    
    switch(type) {
        case 'text':
            html = `
                <div class="custom-section-content text-section">
                    <h2 contenteditable="true" class="inline-editable" data-placeholder="Enter section title..."></h2>
                    <p contenteditable="true" class="inline-editable" data-placeholder="Start writing your content here..."></p>
                </div>
            `;
            break;
        case 'gallery':
            html = `
                <div class="custom-section-content gallery-section">
                    <h2 contenteditable="true" class="inline-editable" data-placeholder="Gallery Title"></h2>
                    <div class="inline-gallery-input">
                        <textarea class="inline-textarea" placeholder="Paste image URLs here (one per line)..." rows="4"></textarea>
                        <button class="inline-action-btn" onclick="applyGalleryImages('${sectionId}')">Add Images</button>
                    </div>
                    <div class="gallery-grid"></div>
                </div>
            `;
            break;
        case 'tips':
            html = `
                <div class="custom-section-content tips-section">
                    <h2 contenteditable="true" class="inline-editable" data-placeholder="Travel Tips Title"></h2>
                    <div class="inline-tips-input">
                        <textarea class="inline-textarea" placeholder="Enter tips (one per line)..." rows="4"></textarea>
                        <button class="inline-action-btn" onclick="applyTips('${sectionId}')">Add Tips</button>
                    </div>
                    <ul class="tips-list"></ul>
                </div>
            `;
            break;
        case 'highlights':
            html = `
                <div class="custom-section-content highlights-section">
                    <h2 contenteditable="true" class="inline-editable" data-placeholder="Highlights Title"></h2>
                    <div class="inline-highlights-input">
                        <textarea class="inline-textarea" placeholder="Enter highlights (format: Name | Description, one per line)..." rows="4"></textarea>
                        <button class="inline-action-btn" onclick="applyHighlights('${sectionId}')">Add Highlights</button>
                    </div>
                    <div class="highlights-grid"></div>
                </div>
            `;
            break;
        case 'quote':
            html = `
                <div class="custom-section-content quote-section">
                    <blockquote contenteditable="true" class="inline-editable" data-placeholder="Enter your quote here..."></blockquote>
                    <cite contenteditable="true" class="inline-editable" data-placeholder="— Attribution"></cite>
                </div>
            `;
            break;
        case 'video':
            html = `
                <div class="custom-section-content video-section">
                    <h2 contenteditable="true" class="inline-editable" data-placeholder="Video Title"></h2>
                    <div class="inline-video-input">
                        <input type="text" class="inline-input" placeholder="Paste YouTube URL here...">
                        <button class="inline-action-btn" onclick="applyVideo('${sectionId}')">Embed Video</button>
                    </div>
                    <div class="video-wrapper"></div>
                </div>
            `;
            break;
    }
    
    // Add save and delete buttons
    html += `
        <div class="inline-section-actions">
            <button class="inline-save-btn" onclick="saveInlineSection('${sectionId}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Save Section
            </button>
            <button class="inline-delete-btn" onclick="cancelInlineSection('${sectionId}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Cancel
            </button>
        </div>
    `;
    
    sectionEl.innerHTML = html;
    
    // Insert at the specified position
    const targetPlaceholder = document.querySelector(`.section-placeholder[data-position="${position}"]`);
    if (targetPlaceholder) {
        targetPlaceholder.parentNode.insertBefore(sectionEl, targetPlaceholder.nextSibling);
    } else {
        document.querySelector('.destination-content .container').appendChild(sectionEl);
    }
    
    // Focus the first editable element
    const firstEditable = sectionEl.querySelector('.inline-editable, .inline-textarea, .inline-input');
    if (firstEditable) {
        setTimeout(() => firstEditable.focus(), 100);
    }
    
    // Scroll to the new section
    sectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function applyGalleryImages(sectionId) {
    const section = document.getElementById(sectionId);
    const textarea = section.querySelector('.inline-textarea');
    const grid = section.querySelector('.gallery-grid');
    const images = textarea.value.split('\n').filter(url => url.trim());
    
    grid.innerHTML = images.map(img => `
        <div class="gallery-item">
            <img src="${img.trim()}" alt="Gallery image">
        </div>
    `).join('');
    
    textarea.parentElement.style.display = 'none';
}

function applyTips(sectionId) {
    const section = document.getElementById(sectionId);
    const textarea = section.querySelector('.inline-textarea');
    const list = section.querySelector('.tips-list');
    const tips = textarea.value.split('\n').filter(tip => tip.trim());
    
    list.innerHTML = tips.map(tip => `<li>${tip.trim()}</li>`).join('');
    textarea.parentElement.style.display = 'none';
}

function applyHighlights(sectionId) {
    const section = document.getElementById(sectionId);
    const textarea = section.querySelector('.inline-textarea');
    const grid = section.querySelector('.highlights-grid');
    const highlights = textarea.value.split('\n').filter(h => h.trim()).map(h => {
        const parts = h.split('|');
        return { name: parts[0]?.trim() || '', description: parts[1]?.trim() || '' };
    });
    
    grid.innerHTML = highlights.map(h => `
        <div class="highlight-card">
            <h4>${h.name}</h4>
            <p>${h.description}</p>
        </div>
    `).join('');
    
    textarea.parentElement.style.display = 'none';
}

function applyVideo(sectionId) {
    const section = document.getElementById(sectionId);
    const input = section.querySelector('.inline-input');
    const wrapper = section.querySelector('.video-wrapper');
    const videoId = extractVideoId(input.value);
    
    if (videoId) {
        wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        input.parentElement.style.display = 'none';
    }
}

function saveInlineSection(sectionId) {
    const section = document.getElementById(sectionId);
    const type = section.dataset.type;
    const position = section.dataset.position;
    const slug = new URLSearchParams(window.location.search).get('d') || 
                 new URLSearchParams(window.location.search).get('country') || 'italy';
    
    const sectionData = {
        id: sectionId,
        type: type,
        position: position,
        createdAt: new Date().toISOString()
    };
    
    // Gather data based on type
    switch(type) {
        case 'text':
            sectionData.title = section.querySelector('h2').textContent.trim() || 'Untitled Section';
            sectionData.content = section.querySelector('p').textContent.trim() || '';
            break;
        case 'gallery':
            sectionData.title = section.querySelector('h2').textContent.trim() || 'Gallery';
            const galleryImages = [];
            section.querySelectorAll('.gallery-item img').forEach(img => galleryImages.push(img.src));
            sectionData.images = galleryImages;
            break;
        case 'tips':
            sectionData.title = section.querySelector('h2').textContent.trim() || 'Travel Tips';
            const tipsList = [];
            section.querySelectorAll('.tips-list li').forEach(li => tipsList.push(li.textContent));
            sectionData.tips = tipsList;
            break;
        case 'highlights':
            sectionData.title = section.querySelector('h2').textContent.trim() || 'Highlights';
            const highlightsList = [];
            section.querySelectorAll('.highlight-card').forEach(card => {
                highlightsList.push({
                    name: card.querySelector('h4').textContent,
                    description: card.querySelector('p').textContent
                });
            });
            sectionData.highlights = highlightsList;
            break;
        case 'quote':
            sectionData.quote = section.querySelector('blockquote').textContent.trim() || '';
            sectionData.attribution = section.querySelector('cite').textContent.trim() || '';
            break;
        case 'video':
            sectionData.title = section.querySelector('h2').textContent.trim() || 'Video';
            const iframe = section.querySelector('iframe');
            sectionData.videoUrl = iframe ? iframe.src : '';
            break;
    }
    
    // Save to localStorage
    let sections = JSON.parse(localStorage.getItem(`destination_sections_${slug}`) || '[]');
    sections.push(sectionData);
    localStorage.setItem(`destination_sections_${slug}`, JSON.stringify(sections));
    
    // Remove inline editing state and action buttons
    section.classList.remove('inline-editing');
    const actions = section.querySelector('.inline-section-actions');
    if (actions) actions.remove();
    
    // Hide any input areas
    section.querySelectorAll('.inline-gallery-input, .inline-tips-input, .inline-highlights-input, .inline-video-input').forEach(el => {
        el.remove();
    });
    
    // Add delete button for edit mode
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'section-delete-btn';
    deleteBtn.setAttribute('onclick', `deleteCustomSection('${sectionId}')`);
    deleteBtn.setAttribute('title', 'Delete Section');
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
    section.appendChild(deleteBtn);
    
    // Make content editable in edit mode
    section.querySelectorAll('.inline-editable').forEach(el => {
        el.classList.add('editable');
        el.removeAttribute('data-placeholder');
    });
    
    showSaveIndicator();
}

function cancelInlineSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.remove();
    }
}

// Close section menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.add-section-inline')) {
        document.querySelectorAll('.section-type-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }
});

function loadCustomSections() {
    const slug = new URLSearchParams(window.location.search).get('d') || 
                 new URLSearchParams(window.location.search).get('country') || 'italy';
    
    const sections = JSON.parse(localStorage.getItem(`destination_sections_${slug}`) || '[]');
    customSections = sections;
    
    sections.forEach(section => renderCustomSection(section));
}

function renderCustomSection(section) {
    const container = document.querySelector('.destination-content .container');
    const sectionEl = document.createElement('section');
    sectionEl.className = 'content-section custom-section active';
    sectionEl.id = section.id;
    sectionEl.dataset.sectionId = section.id;
    
    let html = '';
    
    switch(section.type) {
        case 'text':
            html = `
                <div class="custom-section-content text-section">
                    <h2 class="editable" data-field="${section.id}-title">${section.title}</h2>
                    <div class="text-content editable" data-field="${section.id}-content">${section.content}</div>
                </div>
            `;
            break;
        case 'gallery':
            html = `
                <div class="custom-section-content gallery-section">
                    <h2>${section.title}</h2>
                    <div class="custom-gallery">
                        ${section.images.map(img => `<img src="${img}" alt="Gallery image">`).join('')}
                    </div>
                </div>
            `;
            break;
        case 'tips':
            html = `
                <div class="custom-section-content tips-section">
                    <h2>${section.title}</h2>
                    <ul class="custom-tips-list">
                        ${section.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
            break;
        case 'highlights':
            html = `
                <div class="custom-section-content highlights-section">
                    <h2>${section.title}</h2>
                    <div class="custom-highlights-grid">
                        ${section.highlights.map(h => `
                            <div class="highlight-item">
                                <h4>${h.name}</h4>
                                <p>${h.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
        case 'quote':
            html = `
                <div class="custom-section-content quote-section">
                    <blockquote>
                        <p>"${section.quote}"</p>
                        ${section.attribution ? `<cite>— ${section.attribution}</cite>` : ''}
                    </blockquote>
                </div>
            `;
            break;
        case 'video':
            const videoId = extractVideoId(section.videoUrl);
            html = `
                <div class="custom-section-content video-section">
                    <h2>${section.title}</h2>
                    <div class="video-wrapper">
                        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            `;
            break;
    }
    
    // Add delete button for edit mode
    html += `
        <button class="section-delete-btn" onclick="deleteCustomSection('${section.id}')" title="Delete Section">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
    `;
    
    sectionEl.innerHTML = html;
    
    // Insert at the specified position
    const position = section.position || 'after-map';
    let targetPlaceholder = document.querySelector(`.section-placeholder[data-position="${position}"]`);
    
    if (targetPlaceholder) {
        // Insert after the placeholder
        targetPlaceholder.parentNode.insertBefore(sectionEl, targetPlaceholder.nextSibling);
    } else {
        // Fallback: insert before itineraries or at end
        const itinerariesSection = document.getElementById('itineraries');
        if (itinerariesSection) {
            container.insertBefore(sectionEl, itinerariesSection);
        } else {
            container.appendChild(sectionEl);
        }
    }
    
    // Re-enable editable if in edit mode
    if (isEditMode) {
        sectionEl.querySelectorAll('.editable').forEach(el => {
            el.setAttribute('contenteditable', 'true');
        });
    }
}

function extractVideoId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    return match ? match[1] : '';
}

function deleteCustomSection(sectionId) {
    if (!confirm('Are you sure you want to delete this section?')) return;
    
    const slug = new URLSearchParams(window.location.search).get('d') || 
                 new URLSearchParams(window.location.search).get('country') || 'italy';
    
    let sections = JSON.parse(localStorage.getItem(`destination_sections_${slug}`) || '[]');
    sections = sections.filter(s => s.id !== sectionId);
    localStorage.setItem(`destination_sections_${slug}`, JSON.stringify(sections));
    
    // Remove from DOM
    const sectionEl = document.getElementById(sectionId);
    if (sectionEl) sectionEl.remove();
    
    showSaveIndicator();
}

// ========================================
// Event Listeners
// ========================================

function initEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.section).classList.add('active');
        });
    });
    
    // Duration filter
    document.getElementById('durationFilter').addEventListener('change', (e) => {
        renderItineraries(e.target.value);
    });
    
    // Admin buttons
    document.getElementById('addItineraryBtn').addEventListener('click', openAddItinerary);
    document.getElementById('toggleAdminBtn').addEventListener('click', toggleAdminMode);
    
    // Edit mode buttons
    document.getElementById('floatingEditBtn').addEventListener('click', toggleEditMode);
    document.getElementById('exitEditBtn').addEventListener('click', toggleEditMode);
    document.getElementById('saveChangesBtn').addEventListener('click', saveAllChanges);
    document.getElementById('addItineraryInlineBtn').addEventListener('click', openAddItinerary);
    
    // Quick add itinerary
    const quickAddCard = document.querySelector('.quick-add-card');
    if (quickAddCard) {
        quickAddCard.addEventListener('click', openAddItinerary);
    }
    
    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ========================================
// Utilities
// ========================================

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// ========================================
// Map Unlock Functionality
// ========================================

// Map embed URLs for different destinations
const destinationMaps = {
    italy: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6046287.619848877!2d9.121497!3d42.5033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d4fe82448dd203%3A0xe22cf55c24635e6f!2sItaly!5e0!3m2!1sen!2sus',
    greece: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145988.2098024674!2d22.9590!3d38.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135b4ac711716c63%3A0x363a1775dc9a2d1d!2sGreece!5e0!3m2!1sen!2sus',
    portugal: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3118426.7506287545!2d-9.1333!3d39.3999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xb32242dbf!2sPortugal!5e0!3m2!1sen!2sus',
    spain: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6268626.954347535!2d-3.7492!3d40.4637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1618c2269!2sSpain!5e0!3m2!1sen!2sus',
    france: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5661668.0!2d2.3522!3d46.2276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sFrance!5e0!3m2!1sen!2sus',
    bali: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d505144.01185063!2d115.0919!3d-8.4095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd22f5f9ee3ba8f%3A0xa95b49f0428e59c3!2sBali%2C%20Indonesia!5e0!3m2!1sen!2sus',
    japan: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13356879.79626295!2d138.2529!3d36.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34674e0fd77f192f%3A0xf54275d47c665244!2sJapan!5e0!3m2!1sen!2sus',
    thailand: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7954839.3!2d100.9925!3d15.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d8df747424db1%3A0x9ed72c880757e802!2sThailand!5e0!3m2!1sen!2sus',
    mexico: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14896850.7!2d-102.5528!3d23.6345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84043a3b88685353%3A0xed64b4be6b099811!2sMexico!5e0!3m2!1sen!2sus',
    iceland: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1735159.2!2d-19.0208!3d64.9631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48d22b52a3eb6043%3A0x6f8a0434e5c1459a!2sIceland!5e0!3m2!1sen!2sus'
};

function initMapUnlock(destinationSlug) {
    // Map unlock button in the Map tab section
    const unlockBtnSection = document.getElementById('unlockMapBtnSection');
    const mapLockedState = document.getElementById('mapLockedState');
    const mapUnlockedState = document.getElementById('mapUnlockedState');
    const mapIframeSection = document.getElementById('mapIframeSection');
    
    // Check if already unlocked
    const unlockedMaps = JSON.parse(localStorage.getItem('unlockedMaps') || '{}');
    
    if (unlockedMaps[destinationSlug]) {
        showUnlockedMap(destinationSlug);
    }
    
    // Set correct map URL
    if (destinationMaps[destinationSlug] && mapIframeSection) {
        mapIframeSection.src = destinationMaps[destinationSlug];
    }
    
    // Unlock button click handler for section
    if (unlockBtnSection) {
        unlockBtnSection.addEventListener('click', () => {
            handleMapUnlock(destinationSlug);
        });
    }
}

function handleMapUnlock(destinationSlug) {
    // In a real app, this would integrate with a payment processor like Stripe
    // For demo purposes, we'll simulate a purchase with a confirmation
    
    const confirmed = confirm(
        '🗺️ Unlock Full Interactive Map\n\n' +
        'Price: $5.00 (one-time purchase)\n\n' +
        'You\'ll get:\n' +
        '• Interactive map with all locations\n' +
        '• Recommended routes marked\n' +
        '• Hidden gems and local favorites\n' +
        '• Works on all devices\n\n' +
        'Click OK to unlock (demo - no actual charge)'
    );
    
    if (confirmed) {
        // Save unlock status
        const unlockedMaps = JSON.parse(localStorage.getItem('unlockedMaps') || '{}');
        unlockedMaps[destinationSlug] = {
            unlockedAt: new Date().toISOString(),
            price: 5.00
        };
        localStorage.setItem('unlockedMaps', JSON.stringify(unlockedMaps));
        
        // Show unlocked map
        showUnlockedMap(destinationSlug);
        
        // Show success message
        showUnlockSuccess();
    }
}

function showUnlockedMap(destinationSlug) {
    // Hide locked state, show unlocked state in the Map tab
    const mapLockedState = document.getElementById('mapLockedState');
    const mapUnlockedState = document.getElementById('mapUnlockedState');
    
    if (mapLockedState) mapLockedState.style.display = 'none';
    if (mapUnlockedState) mapUnlockedState.style.display = 'block';
}

function showUnlockSuccess() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.innerHTML = `
        <div class="unlock-notification-content">
            <span class="unlock-notification-icon">✓</span>
            <div>
                <strong>Map Unlocked!</strong>
                <p>You now have full access to the interactive map.</p>
            </div>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #2c5530, #3d7242);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInUp 0.5s ease;
        font-family: 'Montserrat', sans-serif;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Style inner content
    const content = notification.querySelector('.unlock-notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    const icon = notification.querySelector('.unlock-notification-icon');
    icon.style.cssText = `
        width: 40px;
        height: 40px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;
    
    const text = notification.querySelector('p');
    text.style.cssText = `
        margin: 0;
        font-size: 0.85rem;
        opacity: 0.9;
    `;
    
    const strong = notification.querySelector('strong');
    strong.style.cssText = `
        display: block;
        font-size: 1rem;
        margin-bottom: 0.25rem;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// ========================================
// Hotels & Car Rental Functions
// ========================================

function searchHotels() {
    const destination = document.getElementById('hotelDestination').value;
    const checkin = document.getElementById('hotelCheckin').value;
    const checkout = document.getElementById('hotelCheckout').value;
    
    // Build Booking.com affiliate URL (replace with real affiliate ID in production)
    let bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`;
    
    if (checkin) bookingUrl += `&checkin=${checkin}`;
    if (checkout) bookingUrl += `&checkout=${checkout}`;
    
    // Open in new tab
    window.open(bookingUrl, '_blank');
}

function searchCars() {
    const pickup = document.getElementById('carPickup').value;
    const pickupDate = document.getElementById('carPickupDate').value;
    const returnDate = document.getElementById('carReturnDate').value;
    
    // Build rental car search URL (example with RentalCars.com)
    let carUrl = `https://www.rentalcars.com/search-results?location=${encodeURIComponent(pickup)}`;
    
    if (pickupDate) carUrl += `&puDay=${pickupDate.split('-')[2]}&puMonth=${pickupDate.split('-')[1]}&puYear=${pickupDate.split('-')[0]}`;
    if (returnDate) carUrl += `&doDay=${returnDate.split('-')[2]}&doMonth=${returnDate.split('-')[1]}&doYear=${returnDate.split('-')[0]}`;
    
    // Open in new tab
    window.open(carUrl, '_blank');
}

// Make functions globally available
window.openAddItinerary = openAddItinerary;
window.editItinerary = editItinerary;
window.deleteItinerary = deleteItinerary;
window.updateDayNumbers = updateDayNumbers;
window.searchHotels = searchHotels;
window.searchCars = searchCars;
window.deleteCustomSection = deleteCustomSection;
window.toggleSectionMenu = toggleSectionMenu;
window.addSectionDirect = addSectionDirect;
window.logout = logout;
window.applyGalleryImages = applyGalleryImages;
window.applyTips = applyTips;
window.applyHighlights = applyHighlights;
window.applyVideo = applyVideo;
window.saveInlineSection = saveInlineSection;
window.cancelInlineSection = cancelInlineSection;
