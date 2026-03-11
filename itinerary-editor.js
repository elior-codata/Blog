// ========================================
// Itinerary Editor - JavaScript
// ========================================

// State
let currentItinerary = {
    id: null,
    destination: '',
    title: '',
    duration: '',
    durationCode: '',
    regions: '',
    description: '',
    coverImage: '',
    highlights: [],
    days: [],
    budget: '',
    bestTime: '',
    gettingThere: '',
    gettingAround: ''
};

let isEditing = false;
let hasUnsavedChanges = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEditor();
    loadItineraryFromUrl();
    setupEventListeners();
    updateStats();
});

function initializeEditor() {
    // Set up back link
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('d') || 'italy';
    const backLink = document.getElementById('backLink');
    backLink.href = `destination.html?d=${destination}`;
    
    // Pre-select destination if provided
    const destinationSelect = document.getElementById('destinationSelect');
    if (destination && destinationSelect) {
        destinationSelect.value = destination;
        currentItinerary.destination = destination;
    }
}

function loadItineraryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const itineraryId = urlParams.get('id');
    
    if (itineraryId) {
        // Load existing itinerary for editing
        isEditing = true;
        loadItinerary(itineraryId);
    } else {
        // New itinerary - add first day
        addDay();
    }
}

async function loadItinerary(id) {
    let itinerary = null;
    
    // Try local data first
    if (typeof CodataAPI !== 'undefined') {
        try {
            itinerary = await CodataAPI.getItinerary(id);
        } catch (error) {
            console.warn('local data unavailable, using localStorage fallback');
        }
    }
    
    // Fallback to localStorage
    if (!itinerary) {
        const savedItineraries = JSON.parse(localStorage.getItem('customItineraries') || '[]');
        itinerary = savedItineraries.find(it => it.id === id);
    }
    
    if (itinerary) {
        currentItinerary = { ...itinerary };
        populateForm();
        document.getElementById('saveStatus').textContent = 'Editing existing itinerary';
    }
}

function populateForm() {
    // Set destination
    document.getElementById('destinationSelect').value = currentItinerary.destination || '';
    
    // Set title
    document.getElementById('itineraryTitle').value = currentItinerary.title || '';
    autoResizeTextarea(document.getElementById('itineraryTitle'));
    
    // Set description
    document.getElementById('itineraryDescription').value = currentItinerary.description || '';
    
    // Set cover image
    if (currentItinerary.coverImage) {
        setCoverImage(currentItinerary.coverImage);
    }
    
    // Set highlights
    if (currentItinerary.highlights && currentItinerary.highlights.length > 0) {
        currentItinerary.highlights.forEach(h => addHighlightTag(h));
    }
    
    // Set days
    if (currentItinerary.days && currentItinerary.days.length > 0) {
        currentItinerary.days.forEach((day, index) => {
            addDay(day);
        });
    } else {
        addDay();
    }
    
    // Set practical info
    document.getElementById('budgetInput').value = currentItinerary.budget || '';
    document.getElementById('bestTimeInput').value = currentItinerary.bestTime || '';
    document.getElementById('gettingThereInput').value = currentItinerary.gettingThere || '';
    document.getElementById('gettingAroundInput').value = currentItinerary.gettingAround || '';
    
    updatePreview();
    updateStats();
    updateDurationAndRoute();
}

