/**
 * TOP 1-5% PSYCHIATRIST WEBSITE JAVASCRIPT
 * Modern, Performance-Optimized, Conversion-Focused
 * Dr. Lawrence Adu - Gainesville Psychiatry and Forensic Services
 */

(function() {
    'use strict';

    // Performance optimization: Use requestAnimationFrame for smooth animations
    const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        return setTimeout(callback, 1000 / 60);
    };

    // Utility functions
    const utils = {
        // Debounce function for performance
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction() {
                const context = this;
                const args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        // Throttle function for scroll events
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check if element is in viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Smooth scroll to element
        smoothScrollTo: function(target, duration = 800) {
            const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
            if (!targetElement) return;

            const targetPosition = targetElement.offsetTop - 80; // Account for fixed header
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        },

        // Format phone number for display
        formatPhoneNumber: function(phoneNumber) {
            const cleaned = phoneNumber.replace(/\D/g, '');
            const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                return `(${match[1]}) ${match[2]}-${match[3]}`;
            }
            return phoneNumber;
        },

        // Validate email
        validateEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        // Validate phone
        validatePhone: function(phone) {
            const cleaned = phone.replace(/\D/g, '');
            return cleaned.length === 10;
        }
    };

    // Mobile Navigation
    class MobileNavigation {
        constructor() {
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.getElementById('nav-menu');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.isOpen = false;

            this.init();
        }

        init() {
            if (!this.navToggle || !this.navMenu) return;

            this.navToggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                    this.closeMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeMenu();
                }
            });
        }

        toggleMenu() {
            this.isOpen ? this.closeMenu() : this.openMenu();
        }

        openMenu() {
            this.navMenu.classList.add('active');
            this.navToggle.classList.add('active');
            this.navToggle.setAttribute('aria-expanded', 'true');
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        }

        closeMenu() {
            this.navMenu.classList.remove('active');
            this.navToggle.classList.remove('active');
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }

    // Smooth Scrolling
    class SmoothScrolling {
        constructor() {
            this.init();
        }

        init() {
            // Handle anchor links
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (!link) return;

                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                utils.smoothScrollTo(targetId);
            });
        }
    }

    // FAQ Accordion
    class FAQAccordion {
        constructor() {
            this.faqItems = document.querySelectorAll('.faq-item');
            this.init();
        }

        init() {
            this.faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                if (!question) return;

                question.addEventListener('click', () => this.toggleItem(item));
            });
        }

        toggleItem(item) {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            this.faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        }
    }

    // Form Handling
    class FormHandler {
        constructor() {
            this.forms = document.querySelectorAll('form');
            this.init();
        }

        init() {
            this.forms.forEach(form => {
                form.addEventListener('submit', (e) => this.handleSubmit(e));
                
                // Real-time validation
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => this.validateField(input));
                    input.addEventListener('input', () => this.clearErrors(input));
                });
            });
        }

        handleSubmit(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate form
            if (!this.validateForm(form)) {
                return;
            }

            // Show loading state
            this.setLoadingState(form, true);

            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                this.setLoadingState(form, false);
                this.showSuccessMessage(form);
                form.reset();
            }, 2000);
        }

        validateForm(form) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            const name = field.name;
            let isValid = true;
            let errorMessage = '';

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                errorMessage = 'This field is required';
                isValid = false;
            }

            // Email validation
            if (type === 'email' && value && !utils.validateEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }

            // Phone validation
            if (name === 'phone' && value && !utils.validatePhone(value)) {
                errorMessage = 'Please enter a valid 10-digit phone number';
                isValid = false;
            }

            // Show/hide error
            if (isValid) {
                this.clearErrors(field);
            } else {
                this.showError(field, errorMessage);
            }

            return isValid;
        }

        showError(field, message) {
            this.clearErrors(field);
            field.classList.add('error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.color = '#e53e3e';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            
            field.parentNode.appendChild(errorElement);
        }

        clearErrors(field) {
            field.classList.remove('error');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }

        setLoadingState(form, isLoading) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (!submitButton) return;

            if (isLoading) {
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                submitButton.textContent = 'Sending...';
            } else {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                submitButton.textContent = submitButton.dataset.originalText || 'Submit';
            }
        }

        showSuccessMessage(form) {
            const successElement = form.querySelector('.form-success') || form.querySelector('#form-success') || form.querySelector('#appointment-success');
            if (successElement) {
                successElement.style.display = 'block';
                form.style.display = 'none';
                
                // Scroll to success message
                successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    // Scroll Animations
    class ScrollAnimations {
        constructor() {
            this.animatedElements = document.querySelectorAll('[data-animate]');
            this.init();
        }

        init() {
            if (this.animatedElements.length === 0) return;

            // Initial check
            this.checkAnimations();

            // Throttled scroll listener
            window.addEventListener('scroll', utils.throttle(() => {
                this.checkAnimations();
            }, 100));
        }

        checkAnimations() {
            this.animatedElements.forEach(element => {
                if (utils.isInViewport(element) && !element.classList.contains('animated')) {
                    this.animateElement(element);
                }
            });
        }

        animateElement(element) {
            const animationType = element.dataset.animate || 'fadeInUp';
            element.classList.add('animated', animationType);
        }
    }

    // Header Scroll Effect
    class HeaderScrollEffect {
        constructor() {
            this.header = document.querySelector('.header');
            this.lastScrollY = window.scrollY;
            this.init();
        }

        init() {
            if (!this.header) return;

            window.addEventListener('scroll', utils.throttle(() => {
                this.handleScroll();
            }, 100));
        }

        handleScroll() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            this.lastScrollY = currentScrollY;
        }
    }

    // Performance Monitoring
    class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            // Monitor Core Web Vitals
            this.observeLCP();
            this.observeFID();
            this.observeCLS();
        }

        observeLCP() {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            }
        }

        observeFID() {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                observer.observe({ entryTypes: ['first-input'] });
            }
        }

        observeCLS() {
            if ('PerformanceObserver' in window) {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    console.log('CLS:', clsValue);
                });
                observer.observe({ entryTypes: ['layout-shift'] });
            }
        }
    }

    // Analytics Integration
    class Analytics {
        constructor() {
            this.init();
        }

        init() {
            // Track phone number clicks
            this.trackPhoneClicks();
            
            // Track form submissions
            this.trackFormSubmissions();
            
            // Track button clicks
            this.trackButtonClicks();
        }

        trackPhoneClicks() {
            const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            phoneLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.trackEvent('Phone Click', 'Contact', link.href);
                });
            });
        }

        trackFormSubmissions() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', () => {
                    this.trackEvent('Form Submission', 'Contact', form.id || 'Unknown Form');
                });
            });
        }

        trackButtonClicks() {
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const buttonText = button.textContent.trim();
                    this.trackEvent('Button Click', 'CTA', buttonText);
                });
            });
        }

        trackEvent(action, category, label) {
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: category,
                    event_label: label
                });
            }
            
            console.log('Analytics Event:', { action, category, label });
        }
    }

    // Lazy Loading
    class LazyLoading {
        constructor() {
            this.images = document.querySelectorAll('img[data-src]');
            this.init();
        }

        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                });

                this.images.forEach(img => {
                    this.observer.observe(img);
                });
            } else {
                // Fallback for older browsers
                this.images.forEach(img => this.loadImage(img));
            }
        }

        loadImage(img) {
            const src = img.dataset.src;
            if (src) {
                img.src = src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
            }
        }
    }

    // Initialize everything when DOM is ready
    function init() {
        // Core functionality
        new MobileNavigation();
        new SmoothScrolling();
        new FAQAccordion();
        new FormHandler();
        new ScrollAnimations();
        new HeaderScrollEffect();
        new LazyLoading();
        
        // Analytics and monitoring
        new Analytics();
        new PerformanceMonitor();

        // Add loaded class to body
        document.body.classList.add('loaded');

        // Preload critical resources
        preloadCriticalResources();
    }

    function preloadCriticalResources() {
        // Preload hero image
        const heroImage = document.querySelector('.hero-bg-image');
        if (heroImage) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = heroImage.src;
            document.head.appendChild(link);
        }

        // Preload critical CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.as = 'style';
        criticalCSS.href = '/assets/css/style.css';
        document.head.appendChild(criticalCSS);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, pause animations
            document.body.classList.add('paused');
        } else {
            // Page is visible, resume animations
            document.body.classList.remove('paused');
        }
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
        console.log('Connection restored');
        document.body.classList.remove('offline');
    });

    window.addEventListener('offline', () => {
        console.log('Connection lost');
        document.body.classList.add('offline');
    });

    // Export for global access if needed
    window.GainesvillePFS = {
        utils,
        smoothScrollTo: utils.smoothScrollTo
    };

})();