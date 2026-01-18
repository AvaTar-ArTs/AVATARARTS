// script.js - JavaScript functionality for AVATARARTS Directory Documentation System

// Sample data structure based on the deep dive analysis
let fileData = [];
let currentPath = '/Users/steven';
let filteredData = [];

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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load sample data (in a real implementation, this would come from your analysis)
    loadData();
    
    // Set up navigation
    setupNavigation();
    
    // Set up event listeners
    setupEventListeners();
    
    // Display dashboard by default
    showSection('dashboard');
    
    // Update dashboard stats
    updateDashboardStats();
});

// Load sample data based on the deep dive analysis
function loadData() {
    // In a real implementation, this would load from your CSV or JSON data
    // For now, we'll create a sample structure based on common directories
    fileData = [
        {
            path: '/Users/steven/AVATARARTS',
            type: 'directory',
            size: '13GB',
            modified: '2026-01-12 16:04:18',
            category: 'project',
            depth: 1
        },
        {
            path: '/Users/steven/Documents',
            type: 'directory',
            size: '3.3GB',
            modified: '2026-01-12 16:04:18',
            category: 'media-content',
            depth: 1
        },
        {
            path: '/Users/steven/Downloads',
            type: 'directory',
            size: '31GB',
            modified: '2026-01-12 16:04:18',
            category: 'media-content',
            depth: 1
        },
        {
            path: '/Users/steven/Music',
            type: 'directory',
            size: '20GB',
            modified: '2026-01-12 16:04:19',
            category: 'media-content',
            depth: 1
        },
        {
            path: '/Users/steven/Pictures',
            type: 'directory',
            size: '34GB',
            modified: '2026-01-12 16:04:19',
            category: 'media-content',
            depth: 1
        },
        {
            path: '/Users/steven/Movies',
            type: 'directory',
            size: '26GB',
            modified: '2026-01-12 16:04:19',
            category: 'media-content',
            depth: 1
        },
        {
            path: '/Users/steven/GitHub',
            type: 'directory',
            size: '2.8GB',
            modified: '2026-01-12 16:04:19',
            category: 'project',
            depth: 1
        },
        {
            path: '/Users/steven/scripts',
            type: 'directory',
            size: '59MB',
            modified: '2026-01-12 16:04:20',
            category: 'project',
            depth: 1
        },
        {
            path: '/Users/steven/analysis',
            type: 'directory',
            size: '10MB',
            modified: '2026-01-01 13:47:24',
            category: 'project',
            depth: 1
        },
        {
            path: '/Users/steven/pythons',
            type: 'directory',
            size: '323MB',
            modified: '2026-01-12 16:04:20',
            category: 'project',
            depth: 1
        },
        {
            path: '/Users/steven/AVATARARTS/README.md',
            type: 'file',
            size: '2KB',
            modified: '2026-01-01 13:00:00',
            category: 'documentation',
            depth: 2
        },
        {
            path: '/Users/steven/AVATARARTS/master_control.py',
            type: 'file',
            size: '15KB',
            modified: '2026-01-04 13:28:00',
            category: 'code',
            depth: 2
        },
        {
            path: '/Users/steven/AVATARARTS/avatararts_organizer.py',
            type: 'file',
            size: '12KB',
            modified: '2026-01-04 13:28:00',
            category: 'code',
            depth: 2
        },
        {
            path: '/Users/steven/AVATARARTS/advanced_toolkit',
            type: 'directory',
            size: '500MB',
            modified: '2026-01-04 13:28:00',
            category: 'project',
            depth: 2
        },
        {
            path: '/Users/steven/AVATARARTS/01_TOOLS',
            type: 'directory',
            size: '100MB',
            modified: '2026-01-01 13:28:00',
            category: 'project',
            depth: 2
        },
        {
            path: '/Users/steven/AVATARARTS/02_DOCUMENTATION',
            type: 'directory',
            size: '50MB',
            modified: '2026-01-01 13:28:00',
            category: 'documentation',
            depth: 2
        }
    ];
    
    // Add more sample files for demonstration
    for (let i = 0; i < 50; i++) {
        fileData.push({
            path: `/Users/steven/AVATARARTS/sample_file_${i}.py`,
            type: 'file',
            size: `${Math.floor(Math.random() * 100) + 1}KB`,
            modified: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} 10:30:00`,
            category: 'code',
            depth: 2
        });
    }
    
    filteredData = [...fileData];
}

// Set up navigation between sections
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
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
        
        // Special handling for browse section
        if (sectionId === 'browse') {
            displayCurrentDirectory();
        } else if (sectionId === 'dashboard') {
            updateDashboardStats();
        } else if (sectionId === 'categories') {
            updateCategoryCounts();
        }
    }
}

// Display the current directory contents
function displayCurrentDirectory() {
    pathInput.value = currentPath;
    currentPathSpan.textContent = currentPath;
    
    // Filter files for the current directory
    const directoryContents = fileData.filter(item => {
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
            <td class="${item.type}-item">${icon} ${item.path.split('/').pop()}</td>
            <td>${item.type}</td>
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
    alert(`Preview functionality would open for: ${path}\nIn a real implementation, this would show file contents or metadata.`);
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
                             item.path.split('/').pop().toLowerCase().includes(searchTerm);
        
        if (searchType === 'all') {
            return matchesSearch;
        } else {
            const matchesType = item.category === searchType || 
                               (searchType === 'code' && item.path.endsWith('.py')) ||
                               (searchType === 'docs' && item.path.endsWith('.md')) ||
                               (searchType === 'media' && (item.path.endsWith('.jpg') || item.path.endsWith('.png') || item.path.endsWith('.mp4'))) ||
                               (searchType === 'archives' && item.path.endsWith('.zip'));
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
    document.getElementById('categories-count').textContent = [...new Set(fileData.map(item => item.category))].length;
    document.getElementById('indexed-count').textContent = fileData.length.toLocaleString();
}

// Update category counts
function updateCategoryCounts() {
    const categories = {};
    
    fileData.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = 0;
        }
        categories[item.category]++;
    });
    
    // Update the counts
    document.getElementById('code-count').textContent = `${categories.code || 0} files`;
    document.getElementById('docs-count').textContent = `${categories.documentation || 0} files`;
    document.getElementById('data-count').textContent = `${categories.data || 0} files`;
    document.getElementById('media-count').textContent = `${categories.media || 0} files`;
    document.getElementById('archives-count').textContent = `${categories.archive || 0} files`;
    document.getElementById('other-count').textContent = `${categories.other || 0} files`;
}

// Initialize the application when the page loads
window.onload = function() {
    // Additional initialization if needed
};