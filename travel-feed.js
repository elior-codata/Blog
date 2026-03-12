/* ===== Travel Feed JS — Polarsteps-inspired ===== */
(function () {
    'use strict';

    const AUTH_KEY = 'ip_auth_user';
    const user = JSON.parse(localStorage.getItem(AUTH_KEY));
    if (!user) { window.location.href = 'account.html'; return; }

    const TRIPS_KEY = 'ip_trips_' + user.id;
    const SHARED_KEY = 'ip_shared_trips';
    const FOLLOWING_KEY = 'ip_following_' + user.id;
    const USERS_KEY = 'ip_users';
    const PROFILE_KEY = 'ip_profile_' + user.id;

    const userName = ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'Traveler';
    const userInitial = userName.charAt(0).toUpperCase();

    let currentFilter = 'all';
    let currentView = 'feed'; // 'feed' | 'mine'

    /* ---- helpers ---- */
    function getTrips() { return JSON.parse(localStorage.getItem(TRIPS_KEY) || '[]'); }
    function getProfile() { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); }
    function saveProfile(p) { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }

    function resizeImage(dataUrl, maxW, maxH, cb) {
        const img = new Image();
        img.onload = () => {
            const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
            const w = Math.round(img.width * ratio), h = Math.round(img.height * ratio);
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            c.getContext('2d').drawImage(img, 0, 0, w, h);
            cb(c.toDataURL('image/jpeg', 0.85));
        };
        img.src = dataUrl;
    }
    function getSharedTrips() { return JSON.parse(localStorage.getItem(SHARED_KEY) || '[]'); }
    function getAllUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }

    function getFollowing() { return JSON.parse(localStorage.getItem(FOLLOWING_KEY) || '[]'); }
    function saveFollowing(list) { localStorage.setItem(FOLLOWING_KEY, JSON.stringify(list)); }
    function isFollowing(userId) { return getFollowing().some(f => f.id === userId); }
    function followUser(userObj) {
        const list = getFollowing();
        if (!list.some(f => f.id === userObj.id)) {
            list.push({ id: userObj.id, firstName: userObj.firstName, lastName: userObj.lastName, email: userObj.email });
            saveFollowing(list);
        }
        renderFollowingBar();
    }
    function unfollowUser(userId) {
        saveFollowing(getFollowing().filter(f => f.id !== userId));
        renderFollowingBar();
        if (currentView === 'feed') refreshView();
    }

    function getFeedTrips() {
        const shared = getSharedTrips();
        const following = getFollowing();
        const followingIds = new Set(following.map(f => f.id));
        followingIds.add(user.id); // include own shared trips in feed

        const seen = new Set();
        const result = [];

        shared.forEach(entry => {
            if (!followingIds.has(entry.userId)) return;
            const key = entry.userId + ':' + entry.tripId;
            if (seen.has(key)) return;
            seen.add(key);

            const trips = JSON.parse(localStorage.getItem('ip_trips_' + entry.userId) || '[]');
            const trip = trips.find(t => t.id === entry.tripId);
            if (!trip) return;

            if (entry.userId !== user.id) {
                const ownerName = entry.userName ||
                    ((following.find(f => f.id === entry.userId) || {}).firstName || 'Traveler');
                trip._owner = { name: ownerName, initial: ownerName.charAt(0).toUpperCase() };
            }
            result.push(trip);
        });

        return result;
    }

    function fmtDate(d) {
        if (!d) return '';
        const dt = new Date(d + 'T00:00:00');
        return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    function tripStatus(trip) {
        const now = new Date(); now.setHours(0, 0, 0, 0);
        const start = trip.startDate ? new Date(trip.startDate + 'T00:00:00') : null;
        const end = trip.endDate ? new Date(trip.endDate + 'T00:00:00') : null;
        if (end && end < now) return 'past';
        if (start && start <= now) return 'ongoing';
        return 'upcoming';
    }
    function daysBetween(a, b) {
        if (!a || !b) return 0;
        const d1 = new Date(a + 'T00:00:00'), d2 = new Date(b + 'T00:00:00');
        return Math.max(0, Math.round((d2 - d1) / 86400000));
    }
    function timeAgo(dateStr) {
        if (!dateStr) return '';
        const now = new Date();
        const d = new Date(dateStr + 'T00:00:00');
        const diff = Math.floor((now - d) / 86400000);
        if (diff < 0) return 'in ' + Math.abs(diff) + ' days';
        if (diff === 0) return 'today';
        if (diff === 1) return 'yesterday';
        if (diff < 30) return diff + ' days ago';
        if (diff < 365) return Math.floor(diff / 30) + ' months ago';
        return Math.floor(diff / 365) + ' years ago';
    }
    function esc(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }

    /* ---- Nav ---- */
    const avatar = document.getElementById('navUserAvatar');
    if (avatar) avatar.textContent = userInitial;
    const navName = document.getElementById('navUserName');
    if (navName) navName.textContent = user.firstName || 'User';

    // Dropdown toggle
    const navBtn = document.getElementById('navUserBtn');
    const navDropdown = document.getElementById('navUserDropdown');
    if (navBtn && navDropdown) {
        navBtn.addEventListener('click', e => { e.stopPropagation(); navDropdown.classList.toggle('show'); });
        document.addEventListener('click', () => navDropdown.classList.remove('show'));
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', e => {
            e.preventDefault();
            localStorage.removeItem('ip_auth_user');
            window.location.href = 'account.html';
        });
    }

    /* ---- Profile banner ---- */
    function applyAvatarToEl(el, profile) {
        if (!el) return;
        if (profile.avatarDataUrl) {
            el.innerHTML = `<img src="${profile.avatarDataUrl}" alt="">`;
        } else {
            el.textContent = userInitial;
        }
    }

    function renderProfile(trips) {
        const profile = getProfile();
        const displayName = profile.displayName || userName;
        const bio = profile.bio || 'Explorer \u2022 Storyteller \u2022 Wanderer';

        applyAvatarToEl(document.getElementById('feedAvatarBig'), profile);

        const coverEl = document.getElementById('feedCover');
        if (coverEl && profile.coverDataUrl) {
            coverEl.style.backgroundImage = `url(${profile.coverDataUrl})`;
            coverEl.style.backgroundSize = 'cover';
            coverEl.style.backgroundPosition = 'center';
        }

        const nameEl = document.getElementById('feedProfileName');
        if (nameEl) nameEl.textContent = displayName;
        const bioEl = document.getElementById('feedProfileBio');
        if (bioEl) bioEl.textContent = bio;

        document.getElementById('statTrips').textContent = trips.length;
        const dests = new Set(trips.map(t => (t.destination || '').toLowerCase().trim()).filter(Boolean));
        document.getElementById('statCountries').textContent = dests.size;
        const totalPhotos = trips.reduce((s, t) => s + (t.photos || []).length, 0);
        document.getElementById('statPhotos').textContent = totalPhotos;
        const totalDays = trips.reduce((s, t) => s + daysBetween(t.startDate, t.endDate), 0);
        document.getElementById('statDays').textContent = totalDays;
    }

    /* ---- Cover photo upload ---- */
    const coverInput = document.getElementById('coverInput');
    if (coverInput) {
        coverInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => resizeImage(e.target.result, 1400, 560, dataUrl => {
                const profile = getProfile();
                profile.coverDataUrl = dataUrl;
                saveProfile(profile);
                const coverEl = document.getElementById('feedCover');
                if (coverEl) {
                    coverEl.style.backgroundImage = `url(${dataUrl})`;
                    coverEl.style.backgroundSize = 'cover';
                    coverEl.style.backgroundPosition = 'center';
                }
            });
            reader.readAsDataURL(file);
        });
    }

    /* ---- Avatar upload (main page) ---- */
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => resizeImage(e.target.result, 300, 300, dataUrl => {
                const profile = getProfile();
                profile.avatarDataUrl = dataUrl;
                saveProfile(profile);
                applyAvatarToEl(document.getElementById('feedAvatarBig'), profile);
                applyAvatarToEl(document.getElementById('epAvatarPreview'), profile);
            });
            reader.readAsDataURL(file);
        });
    }

    /* ---- Edit Profile Modal ---- */
    const editProfileBtn = document.getElementById('feedEditProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditProfile = document.getElementById('closeEditProfile');
    const epCancel = document.getElementById('epCancel');
    const epAvatarFile = document.getElementById('epAvatarFile');
    const editProfileForm = document.getElementById('editProfileForm');

    function openEditProfile() {
        const profile = getProfile();
        document.getElementById('epDisplayName').value = profile.displayName || userName;
        document.getElementById('epBio').value = profile.bio || '';
        applyAvatarToEl(document.getElementById('epAvatarPreview'), profile);
        editProfileModal.style.display = 'flex';
    }

    function closeEditProfileFn() { editProfileModal.style.display = 'none'; }

    if (editProfileBtn) editProfileBtn.addEventListener('click', openEditProfile);
    if (closeEditProfile) closeEditProfile.addEventListener('click', closeEditProfileFn);
    if (epCancel) epCancel.addEventListener('click', closeEditProfileFn);

    if (editProfileModal) {
        editProfileModal.addEventListener('click', e => {
            if (e.target === editProfileModal) closeEditProfileFn();
        });
    }

    if (epAvatarFile) {
        epAvatarFile.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => resizeImage(e.target.result, 300, 300, dataUrl => {
                const profile = getProfile();
                profile.avatarDataUrl = dataUrl;
                saveProfile(profile);
                applyAvatarToEl(document.getElementById('epAvatarPreview'), profile);
                applyAvatarToEl(document.getElementById('feedAvatarBig'), profile);
            });
            reader.readAsDataURL(file);
        });
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const profile = getProfile();
            profile.displayName = document.getElementById('epDisplayName').value.trim() || userName;
            profile.bio = document.getElementById('epBio').value.trim();
            saveProfile(profile);
            closeEditProfileFn();
            renderProfile(getTrips());
            const navName = document.getElementById('navUserName');
            if (navName) navName.textContent = profile.displayName.split(' ')[0];
        });
    }

    /* ---- Following bar ---- */
    function renderFollowingBar() {
        const bar = document.getElementById('followingBar');
        const chips = document.getElementById('followingChips');
        if (!bar || !chips) return;
        const following = getFollowing();
        if (following.length === 0) {
            bar.style.display = 'none';
            return;
        }
        bar.style.display = 'flex';
        chips.innerHTML = following.map(f => {
            const name = ((f.firstName || '') + ' ' + (f.lastName || '')).trim() || 'Traveler';
            const initial = name.charAt(0).toUpperCase();
            return `<div class="following-chip" data-id="${esc(f.id)}">
                <span class="following-chip-avatar">${initial}</span>
                <span class="following-chip-name">${esc(name)}</span>
                <button class="following-chip-remove" title="Unfollow">&times;</button>
            </div>`;
        }).join('');

        chips.querySelectorAll('.following-chip-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const chip = btn.closest('.following-chip');
                unfollowUser(chip.dataset.id);
            });
        });
    }

    /* ---- Search users ---- */
    let searchDebounce = null;
    const searchInput = document.getElementById('friendSearch');
    const searchResults = document.getElementById('searchResults');

    function renderSearchResults(query) {
        if (!searchResults) return;
        if (!query) { searchResults.style.display = 'none'; return; }
        const q = query.toLowerCase();
        const all = getAllUsers().filter(u => u.id !== user.id && (
            (u.firstName || '').toLowerCase().includes(q) ||
            (u.lastName || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q)
        ));

        if (all.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No travelers found</div>';
            searchResults.style.display = 'block';
            return;
        }

        searchResults.innerHTML = all.map(u => {
            const name = ((u.firstName || '') + ' ' + (u.lastName || '')).trim() || 'Traveler';
            const initial = name.charAt(0).toUpperCase();
            const following = isFollowing(u.id);
            return `<div class="search-result-item">
                <div class="search-result-avatar">${initial}</div>
                <div class="search-result-info">
                    <div class="search-result-name">${esc(name)}</div>
                    <div class="search-result-email">${esc(u.email)}</div>
                </div>
                <button class="search-result-btn${following ? ' following' : ''}" data-uid="${esc(u.id)}"
                    data-fname="${esc(u.firstName || '')}" data-lname="${esc(u.lastName || '')}" data-email="${esc(u.email || '')}">
                    ${following ? 'Following' : 'Follow'}
                </button>
            </div>`;
        }).join('');

        searchResults.querySelectorAll('.search-result-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const uid = btn.dataset.uid;
                if (isFollowing(uid)) {
                    unfollowUser(uid);
                    btn.classList.remove('following');
                    btn.textContent = 'Follow';
                } else {
                    followUser({ id: uid, firstName: btn.dataset.fname, lastName: btn.dataset.lname, email: btn.dataset.email });
                    btn.classList.add('following');
                    btn.textContent = 'Following';
                    if (currentView === 'feed') refreshView();
                }
            });
        });

        searchResults.style.display = 'block';
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => renderSearchResults(searchInput.value.trim()), 300);
        });
    }

    document.addEventListener('click', e => {
        if (searchResults && !searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });

    /* ---- View tabs ---- */
    document.querySelectorAll('.feed-view-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.feed-view-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentView = tab.dataset.view;
            const title = document.getElementById('feedSectionTitle');
            if (title) title.textContent = currentView === 'feed' ? 'Travel Feed' : 'My Trips';
            refreshView();
        });
    });

    function refreshView() {
        const trips = currentView === 'mine' ? getTrips() : getFeedTrips();
        renderFeed(trips);
        drawWorldMap(trips);
    }

    /* ---- World Map (simple equirect projection) ---- */
    const GEO_DB = {
        'italy': [42.5, 12.5], 'greece': [39.0, 22.0], 'portugal': [39.5, -8.0],
        'spain': [40.0, -4.0], 'france': [46.6, 2.5], 'germany': [51.0, 10.0],
        'uk': [54.0, -2.0], 'england': [52.5, -1.5], 'scotland': [57.0, -4.0],
        'ireland': [53.0, -8.0], 'netherlands': [52.3, 5.3], 'belgium': [50.8, 4.4],
        'switzerland': [46.8, 8.2], 'austria': [47.5, 14.5], 'czech republic': [49.8, 15.5],
        'croatia': [45.0, 16.0], 'turkey': [39.0, 35.0], 'iceland': [65.0, -18.0],
        'norway': [62.0, 10.0], 'sweden': [62.0, 15.0], 'denmark': [56.0, 10.0],
        'finland': [64.0, 26.0], 'poland': [52.0, 20.0], 'hungary': [47.5, 19.0],
        'romania': [46.0, 25.0], 'morocco': [32.0, -6.0], 'egypt': [27.0, 30.0],
        'south africa': [-29.0, 24.0], 'kenya': [0.0, 38.0], 'tanzania': [-6.0, 35.0],
        'japan': [36.0, 138.0], 'thailand': [15.0, 101.0], 'bali': [-8.4, 115.2],
        'indonesia': [-2.5, 118.0], 'vietnam': [16.0, 108.0], 'india': [21.0, 78.0],
        'china': [35.0, 105.0], 'south korea': [36.0, 128.0],
        'australia': [-25.0, 134.0], 'new zealand': [-41.0, 174.0],
        'usa': [39.0, -98.0], 'canada': [56.0, -106.0], 'mexico': [23.0, -102.0],
        'brazil': [-14.0, -51.0], 'argentina': [-34.0, -64.0], 'colombia': [4.0, -72.0],
        'peru': [-10.0, -76.0], 'chile': [-33.0, -70.5], 'costa rica': [10.0, -84.0],
        'cuba': [22.0, -79.5], 'dominican republic': [19.0, -70.0],
        'rome': [41.9, 12.5], 'paris': [48.86, 2.35], 'london': [51.5, -0.12],
        'barcelona': [41.39, 2.17], 'amsterdam': [52.37, 4.9], 'berlin': [52.52, 13.4],
        'prague': [50.08, 14.43], 'vienna': [48.2, 16.37], 'lisbon': [38.72, -9.14],
        'athens': [37.98, 23.73], 'istanbul': [41.01, 28.98], 'dubai': [25.2, 55.27],
        'tokyo': [35.68, 139.69], 'bangkok': [13.76, 100.5], 'singapore': [1.35, 103.82],
        'new york': [40.71, -74.0], 'los angeles': [34.05, -118.24],
        'san francisco': [37.77, -122.42], 'miami': [25.76, -80.19],
        'rio de janeiro': [-22.9, -43.17], 'buenos aires': [-34.6, -58.38],
        'sydney': [-33.87, 151.21], 'cape town': [-33.92, 18.42],
        'marrakech': [31.63, -8.0], 'cairo': [30.04, 31.24], 'nairobi': [-1.29, 36.82],
        'kyoto': [35.01, 135.77], 'seoul': [37.57, 127.0], 'hanoi': [21.03, 105.85],
        'mumbai': [19.08, 72.88], 'reykjavik': [64.15, -21.94],
        'santorini': [36.39, 25.46], 'dubrovnik': [42.65, 18.09],
        'florence': [43.77, 11.25], 'venice': [45.44, 12.32], 'milan': [45.46, 9.19],
        'nice': [43.71, 7.26], 'zurich': [47.38, 8.54], 'munich': [48.14, 11.58],
        'madrid': [40.42, -3.7], 'porto': [41.15, -8.61], 'budapest': [47.5, 19.04],
        'stockholm': [59.33, 18.07], 'oslo': [59.91, 10.75], 'copenhagen': [55.68, 12.57],
        'edinburgh': [55.95, -3.19], 'tulum': [20.21, -87.43], 'cancun': [21.16, -86.85],
        'hong kong': [22.32, 114.17], 'taipei': [25.03, 121.57],
        'amalfi': [40.63, 14.6], 'cinque terre': [44.12, 9.71]
    };

    function geoLookup(destination) {
        if (!destination) return null;
        const lower = destination.toLowerCase().trim();
        if (GEO_DB[lower]) return GEO_DB[lower];
        for (const key of Object.keys(GEO_DB)) {
            if (lower.includes(key) || key.includes(lower)) return GEO_DB[key];
        }
        const parts = lower.split(/[,\-\/]+/).map(s => s.trim());
        for (const part of parts) {
            if (GEO_DB[part]) return GEO_DB[part];
            for (const key of Object.keys(GEO_DB)) {
                if (part.includes(key) || key.includes(part)) return GEO_DB[key];
            }
        }
        return null;
    }

    function drawWorldMap(trips) {
        const canvas = document.getElementById('worldMap');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;

        ctx.fillStyle = '#f0ebe4';
        ctx.fillRect(0, 0, W, H);
        drawMinimalWorld(ctx, W, H);

        const pinsContainer = document.getElementById('mapPins');
        if (!pinsContainer) return;
        pinsContainer.innerHTML = '';

        const usedPositions = [];
        trips.forEach(trip => {
            const geo = geoLookup(trip.destination);
            if (!geo) return;
            const [lat, lon] = geo;
            const x = ((lon + 180) / 360) * 100;
            const y = ((90 - lat) / 180) * 100;
            const key = Math.round(x) + ',' + Math.round(y);
            if (usedPositions.includes(key)) return;
            usedPositions.push(key);

            const status = tripStatus(trip);
            const pin = document.createElement('div');
            pin.className = 'map-pin' + (status === 'ongoing' ? ' pulse' : '');
            pin.style.left = x + '%';
            pin.style.top = y + '%';

            const label = document.createElement('div');
            label.className = 'map-pin-label';
            label.textContent = trip.destination || trip.name;
            pin.appendChild(label);

            pin.addEventListener('click', () => {
                window.location.href = 'trip-detail.html?id=' + trip.id;
            });
            pinsContainer.appendChild(pin);
        });
    }

    function drawMinimalWorld(ctx, W, H) {
        ctx.strokeStyle = '#d8cfc4';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#e8e0d5';

        const continents = [
            [[12,18],[18,16],[25,18],[27,22],[28,28],[26,35],[20,38],[15,42],[12,38],[8,32],[10,24]],
            [[20,48],[24,45],[28,48],[30,55],[29,62],[27,70],[24,76],[20,72],[19,64],[18,55]],
            [[46,16],[50,14],[54,16],[52,20],[50,24],[47,26],[44,24],[43,20]],
            [[44,28],[50,28],[54,32],[56,42],[54,52],[52,58],[48,62],[44,58],[42,48],[42,38]],
            [[54,12],[62,10],[70,14],[76,18],[80,22],[82,28],[78,34],[72,36],[66,32],[60,28],[56,24],[54,18]],
            [[68,38],[72,38],[76,42],[74,46],[70,44]],
            [[72,54],[78,52],[82,56],[80,62],[76,64],[72,60]],
        ];

        continents.forEach(coords => {
            ctx.beginPath();
            coords.forEach((c, i) => {
                const px = (c[0] / 100) * W;
                const py = (c[1] / 100) * H;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

        ctx.strokeStyle = 'rgba(200,190,175,0.3)';
        ctx.lineWidth = 0.5;
        for (let i = 1; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(0, (H / 6) * i);
            ctx.lineTo(W, (H / 6) * i);
            ctx.stroke();
        }
        for (let i = 1; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo((W / 8) * i, 0);
            ctx.lineTo((W / 8) * i, H);
            ctx.stroke();
        }
    }

    /* ---- Timeline Feed ---- */
    function renderFeed(trips) {
        const timeline = document.getElementById('feedTimeline');
        const empty = document.getElementById('feedEmpty');

        let filtered = trips.slice();
        if (currentFilter !== 'all') {
            filtered = filtered.filter(t => tripStatus(t) === currentFilter);
        }

        filtered.sort((a, b) => {
            const sa = tripStatus(a), sb = tripStatus(b);
            const order = { ongoing: 0, upcoming: 1, past: 2 };
            if (order[sa] !== order[sb]) return order[sa] - order[sb];
            if (sa === 'past') return (b.endDate || '').localeCompare(a.endDate || '');
            return (a.startDate || '').localeCompare(b.startDate || '');
        });

        if (filtered.length === 0) {
            timeline.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        timeline.innerHTML = filtered.map((trip, i) => buildPostCard(trip, i)).join('');
    }

    function buildPostCard(trip, index) {
        const status = tripStatus(trip);
        const photos = trip.photos || [];
        const bookings = trip.bookings || [];
        const plan = trip.plan || [];
        const days = daysBetween(trip.startDate, trip.endDate);

        const owner = trip._owner || { name: userName, initial: userInitial };

        let photoHtml = '';
        if (photos.length > 0) {
            const show = photos.slice(0, 4);
            const cls = show.length === 1 ? 'single' : show.length === 2 ? 'duo' : show.length === 3 ? 'trio' : 'quad';
            photoHtml = `<div class="feed-post-photos ${cls}">
                ${show.map(p => `<img src="${p.dataUrl}" alt="" loading="lazy">`).join('')}
                ${photos.length > 4 ? `<div class="photo-more">+${photos.length - 4}</div>` : ''}
            </div>`;
        } else if (trip.coverImage) {
            photoHtml = `<div class="feed-post-cover"><img src="${trip.coverImage}" alt="" loading="lazy"></div>`;
        } else {
            photoHtml = `<div class="feed-post-cover"><span class="feed-post-cover-text">${esc(trip.destination || trip.name)}</span></div>`;
        }

        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        const dateDisplay = [fmtDate(trip.startDate), fmtDate(trip.endDate)].filter(Boolean).join(' — ');
        const relativeTime = timeAgo(trip.startDate);

        return `
            <div class="feed-post" style="animation-delay:${index * 0.08}s">
                <a class="feed-post-card" href="trip-detail.html?id=${trip.id}">
                    <div class="feed-post-header">
                        <div class="feed-post-avatar">${owner.initial}</div>
                        <div class="feed-post-user">
                            <div class="feed-post-username">${esc(owner.name)}</div>
                            <div class="feed-post-time">${relativeTime}</div>
                        </div>
                        <span class="feed-post-status ${status}">${statusLabel}</span>
                    </div>
                    ${photoHtml}
                    <div class="feed-post-body">
                        <h3 class="feed-post-title">${esc(trip.name)}</h3>
                        <div class="feed-post-dest">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            ${esc(trip.destination || '')}
                        </div>
                        <div class="feed-post-dates">${dateDisplay}${days ? ' &bull; ' + days + ' days' : ''}</div>
                        ${trip.notes ? `<p class="feed-post-notes">${esc(trip.notes)}</p>` : ''}
                    </div>
                    <div class="feed-post-footer">
                        <span class="feed-post-stat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            ${photos.length} photo${photos.length !== 1 ? 's' : ''}
                        </span>
                        <span class="feed-post-stat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                            ${bookings.length} booking${bookings.length !== 1 ? 's' : ''}
                        </span>
                        <span class="feed-post-stat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            ${plan.length} day${plan.length !== 1 ? 's' : ''} planned
                        </span>
                        <span class="feed-post-action">View Trip →</span>
                    </div>
                </a>
            </div>
        `;
    }

    /* ---- Year Highlights ---- */
    function renderHighlights(trips) {
        const section = document.getElementById('feedHighlights');
        const scroll = document.getElementById('highlightsScroll');
        if (!section || !scroll) return;

        const byYear = {};
        trips.forEach(t => {
            if (!t.startDate) return;
            const year = t.startDate.substring(0, 4);
            if (!byYear[year]) byYear[year] = [];
            byYear[year].push(t);
        });

        const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));
        if (years.length < 1) { section.style.display = 'none'; return; }

        section.style.display = 'block';
        scroll.innerHTML = years.map(year => {
            const yearTrips = byYear[year];
            const totalPh = yearTrips.reduce((s, t) => s + (t.photos || []).length, 0);
            const totalDays = yearTrips.reduce((s, t) => s + daysBetween(t.startDate, t.endDate), 0);
            let cover = '';
            for (const t of yearTrips) {
                if (t.photos && t.photos.length > 0) { cover = t.photos[0].dataUrl; break; }
                if (t.coverImage) { cover = t.coverImage; break; }
            }
            return `
                <div class="highlight-card">
                    <div class="highlight-card-cover">
                        ${cover ? `<img src="${cover}" alt="" loading="lazy">` : ''}
                        <span class="highlight-card-year">${year}</span>
                    </div>
                    <div class="highlight-card-body">
                        <h4>${yearTrips.length} Trip${yearTrips.length !== 1 ? 's' : ''}</h4>
                        <p>${totalDays} days &bull; ${totalPh} photos</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ---- Filter pills ---- */
    document.querySelectorAll('.feed-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.feed-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.dataset.filter;
            refreshView();
        });
    });

    /* ---- Init ---- */
    const ownTrips = getTrips();
    renderProfile(ownTrips);
    renderHighlights(ownTrips);
    renderFollowingBar();

    // Start in 'feed' view — activate the feed tab
    const feedTab = document.querySelector('.feed-view-tab[data-view="feed"]');
    if (feedTab) feedTab.classList.add('active');
    const title = document.getElementById('feedSectionTitle');
    if (title) title.textContent = 'Travel Feed';

    refreshView();

})();
