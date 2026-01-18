import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, DollarSign, ShoppingBag, Sparkles, Image, Wand2, Download, RefreshCw, Filter, BarChart3, Target, Lightbulb, Star, Eye, Heart, ChevronRight, AlertCircle } from 'lucide-react';

const EtsyNicheMaster = () => {
  const [activeTab, setActiveTab] = useState('niche-finder');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [filters, setFilters] = useState({
    minSales: 0,
    maxPrice: 1000,
    trendingOnly: false,
    competition: 'all'
  });
  const [savedNiches, setSavedNiches] = useState([]);
  const [designPrompts, setDesignPrompts] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [remixSettings, setRemixSettings] = useState({
    style: 'modern',
    colors: 'original',
    complexity: 'medium',
    variations: 4
  });

  // Mock Etsy categories with micro-niches
  const categories = {
    all: 'All Categories',
    'home-living': 'Home & Living',
    'art-collectibles': 'Art & Collectibles',
    'jewelry': 'Jewelry & Accessories',
    'clothing': 'Clothing & Shoes',
    'wedding': 'Weddings',
    'toys': 'Toys & Games',
    'craft-supplies': 'Craft Supplies & Tools',
    'gifts': 'Gifts & Gift Cards'
  };

  // Mock micro-niche data with realistic metrics
  const microNiches = [
    {
      id: 1,
      name: 'Minimalist Book Lover Gifts',
      category: 'gifts',
      parentCategory: 'Home & Living',
      avgSales: 2847,
      avgPrice: 24.99,
      competition: 'medium',
      trend: 'rising',
      trendPercent: 23,
      searchVolume: 12500,
      topProducts: [
        { title: 'Personalized Book Embosser Stamp', sales: 4521, price: 19.99, rating: 4.9, reviews: 1240 },
        { title: 'Literary Quote Bookmarks Set', sales: 3892, price: 15.99, rating: 4.8, reviews: 892 },
        { title: 'Custom Book Spine Poster', sales: 3201, price: 29.99, rating: 4.7, reviews: 654 }
      ],
      keywords: ['book lover', 'literary gifts', 'reading accessories', 'bibliophile'],
      seasonality: 'Year-round with peaks in Dec',
      opportunity: 92
    },
    {
      id: 2,
      name: 'Pet Memorial Shadow Boxes',
      category: 'home-living',
      parentCategory: 'Home & Living',
      avgSales: 1923,
      avgPrice: 45.99,
      competition: 'low',
      trend: 'stable',
      trendPercent: 8,
      searchVolume: 8400,
      topProducts: [
        { title: 'Custom Dog Memorial Frame', sales: 2890, price: 42.99, rating: 5.0, reviews: 743 },
        { title: 'Cat Paw Print Shadow Box', sales: 2134, price: 38.99, rating: 4.9, reviews: 521 },
        { title: 'Pet Photo Memory Display', sales: 1876, price: 51.99, rating: 4.8, reviews: 398 }
      ],
      keywords: ['pet memorial', 'shadow box', 'pet loss gift', 'pet remembrance'],
      seasonality: 'Consistent year-round',
      opportunity: 88
    },
    {
      id: 3,
      name: 'Cottagecore Embroidery Patterns',
      category: 'craft-supplies',
      parentCategory: 'Craft Supplies',
      avgSales: 3421,
      avgPrice: 12.99,
      competition: 'high',
      trend: 'rising',
      trendPercent: 45,
      searchVolume: 21300,
      topProducts: [
        { title: 'Wildflower Embroidery Pattern PDF', sales: 5234, price: 8.99, rating: 4.9, reviews: 1832 },
        { title: 'Cottage Garden Stitch Guide', sales: 4102, price: 11.99, rating: 4.8, reviews: 1204 },
        { title: 'Mushroom & Fern Pattern Set', sales: 3876, price: 14.99, rating: 4.9, reviews: 987 }
      ],
      keywords: ['cottagecore', 'embroidery pattern', 'nature stitch', 'botanical design'],
      seasonality: 'Peak: Spring & Fall',
      opportunity: 75
    },
    {
      id: 4,
      name: 'Zodiac Birthstone Jewelry',
      category: 'jewelry',
      parentCategory: 'Jewelry',
      avgSales: 4102,
      avgPrice: 34.99,
      competition: 'medium',
      trend: 'rising',
      trendPercent: 31,
      searchVolume: 34200,
      topProducts: [
        { title: 'Personalized Zodiac Necklace', sales: 6234, price: 32.99, rating: 4.9, reviews: 2103 },
        { title: 'Birthstone Constellation Ring', sales: 5012, price: 39.99, rating: 4.8, reviews: 1654 },
        { title: 'Custom Star Sign Bracelet', sales: 4321, price: 28.99, rating: 4.7, reviews: 1287 }
      ],
      keywords: ['zodiac jewelry', 'birthstone', 'astrology necklace', 'constellation'],
      seasonality: 'Peak: Birthday months',
      opportunity: 85
    },
    {
      id: 5,
      name: 'Vintage Botanical Prints',
      category: 'art-collectibles',
      parentCategory: 'Art',
      avgSales: 2634,
      avgPrice: 18.99,
      competition: 'medium',
      trend: 'stable',
      trendPercent: 12,
      searchVolume: 15800,
      topProducts: [
        { title: 'Victorian Botanical Art Set', sales: 3892, price: 22.99, rating: 4.9, reviews: 1043 },
        { title: 'Pressed Flower Prints Collection', sales: 3201, price: 16.99, rating: 4.8, reviews: 876 },
        { title: 'Antique Herb Illustration Set', sales: 2789, price: 19.99, rating: 4.7, reviews: 654 }
      ],
      keywords: ['botanical print', 'vintage art', 'plant illustration', 'nature print'],
      seasonality: 'Year-round',
      opportunity: 81
    },
    {
      id: 6,
      name: 'Sourdough Starter Kits',
      category: 'home-living',
      parentCategory: 'Home & Living',
      avgSales: 1834,
      avgPrice: 28.99,
      competition: 'low',
      trend: 'rising',
      trendPercent: 67,
      searchVolume: 9200,
      topProducts: [
        { title: 'Complete Sourdough Starter Kit', sales: 2734, price: 31.99, rating: 4.9, reviews: 723 },
        { title: 'Artisan Bread Making Set', sales: 2103, price: 27.99, rating: 4.8, reviews: 512 },
        { title: 'Sourdough Tools Bundle', sales: 1876, price: 24.99, rating: 4.7, reviews: 398 }
      ],
      keywords: ['sourdough starter', 'bread making', 'baking kit', 'artisan bread'],
      seasonality: 'Peak: Jan-Mar (New Year)',
      opportunity: 94
    },
    {
      id: 7,
      name: 'D&D Character Art Commissions',
      category: 'art-collectibles',
      parentCategory: 'Art',
      avgSales: 3102,
      avgPrice: 89.99,
      competition: 'medium',
      trend: 'rising',
      trendPercent: 38,
      searchVolume: 18700,
      topProducts: [
        { title: 'Custom DnD Character Portrait', sales: 4234, price: 95.99, rating: 5.0, reviews: 1432 },
        { title: 'Fantasy Character Digital Art', sales: 3654, price: 79.99, rating: 4.9, reviews: 1087 },
        { title: 'Dungeons & Dragons Party Art', sales: 3102, price: 94.99, rating: 4.9, reviews: 843 }
      ],
      keywords: ['dnd art', 'character commission', 'fantasy portrait', 'rpg art'],
      seasonality: 'Peak: Oct-Dec (holidays)',
      opportunity: 86
    },
    {
      id: 8,
      name: 'Minimalist Wedding Signs',
      category: 'wedding',
      parentCategory: 'Weddings',
      avgSales: 2456,
      avgPrice: 36.99,
      competition: 'high',
      trend: 'stable',
      trendPercent: 5,
      searchVolume: 28400,
      topProducts: [
        { title: 'Modern Acrylic Welcome Sign', sales: 3789, price: 42.99, rating: 4.9, reviews: 1243 },
        { title: 'Minimalist Table Numbers Set', sales: 3201, price: 32.99, rating: 4.8, reviews: 987 },
        { title: 'Simple Wedding Directional Signs', sales: 2891, price: 34.99, rating: 4.7, reviews: 743 }
      ],
      keywords: ['wedding signs', 'minimalist', 'modern wedding', 'acrylic signs'],
      seasonality: 'Peak: May-Sep',
      opportunity: 72
    }
  ];

  // AI Design Templates
  const designTemplates = [
    {
      id: 1,
      name: 'Minimalist Botanical',
      style: 'minimalist',
      description: 'Clean lines with botanical elements',
      example: '🌿',
      compatible: ['home-living', 'art-collectibles']
    },
    {
      id: 2,
      name: 'Vintage Cottage',
      style: 'vintage',
      description: 'Rustic charm with soft colors',
      example: '🏡',
      compatible: ['craft-supplies', 'home-living']
    },
    {
      id: 3,
      name: 'Modern Geometric',
      style: 'modern',
      description: 'Bold shapes and contemporary feel',
      example: '◆',
      compatible: ['jewelry', 'art-collectibles']
    },
    {
      id: 4,
      name: 'Whimsical Handdrawn',
      style: 'whimsical',
      description: 'Playful illustrations and hand-lettering',
      example: '✨',
      compatible: ['gifts', 'wedding']
    }
  ];

  const filteredNiches = microNiches.filter(niche => {
    const matchesCategory = selectedCategory === 'all' || niche.category === selectedCategory;
    const matchesSearch = niche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         niche.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSales = niche.avgSales >= filters.minSales;
    const matchesPrice = niche.avgPrice <= filters.maxPrice;
    const matchesTrending = !filters.trendingOnly || niche.trend === 'rising';
    const matchesCompetition = filters.competition === 'all' || niche.competition === filters.competition;
    
    return matchesCategory && matchesSearch && matchesSales && matchesPrice && matchesTrending && matchesCompetition;
  });

  const saveNiche = (niche) => {
    if (!savedNiches.find(n => n.id === niche.id)) {
      setSavedNiches([...savedNiches, niche]);
    }
  };

  const generateDesignPrompts = (niche) => {
    const prompts = [
      `Create a ${remixSettings.style} design featuring ${niche.keywords[0]} with ${remixSettings.colors} color palette`,
      `Design a ${remixSettings.complexity} complexity ${niche.keywords[1]} product with ${remixSettings.style} aesthetic`,
      `Generate a unique ${niche.keywords[2]} design combining ${remixSettings.style} and contemporary elements`,
      `Produce a ${remixSettings.complexity} ${niche.keywords[0]} illustration with ${remixSettings.colors} tones`
    ];
    
    setDesignPrompts(prompts.slice(0, remixSettings.variations));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Target className="w-10 h-10 text-purple-300" />
            <h1 className="text-4xl font-bold text-white">Etsy Niche Master Pro</h1>
          </div>
          <p className="text-purple-200 text-lg">Discover profitable micro-niches & generate unique designs with AI</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20">
          <TabButton
            active={activeTab === 'niche-finder'}
            onClick={() => setActiveTab('niche-finder')}
            icon={Search}
            label="Niche Finder"
          />
          <TabButton
            active={activeTab === 'trend-analysis'}
            onClick={() => setActiveTab('trend-analysis')}
            icon={TrendingUp}
            label="Trend Analysis"
          />
          <TabButton
            active={activeTab === 'design-studio'}
            onClick={() => setActiveTab('design-studio')}
            icon={Wand2}
            label="AI Design Studio"
          />
          <TabButton
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
            icon={Heart}
            label={`Saved (${savedNiches.length})`}
          />
        </div>

        {/* Niche Finder Tab */}
        {activeTab === 'niche-finder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">Search Niches</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search keywords..."
                      className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {Object.entries(categories).map(([key, value]) => (
                        <option key={key} value={key} className="bg-purple-900">{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">Min Avg Sales: {filters.minSales}</label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={filters.minSales}
                      onChange={(e) => setFilters({...filters, minSales: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">Max Price: ${filters.maxPrice}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-purple-200 text-sm mb-2 block">Competition Level</label>
                    <select
                      value={filters.competition}
                      onChange={(e) => setFilters({...filters, competition: e.target.value})}
                      className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="all" className="bg-purple-900">All Levels</option>
                      <option value="low" className="bg-purple-900">Low Competition</option>
                      <option value="medium" className="bg-purple-900">Medium Competition</option>
                      <option value="high" className="bg-purple-900">High Competition</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="trending"
                      checked={filters.trendingOnly}
                      onChange={(e) => setFilters({...filters, trendingOnly: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="trending" className="text-purple-200 text-sm">Trending Only</label>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 border border-white/20">
                <Lightbulb className="w-8 h-8 text-white mb-3" />
                <h4 className="text-white font-semibold mb-2">Pro Tip</h4>
                <p className="text-purple-100 text-sm">
                  Focus on niches with high opportunity scores (85+) and low-medium competition for best results.
                </p>
              </div>
            </div>

            {/* Niche Results */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Found {filteredNiches.length} Micro-Niches
                  </h3>
                  <button className="text-purple-300 hover:text-white transition-colors text-sm flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                  </button>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredNiches.map(niche => (
                    <div
                      key={niche.id}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => setSelectedNiche(niche)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-1">{niche.name}</h4>
                          <p className="text-purple-300 text-sm">{niche.parentCategory}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            niche.trend === 'rising' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {niche.trend === 'rising' ? '📈' : '➡️'} {niche.trendPercent > 0 ? '+' : ''}{niche.trendPercent}%
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveNiche(niche);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Heart className={`w-5 h-5 ${savedNiches.find(n => n.id === niche.id) ? 'fill-pink-500 text-pink-500' : 'text-purple-300'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <MetricBadge icon={ShoppingBag} label="Avg Sales" value={niche.avgSales.toLocaleString()} />
                        <MetricBadge icon={DollarSign} label="Avg Price" value={`$${niche.avgPrice}`} />
                        <MetricBadge icon={Eye} label="Searches" value={niche.searchVolume.toLocaleString()} />
                        <MetricBadge icon={Target} label="Opportunity" value={`${niche.opportunity}%`} color={niche.opportunity >= 85 ? 'green' : 'yellow'} />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {niche.keywords.slice(0, 3).map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-1 rounded ${
                          niche.competition === 'low' ? 'bg-green-500/20 text-green-300' :
                          niche.competition === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {niche.competition.toUpperCase()} Competition
                        </span>
                        <span className="text-purple-300">{niche.seasonality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trend Analysis Tab */}
        {activeTab === 'trend-analysis' && selectedNiche && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedNiche.name}</h2>
                <p className="text-purple-300">Detailed trend analysis and top products</p>
              </div>
              <button
                onClick={() => setActiveTab('design-studio')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                Create Designs
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard icon={TrendingUp} label="Trend Direction" value={selectedNiche.trend} trend={selectedNiche.trendPercent} />
              <StatCard icon={BarChart3} label="Search Volume" value={selectedNiche.searchVolume.toLocaleString()} />
              <StatCard icon={Target} label="Opportunity Score" value={`${selectedNiche.opportunity}%`} />
            </div>

            <h3 className="text-xl font-semibold text-white mb-4">Top Selling Products</h3>
            <div className="space-y-3">
              {selectedNiche.topProducts.map((product, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-purple-400">#{idx + 1}</span>
                        <h4 className="text-white font-semibold">{product.title}</h4>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400 flex items-center gap-1">
                          <ShoppingBag className="w-4 h-4" />
                          {product.sales.toLocaleString()} sales
                        </span>
                        <span className="text-yellow-400 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">${product.price}</div>
                      <div className="text-purple-300 text-sm">
                        ${(product.sales * product.price).toLocaleString()} revenue
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Design Studio Tab */}
        {activeTab === 'design-studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                AI Design Generator
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-purple-200 text-sm mb-2 block">Select Niche</label>
                  <select
                    value={selectedNiche?.id || ''}
                    onChange={(e) => setSelectedNiche(microNiches.find(n => n.id === parseInt(e.target.value)))}
                    className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="" className="bg-purple-900">Choose a niche...</option>
                    {microNiches.map(niche => (
                      <option key={niche.id} value={niche.id} className="bg-purple-900">{niche.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-purple-200 text-sm mb-2 block">Design Style</label>
                  <select
                    value={remixSettings.style}
                    onChange={(e) => setRemixSettings({...remixSettings, style: e.target.value})}
                    className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="modern" className="bg-purple-900">Modern</option>
                    <option value="minimalist" className="bg-purple-900">Minimalist</option>
                    <option value="vintage" className="bg-purple-900">Vintage</option>
                    <option value="whimsical" className="bg-purple-900">Whimsical</option>
                    <option value="elegant" className="bg-purple-900">Elegant</option>
                  </select>
                </div>

                <div>
                  <label className="text-purple-200 text-sm mb-2 block">Color Palette</label>
                  <select
                    value={remixSettings.colors}
                    onChange={(e) => setRemixSettings({...remixSettings, colors: e.target.value})}
                    className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 