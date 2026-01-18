// Enhanced JavaScript for Gainesville PFS Website - Top 1-5% Performance Optimization

// Performance optimization: Load critical functions immediately
(function() {
  'use strict';

  // DOM Content Loaded Event
  document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
  });

  // Initialize all website functionality
  function initializeWebsite() {
    setupSmoothScrolling();
    setupFormValidation();
    setupContactForm();
    setupMobileMenu();
    setupScrollAnimations();
    setupAnalytics();
    setupPerformanceOptimizations();
  }

  // Smooth scrolling for anchor links
  function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Enhanced form validation
  function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
          e.preventDefault();
        }
      });
    });
  }

  // Form validation function
  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Clear previous error messages
    clearErrorMessages(form);
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        showFieldError(field, 'This field is required');
        isValid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
      } else if (field.type === 'tel' && !isValidPhone(field.value)) {
        showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
      }
    });
    
    return isValid;
  }

  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation
  function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  // Show field error
  function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
  }

  // Clear error messages
  function clearErrorMessages(form) {
    const errorMessages = form.querySelectorAll('.field-error');
    errorMessages.forEach(error => error.remove());
    
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      field.style.borderColor = '#e9ecef';
    });
  }

  // Enhanced contact form handling
  function setupContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
          submitContactForm(this);
        }
      });
    }
  }

  // Submit contact form
  function submitContactForm(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
      // Show success message
      showNotification('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
      
      // Reset form
      form.reset();
      
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  }

  // Show notification
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 2rem;
      background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
      color: white;
      border-radius: 5px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 1000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // Mobile menu functionality
  function setupMobileMenu() {
    // Create mobile menu button if it doesn't exist
    const header = document.querySelector('.header');
    if (header && !document.querySelector('.mobile-menu-btn')) {
      const menuButton = document.createElement('button');
      menuButton.className = 'mobile-menu-btn';
      menuButton.innerHTML = '☰';
      menuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
      `;
      
      header.querySelector('.header-content').appendChild(menuButton);
      
      menuButton.addEventListener('click', function() {
        toggleMobileMenu();
      });
    }
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (!menu) {
      createMobileMenu();
    } else {
      menu.classList.toggle('active');
    }
  }

  // Create mobile menu
  function createMobileMenu() {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.innerHTML = `
      <div class="mobile-menu-content">
        <a href="#services">Services</a>
        <a href="#about">About Dr. Adu</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact</a>
        <a href="tel:3523789116" class="mobile-phone">Call (352) 378-9116</a>
      </div>
    `;
    
    menu.style.cssText = `
      position: fixed;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100vh;
      background: rgba(44, 62, 80, 0.95);
      z-index: 1000;
      transition: left 0.3s ease;
    `;
    
    document.body.appendChild(menu);
  }

  // Scroll animations
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial, .faq-item');
    animateElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Analytics setup
  function setupAnalytics() {
    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function() {
        trackEvent('Form Submission', 'Contact Form');
      });
    });
    
    // Track phone number clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      link.addEventListener('click', function() {
        trackEvent('Phone Call', 'Contact');
      });
    });
    
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
      button.addEventListener('click', function() {
        trackEvent('CTA Click', this.textContent.trim());
      });
    });
  }

  // Track events (replace with actual analytics)
  function trackEvent(action, category) {
    console.log('Analytics Event:', action, category);
    // Replace with actual analytics tracking code
    // gtag('event', action, { event_category: category });
  }

  // Performance optimizations
  function setupPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    preloadCriticalResources();
  }

  // Preload critical resources
  function preloadCriticalResources() {
    const criticalImages = [
      'assets/images/dr-lawrence-adu.jpg',
      'assets/images/dr-adu-office.jpg'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Utility functions
  function debounce(func, wait) {
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

  function throttle(func, limit) {
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
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    .animate-in {
      animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .lazy {
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .lazy.loaded {
      opacity: 1;
    }
    
    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: block !important;
      }
    }
  `;
  document.head.appendChild(style);

})();