function setupEventListeners() {
    const titleInput = document.getElementById('itineraryTitle');
    titleInput.addEventListener('input', (e) => {
        autoResizeTextarea(e.target);
        currentItinerary.title = e.target.value;
        markUnsaved();
        updatePreview();
    });
    
    // Description
    document.getElementById('itineraryDescription').addEventListener('input', (e) => {
        currentItinerary.description = e.target.value;
        markUnsaved();
        updatePreview();
    });
    
    // Destination select
    document.getElementById('destinationSelect').addEventListener('change', (e) => {
        currentItinerary.destination = e.target.value;
        markUnsaved();
    });
    
    // Cover image URL
    const coverUrlInput = document.getElementById('coverImageUrl');
    coverUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (coverUrlInput.value.trim()) {
                setCoverImage(coverUrlInput.value.trim());
            }
        }
    });
    
    coverUrlInput.addEventListener('blur', () => {
        if (coverUrlInput.value.trim()) {
            setCoverImage(coverUrlInput.value.trim());
        }
    });
    
    // Cover image placeholder click
    document.getElementById('coverPlaceholder').addEventListener('click', (e) => {
        if (e.target !== coverUrlInput) {
            document.getElementById('coverImageInput').click();
        }
    });
    
    // Cover image file input
    document.getElementById('coverImageInput').addEventListener('change', handleCoverImageUpload);
    
    // Cover actions
    document.getElementById('changeCoverBtn').addEventListener('click', () => {
        document.getElementById('coverImageInput').click();
    });
    
    document.getElementById('removeCoverBtn').addEventListener('click', removeCoverImage);
    
    // Highlights input
    document.getElementById('highlightInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value) {
                addHighlightTag(value);
                e.target.value = '';
                markUnsaved();
                updateStats();
            }
        }
    });
    
    // Add day button
    document.getElementById('addDayBtn').addEventListener('click', () => {
        addDay();
        markUnsaved();
        updateStats();
    });
    
    // Practical info inputs
    document.getElementById('budgetInput').addEventListener('input', (e) => {
        currentItinerary.budget = e.target.value;
        markUnsaved();
    });
    
    document.getElementById('bestTimeInput').addEventListener('input', (e) => {
        currentItinerary.bestTime = e.target.value;
        markUnsaved();
    });
    
    document.getElementById('gettingThereInput').addEventListener('input', (e) => {
        currentItinerary.gettingThere = e.target.value;
        markUnsaved();
    });
    
    document.getElementById('gettingAroundInput').addEventListener('input', (e) => {
        currentItinerary.gettingAround = e.target.value;
        markUnsaved();
    });
    
    // Preview button
    document.getElementById('previewBtn').addEventListener('click', showPreview);
    document.getElementById('closePreviewModal').addEventListener('click', closePreview);
    
    // Publish button
    document.getElementById('publishBtn').addEventListener('click', publishItinerary);
    
    // Close modal on backdrop click
    document.getElementById('previewModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('previewModal')) {
            closePreview();
        }
    });
    
    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function handleCoverImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            setCoverImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function setCoverImage(url) {
    currentItinerary.coverImage = url;
    
    const placeholder = document.getElementById('coverPlaceholder');
    const preview = document.getElementById('coverPreview');
    const coverImage = document.getElementById('coverImage');
    
    coverImage.src = url;
    placeholder.style.display = 'none';
    preview.style.display = 'block';
    
    markUnsaved();
    updatePreview();
}

function removeCoverImage() {
    currentItinerary.coverImage = '';
    
    const placeholder = document.getElementById('coverPlaceholder');
    const preview = document.getElementById('coverPreview');
    
    placeholder.style.display = 'flex';
    preview.style.display = 'none';
    document.getElementById('coverImageUrl').value = '';
    
    markUnsaved();
    updatePreview();
}

function addHighlightTag(text) {
    if (!currentItinerary.highlights.includes(text)) {
        currentItinerary.highlights.push(text);
    }
    
    const container = document.getElementById('highlightsContainer');
    
    // Remove the "Add highlights..." placeholder if exists
    const placeholder = container.querySelector('.highlight-tag:not(.filled)');
    if (placeholder) {
        placeholder.remove();
    }
    
    // Check if tag already exists in DOM
    const existingTags = container.querySelectorAll('.highlight-tag');
    for (const tag of existingTags) {
        if (tag.querySelector('span') && tag.querySelector('span').textContent === text) {
            return;
        }
    }
    
    const tag = document.createElement('div');
    tag.className = 'highlight-tag filled';
    tag.innerHTML = `
        <span>${text}</span>
        <span class="remove-highlight" onclick="removeHighlight(this, '${text}')">×</span>
    `;
    
    container.appendChild(tag);
}

function removeHighlight(element, text) {
    currentItinerary.highlights = currentItinerary.highlights.filter(h => h !== text);
    element.parentElement.remove();
    
    // Add placeholder back if no highlights
    if (currentItinerary.highlights.length === 0) {
        const container = document.getElementById('highlightsContainer');
        container.innerHTML = `
            <div class="highlight-tag">
                <span>Add highlights...</span>
            </div>
        `;
    }
    
    markUnsaved();
    updateStats();
}

