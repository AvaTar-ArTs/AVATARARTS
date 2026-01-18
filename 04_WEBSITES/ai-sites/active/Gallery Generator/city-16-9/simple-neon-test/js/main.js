// City 16-9 Gallery - Main JavaScript
// Following the dark architectural patterns of simplegallery

// Global variables
let slides = {};
let currentGallery = 'city-16-9';

// Initialize when DOM is loaded
$(document).ready(function() {
    generateGallery();
    createSlides();
    $('div.gallery a').on('click', openPhotoSwipe);
    initScrollButtons();
    initSecurity();
    initDarkMode();
});

// Generate gallery HTML dynamically
function generateGallery() {
    const galleryContainer = document.querySelector('.gallery');
    if (!galleryContainer) return;
    
    // Check if gallery is already populated by template
    if (galleryContainer.children.length > 0) {
        return;
    }
    
    // Fallback: generate from hardcoded data if no template data
    const fallbackData = generateFallbackData();
    galleryContainer.innerHTML = '';
    
    fallbackData.forEach((item, index) => {
        const aspectRatio = item.width / item.height;
        const baseWidth = 284;
        const calculatedHeight = Math.round(baseWidth / aspectRatio);
        
        const galleryItem = document.createElement('a');
        galleryItem.href = item.src;
        galleryItem.className = 'gallery-photo';
        galleryItem.setAttribute('data-index', index);
        galleryItem.setAttribute('data-type', 'image');
        galleryItem.setAttribute('data-gallery', '0');
        galleryItem.setAttribute('data-width', item.width);
        galleryItem.setAttribute('data-height', item.height);
        galleryItem.setAttribute('data-date', '');
        galleryItem.style.setProperty('--w', baseWidth);
        galleryItem.style.setProperty('--h', calculatedHeight);
        
        const img = document.createElement('img');
        img.src = item.thumb;
        img.className = 'thumbnail rounded';
        img.alt = item.alt;
        
        galleryItem.appendChild(img);
        galleryContainer.appendChild(galleryItem);
    });
}

// Generate fallback data for testing
function generateFallbackData() {
    const data = [];
    for (let i = 1; i <= 50; i++) {
        data.push({
            id: i,
            src: `images/photos/${i}.png`,
            thumb: `images/thumbnails/${i}.jpg`,
            width: i <= 7 || (i >= 18 && i <= 25) || (i >= 30 && i <= 37) || (i >= 40 && i <= 50) ? 3200 : 4500,
            height: i <= 7 || (i >= 18 && i <= 25) || (i >= 30 && i <= 37) || (i >= 40 && i <= 50) ? 1800 : 2531,
            alt: `Urban cityscape ${i}`
        });
    }
    return data;
}

// Create slides for PhotoSwipe
function createSlides() {
    $("a.gallery-photo").each(function(photo_id, photo) {
        var slide = {
            w: photo.getAttribute('data-width'),
            h: photo.getAttribute('data-height'),
            msrc: photo.getElementsByTagName('img')[0].getAttribute('src'),
            title: photo.getElementsByTagName('img')[0].getAttribute('alt'),
            date: photo.getAttribute('data-date'),
        };

        if (photo.getAttribute('data-type') == 'image')
            slide['src'] = photo.getAttribute('href');
        else
            slide['html'] = '<video style="margin: 0px auto; height: 100%; max-width: 100%; max-height: 100%; display: block" data-index="' + photo.getAttribute('data-index') +
            '" controls><source src="' + photo.getAttribute('href') + '" type="video/mp4"></video>';

        var gallery_id = photo.getAttribute('data-gallery');
        if (!(gallery_id in slides))
            slides[gallery_id] = [];

        slides[gallery_id].push(slide);
    });
}

// Get thumbnail bounds for PhotoSwipe
function getThumbBounds(gallery, index) {
    var thumbnail = $('div.gallery a[data-gallery="' + gallery + '"][data-index="' + index + '"]')[0];
    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
    var rect = thumbnail.getBoundingClientRect();
    return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
}

