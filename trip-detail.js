/* ===== Trip Detail JS ===== */
(function () {
    'use strict';

    const AUTH_KEY = 'ip_auth_user';
    const user = JSON.parse(localStorage.getItem(AUTH_KEY));
    if (!user) { window.location.href = 'account.html'; return; }

    const TRIPS_KEY = 'ip_trips_' + user.id;
    const params = new URLSearchParams(window.location.search);
    const tripId = params.get('id');
    if (!tripId) { window.location.href = 'my-trips.html'; return; }

    /* ---- helpers ---- */
    function getTrips() { return JSON.parse(localStorage.getItem(TRIPS_KEY) || '[]'); }
    function saveTrips(t) { localStorage.setItem(TRIPS_KEY, JSON.stringify(t)); }
    function getTrip() { return getTrips().find(t => t.id === tripId) || null; }
    function updateTrip(fn) {
        const trips = getTrips();
        const idx = trips.findIndex(t => t.id === tripId);
        if (idx === -1) return null;
        fn(trips[idx]);
        saveTrips(trips);
        return trips[idx];
    }
    function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
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
    const typeEmoji = { flight: '✈️', hotel: '🏨', activity: '🎫', transport: '🚗', restaurant: '🍽️', other: '📌' };

    /* ---- nav user ---- */
    function initNav() {
        const avatar = document.getElementById('navUserAvatar');
        const name = document.getElementById('navUserName');
        if (avatar) avatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : '?';
        if (name) name.textContent = user.name || 'User';
    }

    /* ---- render hero ---- */
    function renderHero(trip) {
        const hero = document.getElementById('tripHero');
        if (trip.coverImage) {
            hero.style.backgroundImage = 'url(' + trip.coverImage + ')';
        }
        document.getElementById('tripTitle').textContent = trip.name || 'Untitled Trip';
        document.getElementById('tripDest').textContent = trip.destination || '';
        const dateStr = [fmtDate(trip.startDate), fmtDate(trip.endDate)].filter(Boolean).join(' — ');
        document.getElementById('tripDates').textContent = dateStr;
        const statusEl = document.getElementById('tripStatus');
        const s = tripStatus(trip);
        statusEl.textContent = s.charAt(0).toUpperCase() + s.slice(1);
        statusEl.className = 'trip-hero-status ' + s;
    }

    /* ==== TABS ==== */
    const tabs = document.querySelectorAll('.trip-tab');
    const sections = {
        plan: document.getElementById('sectionPlan'),
        bookings: document.getElementById('sectionBookings'),
        photos: document.getElementById('sectionPhotos'),
        albums: document.getElementById('sectionAlbums')
    };
    let activeTab = 'plan';

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const t = tab.dataset.tab;
            if (t === activeTab) return;
            tabs.forEach(b => b.classList.remove('active'));
            tab.classList.add('active');
            Object.values(sections).forEach(s => s.style.display = 'none');
            sections[t].style.display = 'block';
            activeTab = t;
        });
    });

    /* ==== PLAN ==== */
    function renderPlan() {
        const trip = getTrip();
        const timeline = document.getElementById('planTimeline');
        const empty = document.getElementById('planEmpty');
        const plan = trip.plan || [];

        if (plan.length === 0) {
            timeline.innerHTML = '';
            timeline.style.display = 'none';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        timeline.style.display = 'flex';

        // sort by date if present
        plan.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        timeline.innerHTML = plan.map(day => `
            <div class="plan-day">
                <div class="plan-day-marker">
                    <div class="plan-day-dot"></div>
                    <div class="plan-day-line"></div>
                </div>
                <div class="plan-day-content">
                    <div class="plan-day-head">
                        <span class="plan-day-title">${esc(day.title)}</span>
                        <span class="plan-day-date">${fmtDate(day.date)}</span>
                    </div>
                    <div class="plan-day-notes">${esc(day.notes || '')}</div>
                    <div class="plan-day-actions">
                        <button class="btn-edit" onclick="editPlanDay('${day.id}')">Edit</button>
                        <button class="btn-del" onclick="deletePlanDay('${day.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.openPlanModal = function (editId) {
        document.getElementById('planModal').style.display = 'flex';
        document.getElementById('planForm').reset();
        document.getElementById('planEditId').value = '';
        document.getElementById('planModalTitle').textContent = 'Add Day';
        if (editId) {
            const trip = getTrip();
            const day = (trip.plan || []).find(d => d.id === editId);
            if (day) {
                document.getElementById('planDayTitle').value = day.title || '';
                document.getElementById('planDayDate').value = day.date || '';
                document.getElementById('planDayNotes').value = day.notes || '';
                document.getElementById('planEditId').value = day.id;
                document.getElementById('planModalTitle').textContent = 'Edit Day';
            }
        }
    };

    window.closePlanModal = function () {
        document.getElementById('planModal').style.display = 'none';
    };

    window.editPlanDay = function (id) { window.openPlanModal(id); };

    window.deletePlanDay = function (id) {
        if (!confirm('Delete this day?')) return;
        updateTrip(trip => { trip.plan = (trip.plan || []).filter(d => d.id !== id); });
        renderPlan();
    };

    document.getElementById('planForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const editId = document.getElementById('planEditId').value;
        const data = {
            id: editId || uid(),
            title: document.getElementById('planDayTitle').value.trim(),
            date: document.getElementById('planDayDate').value,
            notes: document.getElementById('planDayNotes').value.trim()
        };
        updateTrip(trip => {
            if (!trip.plan) trip.plan = [];
            if (editId) {
                const idx = trip.plan.findIndex(d => d.id === editId);
                if (idx !== -1) trip.plan[idx] = { ...trip.plan[idx], ...data };
            } else {
                trip.plan.push(data);
            }
        });
        window.closePlanModal();
        renderPlan();
    });

    /* ==== BOOKINGS ==== */
    function renderBookings() {
        const trip = getTrip();
        const list = document.getElementById('bookingsList');
        const empty = document.getElementById('bookingsEmpty');
        const bookings = trip.bookings || [];

        if (bookings.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        bookings.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        list.innerHTML = bookings.map(b => `
            <div class="booking-card">
                <div class="booking-icon ${b.type || 'other'}">${typeEmoji[b.type] || '📌'}</div>
                <div class="booking-body">
                    <div class="booking-title">${esc(b.title)}</div>
                    <div class="booking-meta">${fmtDate(b.date)}${b.time ? ' at ' + b.time : ''}</div>
                    ${b.ref ? '<span class="booking-ref">Ref: ' + esc(b.ref) + '</span>' : ''}
                    ${b.notes ? '<div class="booking-notes">' + esc(b.notes) + '</div>' : ''}
                </div>
                <div class="booking-actions">
                    <button class="btn-edit" onclick="editBooking('${b.id}')">Edit</button>
                    <button class="btn-del" onclick="deleteBooking('${b.id}')">Del</button>
                </div>
            </div>
        `).join('');
    }

    window.openBookingModal = function (editId) {
        document.getElementById('bookingModal').style.display = 'flex';
        document.getElementById('bookingForm').reset();
        document.getElementById('bookingEditId').value = '';
        document.getElementById('bookingModalTitle').textContent = 'Add Booking';
        if (editId) {
            const trip = getTrip();
            const b = (trip.bookings || []).find(x => x.id === editId);
            if (b) {
                document.getElementById('bookingType').value = b.type || 'other';
                document.getElementById('bookingTitle').value = b.title || '';
                document.getElementById('bookingDate').value = b.date || '';
                document.getElementById('bookingTime').value = b.time || '';
                document.getElementById('bookingRef').value = b.ref || '';
                document.getElementById('bookingNotes').value = b.notes || '';
                document.getElementById('bookingEditId').value = b.id;
                document.getElementById('bookingModalTitle').textContent = 'Edit Booking';
            }
        }
    };

    window.closeBookingModal = function () {
        document.getElementById('bookingModal').style.display = 'none';
    };

    window.editBooking = function (id) { window.openBookingModal(id); };

    window.deleteBooking = function (id) {
        if (!confirm('Delete this booking?')) return;
        updateTrip(trip => { trip.bookings = (trip.bookings || []).filter(b => b.id !== id); });
        renderBookings();
    };

    document.getElementById('bookingForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const editId = document.getElementById('bookingEditId').value;
        const data = {
            id: editId || uid(),
            type: document.getElementById('bookingType').value,
            title: document.getElementById('bookingTitle').value.trim(),
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            ref: document.getElementById('bookingRef').value.trim(),
            notes: document.getElementById('bookingNotes').value.trim()
        };
        updateTrip(trip => {
            if (!trip.bookings) trip.bookings = [];
            if (editId) {
                const idx = trip.bookings.findIndex(b => b.id === editId);
                if (idx !== -1) trip.bookings[idx] = { ...trip.bookings[idx], ...data };
            } else {
                trip.bookings.push(data);
            }
        });
        window.closeBookingModal();
        renderBookings();
    });

    /* ==== PHOTOS ==== */
    let lightboxPhotos = [];
    let lightboxIdx = 0;

    function renderPhotos() {
        const trip = getTrip();
        const grid = document.getElementById('photosGrid');
        const empty = document.getElementById('photosEmpty');
        const photos = trip.photos || [];

        if (photos.length === 0) {
            grid.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        grid.innerHTML = photos.map((p, i) => `
            <div class="photo-card" onclick="openLightbox(${i})">
                <img src="${p.dataUrl}" alt="${esc(p.name || 'Photo')}" loading="lazy">
                <button class="photo-del" onclick="event.stopPropagation(); deletePhoto('${p.id}')" title="Delete photo">&times;</button>
            </div>
        `).join('');

        lightboxPhotos = photos;
    }

    document.getElementById('photoUpload').addEventListener('change', function (e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        processPhotos(files, function (results) {
            updateTrip(trip => {
                if (!trip.photos) trip.photos = [];
                trip.photos = trip.photos.concat(results);
            });
            renderPhotos();
        });
        e.target.value = '';
    });

    function processPhotos(files, cb) {
        const results = [];
        let done = 0;
        files.forEach(file => {
            // Resize to max 800px to save localStorage space
            const reader = new FileReader();
            reader.onload = function (ev) {
                resizeImage(ev.target.result, 800, function (dataUrl) {
                    results.push({ id: uid(), name: file.name, dataUrl: dataUrl, addedAt: new Date().toISOString() });
                    done++;
                    if (done === files.length) cb(results);
                });
            };
            reader.readAsDataURL(file);
        });
    }

    function resizeImage(dataUrl, maxSize, cb) {
        const img = new Image();
        img.onload = function () {
            let w = img.width, h = img.height;
            if (w > maxSize || h > maxSize) {
                if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
                else { w = Math.round(w * maxSize / h); h = maxSize; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            cb(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.src = dataUrl;
    }

    window.deletePhoto = function (id) {
        if (!confirm('Delete this photo?')) return;
        // Also remove from albums
        updateTrip(trip => {
            trip.photos = (trip.photos || []).filter(p => p.id !== id);
            (trip.albums || []).forEach(a => {
                a.photoIds = (a.photoIds || []).filter(pid => pid !== id);
            });
        });
        renderPhotos();
    };

    /* Lightbox */
    window.openLightbox = function (idx) {
        lightboxIdx = idx;
        document.getElementById('lightbox').style.display = 'flex';
        document.getElementById('lightboxImg').src = lightboxPhotos[idx].dataUrl;
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        document.getElementById('lightbox').style.display = 'none';
        document.body.style.overflow = '';
    };

    window.lightboxNav = function (dir) {
        lightboxIdx = (lightboxIdx + dir + lightboxPhotos.length) % lightboxPhotos.length;
        document.getElementById('lightboxImg').src = lightboxPhotos[lightboxIdx].dataUrl;
    };

    // Keyboard for lightbox
    document.addEventListener('keydown', function (e) {
        if (document.getElementById('lightbox').style.display !== 'flex') return;
        if (e.key === 'Escape') window.closeLightbox();
        if (e.key === 'ArrowLeft') window.lightboxNav(-1);
        if (e.key === 'ArrowRight') window.lightboxNav(1);
    });

    /* ==== ALBUMS ==== */
    let currentAlbumId = null;

    function renderAlbums() {
        const trip = getTrip();
        const grid = document.getElementById('albumsGrid');
        const empty = document.getElementById('albumsEmpty');
        const albums = trip.albums || [];

        if (albums.length === 0) {
            grid.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        const photos = trip.photos || [];

        grid.innerHTML = albums.map(a => {
            const ids = a.photoIds || [];
            const previewPhotos = ids.slice(0, 4).map(pid => photos.find(p => p.id === pid)).filter(Boolean);
            const gridClass = previewPhotos.length === 0 ? '' :
                previewPhotos.length === 1 ? 'grid-1' :
                previewPhotos.length === 2 ? 'grid-2' :
                previewPhotos.length === 3 ? 'grid-3' : 'grid-4';

            const coverHtml = previewPhotos.length > 0
                ? previewPhotos.map(p => `<img src="${p.dataUrl}" alt="" loading="lazy">`).join('')
                : '<div class="album-cover-empty">No photos</div>';

            return `
                <div class="album-card" onclick="viewAlbum('${a.id}')">
                    <div class="album-card-cover ${gridClass}">${coverHtml}</div>
                    <div class="album-card-body">
                        <div class="album-card-name">${esc(a.name)}</div>
                        <div class="album-card-meta">${ids.length} photo${ids.length !== 1 ? 's' : ''}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.openAlbumModal = function () {
        document.getElementById('albumModal').style.display = 'flex';
        document.getElementById('albumForm').reset();
        const trip = getTrip();
        const picker = document.getElementById('albumPhotoPicker');
        const photos = trip.photos || [];

        if (photos.length === 0) {
            picker.innerHTML = '<p class="picker-empty">No photos in this trip yet. Go to Photos tab to upload some first.</p>';
        } else {
            picker.innerHTML = photos.map(p => `
                <div class="picker-thumb" data-id="${p.id}" onclick="togglePickerPhoto(this)">
                    <img src="${p.dataUrl}" alt="" loading="lazy">
                </div>
            `).join('');
        }
    };

    window.closeAlbumModal = function () {
        document.getElementById('albumModal').style.display = 'none';
    };

    window.togglePickerPhoto = function (el) {
        el.classList.toggle('selected');
    };

    document.getElementById('albumForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('albumName').value.trim();
        const desc = document.getElementById('albumDesc').value.trim();
        const selected = Array.from(document.querySelectorAll('#albumPhotoPicker .picker-thumb.selected'))
            .map(el => el.dataset.id);

        updateTrip(trip => {
            if (!trip.albums) trip.albums = [];
            trip.albums.push({
                id: uid(),
                name: name,
                description: desc,
                photoIds: selected,
                createdAt: new Date().toISOString()
            });
        });
        window.closeAlbumModal();
        renderAlbums();
    });

    /* Album Viewer */
    window.viewAlbum = function (albumId) {
        currentAlbumId = albumId;
        const trip = getTrip();
        const album = (trip.albums || []).find(a => a.id === albumId);
        if (!album) return;

        document.getElementById('albumViewer').style.display = 'block';
        document.getElementById('albumViewerTitle').textContent = album.name;

        const photos = trip.photos || [];
        const albumPhotos = (album.photoIds || []).map(pid => photos.find(p => p.id === pid)).filter(Boolean);

        const grid = document.getElementById('albumViewerGrid');
        if (albumPhotos.length === 0) {
            grid.innerHTML = '<div class="empty-section"><p>No photos in this album. Add some!</p></div>';
        } else {
            lightboxPhotos = albumPhotos;
            grid.innerHTML = albumPhotos.map((p, i) => `
                <div class="photo-card" onclick="openLightbox(${i})">
                    <img src="${p.dataUrl}" alt="${esc(p.name || '')}" loading="lazy">
                    <button class="photo-del" onclick="event.stopPropagation(); removeFromAlbum('${p.id}')" title="Remove from album">&times;</button>
                </div>
            `).join('');
        }
    };

    window.closeAlbumViewer = function () {
        document.getElementById('albumViewer').style.display = 'none';
        currentAlbumId = null;
        // Reset lightbox photos to all trip photos
        const trip = getTrip();
        lightboxPhotos = trip.photos || [];
        renderAlbums();
    };

    window.removeFromAlbum = function (photoId) {
        if (!currentAlbumId) return;
        updateTrip(trip => {
            const album = (trip.albums || []).find(a => a.id === currentAlbumId);
            if (album) {
                album.photoIds = (album.photoIds || []).filter(pid => pid !== photoId);
            }
        });
        window.viewAlbum(currentAlbumId);
    };

    window.deleteCurrentAlbum = function () {
        if (!currentAlbumId) return;
        if (!confirm('Delete this album? (Photos will not be deleted)')) return;
        updateTrip(trip => {
            trip.albums = (trip.albums || []).filter(a => a.id !== currentAlbumId);
        });
        window.closeAlbumViewer();
    };

    // Add existing trip photos to current album via picker
    window.openAlbumPhotoPicker = function () {
        if (!currentAlbumId) return;
        const trip = getTrip();
        const album = (trip.albums || []).find(a => a.id === currentAlbumId);
        if (!album) return;
        const existingIds = new Set(album.photoIds || []);
        const available = (trip.photos || []).filter(p => !existingIds.has(p.id));
        const picker = document.getElementById('albumViewerPicker');

        if (available.length === 0) {
            picker.innerHTML = '<p class="picker-empty">All trip photos are already in this album</p>';
        } else {
            picker.innerHTML = available.map(p => `
                <div class="picker-thumb" data-id="${p.id}" onclick="togglePickerPhoto(this)">
                    <img src="${p.dataUrl}" alt="" loading="lazy">
                </div>
            `).join('');
        }
        document.getElementById('albumPickerModal').style.display = 'flex';
    };

    window.closeAlbumPhotoPicker = function () {
        document.getElementById('albumPickerModal').style.display = 'none';
    };

    window.confirmAlbumPhotoPicker = function () {
        const selected = Array.from(document.querySelectorAll('#albumViewerPicker .picker-thumb.selected'))
            .map(el => el.dataset.id);
        if (selected.length === 0) { window.closeAlbumPhotoPicker(); return; }
        updateTrip(trip => {
            const album = (trip.albums || []).find(a => a.id === currentAlbumId);
            if (album) {
                if (!album.photoIds) album.photoIds = [];
                selected.forEach(id => { if (!album.photoIds.includes(id)) album.photoIds.push(id); });
            }
        });
        window.closeAlbumPhotoPicker();
        window.viewAlbum(currentAlbumId);
    };

    /* ---- XSS helper ---- */
    function esc(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /* ==== SHARE TO FEED ==== */
    const SHARED_KEY = 'ip_shared_trips';

    function getSharedTrips() { return JSON.parse(localStorage.getItem(SHARED_KEY) || '[]'); }
    function saveSharedTrips(s) { localStorage.setItem(SHARED_KEY, JSON.stringify(s)); }

    function isTripShared() {
        return getSharedTrips().some(s => s.tripId === tripId && s.userId === user.id);
    }

    function updateShareBtn() {
        const btn = document.getElementById('shareToFeed');
        const txt = document.getElementById('shareBtnText');
        if (isTripShared()) {
            btn.classList.add('shared');
            txt.textContent = 'Shared ✓';
        } else {
            btn.classList.remove('shared');
            txt.textContent = 'Share to Feed';
        }
    }

    window.shareToFeed = function () {
        const shared = getSharedTrips();
        const existing = shared.findIndex(s => s.tripId === tripId && s.userId === user.id);
        if (existing !== -1) {
            // Unshare
            shared.splice(existing, 1);
            saveSharedTrips(shared);
        } else {
            // Share
            const trip = getTrip();
            shared.push({
                tripId: tripId,
                userId: user.id,
                userName: user.name || 'Traveler',
                sharedAt: new Date().toISOString()
            });
            saveSharedTrips(shared);
        }
        updateShareBtn();
    };

    /* ==== INIT ==== */
    const trip = getTrip();
    if (!trip) { window.location.href = 'my-trips.html'; return; }

    initNav();
    renderHero(trip);
    renderPlan();
    renderBookings();
    renderPhotos();
    renderAlbums();
    updateShareBtn();

})();