function addDay(dayData = null) {
    const container = document.getElementById('daysContainer');
    const dayNumber = container.children.length + 1;
    
    // Initialize day data with parts structure
    if (!dayData) {
        dayData = {
            dayNumber: dayNumber,
            title: '',
            parts: [{
                title: '',
                place: '',
                description: '',
                image: ''
            }]
        };
        currentItinerary.days.push(dayData);
    }
    // Migrate old format (no parts) to new format
    if (!dayData.parts) {
        dayData.parts = [{
            title: dayData.title || '',
            place: '',
            description: dayData.description || '',
            image: dayData.image || ''
        }];
    }
    
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';
    dayCard.dataset.day = dayNumber;
    
    dayCard.innerHTML = buildDayCardHTML(dayNumber, dayData);
    container.appendChild(dayCard);
    
    // Attach image upload listeners for all parts
    dayData.parts.forEach((_, partIdx) => {
        attachPartImageListener(dayNumber, partIdx);
    });
    
    updateDurationAndRoute();
    updateStats();
}

function buildDayCardHTML(dayNumber, dayData) {
    const partsHTML = dayData.parts.map((part, partIdx) => buildPartHTML(dayNumber, partIdx, part)).join('');
    
    return `
        <div class="day-card-header">
            <span class="day-number">Day ${dayNumber}</span>
            <input type="text" class="day-header-title-input" 
                   placeholder="Day title (e.g., Arrival in Rome)" 
                   value="${escapeAttr(dayData.title || '')}"
                   onchange="updateDayTitle(${dayNumber}, this.value)">
            <div class="day-card-actions">
                <button class="day-action-btn" onclick="moveDayUp(${dayNumber})" title="Move Up">↑</button>
                <button class="day-action-btn" onclick="moveDayDown(${dayNumber})" title="Move Down">↓</button>
                <button class="day-action-btn" onclick="deleteDay(${dayNumber})" title="Delete">×</button>
            </div>
        </div>
        <div class="day-card-body">
            <div class="day-parts-container" id="dayParts_${dayNumber}">
                ${partsHTML}
            </div>
            <button type="button" class="add-part-btn" onclick="addPart(${dayNumber})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Activity
            </button>
        </div>
    `;
}

function buildPartHTML(dayNumber, partIdx, part) {
    const imagePreview = part.image 
        ? `<div class="part-image-preview" id="partImgPreview_${dayNumber}_${partIdx}">
               <img src="${part.image}" alt="Activity photo">
               <button class="part-img-remove-btn" onclick="removePartImage(${dayNumber}, ${partIdx})">×</button>
           </div>`
        : `<div class="part-image-preview" id="partImgPreview_${dayNumber}_${partIdx}" style="display:none;">
               <img src="" alt="Activity photo">
               <button class="part-img-remove-btn" onclick="removePartImage(${dayNumber}, ${partIdx})">×</button>
           </div>`;
    
    return `
        <div class="day-part" data-part="${partIdx}">
            <div class="part-header">
                <span class="part-label">Activity ${partIdx + 1}</span>
                ${partIdx > 0 ? `<button class="part-remove-btn" onclick="removePart(${dayNumber}, ${partIdx})" title="Remove activity">×</button>` : ''}
            </div>
            <div class="part-fields">
                <input type="text" class="part-title-input" 
                       placeholder="Activity title (e.g., Visit the Colosseum)"
                       value="${escapeAttr(part.title || '')}"
                       onchange="updatePartData(${dayNumber}, ${partIdx}, 'title', this.value)">
                <input type="text" class="part-place-input" 
                       placeholder="📍 Place name (e.g., Rome, Colosseum)"
                       value="${escapeAttr(part.place || '')}"
                       onchange="updatePartData(${dayNumber}, ${partIdx}, 'place', this.value)">
                <textarea class="part-description-input" 
                          placeholder="Describe this activity, tips, timings..."
                          onchange="updatePartData(${dayNumber}, ${partIdx}, 'description', this.value)">${part.description || ''}</textarea>
                <div class="part-image-section">
                    <label class="part-image-upload-btn" for="partImgInput_${dayNumber}_${partIdx}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        Add Photo
                    </label>
                    <input type="file" id="partImgInput_${dayNumber}_${partIdx}" accept="image/*" hidden>
                    ${imagePreview}
                </div>
            </div>
        </div>
    `;
}

