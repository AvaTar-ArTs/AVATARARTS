// YouTube Enhancer Script - Version 8.1.0
// Feature-complete implementation based on official Enhancer for YouTube™ extension

(function() {
    'use strict';
    
    const config = {
        // General settings
        ver: "8.1.0",
        enableEnhancer: true,

        // ==================== PLAYBACK SPEED ====================
        playbackSpeed: {
            defaultSpeed: 1,                    // Default playback speed (0.07 - 16)
            overrideDefaults: true,             // Override YouTube's default speed options
            variation: 0.1,                     // Speed increment/decrement
            rememberSpeed: false,               // Remember last used speed
            
            mouseWheel: {
                enabled: true,                  // Control speed with mouse wheel
                requireShiftKey: true,          // Require Shift+wheel for speed control
                reverseDirection: false         // Reverse wheel direction
            }
        },

        // ==================== VOLUME ====================
        volume: {
            defaultLevel: 50,                   // Default volume (0-100)
            boosterLevel: 1,                    // Volume boost multiplier (1-10)
            rememberVolume: false,              // Remember last volume
            
            mouseWheel: {
                enabled: true,                  // Control volume with mouse wheel
                variation: 5,                   // Volume change per scroll (1-25)
                reverseDirection: false,        // Reverse wheel direction
                hideVolumeNotification: false   // Hide YouTube's volume popup
            }
        },

        // ==================== PLAYBACK QUALITY ====================
        quality: {
            // Main video quality
            video: "hd1080",                    // auto, tiny, small, medium, large, hd720, hd1080, hd1440, hd2160, highres
            videoFullscreen: "hd1080",          // Quality in fullscreen
            
            // Playlist quality
            playlist: "hd720",                  // Quality for playlist videos
            playlistFullscreen: "hd1080",       // Playlist fullscreen quality
            
            // Embedded videos
            embedded: "hd720",                  // Embedded video quality
            embeddedFullscreen: "hd1080",       // Embedded fullscreen quality
            
            // Special modes
            screenOut: "medium",                // Quality when screen is off/minimized
            pictureInPicture: "hd720",          // Quality in PiP mode
            
            // Options
            forceMP4: true,                     // Force MP4 format (H.264/AVC)
            forceStandardFrameRate: false,      // Force 24/25/30 FPS instead of 48/50/60
            switchBackToPrevious: true          // Return to previous quality after fullscreen
        },

        // ==================== AUTOPLAY ====================
        autoplay: {
            // General autoplay control
            disable: true,                      // Disable all autoplay
            
            // Background tab control
            preventInBackgroundTabs: true,      // Prevent autoplay in background tabs
            forcePlayInBackgroundTabs: false,   // Force playback in background tabs
            
            // Specific scenarios
            preventOnPlaylists: false,          // Prevent autoplay for playlist videos
            preventForEmbedded: true,           // Prevent autoplay for embedded videos
            preventWhenUnfocused: false,        // Prevent when video isn't in viewport
            
            // Advanced
            stopOnTabChange: false,             // Stop video when switching tabs
            pauseOnTabChange: false             // Pause video when switching tabs
        },

        // ==================== POP-UP PLAYER ====================
        popupPlayer: {
            enabled: false,
            size: { width: 640, height: 360 },
            position: { x: null, y: null },     // null = center
            alwaysOnTop: true
        },

        // ==================== MINI PLAYER ====================
        miniPlayer: {
            enabled: true,
            
            // Launch conditions
            launchOnScroll: true,               // Launch when scrolling down
            launchOnComment: false,             // Launch when clicking comment box
            
            // Size and position
            size: { width: 400, height: 225 },
            position: "bottom-right",           // top-left, top-right, bottom-left, bottom-right
            
            // Behavior
            scrollTriggerOffset: 500,           // Pixels to scroll before activation
            dragEnabled: true,                  // Allow dragging to reposition
            
            // Controls visibility
            showControlsOnHover: true,
            hidePlayerControls: false,
            
            // Position awareness
            positionAwareBasedOnDimensions: true // Adjust based on viewport size
        },

        // ==================== APPEARANCE ====================
        appearance: {
            // Main elements
            hideEndScreenCards: true,           // Hide end screen video suggestions
            hideAnnotations: true,              // Hide annotations/cards
            hideInfoCards: false,               // Hide info card teasers
            
            // Sidebar/Feed elements
            hideComments: false,
            hideRelatedVideos: false,
            hideChat: false,
            hideShorts: true,
            hideMerch: true,
            hideChannelAvatars: false,
            hideVerifiedBadges: false,
            hideGamingShelf: true,
            
            // Player elements
            hidePlayerShadow: false,
            hidePlayerGradient: false,
            hideWatermark: true,                // Hide channel watermark
            hidePaidPromotions: true,
            hideAutoplaySwitch: false,
            
            // Control bar
            hideAutoplayButton: false,
            hideSubtitlesButton: false,
            hideCardsButton: true,
            hideMiniplayerButton: false,
            hideTheaterButton: false,
            hideCastButton: false,
            
            // Mouse cursor
            hideMouseCursor: false,             // Hide cursor over video after inactivity
            cursorHideDelay: 3000,              // Milliseconds before hiding
            
            // Cinema mode
            cinemaMode: {
                enabled: true,
                opacity: 0.85,                  // Background opacity (0.0 - 1.0)
                blurLevel: 0,                   // Background blur (0-20px)
                applyToFullscreen: false
            },
            
            // Color adjustments
            colorFilters: {
                enabled: false,
                brightness: 100,                // 0-200%
                contrast: 100,                  // 0-200%
                saturation: 100,                // 0-200%
                hue: 0,                         // 0-360 degrees
                sepia: 0,                       // 0-100%
                grayscale: 0,                   // 0-100%
                invert: 0                       // 0-100%
            },
            
            // Theme
            theme: "default",                   // default, dark, custom
            customTheme: {
                background: "#181818",
                text: "#ffffff",
                accent: "#ff0000"
            }
        },

        // ==================== KEYBOARD SHORTCUTS ====================
        keyboard: {
            enabled: true,
            
            shortcuts: {
                // Playback speed
                increaseSpeed: '>',             // Increase playback speed
                decreaseSpeed: '<',             // Decrease playback speed
                resetSpeed: '\\',               // Reset to 1x speed
                
                // Volume
                increaseVolume: null,           // null = disabled (use arrow up/down)
                decreaseVolume: null,
                muteToggle: null,
                
                // Quality
                cycleQuality: 'q',              // Cycle through quality options
                
                // Player modes
                theaterMode: 't',               // Toggle theater mode
                fullscreen: null,               // null = use default 'f'
                miniPlayer: 'i',                // Toggle mini player
                popupPlayer: 'w',               // Open popup player
                pictureInPicture: 'p',          // Toggle PiP
                
                // Playback
                playPause: null,                // null = use default 'k' or 'space'
                seekForward: null,              // null = use default 'l' or right arrow
                seekBackward: null,             // null = use default 'j' or left arrow
                nextVideo: 'Shift+n',           // Next video
                previousVideo: 'Shift+p',       // Previous video
                
                // Loop
                toggleLoop: 'l',                // Toggle video loop
                
                // Screenshot
                takeScreenshot: 's',            // Take screenshot
                
                // Misc
                focusPlayer: 'Escape',          // Give focus to player
                toggleControls: 'c',            // Show/hide controls
                rotateVideo: 'r',               // Rotate video
                flipVideo: 'Shift+f',           // Flip video
                
                // Custom
                customAction1: null,
                customAction2: null
            }
        },

        // ==================== ADVANCED ====================
        advanced: {
            // Player behavior
            autoTheaterMode: true,              // Auto-enable theater mode
            autoFullscreen: false,              // Auto-fullscreen on play
            loopEnabled: false,                 // Loop videos by default
            
            // Controls
            alwaysShowControls: false,          // Keep controls visible
            showControlsOnHover: true,          // Show on hover
            controlsFadeDelay: 3000,            // Milliseconds before fade
            
            // Video manipulation
            allowRotate: true,                  // Enable video rotation
            allowFlip: true,                    // Enable video flipping
            allowZoom: true,                    // Enable video zoom
            
            // Performance
            disablePolymer: false,              // Use classic YouTube (if available)
            disableAutoQualityForLivestreams: true,
            forceH264: true,                    // Force H.264 codec
            
            // Accessibility
            autoExpandDescription: false,       // Auto-expand video description
            autoShowTranscript: false,          // Auto-show transcript
            
            // Comments
            autoSortComments: true,             // Sort comments by setting
            commentSortOrder: "top",            // top, new
            
            // Monetization support
            whitelistedChannels: [],            // Channels to allow ads for
            
            // Custom CSS
            customCSS: {
                enabled: false,
                code: ""
            },
            
            // Custom JavaScript
            customScript: {
                enabled: false,
                code: ""
            }
        },

        // ==================== EXPERIMENTAL ====================
        experimental: {
            autoSkipAds: false,                 // Auto-skip skippable ads (use ad blocker instead)
            autoClickSkipButton: false,         // Auto-click skip button
            removeAdPlaceholders: false,        // Remove ad containers
            
            enhancedBitrate: false,             // Request higher bitrate
            preferAV1: false,                   // Prefer AV1 codec
            
            touchControls: false,               // Enhanced touch controls for mobile
            gestureControls: false              // Gesture-based controls
        }
    };

    // ==================== STATE MANAGEMENT ====================
    const state = {
        initialized: false,
        player: null,
        video: null,
        
        // Feature states
        miniPlayerActive: false,
        popupPlayerWindow: null,
        isFullscreen: false,
        isPiP: false,
        isTheaterMode: false,
        
        // Playback states
        currentQuality: null,
        previousQuality: null,
        currentSpeed: config.playbackSpeed.defaultSpeed,
        currentVolume: config.volume.defaultLevel,
        
        // UI states
        controlsVisible: true,
        mouseMovementTimeout: null,
        lastInteractionTime: Date.now(),
        
        // Rotation/flip state
        rotation: 0,                            // 0, 90, 180, 270
        flipped: false,
        
        // Timers
        lastQualityChange: 0,
        lastSpeedChange: 0,
        lastVolumeChange: 0,
        
        // Navigation
        lastUrl: location.href,
        navigationCount: 0
    };

    // ==================== UTILITY FUNCTIONS ====================
    const utils = {
        waitForElement(selector, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const element = document.querySelector(selector);
                if (element) return resolve(element);

                const observer = new MutationObserver((mutations, obs) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        obs.disconnect();
                        resolve(element);
                    }
                });

                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });

                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`Timeout waiting for ${selector}`));
                }, timeout);
            });
        },

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
        },

        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        getPlayer() {
            return document.querySelector('.html5-video-player') || 
                   document.getElementById('movie_player');
        },

        getVideo() {
            return document.querySelector('video.html5-main-video') ||
                   document.querySelector('video');
        },

        log(message, data = null) {
            const timestamp = new Date().toISOString().substr(11, 8);
            console.log(`[YT Enhancer ${timestamp}] ${message}`, data || '');
        },

        // Storage helpers
        storage: {
            get(key, defaultValue) {
                try {
                    const value = localStorage.getItem(`yt_enhancer_${key}`);
                    return value ? JSON.parse(value) : defaultValue;
                } catch (e) {
                    return defaultValue;
                }
            },
            
            set(key, value) {
                try {
                    localStorage.setItem(`yt_enhancer_${key}`, JSON.stringify(value));
                    return true;
                } catch (e) {
                    utils.log('Storage error', e);
                    return false;
                }
            }
        },

        // Check if video is embedded
        isEmbedded() {
            return window.location !== window.parent.location ||
                   window.self !== window.top;
        },

        // Check if video is in playlist
        isPlaylist() {
            return window.location.search.includes('list=');
        },

        // Get video context
        getVideoContext() {
            if (utils.isEmbedded()) return 'embedded';
            if (utils.isPlaylist()) return 'playlist';
            if (state.isFullscreen) return 'fullscreen';
            if (state.isPiP) return 'pip';
            return 'normal';
        }
    };

    // ==================== QUALITY MANAGER ====================
    const qualityManager = {
        getAvailableQualities() {
            const player = utils.getPlayer();
            if (!player) return [];
            
            try {
                return player.getAvailableQualityLevels ? 
                       player.getAvailableQualityLevels() : [];
            } catch (e) {
                return [];
            }
        },

        getCurrentQuality() {
            const player = utils.getPlayer();
            if (!player) return null;
            
            try {
                return player.getPlaybackQuality ? player.getPlaybackQuality() : null;
            } catch (e) {
                return null;
            }
        },

        getQualityForContext(context) {
            const q = config.quality;
            
            switch(context) {
                case 'embedded':
                    return state.isFullscreen ? q.embeddedFullscreen : q.embedded;
                case 'playlist':
                    return state.isFullscreen ? q.playlistFullscreen : q.playlist;
                case 'fullscreen':
                    return q.videoFullscreen;
                case 'pip':
                    return q.pictureInPicture;
                default:
                    return q.video;
            }
        },

        setQuality(quality) {
            const player = utils.getPlayer();
            if (!player) return false;

            try {
                const now = Date.now();
                if (now - state.lastQualityChange < 1000) return false;
                state.lastQualityChange = now;

                const availableQualities = this.getAvailableQualities();
                
                if (availableQualities.includes(quality)) {
                    state.previousQuality = this.getCurrentQuality();
                    
                    if (player.setPlaybackQualityRange) {
                        player.setPlaybackQualityRange(quality);
                    }
                    if (player.setPlaybackQuality) {
                        player.setPlaybackQuality(quality);
                    }
                    
                    state.currentQuality = quality;
                    utils.log(`Quality: ${quality}`);
                    return true;
                } else {
                    // Find closest available quality
                    const qualityMap = {
                        'highres': 5,
                        'hd2160': 4,
                        'hd1440': 3,
                        'hd1080': 2,
                        'hd720': 1,
                        'large': 0,
                        'medium': -1,
                        'small': -2,
                        'tiny': -3
                    };
                    
                    const targetLevel = qualityMap[quality] || 0;
                    let closestQuality = null;
                    let smallestDiff = Infinity;
                    
                    availableQualities.forEach(q => {
                        const level = qualityMap[q] || 0;
                        const diff = Math.abs(level - targetLevel);
                        if (diff < smallestDiff) {
                            smallestDiff = diff;
                            closestQuality = q;
                        }
                    });
                    
                    if (closestQuality) {
                        return this.setQuality(closestQuality);
                    }
                }
            } catch (e) {
                utils.log('Quality error', e);
            }
            
            return false;
        },

        applyAutoQuality() {
            const context = utils.getVideoContext();
            const quality = this.getQualityForContext(context);
            
            if (quality && quality !== 'auto') {
                setTimeout(() => this.setQuality(quality), 500);
            }
        },

        cycleQuality() {
            const qualities = this.getAvailableQualities();
            const current = this.getCurrentQuality();
            const currentIndex = qualities.indexOf(current);
            const nextIndex = (currentIndex + 1) % qualities.length;
            
            this.setQuality(qualities[nextIndex]);
        }
    };

    // ==================== PLAYBACK MANAGER ====================
    const playbackManager = {
        setSpeed(speed) {
            const video = utils.getVideo();
            if (!video) return;
            
            speed = Math.max(0.07, Math.min(16, speed));
            video.playbackRate = speed;
            state.currentSpeed = speed;
            
            if (config.playbackSpeed.rememberSpeed) {
                utils.storage.set('playbackSpeed', speed);
            }
            
            utils.log(`Speed: ${speed}x`);
            this.showSpeedNotification(speed);
        },

        increaseSpeed() {
            const newSpeed = state.currentSpeed + config.playbackSpeed.variation;
            this.setSpeed(newSpeed);
        },

        decreaseSpeed() {
            const newSpeed = state.currentSpeed - config.playbackSpeed.variation;
            this.setSpeed(newSpeed);
        },

        reset() {
            this.setSpeed(1);
        },

        showSpeedNotification(speed) {
            // Create temporary notification
            const notification = document.createElement('div');
            notification.textContent = `Speed: ${speed.toFixed(2)}x`;
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                z-index: 10000;
                pointer-events: none;
                font-family: 'YouTube Sans', 'Roboto', sans-serif;
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 1000);
        }
    };

    // ==================== VOLUME MANAGER ====================
    const volumeManager = {
        setVolume(level) {
            const video = utils.getVideo();
            if (!video) return;
            
            level = Math.max(0, Math.min(100, level));
            video.volume = level / 100;
            state.currentVolume = level;
            
            if (config.volume.rememberVolume) {
                utils.storage.set('volume', level);
            }
            
            utils.log(`Volume: ${level}%`);
        },

        increaseVolume() {
            const newVolume = state.currentVolume + config.volume.mouseWheel.variation;
            this.setVolume(newVolume);
        },

        decreaseVolume() {
            const newVolume = state.currentVolume - config.volume.mouseWheel.variation;
            this.setVolume(newVolume);
        },

        applyBoost() {
            const video = utils.getVideo();
            const boost = config.volume.boosterLevel;
            
            if (!video || !boost || boost <= 1) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaElementSource(video);
                const gainNode = audioContext.createGain();
                
                gainNode.gain.value = boost;
                source.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                utils.log(`Volume boost: ${boost}x`);
            } catch (e) {
                // Already connected or error
            }
        }
    };

    // ==================== UI MANAGER ====================
    const uiManager = {
        // Theater mode
        enableTheaterMode() {
            const flexy = document.querySelector('ytd-watch-flexy');
            const button = document.querySelector('.ytp-size-button');
            
            if (flexy && !flexy.hasAttribute('theater')) {
                if (button) {
                    button.click();
                    state.isTheaterMode = true;
                    utils.log('Theater mode enabled');
                }
            }
        },

        // Cinema mode
        applyCinemaMode() {
            if (!config.appearance.cinemaMode.enabled) return;
            
            const { opacity, blurLevel, applyToFullscreen } = config.appearance.cinemaMode;
            const selector = applyToFullscreen ? 'ytd-watch-flexy' : 'ytd-watch-flexy:not([fullscreen])';
            
            const style = document.createElement('style');
            style.id = 'yt-enhancer-cinema';
            style.textContent = `
                ${selector} #page-manager {
                    background: rgba(0, 0, 0, ${opacity}) !important;
                }
                ${selector} #primary {
                    background: transparent !important;
                }
                ${blurLevel > 0 ? `
                    ${selector} #secondary {
                        filter: blur(${blurLevel}px);
                    }
                ` : ''}
            `;
            
            const existing = document.getElementById('yt-enhancer-cinema');
            if (existing) existing.remove();
            
            document.head.appendChild(style);
        },

        // Color filters
        applyColorFilters() {
            const filters = config.appearance.colorFilters;
            if (!filters.enabled) return;
            
            const filterString = [
                `brightness(${filters.brightness}%)`,
                `contrast(${filters.contrast}%)`,
                `saturate(${filters.saturation}%)`,
                `hue-rotate(${filters.hue}deg)`,
                `sepia(${filters.sepia}%)`,
                `grayscale(${filters.grayscale}%)`,
                `invert(${filters.invert}%)`
            ].join(' ');
            
            const style = document.createElement('style');
            style.id = 'yt-enhancer-filters';
            style.textContent = `
                video.html5-main-video {
                    filter: ${filterString} !important;
                }
            `;
            
            const existing = document.getElementById('yt-enhancer-filters');
            if (existing) existing.remove();
            
            document.head.appendChild(style);
        },

        // Hide elements
        hideElements() {
            const a = config.appearance;
            let css = '';
            
            // End screens and cards
            if (a.hideEndScreenCards) css += '.ytp-ce-element { display: none !important; }';
            if (a.hideAnnotations) css += '.annotation { display: none !important; }';
            if (a.hideInfoCards) css += '.ytp-cards-teaser, .ytp-cards-button { display: none !important; }';
            
            // Sidebar elements
            if (a.hideComments) css += 'ytd-comments { display: none !important; }';
            if (a.hideRelatedVideos) css += '#related { display: none !important; }';
            if (a.hideChat) css += 'ytd-live-chat-frame { display: none !important; }';
            if (a.hideShorts) css += 'ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts] { display: none !important; }';
            if (a.hideMerch) css += 'ytd-merch-shelf-renderer { display: none !important; }';
            if (a.hideChannelAvatars) css += 'ytd-video-owner-renderer img { display: none !important; }';
            if (a.hideVerifiedBadges) css += '.badge-style-type-verified { display: none !important; }';
            if (a.hideGamingShelf) css += 'ytd-game-details-renderer { display: none !important; }';
            
            // Player elements
            if (a.hideWatermark) css += '.ytp-watermark { display: none !important; }';
            if (a.hidePaidPromotions) css += '.ytp-paid-content-overlay { display: none !important; }';
            if (a.hidePlayerShadow) css += '.html5-video-player { box-shadow: none !important; }';
            if (a.hidePlayerGradient) css += '.ytp-gradient-top, .ytp-gradient-bottom { display: none !important; }';
            
            // Control buttons
            if (a.hideAutoplayButton) css += '.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"] { display: none !important; }';
            if (a.hideSubtitlesButton) css += '.ytp-subtitles-button { display: none !important; }';
            if (a.hideCardsButton) css += '.ytp-cards-button { display: none !important; }';
            if (a.hideMiniplayerButton) css += '.ytp-miniplayer-button { display: none !important; }';
            if (a.hideTheaterButton) css += '.ytp-size-button { display: none !important; }';
            if (a.hideCastButton) css += '.ytp-remote-button { display: none !important; }';
            
            if (css) {
                const style = document.createElement('style');
                style.id = 'yt-enhancer-hide';
                style.textContent = css;
                
                const existing = document.getElementById('yt-enhancer-hide');
                if (existing) existing.remove();
                
                document.head.appendChild(style);
                utils.log('Hidden elements applied');
            }
        },

        // Mouse cursor hiding
        setupCursorHiding() {
            if (!config.appearance.hideMouseCursor) return;
            
            const player = utils.getPlayer();
            if (!player) return;
            
            let hideTimeout;
            
            const hideCursor = () => {
                player.style.cursor = 'none';
            };
            
            const showCursor = () => {
                player.style.cursor = 'default';
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(hideCursor, config.appearance.cursorHideDelay);
            };
            
            player.addEventListener('mousemove', showCursor);
            player.addEventListener('mouseenter', showCursor);
            player.addEventListener('mouseleave', () => {
                clearTimeout(hideTimeout);
                player.style.cursor = 'default';
            });
        },

        // Custom CSS
        applyCustomCSS() {
            if (!config.advanced.customCSS.enabled || !config.advanced.customCSS.code) return;
            
            const style = document.createElement('style');
            style.id = 'yt-enhancer-custom-css';
            style.textContent = config.advanced.customCSS.code;
            
            const existing = document.getElementById('yt-enhancer-custom-css');
            if (existing) existing.remove();
            
            document.head.appendChild(style);
            utils.log('Custom CSS applied');
        }
    };

    // ==================== MINI PLAYER ====================
    const miniPlayer = {
        element: null,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        
        create() {
            if (!config.miniPlayer.enabled || this.element) return;
            
            const container = document.createElement('div');
            container.id = 'yt-enhancer-mini-player';
            
            const { width, height } = config.miniPlayer.size;
            const pos = config.miniPlayer.position;
            
            container.style.cssText = `
                position: fixed;
                width: ${width}px;
                height: ${height}px;
                z-index: 9999;
                display: none;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                border-radius: 8px;
                overflow: hidden;
                background: #000;
                cursor: ${config.miniPlayer.dragEnabled ? 'move' : 'default'};
            `;
            
            // Position
            if (pos.includes('top')) container.style.top = '20px';
            if (pos.includes('bottom')) container.style.bottom = '20px';
            if (pos.includes('left')) container.style.left = '20px';
            if (pos.includes('right')) container.style.right = '20px';
            
            if (config.miniPlayer.dragEnabled) {
                this.setupDragging(container);
            }
            
            document.body.appendChild(container);
            this.element = container;
            utils.log('Mini player created');
        },

        setupDragging(element) {
            element.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                const rect = element.getBoundingClientRect();
                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;
                element.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                
                e.preventDefault();
                element.style.left = (e.clientX - this.dragOffset.x) + 'px';
                element.style.top = (e.clientY - this.dragOffset.y) + 'px';
                element.style.right = 'auto';
                element.style.bottom = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    element.style.cursor = 'move';
                }
            });
        },

        activate() {
            if (!this.element || state.miniPlayerActive) return;
            
            const videoContainer = document.querySelector('#player-container');
            if (videoContainer && !state.isFullscreen) {
                state.miniPlayerActive = true;
                this.element.style.display = 'block';
                utils.log('Mini player activated');
            }
        },

        deactivate() {
            if (!this.element || !state.miniPlayerActive) return;
            
            state.miniPlayerActive = false;
            this.element.style.display = 'none';
            utils.log('Mini player deactivated');
        },

        handleScroll: utils.throttle(function() {
            if (!config.miniPlayer.enabled || !config.miniPlayer.launchOnScroll) return;
            
            const playerContainer = document.querySelector('#player-container, #player-theater-container');
            if (!playerContainer) return;
            
            const rect = playerContainer.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            const scrolledEnough = window.scrollY > config.miniPlayer.scrollTriggerOffset;
            
            if (scrolledEnough && !isVisible && !state.isFullscreen) {
                miniPlayer.activate();
            } else {
                miniPlayer.deactivate();
            }
        }, 100)
    };

    // ==================== KEYBOARD MANAGER ====================
    const keyboardManager = {
        init() {
            if (!config.keyboard.enabled) return;
            
            document.addEventListener('keydown', (e) => {
                // Don't trigger if typing
                if (e.target.tagName === 'INPUT' || 
                    e.target.tagName === 'TEXTAREA' ||
                    e.target.isContentEditable) {
                    return;
                }
                
                const key = e.key;
                const withShift = e.shiftKey;
                const withCtrl = e.ctrlKey;
                const shortcuts = config.keyboard.shortcuts;
                
                // Build key string
                let keyString = '';
                if (withCtrl) keyString += 'Ctrl+';
                if (withShift) keyString += 'Shift+';
                keyString += key;
                
                // Check shortcuts
                if (keyString === shortcuts.increaseSpeed || key === shortcuts.increaseSpeed) {
                    e.preventDefault();
                    playbackManager.increaseSpeed();
                }
                else if (keyString === shortcuts.decreaseSpeed || key === shortcuts.decreaseSpeed) {
                    e.preventDefault();
                    playbackManager.decreaseSpeed();
                }
                else if (keyString === shortcuts.resetSpeed || key === shortcuts.resetSpeed) {
                    e.preventDefault();
                    playbackManager.reset();
                }
                else if (keyString === shortcuts.cycleQuality || key === shortcuts.cycleQuality) {
                    e.preventDefault();
                    qualityManager.cycleQuality();
                }
                else if (keyString === shortcuts.theaterMode || key === shortcuts.theaterMode) {
                    e.preventDefault();
                    const button = document.querySelector('.ytp-size-button');
                    if (button) button.click();
                }
                else if (keyString === shortcuts.miniPlayer || key === shortcuts.miniPlayer) {
                    e.preventDefault();
                    if (state.miniPlayerActive) {
                        miniPlayer.deactivate();
                    } else {
                        miniPlayer.activate();
                    }
                }
                else if (keyString === shortcuts.pictureInPicture || key === shortcuts.pictureInPicture) {
                    e.preventDefault();
                    videoTransform.togglePiP();
                }
                else if (keyString === shortcuts.takeScreenshot || key === shortcuts.takeScreenshot) {
                    e.preventDefault();
                    screenshotManager.take();
                }
                else if (keyString === shortcuts.toggleLoop || key === shortcuts.toggleLoop) {
                    e.preventDefault();
                    loopManager.toggle();
                }
                else if (keyString === shortcuts.rotateVideo || key === shortcuts.rotateVideo) {
                    e.preventDefault();
                    videoTransform.rotate();
                }
                else if (keyString === shortcuts.flipVideo || key === shortcuts.flipVideo) {
                    e.preventDefault();
                    videoTransform.flip();
                }
            });
            
            utils.log('Keyboard shortcuts initialized');
        }
    };

    // ==================== VIDEO TRANSFORM ====================
    const videoTransform = {
        rotate() {
            if (!config.advanced.allowRotate) return;
            
            state.rotation = (state.rotation + 90) % 360;
            this.applyTransform();
            utils.log(`Rotation: ${state.rotation}°`);
        },

        flip() {
            if (!config.advanced.allowFlip) return;
            
            state.flipped = !state.flipped;
            this.applyTransform();
            utils.log(`Flipped: ${state.flipped}`);
        },

        applyTransform() {
            const video = utils.getVideo();
            if (!video) return;
            
            let transform = `rotate(${state.rotation}deg)`;
            if (state.flipped) {
                transform += ' scaleX(-1)';
            }
            
            video.style.transform = transform;
        },

        async togglePiP() {
            const video = utils.getVideo();
            if (!video) return;
            
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                    state.isPiP = false;
                } else {
                    await video.requestPictureInPicture();
                    state.isPiP = true;
                    qualityManager.applyAutoQuality();
                }
            } catch (e) {
                utils.log('PiP error', e);
            }
        }
    };

    // ==================== SCREENSHOT MANAGER ====================
    const screenshotManager = {
        take() {
            const video = utils.getVideo();
            if (!video) return;
            
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const title = document.querySelector('h1.title')?.textContent.trim().slice(0, 50) || 'video';
                
                a.href = url;
                a.download = `youtube-${title}-${timestamp}.png`;
                a.click();
                
                URL.revokeObjectURL(url);
                utils.log('Screenshot saved');
            });
        }
    };

    // ==================== LOOP MANAGER ====================
    const loopManager = {
        toggle() {
            const video = utils.getVideo();
            if (!video) return;
            
            video.loop = !video.loop;
            utils.log(`Loop: ${video.loop ? 'ON' : 'OFF'}`);
            
            // Show notification
            this.showNotification(video.loop);
        },

        showNotification(enabled) {
            const notification = document.createElement('div');
            notification.textContent = `Loop ${enabled ? 'Enabled' : 'Disabled'}`;
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 18px;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 1500);
        }
    };

    // ==================== MOUSE WHEEL MANAGER ====================
    const mouseWheelManager = {
        init() {
            const player = utils.getPlayer();
            if (!player) return;
            
            player.addEventListener('wheel', (e) => {
                const speedControl = config.playbackSpeed.mouseWheel;
                const volumeControl = config.volume.mouseWheel;
                
                // Check if shift key is required for speed control
                if (speedControl.enabled && 
                    (!speedControl.requireShiftKey || e.shiftKey)) {
                    e.preventDefault();
                    
                    const direction = speedControl.reverseDirection ? -1 : 1;
                    if (e.deltaY < 0) {
                        playbackManager.increaseSpeed();
                    } else {
                        playbackManager.decreaseSpeed();
                    }
                    return;
                }
                
                // Volume control (default if speed control not triggered)
                if (volumeControl.enabled && !e.shiftKey) {
                    e.preventDefault();
                    
                    const direction = volumeControl.reverseDirection ? -1 : 1;
                    if ((e.deltaY < 0 && direction === 1) || (e.deltaY > 0 && direction === -1)) {
                        volumeManager.increaseVolume();
                    } else {
                        volumeManager.decreaseVolume();
                    }
                }
            }, { passive: false });
            
            utils.log('Mouse wheel controls initialized');
        }
    };

    // ==================== AUTOPLAY MANAGER ====================
    const autoplayManager = {
        init() {
            if (!config.autoplay.disable && 
                !config.autoplay.preventInBackgroundTabs &&
                !config.autoplay.preventForEmbedded) {
                return;
            }
            
            const video = utils.getVideo();
            if (!video) return;
            
            // Prevent autoplay based on conditions
            const shouldPrevent = 
                config.autoplay.disable ||
                (config.autoplay.preventInBackgroundTabs && document.hidden) ||
                (config.autoplay.preventForEmbedded && utils.isEmbedded()) ||
                (config.autoplay.preventOnPlaylists && utils.isPlaylist());
            
            if (shouldPrevent) {
                video.pause();
                utils.log('Autoplay prevented');
                
                // Mark as user-initiated on first interaction
                const markUserInitiated = () => {
                    video.setAttribute('user-initiated', 'true');
                    video.removeEventListener('play', preventAutoplay);
                };
                
                const preventAutoplay = (e) => {
                    if (!video.hasAttribute('user-initiated')) {
                        video.pause();
                    }
                };
                
                video.addEventListener('play', preventAutoplay);
                video.addEventListener('click', markUserInitiated, { once: true });
                document.addEventListener('keydown', markUserInitiated, { once: true });
            }
            
            // Tab change handling
            if (config.autoplay.pauseOnTabChange || config.autoplay.stopOnTabChange) {
                document.addEventListener('visibilitychange', () => {
                    const video = utils.getVideo();
                    if (!video) return;
                    
                    if (document.hidden) {
                        if (config.autoplay.stopOnTabChange) {
                            video.pause();
                            video.currentTime = 0;
                        } else if (config.autoplay.pauseOnTabChange) {
                            video.pause();
                        }
                    }
                });
            }
        }
    };

    // ==================== FULLSCREEN MANAGER ====================
    const fullscreenManager = {
        init() {
            document.addEventListener('fullscreenchange', () => {
                state.isFullscreen = !!document.fullscreenElement;
                qualityManager.applyAutoQuality();
                utils.log(`Fullscreen: ${state.isFullscreen}`);
            });

            // PiP detection
            document.addEventListener('enterpictureinpicture', () => {
                state.isPiP = true;
                qualityManager.applyAutoQuality();
                utils.log('Entered PiP');
            });

            document.addEventListener('leavepictureinpicture', () => {
                state.isPiP = false;
                qualityManager.applyAutoQuality();
                utils.log('Left PiP');
            });
        }
    };

    // ==================== CUSTOM SCRIPT MANAGER ====================
    const customScriptManager = {
        execute() {
            if (!config.advanced.customScript.enabled || 
                !config.advanced.customScript.code) {
                return;
            }
            
            try {
                // Create isolated function context
                const customFunction = new Function(
                    'utils', 
                    'state', 
                    'config',
                    config.advanced.customScript.code
                );
                
                customFunction(utils, state, config);
                utils.log('Custom script executed');
            } catch (e) {
                utils.log('Custom script error', e);
            }
        }
    };

    // ==================== MAIN INITIALIZATION ====================
    async function initializeEnhancer() {
        if (state.initialized || !config.enableEnhancer) return;
        
        utils.log('Initializing YouTube Enhancer v' + config.ver);
        
        try {
            // Wait for critical elements
            await utils.waitForElement('video.html5-main-video');
            await utils.waitForElement('.html5-video-player');
            
            state.player = utils.getPlayer();
            state.video = utils.getVideo();
            
            if (!state.player || !state.video) {
                throw new Error('Player or video not found');
            }
            
            // Load saved settings
            if (config.playbackSpeed.rememberSpeed) {
                const savedSpeed = utils.storage.get('playbackSpeed', config.playbackSpeed.defaultSpeed);
                state.currentSpeed = savedSpeed;
            }
            
            if (config.volume.rememberVolume) {
                const savedVolume = utils.storage.get('volume', config.volume.defaultLevel);
                state.currentVolume = savedVolume;
            }
            
            // Apply initial settings
            if (config.volume.defaultLevel !== null) {
                volumeManager.setVolume(state.currentVolume);
            }
            
            if (config.playbackSpeed.defaultSpeed !== 1) {
                playbackManager.setSpeed(state.currentSpeed);
            }
            
            // Apply quality
            qualityManager.applyAutoQuality();
            
            // Apply UI modifications
            uiManager.hideElements();
            uiManager.applyCinemaMode();
            uiManager.applyColorFilters();
            uiManager.applyCustomCSS();
            uiManager.setupCursorHiding();
            
            // Theater mode
            if (config.advanced.autoTheaterMode) {
                setTimeout(() => uiManager.enableTheaterMode(), 1000);
            }
            
            // Loop
            if (config.advanced.loopEnabled) {
                state.video.loop = true;
            }
            
            // Initialize features
            keyboardManager.init();
            fullscreenManager.init();
            autoplayManager.init();
            
            // Volume boost
            if (config.volume.boosterLevel > 1) {
                setTimeout(() => volumeManager.applyBoost(), 500);
            }
            
            // Mini player
            if (config.miniPlayer.enabled) {
                miniPlayer.create();
                if (config.miniPlayer.launchOnScroll) {
                    window.addEventListener('scroll', miniPlayer.handleScroll);
                }
            }
            
            // Mouse wheel controls
            setTimeout(() => mouseWheelManager.init(), 500);
            
            // Custom script
            setTimeout(() => customScriptManager.execute(), 1000);
            
            state.initialized = true;
            state.navigationCount++;
            utils.log(`Initialized successfully (navigation #${state.navigationCount})`);
            
        } catch (error) {
            utils.log('Initialization error', error);
        }
    }

    // ==================== NAVIGATION OBSERVER ====================
    function setupNavigationObserver() {
        const observer = new MutationObserver(utils.debounce(() => {
            const currentUrl = location.href;
            
            if (currentUrl !== state.lastUrl) {
                state.lastUrl = currentUrl;
                state.initialized = false;
                
                if (currentUrl.includes('/watch')) {
                    utils.log('Navigation detected');
                    setTimeout(initializeEnhancer, 500);
                }
            }
        }, 100));
        
        const target = document.querySelector('ytd-app') || document.documentElement;
        observer.observe(target, {
            childList: true,
            subtree: true
        });
        
        utils.log('Navigation observer active');
    }

    // ==================== START ====================
    function start() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initializeEnhancer, 1000);
            });
        } else {
            setTimeout(initializeEnhancer, 1000);
        }
        
        setupNavigationObserver();
        utils.log(`YouTube Enhancer v${config.ver} loaded`);
    }

    // Start the script
    start();

})();
