/**
 * Trend Pulse Pro - Top Trending Topics Implementation
 * Discover top 1-5% trending content with SEO/AEO optimization scores
 * 
 * @file trend_pulse_pro_trending_topics.js
 * @version 1.0.0
 * @author AvatarArts
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const TREND_PULSE_CONFIG = {
  main_title: 'Trend Pulse Pro',
  subtitle_text: 'Discover top 1-5% trending content with SEO/AEO optimization scores',
  background_color: '#020617',
  surface_color: '#1e293b',
  text_color: '#f1f5f9',
  primary_action: '#10b981',
  secondary_action: '#14b8a6',
  font_family: 'Space Grotesk',
  font_size: 16,
  update_interval: 120000 // 2 minutes in milliseconds
};

// ============================================================================
// TRENDING TOPICS DATA
// ============================================================================

const trendData = [
  {
    id: 1,
    title: 'AI Agents for Enterprise Automation',
    category: 'ai',
    categoryLabel: 'AI & ML',
    velocity: 2847,
    velocityChange: '+342%',
    seoScore: 98,
    aeoScore: 96,
    status: 'hot',
    searchVolume: '1.2M',
    competition: 'Low',
    cpc: '$4.82',
    description: 'Enterprise automation solutions powered by AI agents for workflow optimization',
    trendingKeywords: ['ai agent automation', 'enterprise automation', 'ai workflow automation'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Sustainable Tech Investment Strategies',
    category: 'finance',
    categoryLabel: 'Finance',
    velocity: 1923,
    velocityChange: '+189%',
    seoScore: 95,
    aeoScore: 92,
    status: 'rising',
    searchVolume: '890K',
    competition: 'Medium',
    cpc: '$3.21',
    description: 'Investment strategies focused on sustainable technology and ESG principles',
    trendingKeywords: ['sustainable investing 2025', 'tech investment strategies', 'ESG tech stocks'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Remote Work Productivity Tools 2025',
    category: 'tech',
    categoryLabel: 'Technology',
    velocity: 1654,
    velocityChange: '+156%',
    seoScore: 97,
    aeoScore: 94,
    status: 'hot',
    searchVolume: '2.1M',
    competition: 'High',
    cpc: '$2.89',
    description: 'Latest productivity tools and software for remote work efficiency in 2025',
    trendingKeywords: ['remote productivity tools', 'work from home software', 'remote work apps 2025'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Mental Health Apps & Digital Wellness',
    category: 'health',
    categoryLabel: 'Health',
    velocity: 1432,
    velocityChange: '+127%',
    seoScore: 94,
    aeoScore: 91,
    status: 'rising',
    searchVolume: '670K',
    competition: 'Low',
    cpc: '$1.95',
    description: 'Digital wellness applications and mental health support tools',
    trendingKeywords: ['digital wellness apps', 'mental health apps', 'wellness technology'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Small Business AI Integration Guide',
    category: 'business',
    categoryLabel: 'Business',
    velocity: 1156,
    velocityChange: '+98%',
    seoScore: 96,
    aeoScore: 95,
    status: 'hot',
    searchVolume: '540K',
    competition: 'Medium',
    cpc: '$5.12',
    description: 'Comprehensive guide for small businesses integrating AI solutions',
    trendingKeywords: ['small business ai tools', 'ai for small business', 'business ai integration'],
    lastUpdated: new Date().toISOString()
  }
];

// ============================================================================
// RISING KEYWORDS DATA
// ============================================================================

const risingKeywords = [
  { 
    keyword: 'ai agent automation', 
    change: '+892%', 
    volume: '450K',
    category: 'ai',
    cpc: '$4.82'
  },
  { 
    keyword: 'sustainable investing 2025', 
    change: '+654%', 
    volume: '320K',
    category: 'finance',
    cpc: '$3.21'
  },
  { 
    keyword: 'remote productivity tools', 
    change: '+543%', 
    volume: '890K',
    category: 'tech',
    cpc: '$2.89'
  },
  { 
    keyword: 'digital wellness apps', 
    change: '+421%', 
    volume: '210K',
    category: 'health',
    cpc: '$1.95'
  },
  { 
    keyword: 'small business ai tools', 
    change: '+387%', 
    volume: '180K',
    category: 'business',
    cpc: '$5.12'
  },
  { 
    keyword: 'enterprise automation', 
    change: '+312%', 
    volume: '290K',
    category: 'ai',
    cpc: '$4.50'
  }
];

// ============================================================================
// STATS OVERVIEW DATA
// ============================================================================

const statsOverview = {
  hotTopics: {
    count: 247,
    change: '+18%',
    changeType: 'increase',
    label: 'Hot Topics',
    color: 'emerald'
  },
  risingFast: {
    count: 89,
    label: 'Rising Fast',
    description: 'Top 5% velocity',
    color: 'orange'
  },
  avgSeoScore: {
    score: 94.2,
    label: 'Avg SEO Score',
    description: 'Elite tier content',
    color: 'violet'
  },
  aeoReady: {
    count: 156,
    label: 'AEO Ready',
    description: 'AI-optimized queries',
    color: 'cyan'
  }
};

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

/**
 * Renders the trending topics list
 * @param {Array} data - Array of trend objects
 * @param {string} category - Category filter ('all' or specific category)
 */
