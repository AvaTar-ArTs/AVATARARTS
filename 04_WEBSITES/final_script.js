// final_script.js - Final JavaScript functionality for AVATARARTS Directory Documentation System

// Data is embedded in the HTML file
// let fileData = []; // This is now populated from the HTML
let currentPath = '/Users/steven';
let filteredData = [];
let allCategories = new Set();

// DOM Elements
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.main-nav a');
const pathInput = document.getElementById('path-input');
const currentPathSpan = document.getElementById('current-path');
const fileList = document.getElementById('file-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResultsList = document.getElementById('search-results-list');
const searchStats = document.getElementById('search-stats');
const categoryFilters = document.querySelectorAll('.category-card');
const filterButtons = document.querySelectorAll('[data-filter]');
const sortOptions = document.getElementById('sort-options');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation
    setupNavigation();
    
    // Set up event listeners
    setupEventListeners();
    
    // Display dashboard by default
    showSection('dashboard');
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Initialize charts
    initCharts();
    
    // Collect all unique categories
    fileData.forEach(item => {
        allCategories.add(item.category);
    });
    
    filteredData = [...fileData];
});

// Set up navigation between sections
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            showSection(targetId);
        });
    });
}

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Up directory button
    document.getElementById('up-dir-btn').addEventListener('click', navigateUp);
    
    // Category filters
    categoryFilters.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            applyFilter(filter);
        });
    });
    
    // Sort options
    if (sortOptions) {
        sortOptions.addEventListener('change', function() {
            sortCurrentView(this.value);
        });
    }
}

// Apply a filter to the current view
function applyFilter(filter) {
    switch(filter) {
        case 'all':
            filteredData = [...fileData];
            break;
        case 'files':
            filteredData = fileData.filter(item => item.type === 'file');
            break;
        case 'directories':
            filteredData = fileData.filter(item => item.type === 'directory');
            break;
        case 'large':
            filteredData = fileData.filter(item => {
                const sizeValue = parseFloat(item.size);
                return item.size.includes('GB') || (item.size.includes('MB') && sizeValue > 100);
            });
            break;
        case 'recent':
            filteredData = [...fileData].sort((a, b) => new Date(b.modified) - new Date(a.modified));
            break;
    }
    
    // Update the current view based on which section is active
    if (document.getElementById('browse').classList.contains('active')) {
        displayCurrentDirectory();
    } else if (document.getElementById('search').classList.contains('active')) {
        displaySearchResults(filteredData);
    }
}

// Filter by category
function filterByCategory(category) {
    filteredData = fileData.filter(item => item.category === category);
    
    // Update the current view based on which section is active
    if (document.getElementById('browse').classList.contains('active')) {
        displayCurrentDirectory();
    } else if (document.getElementById('search').classList.contains('active')) {
        displaySearchResults(filteredData);
    }
}

// Sort current view
function sortCurrentView(sortBy) {
    switch(sortBy) {
        case 'name':
            filteredData.sort((a, b) => a.path.localeCompare(b.path));
            break;
        case 'size':
            filteredData.sort((a, b) => {
                const sizeA = parseSize(a.size);
                const sizeB = parseSize(b.size);
                return sizeB - sizeA;
            });
            break;
        case 'date':
            filteredData.sort((a, b) => new Date(b.modified) - new Date(a.modified));
            break;
        case 'type':
            filteredData.sort((a, b) => a.type.localeCompare(b.type));
            break;
    }
    
    // Update the current view based on which section is active
    if (document.getElementById('browse').classList.contains('active')) {
        displayCurrentDirectory();
    } else if (document.getElementById('search').classList.contains('active')) {
        displaySearchResults(filteredData);
    }
}

// Parse size string to bytes for sorting
function parseSize(sizeStr) {
    const num = parseFloat(sizeStr);
    if (sizeStr.includes('GB')) return num * 1024 * 1024 * 1024;
    if (sizeStr.includes('MB')) return num * 1024 * 1024;
    if (sizeStr.includes('KB')) return num * 1024;
    return num;
}

// Show a specific section
function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Special handling for different sections
        switch(sectionId) {
            case 'browse':
                displayCurrentDirectory();
                break;
            case 'dashboard':
                updateDashboardStats();
                break;
            case 'categories':
                updateCategoryCounts();
                break;
            case 'analytics':
                updateAnalytics();
                break;
        }
    }
}

