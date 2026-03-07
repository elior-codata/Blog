// ========================================
// Blog Editor - JavaScript
// ========================================

// State
let currentPost = null;
let posts = [];
let autoSaveTimeout = null;

// DOM Elements
const elements = {
    postsList: document.getElementById('postsList'),
    postTitle: document.getElementById('postTitle'),
    postSubtitle: document.getElementById('postSubtitle'),
    postCategory: document.getElementById('postCategory'),
    postDestination: document.getElementById('postDestination'),
    contentEditor: document.getElementById('contentEditor'),
    tagsContainer: document.getElementById('tagsContainer'),
    tagInput: document.getElementById('tagInput'),
    postSlug: document.getElementById('postSlug'),
    postDate: document.getElementById('postDate'),
    postAuthor: document.getElementById('postAuthor'),
    readingTime: document.getElementById('readingTime'),
    metaTitle: document.getElementById('metaTitle'),
    metaDescription: document.getElementById('metaDescription'),
    saveStatus: document.getElementById('saveStatus'),
    coverPlaceholder: document.getElementById('coverPlaceholder'),
    coverPreview: document.getElementById('coverPreview'),
    coverImage: document.getElementById('coverImage'),
    coverImageInput: document.getElementById('coverImageInput'),
    previewModal: document.getElementById('previewModal'),
    publishModal: document.getElementById('publishModal'),
    imageUrlModal: document.getElementById('imageUrlModal'),
    previewFrame: document.getElementById('previewFrame')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    initToolbar();
    initEventListeners();
    initAutoResize();
    
    // Set today's date as default
    elements.postDate.value = new Date().toISOString().split('T')[0];
    
    // Create new post if none exists
    if (posts.length === 0) {
        createNewPost();
    } else {
        loadPost(posts[0].id);
    }
});

// ========================================
// Post Management
// ========================================

