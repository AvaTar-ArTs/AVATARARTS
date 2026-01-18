// AVATARARTS Website Interactive JavaScript
// Advanced functionality for AI automation and revenue generation showcase

class AvatarArtsWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateStats();
        this.setupScrollAnimations();
        this.setupTabNavigation();
        console.log('🚀 AVATARARTS Website System Initialized');
    }

    setupEventListeners() {
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', this.buttonHoverEffect);
            button.addEventListener('mouseleave', this.buttonResetEffect);
        });

        // Card hover effects
        const cards = document.querySelectorAll('.stat-card, .feature-card, .opportunity-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', this.cardHoverEffect);
            card.addEventListener('mouseleave', this.cardResetEffect);
        });

        // Navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', this.switchTab);
        });
    }

    buttonHoverEffect(e) {
        e.target.style.transform = 'translateY(-3px)';
        e.target.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.6)';
    }

    buttonResetEffect(e) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
    }

    cardHoverEffect(e) {
        e.target.style.transform = 'translateY(-5px)';
        e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    }

    cardResetEffect(e) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    }

    switchTab(e) {
        const tabs = document.querySelectorAll('.nav-tab');
        const sections = document.querySelectorAll('.content-section');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        e.currentTarget.classList.add('active');
        const targetSection = document.getElementById(e.currentTarget.dataset.target);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    animateStats() {
        // Animate stat cards on page load
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        document.querySelectorAll('.feature-card, .opportunity-card, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupTabNavigation() {
        // Set up tab navigation for different sections
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-target');
                this.showTabContent(target);
            });
        });
    }

    showTabContent(targetId) {
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('fade-in');
        }
    }

    // Revenue Calculator
    calculateRevenue(hoursPerWeek, hourlyRate, conversionRate) {
        const weeklyRevenue = hoursPerWeek * hourlyRate;
        const monthlyRevenue = weeklyRevenue * 4;
        const annualRevenue = monthlyRevenue * 12;
        const convertedRevenue = annualRevenue * (conversionRate / 100);
        
        return {
            weekly: weeklyRevenue,
            monthly: monthlyRevenue,
            annual: annualRevenue,
            converted: convertedRevenue
        };
    }

    // Update revenue calculator display
    updateRevenueCalculator() {
        const hoursInput = document.getElementById('hours-per-week');
        const rateInput = document.getElementById('hourly-rate');
        const conversionInput = document.getElementById('conversion-rate');
        
        if (hoursInput && rateInput && conversionInput) {
            const hours = parseInt(hoursInput.value) || 40;
            const rate = parseInt(rateInput.value) || 75;
            const conversion = parseInt(conversionInput.value) || 15;
            
            const revenue = this.calculateRevenue(hours, rate, conversion);
            
            document.getElementById('weekly-revenue').textContent = `$${revenue.weekly.toLocaleString()}`;
            document.getElementById('monthly-revenue').textContent = `$${revenue.monthly.toLocaleString()}`;
            document.getElementById('annual-revenue').textContent = `$${revenue.annual.toLocaleString()}`;
            document.getElementById('converted-revenue').textContent = `$${revenue.converted.toLocaleString()}`;
        }
    }

    // Opportunity scoring system
    scoreOpportunity(trendGrowth, searchVolume, competition, cpc) {
        // Calculate opportunity score based on multiple factors
        const growthScore = Math.min(trendGrowth / 10, 10); // Normalize growth (0-10)
        const volumeScore = Math.min(Math.log10(searchVolume) * 2, 10); // Logarithmic volume scoring
        const competitionScore = competition === 'Low' ? 10 : competition === 'Medium' ? 7 : 4; // Competition scoring
        const cpcScore = Math.min(cpc * 2, 10); // CPC scoring
        
        const totalScore = (growthScore * 0.4) + (volumeScore * 0.25) + (competitionScore * 0.2) + (cpcScore * 0.15);
        
        return Math.round(totalScore * 10) / 10; // Round to 1 decimal
    }

    // Performance tracking
    trackEvent(eventName, properties = {}) {
        // Log events for analytics
        console.log(`📊 Event Tracked: ${eventName}`, properties);
        
        // In a real implementation, this would send to analytics service
        // Example: analytics.track(eventName, properties);
    }

    // Form submission handler
    handleFormSubmission(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Track submission
                this.trackEvent('form_submission', {
                    form_id: formId,
                    fields: Object.keys(data)
                });
                
                // Show success message
                this.showMessage('Form submitted successfully!', 'success');
                
                // Reset form
                form.reset();
            });
        }
    }

    // Show message (notification)
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Dynamic content loading
    async loadContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            return content;
        } catch (error) {
            console.error('Error loading content:', error);
            return null;
        }
    }

    // Initialize revenue calculator
    initRevenueCalculator() {
        const calculatorInputs = document.querySelectorAll('#hours-per-week, #hourly-rate, #conversion-rate');
        calculatorInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateRevenueCalculator();
            });
        });
        
        // Initialize with default values
        this.updateRevenueCalculator();
    }

    // Initialize opportunity scorer
    initOpportunityScorer() {
        // Add event listeners to opportunity cards for scoring
        const opportunityCards = document.querySelectorAll('.opportunity-card');
        opportunityCards.forEach(card => {
            card.addEventListener('click', () => {
                const growth = card.getAttribute('data-growth') || 0;
                const volume = card.getAttribute('data-volume') || 0;
                const competition = card.getAttribute('data-competition') || 'Medium';
                const cpc = card.getAttribute('data-cpc') || 0;
                
                const score = this.scoreOpportunity(
                    parseFloat(growth),
                    parseInt(volume),
                    competition,
                    parseFloat(cpc)
                );
                
                this.showMessage(`Opportunity Score: ${score}/10`, 'info');
            });
        });
    }

    // Initialize all interactive features
    initInteractiveFeatures() {
        this.initRevenueCalculator();
        this.initOpportunityScorer();
        
        // Initialize form handlers
        this.handleFormSubmission('contact-form');
        this.handleFormSubmission('newsletter-form');
        
        // Set up performance tracking
        document.querySelectorAll('a[href^="mailto:"], .btn').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackEvent('click_interaction', {
                    target: e.target.href || e.target.textContent,
                    type: e.target.tagName
                });
            });
        });
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const avatarArtsSite = new AvatarArtsWebsite();
    avatarArtsSite.initInteractiveFeatures();
});

// Additional utility functions
const Utils = {
    // Format large numbers
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // Calculate time ago
    timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        if (diffHours > 0) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        return 'Just now';
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AvatarArtsWebsite, Utils };
}

console.log('🎯 AVATARARTS Interactive System Loaded Successfully');
console.log('📊 Ready to execute revenue generation strategies');
console.log('🚀 AI Automation & Content Intelligence System Active');