// Display the current directory contents
function displayCurrentDirectory() {
    pathInput.value = currentPath;
    currentPathSpan.textContent = currentPath;
    
    // Filter files for the current directory
    const directoryContents = filteredData.filter(item => {
        const itemDir = item.path.substring(0, item.path.lastIndexOf('/'));
        return itemDir === currentPath || item.path === currentPath;
    });
    
    // Clear the table
    fileList.innerHTML = '';
    
    // Add each item to the table
    directoryContents.forEach(item => {
        const row = document.createElement('tr');
        
        // Determine icon based on type
        const icon = item.type === 'directory' ? '📁' : '📄';
        
        // Format the row
        row.innerHTML = `
            <td class="${item.type}-item" title="${item.description}">
                <span class="item-icon">${icon}</span>
                <span class="item-name">${item.path.split('/').pop()}</span>
            </td>
            <td>${item.category}</td>
            <td>${item.size}</td>
            <td>${item.modified}</td>
            <td>
                <button class="btn btn-sm" onclick="openItem('${item.path}')">Open</button>
                <button class="btn btn-sm btn-warning" onclick="previewItem('${item.path}')">Preview</button>
            </td>
        `;
        
        fileList.appendChild(row);
    });
}

// Navigate up one directory level
function navigateUp() {
    const pathParts = currentPath.split('/');
    if (pathParts.length > 2) {
        pathParts.pop();
        currentPath = pathParts.join('/');
        displayCurrentDirectory();
    }
}

// Open an item (directory or file)
function openItem(path) {
    const item = fileData.find(i => i.path === path);
    if (item && item.type === 'directory') {
        currentPath = path;
        displayCurrentDirectory();
    } else {
        // For files, show preview or download
        previewItem(path);
    }
}

// Preview an item
function previewItem(path) {
    const item = fileData.find(i => i.path === path);
    if (item) {
        alert(`Preview for: ${item.path}\nSize: ${item.size}\nModified: ${item.modified}\nCategory: ${item.category}\nDescription: ${item.description}`);
    }
}

// Perform search
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const searchType = document.getElementById('search-type').value;
    
    if (!searchTerm) {
        filteredData = [...fileData];
        displaySearchResults(filteredData);
        return;
    }
    
    let results = fileData.filter(item => {
        const matchesSearch = item.path.toLowerCase().includes(searchTerm) ||
                             item.path.split('/').pop().toLowerCase().includes(searchTerm) ||
                             item.description.toLowerCase().includes(searchTerm);
        
        if (searchType === 'all') {
            return matchesSearch;
        } else {
            const matchesType = item.category === searchType || 
                               (searchType === 'code' && item.path.endsWith('.py')) ||
                               (searchType === 'docs' && item.path.endsWith('.md')) ||
                               (searchType === 'data' && item.path.endsWith('.json')) ||
                               (searchType === 'image' && (item.path.endsWith('.jpg') || item.path.endsWith('.png') || item.path.endsWith('.gif'))) ||
                               (searchType === 'archive' && item.path.endsWith('.zip'));
            return matchesSearch && matchesType;
        }
    });
    
    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    searchResultsList.innerHTML = '';
    
    if (results.length === 0) {
        searchResultsList.innerHTML = '<p>No results found.</p>';
        searchStats.textContent = '0 results';
        return;
    }
    
    searchStats.textContent = `${results.length} results`;
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results-grid';
    
    results.forEach(item => {
        const resultCard = document.createElement('div');
        resultCard.className = 'search-result-card';
        
        const icon = item.type === 'directory' ? '📁' : '📄';
        
        resultCard.innerHTML = `
            <div class="result-header">
                <span class="result-icon">${icon}</span>
                <h4>${item.path.split('/').pop()}</h4>
            </div>
            <div class="result-details">
                <p><strong>Path:</strong> ${item.path}</p>
                <p><strong>Type:</strong> ${item.type} | <strong>Size:</strong> ${item.size} | <strong>Modified:</strong> ${item.modified}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Description:</strong> ${item.description}</p>
            </div>
            <div class="result-actions">
                <button class="btn btn-sm" onclick="openItem('${item.path}')">Open</button>
                <button class="btn btn-sm btn-warning" onclick="previewItem('${item.path}')">Preview</button>
            </div>
        `;
        
        resultsContainer.appendChild(resultCard);
    });
    
    searchResultsList.appendChild(resultsContainer);
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalFiles = fileData.filter(item => item.type === 'file').length;
    const totalDirs = fileData.filter(item => item.type === 'directory').length;
    
    // Calculate total size (simplified for demo)
    let totalSizeBytes = 0;
    fileData.forEach(item => {
        if (item.size.includes('GB')) {
            totalSizeBytes += parseFloat(item.size) * 1024 * 1024 * 1024;
        } else if (item.size.includes('MB')) {
            totalSizeBytes += parseFloat(item.size) * 1024 * 1024;
        } else if (item.size.includes('KB')) {
            totalSizeBytes += parseFloat(item.size) * 1024;
        } else {
            totalSizeBytes += parseFloat(item.size);
        }
    });
    
    const totalSizeGB = (totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2);
    
    // Update the stats
    document.getElementById('total-files').textContent = totalFiles.toLocaleString();
    document.getElementById('total-dirs').textContent = totalDirs.toLocaleString();
    document.getElementById('total-size').textContent = `${totalSizeGB} GB`;
    document.getElementById('categories-count').textContent = allCategories.size;
    document.getElementById('indexed-count').textContent = fileData.length.toLocaleString();
}

