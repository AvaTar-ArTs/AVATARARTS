// YouTube Enhancer Script - Version 8.0.0
// Improved with proper YouTube SPA handling, MutationObserver, and real API integration

(function() {
    'use strict';
    
    const config = {
        // General settings
        ver: "8.0.0",
        enableEnhancer: true,
        themeColor: "white",

        // Video player settings
        minWidthVideoContainerEnabled: true,
        autoVideoQuality: "hd720", // Use YouTube's quality format: "hd720", "hd1080", "hd1440", "hd2160"
        autoVideoQualityFullScreen: "hd1080",
        playbackSpeedDefault: 1,
        playbackSpeedVariation: 0.1,
        volumeDefault: 50,
        volumeBooster: 3, // Max 10x boost
        cinemaModeEnabled: true,
        cinemaModeOpacity: 0.85,
        
        // Controls and UI settings
        controlsInsideVideo: true,
        controlsVisible: true,
        controlBarLocation: "below",
        autoExpandVideo: true,
        autoTheaterMode: true,

        // Autoplay settings
        autoPause: false,
        disableAutoplay: true,
        preventAutoplayInBackgroundTabs: true,
        preventAutoplayInForegroundTab: false,

        // Additional settings
        showAnnotations: false,
        hideAnnotations: true,
        hideSidebar: {
            comments: false,
            relatedVideos: true,
            shorts: true,
            endCards: true,
            infoCards: false
        },

        // Mini Player Settings
        miniPlayerEnabled: true,
        miniPlayerSize: { width: 400, height: 225 },
        miniPlayerPosition: "bottom-right",
        miniPlayerTriggerOffset: 500, // Pixels scrolled before mini player activates

        // Volume control
        controlVolumeWithMouseWheel: true,
        volumeVariation: 5,
        reverseMouseWheelDirection: false,

        // Keyboard shortcuts
        keyboardShortcutsEnabled: true,

        // Advanced playback options
        forceStandardFrameRates: false,
        forceMP4: true,
        loopEnabled: false,

        // Appearance and performance
        autoSortComments: true,
        hideComments: false,
        hideChat: false,
        useExpandedViewport: true,
        maxRenderingLimit: false,

        // Pop-up player settings
        popUpPlayerSize: { width: 640, height: 360 }
    };

    // State management
    const state = {
        initialized: false,
        player: null,
        video: null,
        miniPlayerActive: false,
        originalScrollPosition: 0,
        isFullscreen: false,
        lastQualityChange: 0
    };

    // Utility functions
    const utils = {
        // Wait for element to exist in DOM
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

        // Debounce function for performance
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

        // Throttle function for frequent events
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

        // Get YouTube player API
        getPlayer() {
            return document.querySelector('.html5-video-player') || 
                   document.getElementById('movie_player');
        },

        // Get video element
        getVideo() {
            return document.querySelector('video.html5-main-video') ||
                   document.querySelector('video');
        },

        // Log with timestamp
        log(message, data = null) {
            const timestamp = new Date().toISOString();
            console.log(`[YT Enhancer ${timestamp}] ${message}`, data || '');
        }
    };

    // Video quality management
    const qualityManager = {
        // Get available quality levels
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

        // Set video quality
        setQuality(quality) {
            const player = utils.getPlayer();
            if (!player) {
                utils.log('Player not found for quality change');
                return false;
            }

            try {
                // Prevent rapid quality changes
                const now = Date.now();
                if (now - state.lastQualityChange < 1000) return false;
                state.lastQualityChange = now;

                const availableQualities = this.getAvailableQualities();
                
                if (availableQualities.includes(quality)) {
                    if (player.setPlaybackQualityRange) {
                        player.setPlaybackQualityRange(quality);
                    }
                    if (player.setPlaybackQuality) {
                        player.setPlaybackQuality(quality);
                    }
                    utils.log(`Quality set to: ${quality}`);
                    return true;
                } else {
                    utils.log(`Quality ${quality} not available. Available: ${availableQualities.join(', ')}`);
                    return false;
                }
            } catch (e) {
                utils.log('Error setting quality', e);
                return false;
            }
        },

        // Apply quality based on fullscreen state
        applyAutoQuality() {
            const quality = state.isFullscreen ? 
                          config.autoVideoQualityFullScreen : 
                          config.autoVideoQuality;
            
            if (quality) {
                // Delay quality change to allow player to initialize
                setTimeout(() => this.setQuality(quality), 500);
            }
        }
    };

    // Playback speed management
    const playbackManager = {
        setSpeed(speed) {
            const video = utils.getVideo();
            if (video) {
                video.playbackRate = speed;
                utils.log(`Playback speed: ${speed}x`);
            }
        },

        increaseSpeed() {
            const video = utils.getVideo();
            if (video) {
                const newSpeed = Math.min(16, video.playbackRate + config.playbackSpeedVariation);
                this.setSpeed(newSpeed);
            }
        },

        decreaseSpeed() {
            const video = utils.getVideo();
            if (video) {
                const newSpeed = Math.max(0.07, video.playbackRate - config.playbackSpeedVariation);
                this.setSpeed(newSpeed);
            }
        },

        reset() {
            this.setSpeed(1);
        }
    };

    // Volume management
    const volumeManager = {
        setVolume(level) {
            const video = utils.getVideo();
            if (video) {
                video.volume = Math.max(0, Math.min(1, level / 100));
                utils.log(`Volume: ${level}%`);
            }
        },

        increaseVolume() {
            const video = utils.getVideo();
            if (video) {
                const newVolume = Math.min(100, (video.volume * 100) + config.volumeVariation);
                this.setVolume(newVolume);
            }
        },

        decreaseVolume() {
            const video = utils.getVideo();
            if (video) {
                const newVolume = Math.max(0, (video.volume * 100) - config.volumeVariation);
                this.setVolume(newVolume);
            }
        },

        applyBoost() {
            const video = utils.getVideo();
            if (!video || !config.volumeBooster || config.volumeBooster <= 1) return;

            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaElementSource(video);
                const gainNode = audioContext.createGain();
                
                gainNode.gain.value = config.volumeBooster;
                source.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                utils.log(`Volume boost applied: ${config.volumeBooster}x`);
            } catch (e) {
                utils.log('Could not apply volume boost', e);
            }
        }
    };

    // UI manipulation
    const uiManager = {
        // Enable theater mode
        enableTheaterMode() {
            const flexy = document.querySelector('ytd-watch-flexy');
            const button = document.querySelector('.ytp-size-button');
            
            if (flexy && !flexy.hasAttribute('theater')) {
                if (button) {
                    button.click();
                    utils.log('Theater mode enabled');
                }
            }
        },

        // Toggle cinema mode (dim background)
        toggleCinemaMode(enabled = true) {
            if (!enabled) return;
            
            const opacity = config.cinemaModeOpacity;
            const style = document.createElement('style');
            style.id = 'yt-enhancer-cinema-mode';
            style.textContent = `
                ytd-watch-flexy:not([fullscreen]) #page-manager {
                    background: rgba(0, 0, 0, ${opacity}) !important;
                }
                ytd-watch-flexy:not([fullscreen]) #primary {
                    background: transparent !important;
                }
            `;
            
            const existing = document.getElementById('yt-enhancer-cinema-mode');
            if (existing) existing.remove();
            
            document.head.appendChild(style);
            utils.log('Cinema mode enabled');
        },

        // Hide sidebar elements
        hideSidebarElements() {
            const style = document.createElement('style');
            style.id = 'yt-enhancer-sidebar-hide';
            
            let css = '';
            if (config.hideSidebar.comments) {
                css += 'ytd-comments { display: none !important; }';
            }
            if (config.hideSidebar.relatedVideos) {
                css += '#related { display: none !important; }';
            }
            if (config.hideSidebar.shorts) {
                css += 'ytd-reel-shelf-renderer { display: none !important; }';
            }
            if (config.hideSidebar.endCards) {
                css += '.ytp-ce-element { display: none !important; }';
            }
            if (config.hideSidebar.infoCards) {
                css += '.ytp-cards-teaser { display: none !important; }';
            }
            
            style.textContent = css;
            
            const existing = document.getElementById('yt-enhancer-sidebar-hide');
            if (existing) existing.remove();
            
            if (css) {
                document.head.appendChild(style);
                utils.log('Sidebar elements hidden');
            }
        },

        // Expand video player
        expandPlayer() {
            if (!config.useExpandedViewport) return;
            
            const style = document.createElement('style');
            style.id = 'yt-enhancer-expand';
            style.textContent = `
                ytd-watch-flexy[theater] #player-theater-container {
                    max-width: 100% !important;
                }
            `;
            
            const existing = document.getElementById('yt-enhancer-expand');
            if (existing) existing.remove();
            
            document.head.appendChild(style);
        }
    };

    // Mini player functionality
    const miniPlayer = {
        element: null,
        
        create() {
            if (!config.miniPlayerEnabled || this.element) return;
            
            const container = document.createElement('div');
            container.id = 'yt-enhancer-mini-player';
            container.style.cssText = `
                position: fixed;
                width: ${config.miniPlayerSize.width}px;
                height: ${config.miniPlayerSize.height}px;
                z-index: 9999;
                display: none;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                border-radius: 8px;
                overflow: hidden;
                background: #000;
            `;
            
            // Position based on config
            const pos = config.miniPlayerPosition;
            if (pos.includes('top')) container.style.top = '20px';
            if (pos.includes('bottom')) container.style.bottom = '20px';
            if (pos.includes('left')) container.style.left = '20px';
            if (pos.includes('right')) container.style.right = '20px';
            
            document.body.appendChild(container);
            this.element = container;
            
            utils.log('Mini player created');
        },

        activate() {
            if (!this.element || state.miniPlayerActive) return;
            
            const video = utils.getVideo();
            const player = document.querySelector('#player-container');
            
            if (video && player) {
                state.miniPlayerActive = true;
                this.element.style.display = 'block';
                this.element.appendChild(player);
                utils.log('Mini player activated');
            }
        },

        deactivate() {
            if (!this.element || !state.miniPlayerActive) return;
            
            const player = this.element.querySelector('#player-container');
            const originalContainer = document.querySelector('#player-theater-container') ||
                                     document.querySelector('ytd-watch-flexy');
            
            if (player && originalContainer) {
                state.miniPlayerActive = false;
                this.element.style.display = 'none';
                originalContainer.insertBefore(player, originalContainer.firstChild);
                utils.log('Mini player deactivated');
            }
        },

        handleScroll: utils.throttle(function() {
            if (!config.miniPlayerEnabled) return;
            
            const playerContainer = document.querySelector('#player-container');
            if (!playerContainer) return;
            
            const rect = playerContainer.getBoundingClientRect();
            const isPlayerVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (window.scrollY > config.miniPlayerTriggerOffset && !isPlayerVisible) {
                miniPlayer.activate();
            } else {
                miniPlayer.deactivate();
            }
        }, 100)
    };

    // Keyboard shortcuts
    const keyboardManager = {
        init() {
            if (!config.keyboardShortcutsEnabled) return;
            
            document.addEventListener('keydown', (e) => {
                // Don't trigger if user is typing in an input
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                switch(e.key) {
                    case '>':
                        playbackManager.increaseSpeed();
                        break;
                    case '<':
                        playbackManager.decreaseSpeed();
                        break;
                    case '\\':
                        playbackManager.reset();
                        break;
                }
            });
            
            utils.log('Keyboard shortcuts initialized');
        }
    };

    // Mouse wheel controls
    const mouseWheelManager = {
        init() {
            const player = utils.getPlayer();
            if (!player || !config.controlVolumeWithMouseWheel) return;
            
            player.addEventListener('wheel', (e) => {
                e.preventDefault();
                
                const direction = config.reverseMouseWheelDirection ? -1 : 1;
                
                if (e.deltaY < 0) {
                    volumeManager.increaseVolume();
                } else {
                    volumeManager.decreaseVolume();
                }
            }, { passive: false });
            
            utils.log('Mouse wheel controls initialized');
        }
    };

    // Autoplay prevention
    const autoplayManager = {
        init() {
            if (!config.disableAutoplay) return;
            
            const video = utils.getVideo();
            if (video) {
                // Pause autoplay
                video.addEventListener('play', (e) => {
                    if (!video.hasAttribute('user-initiated-play')) {
                        video.pause();
                        utils.log('Autoplay prevented');
                    }
                }, { once: true });
                
                // Mark user-initiated plays
                video.addEventListener('click', () => {
                    video.setAttribute('user-initiated-play', 'true');
                });
            }
        }
    };

    // Fullscreen detection
    const fullscreenManager = {
        init() {
            document.addEventListener('fullscreenchange', () => {
                state.isFullscreen = !!document.fullscreenElement;
                qualityManager.applyAutoQuality();
                utils.log(`Fullscreen: ${state.isFullscreen}`);
            });
        }
    };

    // Main initialization
    async function initializeEnhancer() {
        if (state.initialized || !config.enableEnhancer) return;
        
        utils.log('Initializing YouTube Enhancer...');
        
        try {
            // Wait for critical elements
            await utils.waitForElement('video.html5-main-video');
            await utils.waitForElement('.html5-video-player');
            
            state.player = utils.getPlayer();
            state.video = utils.getVideo();
            
            if (!state.player || !state.video) {
                throw new Error('Player or video not found');
            }
            
            // Apply initial settings
            if (config.volumeDefault !== null) {
                volumeManager.setVolume(config.volumeDefault);
            }
            
            if (config.playbackSpeedDefault !== 1) {
                playbackManager.setSpeed(config.playbackSpeedDefault);
            }
            
            // Apply quality settings
            qualityManager.applyAutoQuality();
            
            // Initialize UI modifications
            uiManager.hideSidebarElements();
            uiManager.expandPlayer();
            
            if (config.cinemaModeEnabled) {
                uiManager.toggleCinemaMode(true);
            }
            
            if (config.autoTheaterMode) {
                // Delay theater mode to ensure page is ready
                setTimeout(() => uiManager.enableTheaterMode(), 1000);
            }
            
            // Initialize features
            keyboardManager.init();
            fullscreenManager.init();
            autoplayManager.init();
            
            // Initialize mini player
            if (config.miniPlayerEnabled) {
                miniPlayer.create();
                window.addEventListener('scroll', miniPlayer.handleScroll);
            }
            
            // Initialize mouse wheel controls after player is ready
            setTimeout(() => mouseWheelManager.init(), 500);
            
            state.initialized = true;
            utils.log('YouTube Enhancer initialized successfully');
            
        } catch (error) {
            utils.log('Initialization error', error);
        }
    }

    // YouTube SPA navigation handler
    function setupNavigationObserver() {
        let lastUrl = location.href;
        
        // Use MutationObserver to detect YouTube navigation
        const observer = new MutationObserver(utils.debounce(() => {
            const currentUrl = location.href;
            
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                
                // Reset state on navigation
                state.initialized = false;
                
                // Check if we're on a video page
                if (currentUrl.includes('/watch')) {
                    utils.log('Navigation detected, reinitializing...');
                    setTimeout(initializeEnhancer, 500);
                }
            }
        }, 100));
        
        // Observe for navigation changes
        observer.observe(document.querySelector('ytd-app') || document.documentElement, {
            childList: true,
            subtree: true
        });
        
        utils.log('Navigation observer setup complete');
    }

    // Start the enhancer
    function start() {
        // Initial load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initializeEnhancer, 1000);
            });
        } else {
            setTimeout(initializeEnhancer, 1000);
        }
        
        // Setup navigation observer for SPA
        setupNavigationObserver();
        
        utils.log(`YouTube Enhancer v${config.ver} loaded`);
    }

    // Start the script
    start();

})();