async function loadPosts() {
    // Load from local data service
    if (typeof CodataAPI !== 'undefined') {
        try {
            const fetchedPosts = await CodataAPI.getPosts();
            if (fetchedPosts && Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
                posts = fetchedPosts;
                renderPostsList();
                return;
            }
        } catch (error) {
            console.warn('Data service unavailable, using localStorage fallback');
        }
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('blog_posts');
    posts = saved ? JSON.parse(saved) : [];
    renderPostsList();
}

async function savePosts() {
    // Save to localStorage as backup
    localStorage.setItem('blog_posts', JSON.stringify(posts));
    
    // Also save to local data if available
    if (typeof CodataAPI !== 'undefined' && currentPost) {
        try {
            if (currentPost._isNew) {
                delete currentPost._isNew;
                await CodataAPI.createPost(currentPost);
            } else {
                await CodataAPI.updatePost(currentPost.id, currentPost);
            }
        } catch (error) {
            console.error('Failed to save to local data:', error);
        }
    }
}

function createNewPost() {
    const newPost = {
        id: Date.now().toString(),
        title: '',
        subtitle: '',
        category: '',
        destination: '',
        content: '',
        coverImage: '',
        tags: [],
        slug: '',
        date: new Date().toISOString().split('T')[0],
        author: 'Sarah & Alex',
        metaTitle: '',
        metaDescription: '',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _isNew: true
    };
    
    posts.unshift(newPost);
    savePosts();
    renderPostsList();
    loadPost(newPost.id);
}

function loadPost(postId) {
    currentPost = posts.find(p => p.id === postId);
    if (!currentPost) return;
    
    // Update UI
    elements.postTitle.value = currentPost.title || '';
    elements.postSubtitle.value = currentPost.subtitle || '';
    elements.postCategory.value = currentPost.category || '';
    elements.postDestination.value = currentPost.destination || '';
    elements.contentEditor.innerHTML = currentPost.content || '';
    elements.postSlug.value = currentPost.slug || '';
    elements.postDate.value = currentPost.date || '';
    elements.postAuthor.value = currentPost.author || 'Sarah & Alex';
    elements.metaTitle.value = currentPost.metaTitle || '';
    elements.metaDescription.value = currentPost.metaDescription || '';
    
    // Cover image
    if (currentPost.coverImage) {
        elements.coverImage.src = currentPost.coverImage;
        elements.coverPlaceholder.style.display = 'none';
        elements.coverPreview.style.display = 'block';
    } else {
        elements.coverPlaceholder.style.display = 'flex';
        elements.coverPreview.style.display = 'none';
    }
    
    // Tags
    renderTags();
    
    // Update reading time
    updateReadingTime();
    
    // Update active state in list
    document.querySelectorAll('.post-list-item').forEach(item => {
        item.classList.toggle('active', item.dataset.id === postId);
    });
    
    // Auto-resize textareas
    autoResizeTextarea(elements.postTitle);
    autoResizeTextarea(elements.postSubtitle);
}

function saveCurrentPost() {
    if (!currentPost) return;
    
    currentPost.title = elements.postTitle.value;
    currentPost.subtitle = elements.postSubtitle.value;
    currentPost.category = elements.postCategory.value;
    currentPost.destination = elements.postDestination.value;
    currentPost.content = elements.contentEditor.innerHTML;
    currentPost.slug = elements.postSlug.value || generateSlug(currentPost.title);
    currentPost.date = elements.postDate.value;
    currentPost.author = elements.postAuthor.value;
    currentPost.metaTitle = elements.metaTitle.value;
    currentPost.metaDescription = elements.metaDescription.value;
    currentPost.updatedAt = new Date().toISOString();
    
    savePosts();
    renderPostsList();
    showSaveStatus('saved');
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    // Delete from local data if available
    if (typeof CodataAPI !== 'undefined') {
        try {
            await CodataAPI.deletePost(postId);
        } catch (error) {
            console.error('Failed to delete from local data:', error);
        }
    }
    
    posts = posts.filter(p => p.id !== postId);
    savePosts();
    renderPostsList();
    
    if (posts.length > 0) {
        loadPost(posts[0].id);
    } else {
        createNewPost();
    }
}

async function publishPost() {
    if (!currentPost) return;
    
    // Validate required fields
    if (!currentPost.title) {
        alert('Please add a title before publishing.');
        elements.postTitle.focus();
        return;
    }
    
    if (!elements.contentEditor.textContent.trim()) {
        alert('Please add some content before publishing.');
        elements.contentEditor.focus();
        return;
    }
    
    currentPost.status = 'published';
    currentPost.slug = currentPost.slug || generateSlug(currentPost.title);
    saveCurrentPost();
    
    // Save to local data if available
    if (typeof CodataAPI !== 'undefined') {
        try {
            await CodataAPI.updatePost(currentPost.id, currentPost);
        } catch (error) {
            console.error('Failed to publish to local data:', error);
        }
    }
    
    // Save to published posts for the main site
    savePublishedPost(currentPost);
    
    // Show success modal
    elements.publishModal.classList.add('active');
}

async function savePublishedPost(post) {
    // Save to local data if available
    if (typeof CodataAPI !== 'undefined') {
        try {
            await CodataAPI.updatePost(post.id, post);
        } catch (error) {
            console.error('Failed to save published post to local data:', error);
        }
    }
    
    // Also save to localStorage as backup
    const publishedPosts = JSON.parse(localStorage.getItem('published_posts') || '[]');
    const existingIndex = publishedPosts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
        publishedPosts[existingIndex] = post;
    } else {
        publishedPosts.unshift(post);
    }
    
    localStorage.setItem('published_posts', JSON.stringify(publishedPosts));
}

// ========================================
// UI Rendering
// ========================================