// Update category counts
function updateCategoryCounts() {
    const categories = {};
    
    fileData.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = { count: 0, size: 0 };
        }
        categories[item.category].count++;
        
        // Add to size calculation (simplified)
        const sizeValue = parseFloat(item.size);
        if (item.size.includes('GB')) {
            categories[item.category].size += sizeValue * 1024 * 1024 * 1024;
        } else if (item.size.includes('MB')) {
            categories[item.category].size += sizeValue * 1024 * 1024;
        } else if (item.size.includes('KB')) {
            categories[item.category].size += sizeValue * 1024;
        } else {
            categories[item.category].size += sizeValue;
        }
    });
    
    // Update the counts
    document.getElementById('code-count').textContent = `${categories.code ? categories.code.count : 0} items`;
    document.getElementById('docs-count').textContent = `${categories.documentation ? categories.documentation.count : 0} items`;
    document.getElementById('data-count').textContent = `${categories.data ? categories.data.count : 0} items`;
    document.getElementById('image-count').textContent = `${categories.image ? categories.image.count : 0} items`;
    document.getElementById('archives-count').textContent = `${categories.archive ? categories.archive.count : 0} items`;
    document.getElementById('document-count').textContent = `${categories.document ? categories.document.count : 0} items`;
    document.getElementById('other-count').textContent = `${categories.other ? categories.other.count : 0} items`;
}

// Update analytics section
function updateAnalytics() {
    // Update with actual chart data
    updateStorageChart();
    updateCountChart();
    updateLargestDirsList();
    updateRecentFilesList();
}

// Initialize charts
function initCharts() {
    // Placeholder for chart initialization
    // In a real implementation, this would use Chart.js or similar
    console.log('Charts initialized');
}

// Update storage chart
function updateStorageChart() {
    // Placeholder for storage chart update
    console.log('Storage chart updated');
}

// Update count chart
function updateCountChart() {
    // Placeholder for count chart update
    console.log('Count chart updated');
}

// Update largest directories list
function updateLargestDirsList() {
    const largestDirs = fileData
        .filter(item => item.type === 'directory')
        .sort((a, b) => parseSize(b.size) - parseSize(a.size))
        .slice(0, 10);
    
    const listElement = document.getElementById('largest-dirs-list');
    listElement.innerHTML = '';
    
    largestDirs.forEach(dir => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `<span>${dir.path.split('/').pop()}</span><span>${dir.size}</span>`;
        listElement.appendChild(listItem);
    });
}

// Update recent files list
function updateRecentFilesList() {
    const recentFiles = [...fileData]
        .filter(item => item.type === 'file')
        .sort((a, b) => new Date(b.modified) - new Date(a.modified))
        .slice(0, 10);
    
    const listElement = document.getElementById('recent-files-list');
    listElement.innerHTML = '';
    
    recentFiles.forEach(file => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `<span>${file.path.split('/').pop()}</span><span>${file.modified}</span>`;
        listElement.appendChild(listItem);
    });
}

// Initialize the application when the page loads
window.onload = function() {
    // Additional initialization if needed
};
