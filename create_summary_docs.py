#!/usr/bin/env python3
"""
Create a summary HTML Documentation System from Directory Analysis
This version creates a more manageable dataset by summarizing the analysis
"""

import csv
import json
import os
from pathlib import Path
from datetime import datetime


def load_analysis_data(csv_file_path):
    """Load the directory analysis data from CSV file"""
    data = []
    with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
    return data


def categorize_file(file_path):
    """Categorize a file based on its extension"""
    path_obj = Path(file_path)
    ext = path_obj.suffix.lower()
    
    if ext in ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.h', '.rb', '.go', '.rs']:
        return 'code'
    elif ext in ['.md', '.txt', '.rst', '.tex']:
        return 'documentation'
    elif ext in ['.json', '.yaml', '.yml', '.xml', '.csv', '.tsv']:
        return 'data'
    elif ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']:
        return 'image'
    elif ext in ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv']:
        return 'video'
    elif ext in ['.mp3', '.wav', '.flac', '.aac', '.ogg']:
        return 'audio'
    elif ext in ['.zip', '.tar', '.gz', '.rar', '.7z', '.bz2']:
        return 'archive'
    elif ext in ['.pdf', '.doc', '.docx', '.ppt', '.pptx']:
        return 'document'
    elif ext in ['.env', '.config', '.conf', '.ini']:
        return 'configuration'
    else:
        return 'other'


def create_summarized_data(data):
    """Create a summarized dataset focusing on top-level directories and important files"""
    # Create a summary of top-level directories
    top_level_dirs = {}
    important_files = []

    for row in data:
        path_parts = row['Path'].split('/')
        if len(path_parts) >= 2:
            top_dir = f"/{path_parts[1]}"

            if top_dir not in top_level_dirs:
                top_level_dirs[top_dir] = {
                    'path': top_dir,
                    'type': 'directory',
                    'size': 0,
                    'modified': row['Modified'],
                    'category': 'directory',
                    'depth': 1,
                    'description': f"Top-level directory in home",
                    'file_count': 0,
                    'subdirs': []  # Changed from set to list for JSON serialization
                }

            # Track file counts and subdirectories
            if row['Type'] == 'file':
                top_level_dirs[top_dir]['file_count'] += 1
            else:
                if len(path_parts) > 2:
                    if path_parts[2] not in top_level_dirs[top_dir]['subdirs']:  # Check if not already in list
                        top_level_dirs[top_dir]['subdirs'].append(path_parts[2])
    
    # Calculate approximate sizes for top-level directories
    for row in data:
        path_parts = row['Path'].split('/')
        if len(path_parts) >= 2:
            top_dir = f"/{path_parts[1]}"
            
            # Parse size and add to top-level directory
            size_str = row['Size']
            if 'bytes' in size_str:
                size_val = float(size_str.replace(' bytes', '').replace(',', ''))
            elif 'KB' in size_str:
                size_val = float(size_str.replace('KB', '')) * 1024
            elif 'MB' in size_str:
                size_val = float(size_str.replace('MB', '')) * 1024 * 1024
            elif 'GB' in size_str:
                size_val = float(size_str.replace('GB', '')) * 1024 * 1024 * 1024
            else:
                size_val = 0
                
            top_level_dirs[top_dir]['size'] += size_val
    
    # Format sizes appropriately
    for dir_info in top_level_dirs.values():
        size = dir_info['size']
        if size >= 1024 * 1024 * 1024:
            dir_info['size'] = f"{size / (1024 * 1024 * 1024):.2f}GB"
        elif size >= 1024 * 1024:
            dir_info['size'] = f"{size / (1024 * 1024):.2f}MB"
        elif size >= 1024:
            dir_info['size'] = f"{size / 1024:.2f}KB"
        else:
            dir_info['size'] = f"{size} bytes"
        
        # Update category based on directory name
        if 'AVATARARTS' in dir_info['path']:
            dir_info['category'] = 'project'
        elif any(keyword in dir_info['path'].lower() for keyword in ['doc', 'manual', 'guide']):
            dir_info['category'] = 'documentation'
        elif any(keyword in dir_info['path'].lower() for keyword in ['script', 'tool', 'util']):
            dir_info['category'] = 'project'
        elif any(keyword in dir_info['path'].lower() for keyword in ['music', 'movie', 'picture', 'image', 'video', 'photo']):
            dir_info['category'] = 'media-content'
        else:
            dir_info['category'] = 'directory'
    
    # Also include some important files from key directories
    important_dirs = ['/AVATARARTS', '/Documents', '/scripts', '/analysis']
    for row in data:
        for imp_dir in important_dirs:
            if row['Path'].startswith(f'/Users/steven{imp_dir}') and row['Type'] == 'file':
                # Include important files from key directories
                if any(ext in row['Path'] for ext in ['.py', '.md', '.json', '.csv', '.txt']):
                    file_entry = {
                        'path': row['Path'],
                        'type': row['Type'],
                        'size': row['Size'],
                        'modified': row['Modified'],
                        'category': categorize_file(row['Path']),
                        'depth': int(row['Depth']),
                        'description': f"Important file in {imp_dir}"
                    }
                    important_files.append(file_entry)
                    if len(important_files) >= 100:  # Limit to 100 important files
                        break
        if len(important_files) >= 100:
            break
    
    # Combine top-level directories and important files
    summarized_data = list(top_level_dirs.values()) + important_files
    return summarized_data