function renderPostsList(filter = 'all') {
    const filteredPosts = filter === 'all' 
        ? posts 
        : posts.filter(p => p.status === filter);
    
    elements.postsList.innerHTML = filteredPosts.map(post => `
        <div class="post-list-item ${currentPost?.id === post.id ? 'active' : ''}" 
             data-id="${post.id}">
            <div class="post-list-title">${post.title || 'Untitled Post'}</div>
            <div class="post-list-meta">
                <span>${formatDate(post.updatedAt)}</span>
                <span class="post-status ${post.status}">${post.status}</span>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.post-list-item').forEach(item => {
        item.addEventListener('click', () => loadPost(item.dataset.id));
    });
}

function renderTags() {
    if (!currentPost) return;
    
    elements.tagsContainer.innerHTML = (currentPost.tags || []).map((tag, index) => `
        <span class="tag">
            ${tag}
            <button class="tag-remove" data-index="${index}">×</button>
        </span>
    `).join('');
    
    // Add remove handlers
    document.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            currentPost.tags.splice(index, 1);
            renderTags();
            triggerAutoSave();
        });
    });
}

function showSaveStatus(status) {
    elements.saveStatus.textContent = status === 'saving' ? 'Saving...' : 'All changes saved';
    elements.saveStatus.className = `save-status ${status}`;
}

function updateReadingTime() {
    const text = elements.contentEditor.textContent || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    elements.readingTime.textContent = `${minutes} min read`;
}

// ========================================
// Toolbar & Editor
// ========================================

function initToolbar() {
    document.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
        btn.addEventListener('click', () => {
            const command = btn.dataset.command;
            
            if (command === 'h2') {
                document.execCommand('formatBlock', false, 'h2');
            } else if (command === 'h3') {
                document.execCommand('formatBlock', false, 'h3');
            } else if (command === 'paragraph') {
                document.execCommand('formatBlock', false, 'p');
            } else if (command === 'blockquote') {
                document.execCommand('formatBlock', false, 'blockquote');
            } else if (command === 'createLink') {
                const url = prompt('Enter link URL:');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
            } else {
                document.execCommand(command, false, null);
            }
            
            elements.contentEditor.focus();
        });
    });
    
    // Image insert button
    document.getElementById('insertImageBtn').addEventListener('click', () => {
        elements.imageUrlModal.classList.add('active');
    });
}

// ========================================
// Event Listeners
// ========================================

function initEventListeners() {
    // New Post
    document.getElementById('newPostBtn').addEventListener('click', createNewPost);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPostsList(btn.dataset.filter);
        });
    });
    
    // Auto-save on content change
    const inputs = [
        elements.postTitle, elements.postSubtitle, elements.postCategory,
        elements.postDestination, elements.contentEditor, elements.postSlug,
        elements.postDate, elements.postAuthor, elements.metaTitle, elements.metaDescription
    ];
    
    inputs.forEach(input => {
        input.addEventListener('input', triggerAutoSave);
    });
    
    // Content editor specific
    elements.contentEditor.addEventListener('input', updateReadingTime);
    
    // Tag input
    elements.tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && elements.tagInput.value.trim()) {
            e.preventDefault();
            if (!currentPost.tags) currentPost.tags = [];
            currentPost.tags.push(elements.tagInput.value.trim());
            elements.tagInput.value = '';
            renderTags();
            triggerAutoSave();
        }
    });
    
    // Title auto-slug
    elements.postTitle.addEventListener('input', () => {
        if (!elements.postSlug.value || elements.postSlug.value === generateSlug(currentPost?.title || '')) {
            elements.postSlug.value = generateSlug(elements.postTitle.value);
        }
        autoResizeTextarea(elements.postTitle);
    });
    
    elements.postSubtitle.addEventListener('input', () => {
        autoResizeTextarea(elements.postSubtitle);
    });
    
    // Cover image
    elements.coverPlaceholder.addEventListener('click', () => {
        elements.coverImageInput.click();
    });
    
    elements.coverImageInput.addEventListener('change', handleCoverImageUpload);
    
    document.getElementById('changeCoverBtn').addEventListener('click', () => {
        elements.coverImageInput.click();
    });
    
    document.getElementById('removeCoverBtn').addEventListener('click', () => {
        currentPost.coverImage = '';
        elements.coverPlaceholder.style.display = 'flex';
        elements.coverPreview.style.display = 'none';
        triggerAutoSave();
    });
    
    // Preview button
    document.getElementById('previewBtn').addEventListener('click', showPreview);
    document.getElementById('closePreviewBtn').addEventListener('click', () => {
        elements.previewModal.classList.remove('active');
    });
    
    // Publish button
    document.getElementById('publishBtn').addEventListener('click', publishPost);
    
    // Delete button
    document.getElementById('deletePostBtn').addEventListener('click', () => {
        if (currentPost) deletePost(currentPost.id);
    });
    
    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // View post after publish
    document.getElementById('viewPostBtn').addEventListener('click', () => {
        elements.publishModal.classList.remove('active');
        window.location.href = `post.html?id=${currentPost.id}`;
    });
    
    // Image modal
    initImageModal();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentPost();
        }
    });
}

function initImageModal() {
    const modal = elements.imageUrlModal;
    const tabs = modal.querySelectorAll('.image-tab');
    const urlTab = document.getElementById('urlTab');
    const uploadTab = document.getElementById('uploadTab');
    const uploadZone = document.getElementById('uploadZone');
    const modalImageUpload = document.getElementById('modalImageUpload');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.tab === 'url') {
                urlTab.style.display = 'block';
                uploadTab.style.display = 'none';
            } else {
                urlTab.style.display = 'none';
                uploadTab.style.display = 'block';
            }
        });
    });
    
    uploadZone.addEventListener('click', () => modalImageUpload.click());
    
    modalImageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                insertImageToEditor(event.target.result, file.name);
                modal.classList.remove('active');
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('cancelImageBtn').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    document.getElementById('insertImageConfirmBtn').addEventListener('click', () => {
        const url = document.getElementById('imageUrlInput').value.trim();
        const alt = document.getElementById('imageAltInput').value.trim();
        
        if (url) {
            insertImageToEditor(url, alt || 'Image');
            modal.classList.remove('active');
            document.getElementById('imageUrlInput').value = '';
            document.getElementById('imageAltInput').value = '';
        }
    });
}

function insertImageToEditor(src, alt) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.maxWidth = '100%';
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(img);
        range.collapse(false);
    } else {
        elements.contentEditor.appendChild(img);
    }
    
    triggerAutoSave();
}

function handleCoverImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        currentPost.coverImage = event.target.result;
        elements.coverImage.src = event.target.result;
        elements.coverPlaceholder.style.display = 'none';
        elements.coverPreview.style.display = 'block';
        triggerAutoSave();
    };
    reader.readAsDataURL(file);
}

// ========================================
// Preview
// ========================================

function showPreview() {
    if (!currentPost) return;
    
    const categoryLabels = {
        'europe': '🌍 Europe',
        'asia': '🌏 Asia',
        'americas': '🌎 Americas',
        'africa': '🌍 Africa',
        'oceania': '🌏 Oceania',
        'tips': '💡 Travel Tips',
        'gear': '🎒 Gear & Packing',
        'food': '🍜 Food & Culture'
    };
    
    elements.previewFrame.innerHTML = `
        ${currentPost.coverImage ? `<img class="preview-cover" src="${currentPost.coverImage}" alt="Cover">` : ''}
        ${currentPost.category ? `<span class="preview-category">${categoryLabels[currentPost.category] || currentPost.category}</span>` : ''}
        <h1 class="preview-title">${currentPost.title || 'Untitled Post'}</h1>
        <div class="preview-meta">
            <span>${currentPost.author || 'Sarah & Alex'}</span>
            <span>•</span>
            <span>${formatDate(currentPost.date)}</span>
            <span>•</span>
            <span>${elements.readingTime.textContent}</span>
        </div>
        <div class="preview-body">${currentPost.content || '<p>No content yet...</p>'}</div>
    `;
    
    elements.previewModal.classList.add('active');
}

// ========================================
// Utilities
// ========================================

function triggerAutoSave() {
    showSaveStatus('saving');
    
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    
    autoSaveTimeout = setTimeout(() => {
        saveCurrentPost();
    }, 1000);
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

function initAutoResize() {
    [elements.postTitle, elements.postSubtitle].forEach(textarea => {
        textarea.addEventListener('input', () => autoResizeTextarea(textarea));
    });
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
