/**
 * Test Data Generator for Bookmarks
 * Generates sample bookmark data and exports to CSV
 */

// Sample bookmark data
const sampleBookmarks = [
  {
    url: 'https://github.com',
    title: 'GitHub - Where the world builds software',
    rating: 5,
    category: 'Development',
    tags: ['coding', 'git', 'opensource'],
    notes: 'Essential platform for code collaboration and version control',
    created_at: new Date('2024-01-15')
  },
  {
    url: 'https://stackoverflow.com',
    title: 'Stack Overflow - Developer Q&A',
    rating: 5,
    category: 'Development',
    tags: ['coding', 'help', 'community'],
    notes: 'Best resource for programming questions and answers',
    created_at: new Date('2024-01-20')
  },
  {
    url: 'https://developer.mozilla.org',
    title: 'MDN Web Docs',
    rating: 5,
    category: 'Development',
    tags: ['documentation', 'web', 'reference'],
    notes: 'Comprehensive web development documentation',
    created_at: new Date('2024-02-01')
  },
  {
    url: 'https://stripe.com/docs',
    title: 'Stripe Documentation',
    rating: 4,
    category: 'Development',
    tags: ['payments', 'api', 'documentation'],
    notes: 'Payment processing integration guides',
    created_at: new Date('2024-02-10')
  },
  {
    url: 'https://tailwindcss.com',
    title: 'Tailwind CSS',
    rating: 5,
    category: 'Design',
    tags: ['css', 'framework', 'styling'],
    notes: 'Utility-first CSS framework for rapid UI development',
    created_at: new Date('2024-02-15')
  },
  {
    url: 'https://figma.com',
    title: 'Figma - Collaborative Design Tool',
    rating: 5,
    category: 'Design',
    tags: ['design', 'ui', 'collaboration'],
    notes: 'Cloud-based design and prototyping tool',
    created_at: new Date('2024-03-01')
  },
  {
    url: 'https://aws.amazon.com',
    title: 'Amazon Web Services (AWS)',
    rating: 4,
    category: 'Cloud',
    tags: ['cloud', 'hosting', 'infrastructure'],
    notes: 'Comprehensive cloud computing platform',
    created_at: new Date('2024-03-10')
  },
  {
    url: 'https://vercel.com',
    title: 'Vercel - Deploy Web Apps Instantly',
    rating: 5,
    category: 'Cloud',
    tags: ['deployment', 'hosting', 'nextjs'],
    notes: 'Fast and easy deployment platform for frontend',
    created_at: new Date('2024-03-15')
  },
  {
    url: 'https://chatgpt.com',
    title: 'ChatGPT by OpenAI',
    rating: 5,
    category: 'AI',
    tags: ['ai', 'chatbot', 'productivity'],
    notes: 'AI assistant for coding, writing, and problem-solving',
    created_at: new Date('2024-04-01')
  },
  {
    url: 'https://claude.ai',
    title: 'Claude by Anthropic',
    rating: 5,
    category: 'AI',
    tags: ['ai', 'assistant', 'coding'],
    notes: 'Advanced AI assistant with strong coding capabilities',
    created_at: new Date('2024-04-10')
  }
];

/**
 * Convert bookmarks to CSV format
 */
function convertToCSV(bookmarks) {
  const headers = ['URL', 'Title', 'Rating', 'Category', 'Tags', 'Notes', 'Created At'];
  const rows = [headers.join(',')];

  for (const bookmark of bookmarks) {
    const row = [
      `"${bookmark.url}"`,
      `"${bookmark.title || ''}"`,
      bookmark.rating || '',
      `"${bookmark.category || ''}"`,
      `"${(bookmark.tags || []).join(', ')}"`,
      `"${(bookmark.notes || '').replace(/"/g, '""')}"`,
      `"${bookmark.created_at.toISOString()}"`
    ];
    rows.push(row.join(','));
  }

  return rows.join('\n');
}

/**
 * Generate statistics from bookmarks
 */
function generateStats(bookmarks) {
  const stats = {
    total: bookmarks.length,
    byCategory: {},
    byRating: {},
    averageRating: 0,
    totalTags: new Set(),
    dateRange: {
      earliest: null,
      latest: null
    }
  };

  let ratingSum = 0;
  let ratingCount = 0;

  bookmarks.forEach(bookmark => {
    // Category stats
    if (bookmark.category) {
      stats.byCategory[bookmark.category] = (stats.byCategory[bookmark.category] || 0) + 1;
    }

    // Rating stats
    if (bookmark.rating) {
      stats.byRating[bookmark.rating] = (stats.byRating[bookmark.rating] || 0) + 1;
      ratingSum += bookmark.rating;
      ratingCount++;
    }

    // Tags
    if (bookmark.tags) {
      bookmark.tags.forEach(tag => stats.totalTags.add(tag));
    }

    // Date range
    if (!stats.dateRange.earliest || bookmark.created_at < stats.dateRange.earliest) {
      stats.dateRange.earliest = bookmark.created_at;
    }
    if (!stats.dateRange.latest || bookmark.created_at > stats.dateRange.latest) {
      stats.dateRange.latest = bookmark.created_at;
    }
  });

  stats.averageRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(2) : 0;
  stats.totalUniqueTags = stats.totalTags.size;
  stats.totalTags = Array.from(stats.totalTags).sort();

  return stats;
}

/**
 * Main execution
 */
function main() {
  console.log('=== Hookmark Pro - Test Data Generator ===\n');

  // Generate CSV
  const csv = convertToCSV(sampleBookmarks);

  // Generate statistics
  const stats = generateStats(sampleBookmarks);

  // Display statistics
  console.log('BOOKMARK STATISTICS');
  console.log('-------------------');
  console.log(`Total Bookmarks: ${stats.total}`);
  console.log(`Average Rating: ${stats.averageRating} / 5.0`);
  console.log(`Unique Tags: ${stats.totalUniqueTags}`);
  console.log();

  console.log('BY CATEGORY:');
  Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
  console.log();

  console.log('BY RATING:');
  Object.entries(stats.byRating)
    .sort((a, b) => b[0] - a[0])
    .forEach(([rating, count]) => {
      console.log(`  ${rating} stars: ${count}`);
    });
  console.log();

  console.log('ALL TAGS:');
  console.log(`  ${stats.totalTags.join(', ')}`);
  console.log();

  console.log('DATE RANGE:');
  console.log(`  Earliest: ${stats.dateRange.earliest.toISOString().split('T')[0]}`);
  console.log(`  Latest: ${stats.dateRange.latest.toISOString().split('T')[0]}`);
  console.log();

  // Save CSV
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, 'sample-bookmarks.csv');

  fs.writeFileSync(outputPath, csv);
  console.log(`✅ CSV exported to: ${outputPath}`);
  console.log();

  // Display CSV preview
  console.log('CSV PREVIEW (first 5 rows):');
  console.log('---------------------------');
  const csvLines = csv.split('\n');
  csvLines.slice(0, 6).forEach(line => console.log(line));
  console.log();

  return {
    bookmarks: sampleBookmarks,
    stats,
    csv,
    outputPath
  };
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  sampleBookmarks,
  convertToCSV,
  generateStats,
  main
};