def create_main_html():
    """Create the main HTML file (without embedded data)"""
    html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AVATARARTS - Directory Documentation System</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="logo">
                <h1>AVATARARTS</h1>
                <p>Directory Documentation System</p>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="#dashboard" data-target="dashboard">Dashboard</a></li>
                    <li><a href="#browse" data-target="browse">Browse</a></li>
                    <li><a href="#search" data-target="search">Search</a></li>
                    <li><a href="#categories" data-target="categories">Categories</a></li>
                    <li><a href="#analytics" data-target="analytics">Analytics</a></li>
                </ul>
            </nav>
        </header>

        <!-- Main Content Area -->
        <main class="main-content">
            <!-- Dashboard Section -->
            <section id="dashboard" class="dashboard-section">
                <div class="dashboard-header">
                    <h2>System Overview</h2>
                    <div class="stats-container">
                        <div class="stat-card">
                            <h3 id="total-files">0</h3>
                            <p>Total Files</p>
                        </div>
                        <div class="stat-card">
                            <h3 id="total-dirs">0</h3>
                            <p>Total Directories</p>
                        </div>
                        <div class="stat-card">
                            <h3 id="total-size">0 GB</h3>
                            <p>Total Size</p>
                        </div>
                        <div class="stat-card">
                            <h3 id="categories-count">0</h3>
                            <p>Categories</p>
                        </div>
                    </div>
                </div>
                
                <div class="quick-access">
                    <h3>Quick Access</h3>
                    <div class="quick-links">
                        <a href="#AVATARARTS" class="quick-link">AVATARARTS Project</a>
                        <a href="#analysis" class="quick-link">Analysis Reports</a>
                        <a href="#scripts" class="quick-link">Scripts</a>
                        <a href="#documents" class="quick-link">Documents</a>
                    </div>
                </div>
            </section>

            <!-- Browse Section -->
            <section id="browse" class="browse-section">
                <div class="browse-header">
                    <h2>Directory Browser</h2>
                    <div class="browser-controls">
                        <input type="text" id="path-input" placeholder="/Users/steven" readonly>
                        <button id="up-dir-btn">Up Directory</button>
                        <select id="sort-options">
                            <option value="name">Sort by Name</option>
                            <option value="size">Sort by Size</option>
                            <option value="date">Sort by Date</option>
                            <option value="type">Sort by Type</option>
                        </select>
                    </div>
                    <div class="filter-controls">
                        <button class="btn" data-filter="all">All</button>
                        <button class="btn" data-filter="files">Files</button>
                        <button class="btn" data-filter="directories">Directories</button>
                        <button class="btn" data-filter="large">Large Items</button>
                        <button class="btn" data-filter="recent">Recent</button>
                    </div>
                </div>
                
                <div class="file-browser">
                    <div class="breadcrumb">
                        <span id="current-path">/Users/steven</span>
                    </div>
                    <div class="directory-content">
                        <table class="file-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Size</th>
                                    <th>Modified</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="file-list">
                                <!-- File list will be populated dynamically -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- Search Section -->
            <section id="search" class="search-section">
                <div class="search-header">
                    <h2>Search Files & Directories</h2>
                    <div class="search-controls">
                        <input type="text" id="search-input" placeholder="Enter search term...">
                        <select id="search-type">
                            <option value="all">All Types</option>
                            <option value="code">Code Files</option>
                            <option value="docs">Documentation</option>
                            <option value="data">Data Files</option>
                            <option value="media">Media Files</option>
                            <option value="archives">Archives</option>
                            <option value="documents">Documents</option>
                        </select>
                        <button id="search-btn">Search</button>
                    </div>
                </div>
                
                <div class="search-results">
                    <div id="search-stats"></div>
                    <div id="search-results-list"></div>
                </div>
            </section>

            <!-- Categories Section -->
            <section id="categories" class="categories-section">
                <div class="categories-header">
                    <h2>File Categories</h2>
                </div>
                
                <div class="category-grid">
                    <div class="category-card" data-category="code">
                        <h3>Code</h3>
                        <p id="code-count">0 items</p>
                        <div class="category-preview"></div>
                    </div>
                    <div class="category-card" data-category="documentation">
                        <h3>Documentation</h3>
                        <p id="docs-count">0 items</p>
                        <div class="category-preview"></div>
                    </div>
                    <div class="category-card" data-category="data">
                        <h3>Data</h3>
                        <p id="data-count">0 items</p>
                        <div class="category-preview"></div>
                    </div>
                    <div class="category-card" data-category="image">
                        <h3>Images</h3>
                        <p id="image-count">0 items</p>
                        <div class="category-preview"></div>
                    </div>
                    <div class="category-card" data-category="archive">
                        <h3>Archives</h3>
                        <p id="archives-count">0 items</p>
                        <div class="category-preview"></div>
                    </div>
                    <div class="category-card" data-category="document">
                        <h3>Documents</h3>
                        <p id="document-count">0 items</p>
                        <div class="category-preview"></div>
                    </div>
                    <div class="category-card" data-category="other">
                        <h3>Other</h3>
                        <p id="other-count">0 items</p>
                        <div class="category-preview"></div>
                    </div>
                </div>
            </section>

            <!-- Analytics Section -->
            <section id="analytics" class="analytics-section">
                <div class="analytics-header">
                    <h2>System Analytics</h2>
                </div>
                
                <div class="analytics-grid">
                    <div class="chart-container">
                        <h3>Storage by Category</h3>
                        <canvas id="storage-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>File Count by Category</h3>
                        <canvas id="count-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>Largest Directories</h3>
                        <div id="largest-dirs-list"></div>
                    </div>
                    <div class="chart-container">
                        <h3>Recent Activity</h3>
                        <div id="recent-files-list"></div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <p>AVATARARTS Directory Documentation System &copy; 2026</p>
            <p>Total indexed: <span id="indexed-count">0</span> items</p>
        </footer>
    </div>

    <!-- Load data separately to avoid huge HTML file -->
    <script>
        // Embedded summarized data to keep file size manageable
        const fileData = ''' + json.dumps(create_summarized_data(load_analysis_data(Path.home() / 'targeted_deep_dive_analysis.csv')), indent=2) + ''';
    </script>
    <script src="application.js"></script>
