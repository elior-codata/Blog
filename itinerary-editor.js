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

// Duration mapping
const durationMap = {
    '5days': '5 Days',
    'week': '1 Week',
    '10days': '10 Days',
    '2weeks': '2 Weeks',
    '3weeks': '3 Weeks',
    'month': '1 Month'
};

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
    
    // Try Codata first
    if (typeof CodataAPI !== 'undefined') {
        try {
            itinerary = await CodataAPI.getItinerary(id);
        } catch (error) {
            console.warn('Codata unavailable, using localStorage fallback');
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
    
    // Set duration
    document.getElementById('durationSelect').value = currentItinerary.durationCode || '';
    
    // Set title
    document.getElementById('itineraryTitle').value = currentItinerary.title || '';
    autoResizeTextarea(document.getElementById('itineraryTitle'));
    
    // Set regions
    document.getElementById('itineraryRegions').value = currentItinerary.regions || '';
    
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
}

function setupEventListeners() {
    // Title auto-resize
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
    
    // Regions
    document.getElementById('itineraryRegions').addEventListener('input', (e) => {
        currentItinerary.regions = e.target.value;
        markUnsaved();
    });
    
    // Destination select
    document.getElementById('destinationSelect').addEventListener('change', (e) => {
        currentItinerary.destination = e.target.value;
        markUnsaved();
    });
    
    // Duration select
    document.getElementById('durationSelect').addEventListener('change', (e) => {
        currentItinerary.durationCode = e.target.value;
        currentItinerary.duration = durationMap[e.target.value] || '';
        markUnsaved();
        updatePreview();
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
    
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';
    dayCard.dataset.day = dayNumber;
    
    dayCard.innerHTML = `
        <div class="day-card-header">
            <span class="day-number">Day ${dayNumber}</span>
            <div class="day-card-actions">
                <button class="day-action-btn" onclick="moveDayUp(${dayNumber})" title="Move Up">↑</button>
                <button class="day-action-btn" onclick="moveDayDown(${dayNumber})" title="Move Down">↓</button>
                <button class="day-action-btn" onclick="deleteDay(${dayNumber})" title="Delete">×</button>
            </div>
        </div>
        <div class="day-card-body">
            <input type="text" class="day-title-input" 
                   placeholder="Day title (e.g., Arrival in Rome)" 
                   value="${dayData?.title || ''}"
                   onchange="updateDayData(${dayNumber}, 'title', this.value)">
            <textarea class="day-description-input" 
                      placeholder="Describe what to do, see, and experience on this day. Include specific recommendations, timings, and tips..."
                      onchange="updateDayData(${dayNumber}, 'description', this.value)">${dayData?.description || ''}</textarea>
            <div class="day-images-section">
                <span class="day-images-label">📷 Add image URL (optional)</span>
                <input type="text" class="day-image-url-input" 
                       placeholder="https://images.unsplash.com/..."
                       value="${dayData?.image || ''}"
                       onchange="updateDayData(${dayNumber}, 'image', this.value)">
            </div>
        </div>
    `;
    
    container.appendChild(dayCard);
    
    // Update internal days array
    if (!dayData) {
        currentItinerary.days.push({
            dayNumber: dayNumber,
            title: '',
            description: '',
            image: ''
        });
    }
    
    updateStats();
}

function updateDayData(dayNumber, field, value) {
    const dayIndex = dayNumber - 1;
    if (currentItinerary.days[dayIndex]) {
        currentItinerary.days[dayIndex][field] = value;
    } else {
        currentItinerary.days[dayIndex] = {
            dayNumber: dayNumber,
            title: '',
            description: '',
            image: ''
        };
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
        
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.dataset.day = day.dayNumber;
        
        dayCard.innerHTML = `
            <div class="day-card-header">
                <span class="day-number">Day ${day.dayNumber}</span>
                <div class="day-card-actions">
                    <button class="day-action-btn" onclick="moveDayUp(${day.dayNumber})" title="Move Up">↑</button>
                    <button class="day-action-btn" onclick="moveDayDown(${day.dayNumber})" title="Move Down">↓</button>
                    <button class="day-action-btn" onclick="deleteDay(${day.dayNumber})" title="Delete">×</button>
                </div>
            </div>
            <div class="day-card-body">
                <input type="text" class="day-title-input" 
                       placeholder="Day title (e.g., Arrival in Rome)" 
                       value="${day.title || ''}"
                       onchange="updateDayData(${day.dayNumber}, 'title', this.value)">
                <textarea class="day-description-input" 
                          placeholder="Describe what to do, see, and experience on this day..."
                          onchange="updateDayData(${day.dayNumber}, 'description', this.value)">${day.description || ''}</textarea>
                <div class="day-images-section">
                    <span class="day-images-label">📷 Add image URL (optional)</span>
                    <input type="text" class="day-image-url-input" 
                           placeholder="https://images.unsplash.com/..."
                           value="${day.image || ''}"
                           onchange="updateDayData(${day.dayNumber}, 'image', this.value)">
                </div>
            </div>
        `;
        
        container.appendChild(dayCard);
    });
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
                ${currentItinerary.days.map(day => `
                    <div style="margin-bottom: 2rem; padding: 1.5rem; background: #f9f9f9; border-radius: 12px; border-left: 4px solid #2c5530;">
                        <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; margin-bottom: 0.5rem;">
                            <span style="color: #2c5530;">Day ${day.dayNumber}</span> - ${day.title || 'Untitled'}
                        </h4>
                        <p style="font-family: 'Montserrat', sans-serif; color: #555; line-height: 1.7;">${day.description || 'No description yet.'}</p>
                    </div>
                `).join('')}
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
    
    if (!currentItinerary.duration) {
        alert('Please select a duration.');
        return;
    }
    
    // Generate ID if new
    const isNew = !currentItinerary.id;
    if (isNew) {
        currentItinerary.id = `custom-${Date.now()}`;
    }
    
    // Save to Codata if available
    if (typeof CodataAPI !== 'undefined') {
        try {
            if (isNew) {
                await CodataAPI.createItinerary(currentItinerary);
            } else {
                await CodataAPI.updateItinerary(currentItinerary.id, currentItinerary);
            }
            console.log('Saved to Codata successfully');
        } catch (error) {
            console.error('Failed to save to Codata:', error);
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
window.deleteDay = deleteDay;
window.moveDayUp = moveDayUp;
window.moveDayDown = moveDayDown;
