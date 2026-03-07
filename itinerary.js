// ========================================
// Itinerary View Page JavaScript
// With Inline Editing Support
// ========================================

let currentItinerary = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', () => {
    loadItinerary();
    setupNavigation();
    setupEditMode();
});

async function loadItinerary() {
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('d') || 'italy';
    const itineraryId = urlParams.get('id');
    
    if (!itineraryId) {
        showError('No itinerary specified');
        return;
    }
    
    let itinerary = null;
    
    // Try to load from Codata first
    if (typeof CodataAPI !== 'undefined') {
        try {
            itinerary = await CodataAPI.getItinerary(itineraryId);
        } catch (error) {
            console.warn('Codata unavailable, using localStorage fallback');
        }
    }
    
    // Fallback to localStorage
    if (!itinerary) {
        const itineraries = JSON.parse(localStorage.getItem(`itineraries_${destination}`) || '[]');
        itinerary = itineraries.find(it => it.id === itineraryId);
    }
    
    if (!itinerary) {
        showError('Itinerary not found');
        return;
    }
    
    currentItinerary = itinerary;
    
    // Update page title
    document.title = `${itinerary.title} - Itinerant Pixels`;
    
    // Populate hero
    const hero = document.getElementById('itineraryHero');
    if (itinerary.coverImage) {
        hero.style.backgroundImage = `url('${itinerary.coverImage}')`;
    } else {
        hero.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    }
    
    document.getElementById('itineraryDuration').textContent = itinerary.duration || '7 Days';
    document.getElementById('itineraryTitle').textContent = itinerary.title;
    document.getElementById('itineraryRegions').textContent = '📍 ' + (itinerary.regions || 'Various regions');
    document.getElementById('itineraryAuthor').textContent = '✍️ ' + (itinerary.author || 'Itinerant Pixels');
    
    // Description
    document.getElementById('itineraryDescription').textContent = itinerary.description || '';
    
    // Highlights
    renderHighlights(itinerary.highlights);
    
    // Days
    renderDays(itinerary.days);
    
    // Practical info (if available)
    if (itinerary.budget || itinerary.bestTime || itinerary.accommodation) {
        const practicalSection = document.getElementById('practicalSection');
        const practicalInfo = document.getElementById('practicalInfo');
        
        let infoHTML = '';
        
        if (itinerary.budget) {
            infoHTML += '<div class="info-card"><h4>💰 Budget</h4><p>' + itinerary.budget + '</p></div>';
        }
        
        if (itinerary.bestTime) {
            infoHTML += '<div class="info-card"><h4>📅 Best Time to Visit</h4><p>' + itinerary.bestTime + '</p></div>';
        }
        
        if (itinerary.accommodation) {
            infoHTML += '<div class="info-card"><h4>🏨 Accommodation Tips</h4><p>' + itinerary.accommodation + '</p></div>';
        }
        
        practicalInfo.innerHTML = infoHTML;
        practicalSection.style.display = 'block';
    }
    
    // Update affiliate links based on itinerary regions
    updateAffiliateLinks(itinerary, destination);
    
    // Update back links
    const destinationUrl = 'destination.html?d=' + destination;
    document.getElementById('backToDestination').href = destinationUrl;
    document.getElementById('backBtn').href = destinationUrl;
}

function renderHighlights(highlights) {
    const highlightsSection = document.getElementById('highlightsSection');
    const highlightsGrid = document.getElementById('highlightsGrid');
    
    if (highlights && highlights.length > 0) {
        highlightsGrid.innerHTML = highlights.map(h => '<span class="highlight-tag">' + h + '</span>').join('');
        highlightsSection.style.display = 'block';
    } else {
        highlightsSection.style.display = 'none';
    }
}

function renderDays(days) {
    const daysSection = document.getElementById('dayByDaySection');
    const timeline = document.getElementById('daysTimeline');
    
    if (days && days.length > 0) {
        timeline.innerHTML = days.map((day, index) => 
            '<div class="day-card" data-day-index="' + index + '">' +
                '<div class="day-card-actions" style="display: none;">' +
                    '<button class="day-delete-btn" onclick="deleteDay(' + index + ')" title="Delete Day">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
                    '</button>' +
                '</div>' +
                '<span class="day-number">Day ' + day.dayNumber + '</span>' +
                '<h3 class="day-title editable" data-field="day-title-' + index + '">' + day.title + '</h3>' +
                '<p class="day-description editable" data-field="day-desc-' + index + '">' + day.description + '</p>' +
            '</div>'
        ).join('');
        daysSection.style.display = 'block';
    } else {
        timeline.innerHTML = '<p class="no-days-message">No days added yet. Click "Add Day" to start building your itinerary.</p>';
        daysSection.style.display = 'block';
    }
}

function updateAffiliateLinks(itinerary, destination) {
    const searchLocation = itinerary.regions || destination;
    const encodedLocation = encodeURIComponent(searchLocation);
    
    document.getElementById('hotelLink').href = 'https://www.booking.com/searchresults.html?ss=' + encodedLocation;
    document.getElementById('carLink').href = 'https://www.rentalcars.com/search-results?location=' + encodedLocation;
    document.getElementById('toursLink').href = 'https://www.getyourguide.com/s/?q=' + encodedLocation;
}

function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