function renderTrends(data = trendData, category = 'all') {
  const container = document.getElementById('trends-container');
  if (!container) {
    console.error('Trends container not found');
    return;
  }

  // Filter by category if needed
  const filteredData = category === 'all' 
    ? data 
    : data.filter(t => t.category === category);

  // Sort by velocity (descending)
  const sortedData = [...filteredData].sort((a, b) => b.velocity - a.velocity);

  container.innerHTML = sortedData.map((trend, index) => {
    const rank = index + 1;
    const isHot = trend.status === 'hot';
    const statusBadge = isHot 
      ? '<span class="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">🔥 HOT</span>'
      : '<span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">📈 Rising</span>';
    
    const rankClass = isHot 
      ? 'from-orange-500 to-red-600 hot-badge' 
      : 'from-emerald-500 to-teal-600';
    
    const competitionColor = trend.competition === 'Low' 
      ? 'text-emerald-400' 
      : trend.competition === 'Medium' 
        ? 'text-yellow-400' 
        : 'text-red-400';

    return `
      <div class="trend-card bg-slate-800/40 backdrop-blur rounded-2xl p-4 border border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer group" data-trend-id="${trend.id}">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${rankClass} flex items-center justify-center text-white font-bold text-lg">
            ${rank}
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <h3 class="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">${trend.title}</h3>
              ${statusBadge}
            </div>
            <div class="flex items-center gap-3 text-sm mb-3 flex-wrap">
              <span class="category-pill px-2 py-1 bg-slate-700/50 rounded-lg text-slate-400 text-xs">${trend.categoryLabel}</span>
              <span class="text-slate-500">•</span>
              <span class="text-emerald-400 font-medium mono">${trend.velocityChange}</span>
              <span class="text-slate-500">velocity</span>
            </div>
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="bg-slate-900/50 rounded-lg p-2">
                <div class="text-xs text-slate-500 mb-1">SEO Score</div>
                <div class="text-lg font-bold text-violet-400 mono">${trend.seoScore}</div>
              </div>
              <div class="bg-slate-900/50 rounded-lg p-2">
                <div class="text-xs text-slate-500 mb-1">AEO Score</div>
                <div class="text-lg font-bold text-cyan-400 mono">${trend.aeoScore}</div>
              </div>
              <div class="bg-slate-900/50 rounded-lg p-2">
                <div class="text-xs text-slate-500 mb-1">Search Vol</div>
                <div class="text-lg font-bold text-slate-300 mono">${trend.searchVolume}</div>
              </div>
            </div>
            <div class="mt-3 flex items-center gap-4 text-xs text-slate-500">
              <span>Competition: <span class="${competitionColor}">${trend.competition}</span></span>
              <span>Est. CPC: <span class="text-emerald-400">${trend.cpc}</span></span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add click event listeners
  attachTrendCardListeners();
}

/**
 * Renders the rising keywords list
 * @param {Array} keywords - Array of keyword objects
 */
function renderKeywords(keywords = risingKeywords) {
  const container = document.getElementById('keywords-container');
  if (!container) {
    console.error('Keywords container not found');
    return;
  }

  container.innerHTML = keywords.map(kw => `
    <div class="flex items-center justify-between py-2 px-3 bg-slate-900/30 rounded-lg hover:bg-slate-900/50 transition-colors cursor-pointer group" data-keyword="${kw.keyword}">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-emerald-400 text-xs">↗</span>
        <span class="text-sm text-slate-300 truncate group-hover:text-emerald-400 transition-colors">${kw.keyword}</span>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="text-xs text-emerald-400 font-medium mono">${kw.change}</span>
      </div>
    </div>
  `).join('');

  // Add click event listeners
  attachKeywordListeners();
}

/**
 * Renders the stats overview cards
 * @param {Object} stats - Stats overview object
 */
function renderStatsOverview(stats = statsOverview) {
  const statsContainer = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
  if (!statsContainer) {
    console.error('Stats container not found');
    return;
  }

  const statsArray = [
    {
      label: stats.hotTopics.label,
      value: stats.hotTopics.count,
      change: stats.hotTopics.change,
      color: 'emerald',
      icon: 'w-2 h-2 rounded-full bg-emerald-400'
    },
    {
      label: stats.risingFast.label,
      value: stats.risingFast.count,
      description: stats.risingFast.description,
      color: 'orange',
      icon: 'w-2 h-2 rounded-full bg-orange-400'
    },
    {
      label: stats.avgSeoScore.label,
      value: stats.avgSeoScore.score,
      description: stats.avgSeoScore.description,
      color: 'violet',
      icon: 'w-2 h-2 rounded-full bg-violet-400'
    },
    {
      label: stats.aeoReady.label,
      value: stats.aeoReady.count,
      description: stats.aeoReady.description,
      color: 'cyan',
      icon: 'w-2 h-2 rounded-full bg-cyan-400'
    }
  ];

  statsContainer.innerHTML = statsArray.map(stat => {
    const colorClass = `text-${stat.color}-400`;
    const changeText = stat.change ? `<div class="text-xs ${colorClass}/70">${stat.change} from yesterday</div>` : '';
    const descText = stat.description ? `<div class="text-xs ${colorClass}/70">${stat.description}</div>` : '';

    return `
      <div class="bg-slate-800/40 backdrop-blur rounded-2xl p-4 border border-slate-700/50">
        <div class="flex items-center gap-2 text-slate-400 text-sm mb-1">
          <span class="${stat.icon}"></span>
          ${stat.label}
        </div>
        <div class="text-2xl font-bold ${colorClass} mono">${stat.value}</div>
        ${changeText}
        ${descText}
      </div>
    `;
  }).join('');
}

/**
 * Renders the SEO/AEO score breakdown panel
 * @param {Object} trend - Selected trend object (optional)
 */
function renderScoreBreakdown(trend = null) {
  // Use average scores if no trend selected
  const seoScore = trend ? trend.seoScore : 96;
  const scores = trend ? {
    keywordDensity: 92,
    searchIntentMatch: 98,
    aeoCompatibility: 95,
    featuredSnippetReady: 89
  } : {
    keywordDensity: 92,
    searchIntentMatch: 98,
    aeoCompatibility: 95,
    featuredSnippetReady: 89
  };

  const scoreRing = document.getElementById('score-ring');
  const scoreText = document.querySelector('#score-ring + div .text-3xl');
  const scoreLabel = document.querySelector('#score-ring + div .text-xs');

  if (scoreRing) {
    const circumference = 2 * Math.PI * 56; // radius = 56
    const offset = circumference - (seoScore / 100) * circumference;
    scoreRing.style.strokeDashoffset = offset;
  }

  if (scoreText) {
    scoreText.textContent = seoScore;
  }

  if (scoreLabel) {
    scoreLabel.textContent = seoScore >= 96 ? 'Top 1%' : seoScore >= 94 ? 'Top 5%' : 'Elite tier';
  }

  // Update progress bars
  updateProgressBar('keyword-density', scores.keywordDensity);
  updateProgressBar('search-intent', scores.searchIntentMatch);
  updateProgressBar('aeo-compatibility', scores.aeoCompatibility);
  updateProgressBar('featured-snippet', scores.featuredSnippetReady);
}

/**
 * Updates a progress bar
 * @param {string} id - Progress bar identifier
 * @param {number} percentage - Percentage value (0-100)
 */
function updateProgressBar(id, percentage) {
  const bar = document.querySelector(`[data-progress="${id}"]`);
  if (bar) {
    bar.style.width = `${percentage}%`;
    const text = bar.parentElement.nextElementSibling;
    if (text) {
      text.textContent = `${percentage}%`;
    }
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Attaches click event listeners to trend cards
 */
function attachTrendCardListeners() {
  const cards = document.querySelectorAll('.trend-card[data-trend-id]');
  cards.forEach(card => {
    card.addEventListener('click', function() {
      const trendId = parseInt(this.getAttribute('data-trend-id'));
      const trend = trendData.find(t => t.id === trendId);
      if (trend) {
        selectTrend(trend);
        renderScoreBreakdown(trend);
      }
    });
  });
}

/**
 * Attaches click event listeners to keyword items
 */
function attachKeywordListeners() {
  const keywords = document.querySelectorAll('[data-keyword]');
  keywords.forEach(keyword => {
    keyword.addEventListener('click', function() {
      const keywordText = this.getAttribute('data-keyword');
      filterByKeyword(keywordText);
    });
  });
}

/**
 * Handles trend selection
 * @param {Object} trend - Selected trend object
 */
function selectTrend(trend) {
  // Remove previous selection
  document.querySelectorAll('.trend-card').forEach(card => {
    card.classList.remove('ring-2', 'ring-emerald-500');
  });

  // Add selection to current card
  const selectedCard = document.querySelector(`[data-trend-id="${trend.id}"]`);
  if (selectedCard) {
    selectedCard.classList.add('ring-2', 'ring-emerald-500');
  }

  // Update score breakdown
  renderScoreBreakdown(trend);

  // Show toast notification
  showToast(`Selected: ${trend.title}`);
}

/**
 * Filters trends by keyword
 * @param {string} keyword - Keyword to filter by
 */
function filterByKeyword(keyword) {
  const filtered = trendData.filter(trend => 
    trend.trendingKeywords.some(kw => 
      kw.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  
  if (filtered.length > 0) {
    renderTrends(filtered, 'all');
    showToast(`Filtered by: ${keyword}`);
  } else {
    showToast(`No trends found for: ${keyword}`);
  }
}

// ============================================================================
// FILTER FUNCTIONS
// ============================================================================

/**
 * Sets the timeframe filter
 * @param {string} timeframe - Timeframe ('1h', '24h', '7d', '30d')
 */
function setTimeframe(timeframe) {
  currentTimeframe = timeframe;
  
  // Update button states
  document.querySelectorAll('.timeframe-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-emerald-600', 'text-white');
    btn.classList.add('text-slate-400', 'hover:text-slate-200');
  });
  
  const activeBtn = document.querySelector(`[data-time="${timeframe}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-emerald-600', 'text-white');
    activeBtn.classList.remove('text-slate-400', 'hover:text-slate-200');
  }
  
  // Filter data based on timeframe (placeholder - would need real data)
  filterByTimeframe(timeframe);
  showToast(`Showing ${timeframe} trends`);
}

/**
 * Filters trends by category
 * @param {string} category - Category to filter by
 */
function filterCategory(category) {
  currentCategory = category;
  renderTrends(trendData, category);
  showToast(category === 'all' ? 'Showing all categories' : `Filtered to ${category}`);
}

/**
 * Filters data by timeframe (placeholder for real implementation)
 * @param {string} timeframe - Timeframe filter
 */
function filterByTimeframe(timeframe) {
  // This would filter data based on timeframe
  // For now, just re-render with current data
  renderTrends(trendData, currentCategory);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  
  // Update toast color based on type
  toast.className = 'fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg transform translate-y-20 opacity-0 transition-all duration-300 flex items-center gap-2';
  
  if (type === 'success') {
    toast.classList.add('bg-emerald-600', 'text-white');
  } else if (type === 'error') {
    toast.classList.add('bg-red-600', 'text-white');
  } else {
    toast.classList.add('bg-blue-600', 'text-white');
  }
  
  // Show toast
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  
  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3000);
}

/**
 * Refreshes trend data
 */
function refreshData() {
  showToast('Refreshing trend data...', 'info');
  
  const container = document.getElementById('trends-container');
  if (container) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-500">
        <div class="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading fresh trends...
      </div>
    `;
  }
  
  // Simulate API call
  setTimeout(() => {
    // In real implementation, this would fetch from API
    renderTrends(trendData, currentCategory);
    renderKeywords(risingKeywords);
    updateLastUpdated();
    showToast('Trends updated successfully!');
  }, 1500);
}

/**
 * Updates the "last updated" timestamp
 */
function updateLastUpdated() {
  const updatedElement = document.querySelector('.text-xs.text-slate-500.mono');
  if (updatedElement) {
    const now = new Date();
    const minutes = now.getMinutes();
    updatedElement.textContent = `Updated ${minutes} min ago`;
  }
}

/**
 * Exports trend report
 */
function exportReport() {
  showToast('Generating SEO/AEO report...', 'info');
  
  // Create report data
  const report = {
    generatedAt: new Date().toISOString(),
    timeframe: currentTimeframe,
    category: currentCategory,
    trends: trendData,
    keywords: risingKeywords,
    stats: statsOverview
  };
  
  // Simulate report generation
  setTimeout(() => {
    // In real implementation, this would generate PDF/CSV
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trend-pulse-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Report ready for download!');
  }, 1000);
}

/**
 * Sets up trend alerts
 */
function setAlerts() {
  showToast('Trend alerts configured!');
  // In real implementation, this would open a modal or navigate to settings
}

// ============================================================================
// INITIALIZATION
// ============================================================================

let currentTimeframe = '24h';
let currentCategory = 'all';

/**
 * Initializes the Trend Pulse Pro dashboard
 */
function initTrendPulsePro() {
  // Render all components
  renderStatsOverview(statsOverview);
  renderTrends(trendData, currentCategory);
  renderKeywords(risingKeywords);
  renderScoreBreakdown();
  
  // Initialize timeframe buttons
  document.querySelectorAll('.timeframe-btn').forEach(btn => {
    if (btn.classList.contains('active')) {
      btn.classList.add('bg-emerald-600', 'text-white');
    } else {
      btn.classList.add('text-slate-400', 'hover:text-slate-200');
    }
  });
  
  // Set up auto-refresh
  setInterval(() => {
    refreshData();
  }, TREND_PULSE_CONFIG.update_interval);
  
  // Update last updated time
  updateLastUpdated();
  
  console.log('Trend Pulse Pro initialized successfully');
}

// ============================================================================
// EXPORTS (for module systems)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trendData,
    risingKeywords,
    statsOverview,
    renderTrends,
    renderKeywords,
    renderStatsOverview,
    renderScoreBreakdown,
    setTimeframe,
    filterCategory,
    refreshData,
    exportReport,
    setAlerts,
    initTrendPulsePro
  };
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTrendPulsePro);
} else {
  initTrendPulsePro();
}