// Add caption HTML for PhotoSwipe
function addCaptionHTML(item, captionEl, isFake) {
    if (!item.title && !item.date) {
        captionEl.children[0].innerText = '';
        return false;
    }
    captionEl.children[0].innerHTML = item.title;
    if (item.date) {
        captionEl.children[0].innerHTML += '<p class="caption-date">' + item.date + '</p>';
    }
    return true;
}

// Open PhotoSwipe gallery
function openPhotoSwipe() {
    var index = parseInt($(this).attr('data-index'))
    var gallery_id = $(this).attr('data-gallery')

    var options = {
        index: index,
        getThumbBoundsFn: function(id) { return getThumbBounds(gallery_id, id) },
        addCaptionHTMLFn: addCaptionHTML,
        preload: [2, 5],
        zoomEl: false,
        shareEl: true,
        barsSize: { top: 0, bottom: 0 },
        bgOpacity: 1,
        loop: false,
        mainClass: 'pswp--minimal--dark',
        shareButtons: [
            { id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true }
        ],
    };

    var gallery = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, slides[gallery_id], options);

    gallery.listen('initialZoomOut', function() {
        if (this.currItem.html) {
            var videos = $('div.pswp__item video[data-index=' + this.getCurrentIndex() + ']')
            if (videos.length > 0)
                videos[0].pause()
        }
    });

    gallery.listen('afterChange', function() {
        var videos = $('div.pswp__item video')
        for (var i = 0; i < videos.length; ++i)
            videos[i].pause()

        if (this.currItem.html) {
            var videos = $('div.pswp__item video[data-index=' + this.getCurrentIndex() + ']')
            if (videos.length > 0)
                videos[0].play()
        }
    });

    gallery.init();

    return false;
}

// Initialize scroll buttons
function initScrollButtons() {
    let myBtn = document.getElementById("myBtn");
    let jumpBtn = document.getElementById("jumpBtn");

    // When the user scrolls down 20px from the top of the document, show the buttons
    window.onscroll = function() {
        scrollFunction();
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            myBtn.style.display = "block"; // Show "Top" button
            jumpBtn.style.display = "block"; // Show "Jump Down" button
        } else {
            myBtn.style.display = "none"; // Hide buttons if not scrolled down
            jumpBtn.style.display = "none";
        }
    }

    // Scroll to the top when the "Top" button is clicked
    function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
    }

    // Scroll down when the "Jump Down" button is clicked
    function jumpDown() {
        window.scrollBy(0, window.innerHeight); // Scroll down by one viewport height
    }

    // Make functions global
    window.topFunction = topFunction;
    window.jumpDown = jumpDown;
}

// Initialize security measures
function initSecurity() {
    // Disable right click and save as
    document.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });
    
    document.addEventListener("keydown", function(event) {
        // Disable F12 key
        if (event.keyCode === 123) {
            event.preventDefault();
        }
        // Disable Ctrl+Shift+I keys
        if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
            event.preventDefault();
        }
        // Disable Ctrl+Shift+C keys
        if (event.ctrlKey && event.shiftKey && event.keyCode === 67) {
            event.preventDefault();
        }
        // Disable Ctrl+Shift+J keys
        if (event.ctrlKey && event.shiftKey && event.keyCode === 74) {
            event.preventDefault();
        }
        // Disable Ctrl+U keys
        if (event.ctrlKey && event.keyCode === 85) {
            event.preventDefault();
        }
    });
}

// Initialize dark mode features
function initDarkMode() {
    // Add dark mode class to body
    document.body.classList.add('dark-mode');
    
    // Add urban theme effects
    addUrbanEffects();
}

// Add urban theme effects
function addUrbanEffects() {
    // Add subtle animation to gallery items
    const galleryItems = document.querySelectorAll('.gallery-photo');
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in-up');
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

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
            }, 0);
        });
    }
}

// Initialize performance tracking
trackPerformance();

// Export functions for external use
window.CityGallery = {
    generateGallery,
    createSlides,
    openPhotoSwipe,
    initScrollButtons,
    initSecurity,
    initDarkMode,
    addUrbanEffects
};