function setupEditMode() {
    const editBtn = document.getElementById('editItineraryBtn');
    if (editBtn) {
        editBtn.addEventListener('click', toggleEditMode);
    }
    
    const exitBtn = document.getElementById('exitEditBtn');
    if (exitBtn) {
        exitBtn.addEventListener('click', toggleEditMode);
    }
    
    const saveBtn = document.getElementById('saveChangesBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAllChanges);
    }
    
    const addDayBtn = document.getElementById('addDayBtn');
    if (addDayBtn) {
        addDayBtn.addEventListener('click', addNewDay);
    }
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode', isEditMode);
    document.getElementById('editToolbar').classList.toggle('active', isEditMode);
    document.getElementById('editItineraryBtn').classList.toggle('active', isEditMode);
    
    if (isEditMode) {
        enableEditableElements();
        showDayActions();
        showHighlightsEditor();
    } else {
        disableEditableElements();
        hideDayActions();
        hideHighlightsEditor();
    }
}

function enableEditableElements() {
    document.querySelectorAll('.editable').forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('editing');
    });
}

function disableEditableElements() {
    document.querySelectorAll('.editable').forEach(el => {
        el.removeAttribute('contenteditable');
        el.classList.remove('editing');
    });
}

function showDayActions() {
    document.querySelectorAll('.day-card-actions').forEach(el => {
        el.style.display = 'flex';
    });
}

function hideDayActions() {
    document.querySelectorAll('.day-card-actions').forEach(el => {
        el.style.display = 'none';
    });
}

function showHighlightsEditor() {
    const editor = document.getElementById('highlightsEditor');
    const input = document.getElementById('highlightsInput');
    const section = document.getElementById('highlightsSection');
    
    if (editor && input) {
        input.value = (currentItinerary.highlights || []).join('\n');
        editor.style.display = 'block';
        section.style.display = 'block';
    }
}

function hideHighlightsEditor() {
    const editor = document.getElementById('highlightsEditor');
    if (editor) {
        editor.style.display = 'none';
    }
}

function applyHighlightsEdit() {
    const input = document.getElementById('highlightsInput');
    const highlights = input.value.split('\n').filter(h => h.trim());
    currentItinerary.highlights = highlights;
    renderHighlights(highlights);
}

async function addNewDay() {
    if (!currentItinerary.days) {
        currentItinerary.days = [];
    }
    
    const newDayNumber = currentItinerary.days.length + 1;
    currentItinerary.days.push({
        dayNumber: newDayNumber,
        title: 'Day ' + newDayNumber + ' Title',
        description: 'Describe what happens on this day...'
    });
    
    renderDays(currentItinerary.days);
    enableEditableElements();
    showDayActions();
    
    const newDay = document.querySelector('[data-day-index="' + (newDayNumber - 1) + '"]');
    if (newDay) {
        newDay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Auto-save after adding a new day
    await saveAllChanges();
}

async function deleteDay(index) {
    if (confirm('Delete this day? This action cannot be undone.')) {
        currentItinerary.days.splice(index, 1);
        
        currentItinerary.days.forEach((day, i) => {
            day.dayNumber = i + 1;
        });
        
        renderDays(currentItinerary.days);
        if (isEditMode) {
            enableEditableElements();
            showDayActions();
        }
        
        // Auto-save after deleting a day
        await saveAllChanges();
    }
}

async function saveAllChanges() {
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('d') || 'italy';
    
    currentItinerary.title = document.getElementById('itineraryTitle').textContent.trim();
    currentItinerary.duration = document.getElementById('itineraryDuration').textContent.trim();
    currentItinerary.description = document.getElementById('itineraryDescription').textContent.trim();
    
    const regionsText = document.getElementById('itineraryRegions').textContent.trim();
    currentItinerary.regions = regionsText.replace(/^📍\s*/, '');
    
    document.querySelectorAll('.day-card').forEach((card, index) => {
        if (currentItinerary.days[index]) {
            const titleEl = card.querySelector('.day-title');
            const descEl = card.querySelector('.day-description');
            
            if (titleEl) currentItinerary.days[index].title = titleEl.textContent.trim();
            if (descEl) currentItinerary.days[index].description = descEl.textContent.trim();
        }
    });
    
    // Save to Codata backend
    if (typeof CodataAPI !== 'undefined') {
        try {
            await CodataAPI.updateItinerary(currentItinerary.id, currentItinerary);
            console.log('Saved to Codata successfully');
        } catch (error) {
            console.error('Failed to save to Codata:', error);
        }
    }
    
    // Also save to localStorage as fallback
    const itineraries = JSON.parse(localStorage.getItem('itineraries_' + destination) || '[]');
    const index = itineraries.findIndex(it => it.id === currentItinerary.id);
    
    if (index !== -1) {
        itineraries[index] = currentItinerary;
        localStorage.setItem('itineraries_' + destination, JSON.stringify(itineraries));
    }
    
    // Also update customItineraries
    const customItineraries = JSON.parse(localStorage.getItem('customItineraries') || '[]');
    const customIndex = customItineraries.findIndex(it => it.id === currentItinerary.id);
    if (customIndex !== -1) {
        customItineraries[customIndex] = currentItinerary;
        localStorage.setItem('customItineraries', JSON.stringify(customItineraries));
    }
    
    showSaveIndicator();
}

function showSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'save-indicator';
    indicator.innerHTML = '✅ Changes saved!';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.classList.add('fade-out');
        setTimeout(() => indicator.remove(), 300);
    }, 2000);
}

function showError(message) {
    document.getElementById('itineraryTitle').textContent = message;
    document.getElementById('itineraryDescription').textContent = 'The itinerary you are looking for could not be found.';
}

window.applyHighlightsEdit = applyHighlightsEdit;
window.deleteDay = deleteDay;
