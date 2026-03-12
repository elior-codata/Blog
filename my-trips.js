// ========================================
// My Trips Dashboard JavaScript
// ========================================
(function () {
    'use strict';

    const AUTH_KEY = 'ip_auth_user';
    let user = null;
    let trips = [];
    let currentFilter = 'ongoing';

    // ── Auth guard ──
    try { user = JSON.parse(localStorage.getItem(AUTH_KEY)); } catch {}
    if (!user) { window.location.href = 'account.html'; return; }

    function getTripsKey() { return 'ip_trips_' + user.id; }
    function loadTrips() { try { return JSON.parse(localStorage.getItem(getTripsKey())) || []; } catch { return []; } }
    function saveTrips(t) { localStorage.setItem(getTripsKey(), JSON.stringify(t)); }

    const GLOBAL_ALBUMS_KEY = 'ip_albums_' + user.id;
    function getGlobalAlbums() { return JSON.parse(localStorage.getItem(GLOBAL_ALBUMS_KEY) || '[]'); }
    function saveGlobalAlbums(a) { localStorage.setItem(GLOBAL_ALBUMS_KEY, JSON.stringify(a)); }

    function tripStatus(trip) {
        const now = new Date(); now.setHours(0,0,0,0);
        const start = new Date(trip.startDate); start.setHours(0,0,0,0);
        const end = new Date(trip.endDate); end.setHours(0,0,0,0);
        if (now < start) return 'upcoming';
        if (now > end) return 'past';
        return 'ongoing';
    }

    function formatDate(d) {
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function daysUntil(d) {
        const now = new Date(); now.setHours(0,0,0,0);
        const target = new Date(d); target.setHours(0,0,0,0);
        return Math.ceil((target - now) / 86400000);
    }

    function countPhotos(trip) {
        return (trip.photos || []).length;
    }

    function countAlbums(trip) {
        return (trip.albums || []).length;
    }

    function countBookings(trip) {
        return (trip.bookings || []).length;
    }

    // ── Render ──
    function renderProfile() {
        const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
        document.getElementById('avatarInitials').textContent = initials || '?';
        document.getElementById('navUserAvatar').textContent = initials || '?';
        document.getElementById('navUserName').textContent = user.firstName || 'User';
        document.getElementById('dashUserName').textContent = (user.firstName + ' ' + user.lastName).trim() || 'Traveler';

        const upcoming = trips.filter(t => tripStatus(t) === 'upcoming').length;
        const totalPhotos = trips.reduce((s, t) => s + countPhotos(t), 0);
        const totalAlbums = trips.reduce((s, t) => s + countAlbums(t), 0);

        document.getElementById('statTrips').textContent = trips.length;
        document.getElementById('statUpcoming').textContent = upcoming;
        document.getElementById('statPhotos').textContent = totalPhotos;
        document.getElementById('statAlbums').textContent = totalAlbums;

        if (upcoming > 0) {
            const next = trips.filter(t => tripStatus(t) === 'upcoming').sort((a,b) => new Date(a.startDate) - new Date(b.startDate))[0];
            if (next) {
                const days = daysUntil(next.startDate);
                document.getElementById('dashSubtitle').textContent = `Next trip: ${next.name} in ${days} day${days !== 1 ? 's' : ''}`;
            }
        }
    }

    function renderTrips() {
        const grid = document.getElementById('tripsGrid');
        const empty = document.getElementById('dashEmpty');

        let filtered = trips;
        if (currentFilter === 'ongoing') filtered = trips.filter(t => tripStatus(t) === 'ongoing');
        else if (currentFilter === 'upcoming') filtered = trips.filter(t => tripStatus(t) === 'upcoming');
        else if (currentFilter === 'past') filtered = trips.filter(t => tripStatus(t) === 'past');

        // Sort: upcoming by start date asc, past by end date desc
        filtered.sort((a, b) => {
            const sa = tripStatus(a), sb = tripStatus(b);
            if (sa === 'ongoing' && sb !== 'ongoing') return -1;
            if (sb === 'ongoing' && sa !== 'ongoing') return 1;
            if (currentFilter === 'past') return new Date(b.endDate) - new Date(a.endDate);
            return new Date(a.startDate) - new Date(b.startDate);
        });

        if (filtered.length === 0) {
            grid.innerHTML = '';
            empty.style.display = '';
            return;
        }

        empty.style.display = 'none';
        grid.innerHTML = filtered.map(t => {
            const status = tripStatus(t);
            const coverStyle = t.coverImage
                ? `<img src="${t.coverImage}" alt="${t.name}">`
                : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-family:var(--font-heading);font-size:1.8rem;letter-spacing:0.06em">${t.destination || t.name}</div>`;

            const days = status === 'upcoming' ? daysUntil(t.startDate) : 0;
            const statusLabel = status === 'ongoing' ? 'Ongoing' : status === 'upcoming' ? `In ${days}d` : 'Past';

            return `
                <a class="trip-card" href="trip-detail.html?id=${t.id}">
                    <div class="trip-card-cover">
                        ${coverStyle}
                        <span class="trip-card-status ${status}">${statusLabel}</span>
                        <div class="trip-card-actions">
                            <button class="trip-card-action" onclick="event.preventDefault();event.stopPropagation();editTrip('${t.id}')" title="Edit">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button class="trip-card-action" onclick="event.preventDefault();event.stopPropagation();deleteTrip('${t.id}')" title="Delete">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="trip-card-body">
                        <h3>${t.name}</h3>
                        <div class="trip-card-dest">${t.destination}</div>
                        <div class="trip-card-dates">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            ${formatDate(t.startDate)} — ${formatDate(t.endDate)}
                        </div>
                        <div class="trip-card-meta">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> ${countPhotos(t)} photos</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> ${countBookings(t)} bookings</span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    }

    // ── Albums view ──
    function renderAlbums() {
        const grid = document.getElementById('albumsGrid');
        const empty = document.getElementById('dashEmpty');

        const cards = [];

        // Global (super) albums
        getGlobalAlbums().forEach(album => {
            let cover = '';
            if (album.photoRefs && album.photoRefs.length > 0) {
                const ref = album.photoRefs[0];
                const trip = trips.find(t => t.id === ref.tripId);
                if (trip) {
                    const photo = (trip.photos || []).find(p => p.id === ref.photoId);
                    if (photo) cover = photo.dataUrl;
                }
            }
            cards.push(`
                <div class="trip-card" onclick="openAlbumEditor('${album.id}')" style="cursor:pointer;">
                    <div class="trip-card-cover">
                        ${cover
                            ? `<img src="${cover}" alt="${album.name}">`
                            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-family:var(--font-heading);font-size:1.8rem;letter-spacing:0.06em">${album.name}</div>`
                        }
                        <span class="trip-card-status ongoing" style="font-size:0.65rem;padding:0.2rem 0.5rem;">Album</span>
                    </div>
                    <div class="trip-card-body">
                        <h3>${album.name}</h3>
                        <div class="trip-card-dest">My Album</div>
                        <div class="trip-card-meta">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> ${(album.photoRefs || []).length} photos</span>
                        </div>
                    </div>
                </div>
            `);
        });

        // Trip-level albums
        trips.forEach(trip => {
            (trip.albums || []).forEach(album => {
                let cover = '';
                if (album.photoIds && album.photoIds.length > 0) {
                    const photo = (trip.photos || []).find(p => p.id === album.photoIds[0]);
                    if (photo) cover = photo.dataUrl;
                }
                cards.push(`
                    <a class="trip-card" href="trip-detail.html?id=${trip.id}">
                        <div class="trip-card-cover">
                            ${cover
                                ? `<img src="${cover}" alt="${album.name}">`
                                : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-family:var(--font-heading);font-size:1.8rem;letter-spacing:0.06em">${album.name}</div>`
                            }
                        </div>
                        <div class="trip-card-body">
                            <h3>${album.name}</h3>
                            <div class="trip-card-dest">${trip.name}</div>
                            <div class="trip-card-meta">
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> ${(album.photoIds || []).length} photos</span>
                            </div>
                        </div>
                    </a>
                `);
            });
        });

        if (cards.length === 0) {
            grid.innerHTML = '';
            empty.style.display = '';
            empty.querySelector('h3').textContent = 'No albums yet';
            empty.querySelector('p').textContent = 'Tap + to create your first album from all your trip photos';
            const btn = empty.querySelector('.btn-add-trip');
            if (btn) { btn.onclick = window.openAlbumEditor; btn.querySelector('svg + text, span') ; btn.textContent = ''; btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Album'; }
            return;
        }

        empty.style.display = 'none';
        grid.innerHTML = cards.join('');
    }

    // ── Tabs ──
    document.addEventListener('DOMContentLoaded', () => {
        trips = loadTrips();
        renderProfile();
        renderTrips();

        // Handle #albums hash on load (from nav link)
        if (window.location.hash === '#albums') {
            switchToAlbums();
        }

        // Sub-filter pills (Ongoing / Upcoming / Past)
        document.querySelectorAll('.dash-subfilter').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.dash-subfilter').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFilter = pill.dataset.filter;
                renderTrips();
            });
        });

        // User dropdown
        document.getElementById('navUserBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('navUserDropdown').classList.toggle('show');
        });
        document.addEventListener('click', () => {
            document.getElementById('navUserDropdown').classList.remove('show');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem(AUTH_KEY);
            window.location.href = 'account.html';
        });

        // Trip form
        document.getElementById('tripForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const editId = document.getElementById('tripEditId').value;
            const tripData = {
                id: editId || 'trip_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
                name: document.getElementById('tripName').value.trim(),
                destination: document.getElementById('tripDest').value.trim(),
                startDate: document.getElementById('tripStart').value,
                endDate: document.getElementById('tripEnd').value,
                coverImage: document.getElementById('tripCover').value.trim(),
                notes: document.getElementById('tripNotes').value.trim(),
                bookings: [],
                plan: [],
                photos: [],
                albums: [],
                createdAt: new Date().toISOString()
            };

            if (editId) {
                const idx = trips.findIndex(t => t.id === editId);
                if (idx >= 0) {
                    tripData.bookings = trips[idx].bookings || [];
                    tripData.plan = trips[idx].plan || [];
                    tripData.photos = trips[idx].photos || [];
                    tripData.albums = trips[idx].albums || [];
                    tripData.createdAt = trips[idx].createdAt;
                    trips[idx] = tripData;
                }
            } else {
                trips.push(tripData);
            }

            saveTrips(trips);
            closeTripModal();
            renderProfile();
            renderTrips();
        });
    });

    // ── Switch to albums view ──
    window.switchToAlbums = function (e) {
        if (e) e.preventDefault();
        history.replaceState(null, '', '#albums');
        document.getElementById('tripsGrid').style.display = 'none';
        document.getElementById('tripsSubfilters').style.display = 'none';
        document.getElementById('dashEmpty').style.display = 'none';
        document.getElementById('albumsGrid').style.display = '';
        document.getElementById('fabAddTrip').style.display = 'none';
        document.getElementById('fabCreateAlbum').style.display = '';
        renderAlbums();
    };

    // ── Album Editor (Lupa-style) ──
    let albumEditorId = null;
    let albumEditorPhotoRefs = [];
    let dragSrcIndex = null;

    function renderLibrary() {
        const container = document.getElementById('albumLibraryPhotos');
        const selectedSet = new Set(albumEditorPhotoRefs.map(r => r.tripId + ':' + r.photoId));
        let html = '';
        let total = 0;
        trips.forEach(trip => {
            const photos = trip.photos || [];
            if (!photos.length) return;
            total += photos.length;
            html += `<div class="album-lib-trip-label">${trip.name}</div><div class="album-lib-group">`;
            html += photos.map(p => {
                const sel = selectedSet.has(trip.id + ':' + p.id) ? ' selected' : '';
                const check = sel ? '<div class="album-lib-check">✓</div>' : '';
                return `<div class="album-lib-thumb${sel}" data-trip-id="${trip.id}" data-photo-id="${p.id}" onclick="toggleLibPhoto(this,'${trip.id}','${p.id}')"><img src="${p.dataUrl}" alt="" loading="lazy">${check}</div>`;
            }).join('');
            html += `</div>`;
        });
        if (!html) html = '<p class="album-lib-empty">No photos uploaded yet. Add photos to your trips first.</p>';
        container.innerHTML = html;
        document.getElementById('albumLibraryCount').textContent = total + ' photo' + (total !== 1 ? 's' : '');
    }

    function renderBook() {
        const container = document.getElementById('albumBookPages');
        const empty = document.getElementById('albumBookEmpty');
        document.getElementById('albumBookCount').textContent = albumEditorPhotoRefs.length + ' photo' + (albumEditorPhotoRefs.length !== 1 ? 's' : '');
        container.querySelectorAll('.album-book-photo').forEach(e => e.remove());
        if (albumEditorPhotoRefs.length === 0) { empty.style.display = 'flex'; return; }
        empty.style.display = 'none';
        let html = '';
        albumEditorPhotoRefs.forEach((ref, i) => {
            const trip = trips.find(t => t.id === ref.tripId);
            if (!trip) return;
            const photo = (trip.photos || []).find(p => p.id === ref.photoId);
            if (!photo) return;
            html += `<div class="album-book-photo" draggable="true" data-index="${i}"><img src="${photo.dataUrl}" alt="" loading="lazy"><div class="album-book-num">${i + 1}</div><button class="album-book-remove" onclick="removeBookPhoto(${i})" title="Remove">&times;</button></div>`;
        });
        empty.insertAdjacentHTML('beforebegin', html);
        setupBookDrag();
    }

    function setupBookDrag() {
        document.querySelectorAll('.album-book-photo').forEach(el => {
            el.addEventListener('dragstart', e => {
                dragSrcIndex = parseInt(el.dataset.index);
                el.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            el.addEventListener('dragend', () => el.classList.remove('dragging'));
            el.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
            el.addEventListener('drop', e => {
                e.preventDefault();
                const targetIndex = parseInt(el.dataset.index);
                if (dragSrcIndex === null || dragSrcIndex === targetIndex) return;
                const moved = albumEditorPhotoRefs.splice(dragSrcIndex, 1)[0];
                albumEditorPhotoRefs.splice(targetIndex, 0, moved);
                dragSrcIndex = null;
                renderBook();
            });
        });
    }

    window.toggleLibPhoto = function (el, tripId, photoId) {
        const idx = albumEditorPhotoRefs.findIndex(r => r.tripId === tripId && r.photoId === photoId);
        if (idx >= 0) {
            albumEditorPhotoRefs.splice(idx, 1);
            el.classList.remove('selected');
            const check = el.querySelector('.album-lib-check');
            if (check) check.remove();
        } else {
            albumEditorPhotoRefs.push({ tripId, photoId });
            el.classList.add('selected');
            el.insertAdjacentHTML('beforeend', '<div class="album-lib-check">✓</div>');
        }
        renderBook();
    };

    window.removeBookPhoto = function (index) {
        const ref = albumEditorPhotoRefs[index];
        albumEditorPhotoRefs.splice(index, 1);
        const libThumb = document.querySelector(`.album-lib-thumb[data-trip-id="${ref.tripId}"][data-photo-id="${ref.photoId}"]`);
        if (libThumb) {
            libThumb.classList.remove('selected');
            const check = libThumb.querySelector('.album-lib-check');
            if (check) check.remove();
        }
        renderBook();
    };

    window.openAlbumEditor = function (albumId) {
        albumEditorId = albumId || null;
        const editAlbum = albumId ? getGlobalAlbums().find(a => a.id === albumId) : null;
        document.getElementById('albumEditorName').value = editAlbum ? editAlbum.name : '';
        albumEditorPhotoRefs = editAlbum ? editAlbum.photoRefs.map(r => ({ ...r })) : [];
        renderLibrary();
        renderBook();
        document.getElementById('albumEditorOverlay').style.display = 'flex';
    };

    window.closeAlbumEditor = function () {
        document.getElementById('albumEditorOverlay').style.display = 'none';
    };

    window.saveAlbumEditor = function () {
        const name = document.getElementById('albumEditorName').value.trim();
        if (!name) { document.getElementById('albumEditorName').focus(); return; }
        const albums = getGlobalAlbums();
        if (albumEditorId) {
            const idx = albums.findIndex(a => a.id === albumEditorId);
            if (idx >= 0) { albums[idx].name = name; albums[idx].photoRefs = albumEditorPhotoRefs; }
        } else {
            albums.push({
                id: 'album_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
                name, photoRefs: albumEditorPhotoRefs,
                createdAt: new Date().toISOString()
            });
        }
        saveGlobalAlbums(albums);
        closeAlbumEditor();
        renderAlbums();
    };

    // ── Modal ──
    window.openAddTrip = function () {
        document.getElementById('modalTitle').textContent = 'New Trip';
        document.getElementById('tripForm').reset();
        document.getElementById('tripEditId').value = '';
        document.getElementById('tripModal').style.display = '';
    };

    window.closeTripModal = function () {
        document.getElementById('tripModal').style.display = 'none';
    };

    window.editTrip = function (id) {
        const trip = trips.find(t => t.id === id);
        if (!trip) return;
        document.getElementById('modalTitle').textContent = 'Edit Trip';
        document.getElementById('tripEditId').value = trip.id;
        document.getElementById('tripName').value = trip.name;
        document.getElementById('tripDest').value = trip.destination;
        document.getElementById('tripStart').value = trip.startDate;
        document.getElementById('tripEnd').value = trip.endDate;
        document.getElementById('tripCover').value = trip.coverImage || '';
        document.getElementById('tripNotes').value = trip.notes || '';
        document.getElementById('tripModal').style.display = '';
    };

    window.deleteTrip = function (id) {
        if (!confirm('Delete this trip? This cannot be undone.')) return;
        trips = trips.filter(t => t.id !== id);
        saveTrips(trips);
        renderProfile();
        renderTrips();
    };
})();