function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function attachPartImageListener(dayNumber, partIdx) {
    const input = document.getElementById(`partImgInput_${dayNumber}_${partIdx}`);
    if (!input) return;
    input.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            // Compress image before storing
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const maxW = 800, maxH = 600;
                let w = img.width, h = img.height;
                if (w > maxW) { h = h * maxW / w; w = maxW; }
                if (h > maxH) { w = w * maxH / h; h = maxH; }
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
                updatePartData(dayNumber, partIdx, 'image', dataUrl);
                // Show preview
                const preview = document.getElementById(`partImgPreview_${dayNumber}_${partIdx}`);
                if (preview) {
                    preview.querySelector('img').src = dataUrl;
                    preview.style.display = 'block';
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function updateDayTitle(dayNumber, value) {
    const dayIndex = dayNumber - 1;
    if (currentItinerary.days[dayIndex]) {
        currentItinerary.days[dayIndex].title = value;
    }
    markUnsaved();
}

function updatePartData(dayNumber, partIdx, field, value) {
    const dayIndex = dayNumber - 1;
    if (!currentItinerary.days[dayIndex]) return;
    if (!currentItinerary.days[dayIndex].parts) currentItinerary.days[dayIndex].parts = [];
    if (!currentItinerary.days[dayIndex].parts[partIdx]) {
        currentItinerary.days[dayIndex].parts[partIdx] = { title: '', place: '', description: '', image: '' };
    }
    currentItinerary.days[dayIndex].parts[partIdx][field] = value;
    markUnsaved();
    updateDurationAndRoute();
}

function addPart(dayNumber) {
    const dayIndex = dayNumber - 1;
    if (!currentItinerary.days[dayIndex]) return;
    if (!currentItinerary.days[dayIndex].parts) currentItinerary.days[dayIndex].parts = [];
    
    const newPart = { title: '', place: '', description: '', image: '' };
    currentItinerary.days[dayIndex].parts.push(newPart);
    
    const partIdx = currentItinerary.days[dayIndex].parts.length - 1;
    const partsContainer = document.getElementById(`dayParts_${dayNumber}`);
    if (partsContainer) {
        const partDiv = document.createElement('div');
        partDiv.innerHTML = buildPartHTML(dayNumber, partIdx, newPart);
        partsContainer.appendChild(partDiv.firstElementChild);
        attachPartImageListener(dayNumber, partIdx);
    }
    markUnsaved();
}

function removePart(dayNumber, partIdx) {
    const dayIndex = dayNumber - 1;
    if (!currentItinerary.days[dayIndex] || !currentItinerary.days[dayIndex].parts) return;
    if (currentItinerary.days[dayIndex].parts.length <= 1) return;
    
    currentItinerary.days[dayIndex].parts.splice(partIdx, 1);
    renderDays();
    markUnsaved();
    updateDurationAndRoute();
}

function removePartImage(dayNumber, partIdx) {
    const dayIndex = dayNumber - 1;
    if (currentItinerary.days[dayIndex] && currentItinerary.days[dayIndex].parts[partIdx]) {
        currentItinerary.days[dayIndex].parts[partIdx].image = '';
    }
    const preview = document.getElementById(`partImgPreview_${dayNumber}_${partIdx}`);
    if (preview) {
        preview.style.display = 'none';
        preview.querySelector('img').src = '';
    }
    markUnsaved();
}

// ========================================
// Auto-derive Duration & Route
// ========================================

function updateDurationAndRoute() {
    // Duration = number of days
    const numDays = currentItinerary.days.length;
    let durationText = `${numDays} Day${numDays !== 1 ? 's' : ''}`;
    if (numDays === 7) durationText = '1 Week';
    else if (numDays === 14) durationText = '2 Weeks';
    else if (numDays === 21) durationText = '3 Weeks';
    else if (numDays === 30 || numDays === 31) durationText = '1 Month';
    
    currentItinerary.duration = durationText;
    currentItinerary.durationCode = numDays <= 5 ? '5days' : numDays <= 7 ? 'week' : numDays <= 10 ? '10days' : numDays <= 14 ? '2weeks' : numDays <= 21 ? '3weeks' : 'month';
    
    const durationDisplay = document.getElementById('durationDisplay');
    if (durationDisplay) durationDisplay.textContent = durationText;
    
    // Route = unique places from all parts, in order of appearance
    const places = [];
    currentItinerary.days.forEach(day => {
        if (day.parts) {
            day.parts.forEach(part => {
                if (part.place && part.place.trim()) {
                    const placeName = part.place.trim();
                    if (!places.includes(placeName)) {
                        places.push(placeName);
                    }
                }
            });
        }
    });
    
    const routeText = places.length > 0 ? places.join(' → ') : '';
    currentItinerary.regions = routeText;
    
    const routeDisplay = document.getElementById('routeDisplay');
    if (routeDisplay) {
        routeDisplay.textContent = routeText || 'Add places to your days to build the route';
        routeDisplay.classList.toggle('has-route', places.length > 0);
    }
    
    updatePreview();
}

function updateDayData(dayNumber, field, value) {
    const dayIndex = dayNumber - 1;
    if (currentItinerary.days[dayIndex]) {
        currentItinerary.days[dayIndex][field] = value;
    }
    markUnsaved();
}

function deleteDay(dayNumber) {
    if (currentItinerary.days.length <= 1) {
        alert('You need at least one day in your itinerary.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this day?')) {
        currentItinerary.days.splice(dayNumber - 1, 1);
        renderDays();
        markUnsaved();
        updateStats();
        updateDurationAndRoute();
    }
}

function moveDayUp(dayNumber) {
    if (dayNumber <= 1) return;
    
    const days = currentItinerary.days;
    [days[dayNumber - 1], days[dayNumber - 2]] = [days[dayNumber - 2], days[dayNumber - 1]];
    
    renderDays();
    markUnsaved();
}

function moveDayDown(dayNumber) {
    if (dayNumber >= currentItinerary.days.length) return;
    
    const days = currentItinerary.days;
    [days[dayNumber - 1], days[dayNumber]] = [days[dayNumber], days[dayNumber - 1]];
    
    renderDays();
    markUnsaved();
}

function renderDays() {
    const container = document.getElementById('daysContainer');
    container.innerHTML = '';
    
    currentItinerary.days.forEach((day, index) => {
        day.dayNumber = index + 1;
        // Migrate old format
        if (!day.parts) {
            day.parts = [{
                title: day.title || '',
                place: '',
                description: day.description || '',
                image: day.image || ''
            }];
        }
        
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.dataset.day = day.dayNumber;
        
        dayCard.innerHTML = buildDayCardHTML(day.dayNumber, day);
        container.appendChild(dayCard);
        
        // Attach image listeners for all parts
        day.parts.forEach((_, partIdx) => {
            attachPartImageListener(day.dayNumber, partIdx);
        });
    });
    
    updateDurationAndRoute();
}

function markUnsaved() {
    hasUnsavedChanges = true;
    document.getElementById('saveStatus').textContent = 'Unsaved changes';
    document.getElementById('saveStatus').classList.remove('saved');
}

function markSaved() {
    hasUnsavedChanges = false;
    document.getElementById('saveStatus').textContent = 'All changes saved';
    document.getElementById('saveStatus').classList.add('saved');
}

function updatePreview() {
    // Update sidebar preview card
    const previewImage = document.getElementById('previewImage');
    const previewDuration = document.getElementById('previewDuration');
    const previewTitle = document.getElementById('previewTitle');
    const previewDescription = document.getElementById('previewDescription');
    
    if (currentItinerary.coverImage) {
        previewImage.style.backgroundImage = `url(${currentItinerary.coverImage})`;
        previewImage.innerHTML = '';
    } else {
        previewImage.style.backgroundImage = '';
        previewImage.innerHTML = '<span>No cover image</span>';
    }
    
    previewDuration.textContent = currentItinerary.duration || 'Duration';
    previewTitle.textContent = currentItinerary.title || 'Itinerary Title';
    previewDescription.textContent = currentItinerary.description || 'Description preview...';
}

function updateStats() {
    document.getElementById('statDays').textContent = currentItinerary.days.length;
    document.getElementById('statHighlights').textContent = currentItinerary.highlights.length;
    
    // Calculate completeness
    let score = 0;
    let total = 6;
    
    if (currentItinerary.title) score++;
    if (currentItinerary.description) score++;
    if (currentItinerary.coverImage) score++;
    if (currentItinerary.days.length > 0) score++;
    if (currentItinerary.highlights.length > 0) score++;
    if (currentItinerary.destination) score++;
    
    const percentage = Math.round((score / total) * 100);
    document.getElementById('statCompleteness').textContent = `${percentage}%`;
}

function showPreview() {
    const modal = document.getElementById('previewModal');
    const container = document.getElementById('previewContainer');
    
    container.innerHTML = `
        <div class="itinerary-preview">
            ${currentItinerary.coverImage ? `
                <div class="preview-cover" style="background-image: url(${currentItinerary.coverImage}); height: 300px; background-size: cover; background-position: center; border-radius: 12px; margin-bottom: 2rem;"></div>
            ` : ''}
            
            <div style="margin-bottom: 1rem;">
                <span style="background: #2c5530; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-family: 'Montserrat', sans-serif;">${currentItinerary.duration || 'Duration not set'}</span>
            </div>
            
            <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; margin-bottom: 0.5rem;">${currentItinerary.title || 'Untitled Itinerary'}</h1>
            
            <p style="font-family: 'Montserrat', sans-serif; color: #2c5530; font-weight: 500; margin-bottom: 1.5rem;">${currentItinerary.regions || ''}</p>
            
            <p style="font-family: 'Montserrat', sans-serif; color: #555; line-height: 1.8; margin-bottom: 2rem;">${currentItinerary.description || ''}</p>
            
            ${currentItinerary.highlights.length > 0 ? `
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; margin-bottom: 1rem;">Trip Highlights</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${currentItinerary.highlights.map(h => `
                            <span style="background: #f0f7f1; color: #2c5530; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-family: 'Montserrat', sans-serif;">${h}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div style="margin-top: 2rem;">
                <h3 style="font-family: 'Cormorant Garamond', serif; margin-bottom: 1.5rem; font-size: 1.8rem;">Day by Day</h3>
                ${currentItinerary.days.map(day => {
                    const parts = day.parts || [{ title: day.title || '', place: '', description: day.description || '', image: day.image || '' }];
                    return `
                    <div style="margin-bottom: 2rem; padding: 1.5rem; background: #f9f9f9; border-radius: 12px; border-left: 4px solid #2c5530;">
                        <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; margin-bottom: 0.8rem;">
                            <span style="color: #2c5530;">Day ${day.dayNumber}</span>${day.title ? ' - ' + day.title : ''}
                        </h4>
                        ${parts.map((part, pi) => `
                            <div style="margin-bottom: 1rem; ${pi > 0 ? 'padding-top: 1rem; border-top: 1px solid #e0e0e0;' : ''}">
                                ${part.title ? `<h5 style="font-family: 'Montserrat', sans-serif; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.3rem;">${part.title}</h5>` : ''}
                                ${part.place ? `<p style="font-family: 'Montserrat', sans-serif; color: #2c5530; font-size: 0.85rem; margin-bottom: 0.4rem;">📍 ${part.place}</p>` : ''}
                                ${part.description ? `<p style="font-family: 'Montserrat', sans-serif; color: #555; line-height: 1.7; font-size: 0.9rem;">${part.description}</p>` : ''}
                                ${part.image ? `<img src="${part.image}" style="max-width: 100%; border-radius: 8px; margin-top: 0.5rem;" alt="${part.title || 'Activity photo'}">` : ''}
                            </div>
                        `).join('')}
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closePreview() {
    document.getElementById('previewModal').classList.remove('active');
}

async function publishItinerary() {
    // Validate required fields
    if (!currentItinerary.destination) {
        alert('Please select a destination.');
        return;
    }
    
    if (!currentItinerary.title) {
        alert('Please add a title for your itinerary.');
        return;
    }
    
    // Auto-calculate duration and route before publishing
    updateDurationAndRoute();
    
    // Generate ID if new
    const isNew = !currentItinerary.id;
    if (isNew) {
        currentItinerary.id = `custom-${Date.now()}`;
    }
    
    // Save to local data if available
    if (typeof CodataAPI !== 'undefined') {
        try {
            if (isNew) {
                await CodataAPI.createItinerary(currentItinerary);
            } else {
                await CodataAPI.updateItinerary(currentItinerary.id, currentItinerary);
            }
            console.log('Saved to local data successfully');
        } catch (error) {
            console.error('Failed to save to local data:', error);
        }
    }
    
    // Also save to localStorage as backup
    const savedItineraries = JSON.parse(localStorage.getItem('customItineraries') || '[]');
    
    // Update or add
    const existingIndex = savedItineraries.findIndex(it => it.id === currentItinerary.id);
    if (existingIndex >= 0) {
        savedItineraries[existingIndex] = currentItinerary;
    } else {
        savedItineraries.push(currentItinerary);
    }
    
    // Save
    localStorage.setItem('customItineraries', JSON.stringify(savedItineraries));
    
    markSaved();
    
    // Show success message
    alert('Itinerary published successfully!');
    
    // Redirect to destination page
    window.location.href = `destination.html?d=${currentItinerary.destination}`;
}

// Make functions available globally
window.removeHighlight = removeHighlight;
window.updateDayData = updateDayData;
window.updateDayTitle = updateDayTitle;
window.updatePartData = updatePartData;
window.addPart = addPart;
window.removePart = removePart;
window.removePartImage = removePartImage;
window.deleteDay = deleteDay;
window.moveDayUp = moveDayUp;
window.moveDayDown = moveDayDown;