</body>
</html>'''
    return html_content


def create_application_js():
    """Create the main application JavaScript file"""
    js_content = '''// application.js - Main application logic for AVATARARTS Directory Documentation System

// Global variables
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
    // Initialize categories set
    fileData.forEach(item => {
        allCategories.add(item.category);
    });
    
    filteredData = [...fileData];
    
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
        alert(`Preview for: ${item.path}\\nSize: ${item.size}\\nModified: ${item.modified}\\nCategory: ${item.category}\\nDescription: ${item.description}`);
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
    updateLargestDirsList();
    updateRecentFilesList();
}

// Initialize charts
function initCharts() {
    // Placeholder for chart initialization
    // In a real implementation, this would use Chart.js or similar
    console.log('Charts initialized');
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
    console.log('AVATARARTS Documentation System loaded successfully!');
};
'''
    return js_content


def main():
    """Main function to generate the summary documentation system"""
    print("Generating SUMMARY HTML Documentation System from directory analysis...")
    
    # Get the path to the analysis CSV file
    csv_path = Path.home() / 'targeted_deep_dive_analysis.csv'
    
    if not csv_path.exists():
        print(f"Error: Analysis CSV file not found at {csv_path}")
        print("Please run the deep dive analysis first.")
        return
    
    print(f"Loading analysis data from {csv_path}...")
    data = load_analysis_data(csv_path)
    print(f"Loaded {len(data)} items from analysis")
    
    # Generate the main HTML file with summarized data
    print("Generating main HTML file with summarized data...")
    html_content = create_main_html()
    
    # Write the main HTML file
    html_path = Path(__file__).parent / 'docs_system_summarized.html'
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # Generate the application JavaScript file
    print("Generating application JavaScript file...")
    app_js_content = create_application_js()
    
    # Write the application JavaScript file
    app_js_path = Path(__file__).parent / 'application.js'
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(app_js_content)
    
    print(f"Summary documentation system generated successfully!")
    print(f"HTML file: {html_path}")
    print(f"Application file: {app_js_path}")
    print(f"CSS file: {Path(__file__).parent / 'styles.css'}")
    print("\nThe documentation system is ready to be uploaded to your server.")
    print("Data has been summarized to keep file sizes manageable.")


if __name__ == "__main__":
    main()