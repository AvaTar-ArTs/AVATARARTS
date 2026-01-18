# YouTube Enhancer - Quick Reference Guide

## Installation (TamperMonkey/GreaseMonkey)

1. Copy the improved script: `youtube-enhancer-improved.js`
2. Add this header at the very top:

```javascript
// ==UserScript==
// @name         YouTube Enhancer Pro
// @namespace    http://tampermonkey.net/
// @version      8.0.0
// @description  Enhanced YouTube experience with quality control, mini player, and more
// @author       Your Name
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// ==/UserScript==
```

---

## Quick Configuration Reference

### Video Quality Settings

```javascript
// Available quality options:
autoVideoQuality: "hd720"        // 720p HD
autoVideoQuality: "hd1080"       // 1080p Full HD
autoVideoQuality: "hd1440"       // 1440p 2K
autoVideoQuality: "hd2160"       // 2160p 4K
autoVideoQuality: "highres"      // Highest available

// Different quality for fullscreen
autoVideoQualityFullScreen: "hd1080"
```

### Playback Speed

```javascript
playbackSpeedDefault: 1.0        // Normal speed
playbackSpeedDefault: 1.25       // 25% faster
playbackSpeedDefault: 1.5        // 50% faster
playbackSpeedDefault: 2.0        // 2x speed

playbackSpeedVariation: 0.1      // Increment/decrement by 0.1
playbackSpeedVariation: 0.25     // Increment/decrement by 0.25
```

### Volume Settings

```javascript
volumeDefault: 50                // 50% volume
volumeDefault: 75                // 75% volume
volumeDefault: 100               // 100% volume

volumeBooster: 1                 // No boost (normal)
volumeBooster: 2                 // 2x boost
volumeBooster: 5                 // 5x boost
volumeBooster: 10                // 10x boost (maximum)

volumeVariation: 5               // Change volume by 5%
volumeVariation: 10              // Change volume by 10%
```

### UI Display Options

```javascript
// Theater mode (wider player)
autoTheaterMode: true            // Enable automatically
autoTheaterMode: false           // Disable

// Cinema mode (dim background)
cinemaModeEnabled: true          // Enable dim background
cinemaModeOpacity: 0.85          // 85% opacity (darker)
cinemaModeOpacity: 0.5           // 50% opacity (lighter)

// Expanded viewport
useExpandedViewport: true        // Maximum width in theater
useExpandedViewport: false       // Standard width
```

### Mini Player Settings

```javascript
// Enable/disable mini player
miniPlayerEnabled: true          // Enable mini player
miniPlayerEnabled: false         // Disable mini player

// Mini player size
miniPlayerSize: { 
    width: 400,                  // Width in pixels
    height: 225                  // Height in pixels (16:9 ratio)
}

// Smaller mini player
miniPlayerSize: { 
    width: 320, 
    height: 180 
}

// Larger mini player
miniPlayerSize: { 
    width: 640, 
    height: 360 
}

// Position on screen
miniPlayerPosition: "bottom-right"
miniPlayerPosition: "bottom-left"
miniPlayerPosition: "top-right"
miniPlayerPosition: "top-left"

// Trigger point (pixels scrolled)
miniPlayerTriggerOffset: 500     // Activate after 500px scroll
miniPlayerTriggerOffset: 1000    // Activate after 1000px scroll
```

### Autoplay Control

```javascript
// Prevent videos from autoplaying
disableAutoplay: true            // Always prevent autoplay
disableAutoplay: false           // Allow autoplay

// Background tab autoplay
preventAutoplayInBackgroundTabs: true   // Prevent in bg tabs
preventAutoplayInBackgroundTabs: false  // Allow in bg tabs

// Foreground tab autoplay
preventAutoplayInForegroundTab: true    // Prevent in active tab
preventAutoplayInForegroundTab: false   // Allow in active tab
```

### Hide Elements

```javascript
hideSidebar: {
    comments: false,             // Show comments
    comments: true,              // Hide comments
    
    relatedVideos: false,        // Show related videos
    relatedVideos: true,         // Hide related videos
    
    shorts: false,               // Show Shorts
    shorts: true,                // Hide Shorts
    
    endCards: false,             // Show end cards
    endCards: true,              // Hide end cards
    
    infoCards: false,            // Show info cards
    infoCards: true              // Hide info cards
}

// Alternative: Hide everything
hideComments: true,
hideChat: true,
// Then configure specific items in hideSidebar
```

### Mouse Wheel Controls

```javascript
// Enable mouse wheel volume control
controlVolumeWithMouseWheel: true
controlVolumeWithMouseWheel: false

// Reverse scroll direction
reverseMouseWheelDirection: false  // Up=louder, Down=quieter
reverseMouseWheelDirection: true   // Up=quieter, Down=louder

// Volume change per scroll
volumeVariation: 5               // 5% per scroll
volumeVariation: 10              // 10% per scroll
```

### Advanced Options

```javascript
// Force specific video format
forceMP4: true                   // Prefer MP4 over WebM
forceMP4: false                  // Use default format

// Force standard frame rates
forceStandardFrameRates: true    // Use 24/25/30 FPS
forceStandardFrameRates: false   // Allow 48/50/60 FPS

// Keyboard shortcuts
keyboardShortcutsEnabled: true   // Enable custom shortcuts
keyboardShortcutsEnabled: false  // Disable custom shortcuts

// Loop video
loopEnabled: true                // Loop current video
loopEnabled: false               // No loop
```

---

## Keyboard Shortcuts

| Key | Action | Notes |
|-----|--------|-------|
| `>` | Increase playback speed | By `playbackSpeedVariation` |
| `<` | Decrease playback speed | By `playbackSpeedVariation` |
| `\` | Reset speed to 1x | Back to normal |
| Mouse wheel up | Increase volume | Over video player |
| Mouse wheel down | Decrease volume | Over video player |

**Note:** Standard YouTube shortcuts still work (Space, K, J, L, F, M, etc.)

---

## Common Configuration Presets

### Preset 1: Speed Learner
*For watching tutorials and educational content faster*

```javascript
autoVideoQuality: "hd1080",
playbackSpeedDefault: 1.5,
playbackSpeedVariation: 0.1,
volumeDefault: 75,
volumeBooster: 2,
autoTheaterMode: true,
hideSidebar: {
    relatedVideos: true,
    shorts: true,
    endCards: true
}
```

### Preset 2: Clean Viewer
*Minimal distractions, focus on content*

```javascript
autoVideoQuality: "hd1080",
playbackSpeedDefault: 1.0,
volumeDefault: 100,
cinemaModeEnabled: true,
cinemaModeOpacity: 0.9,
autoTheaterMode: true,
miniPlayerEnabled: true,
hideSidebar: {
    relatedVideos: true,
    shorts: true,
    endCards: true,
    infoCards: true
}
```

### Preset 3: Power User
*Maximum control and features*

```javascript
autoVideoQuality: "hd1440",
autoVideoQualityFullScreen: "hd2160",
playbackSpeedDefault: 1.25,
playbackSpeedVariation: 0.05,
volumeDefault: 80,
volumeBooster: 3,
cinemaModeEnabled: true,
autoTheaterMode: true,
miniPlayerEnabled: true,
miniPlayerSize: { width: 640, height: 360 },
controlVolumeWithMouseWheel: true,
keyboardShortcutsEnabled: true,
hideSidebar: {
    shorts: true,
    endCards: true
}
```

### Preset 4: Podcast Listener
*Audio-focused, minimal video controls*

```javascript
autoVideoQuality: "hd720",  // Lower quality to save bandwidth
playbackSpeedDefault: 1.5,
volumeDefault: 100,
volumeBooster: 5,
miniPlayerEnabled: true,
miniPlayerSize: { width: 320, height: 180 },
miniPlayerPosition: "bottom-right",
miniPlayerTriggerOffset: 100,  // Activate quickly
hideSidebar: {
    relatedVideos: true,
    shorts: true,
    endCards: true
}
```

### Preset 5: Music Listener
*Optimized for music videos*

```javascript
autoVideoQuality: "hd1080",
autoVideoQualityFullScreen: "hd2160",
playbackSpeedDefault: 1.0,     // Normal speed for music
volumeDefault: 60,
volumeBooster: 2,
cinemaModeEnabled: true,
cinemaModeOpacity: 0.95,
autoTheaterMode: true,
loopEnabled: true,             // Loop songs
disableAutoplay: false,        // Allow autoplay for playlists
hideSidebar: {
    comments: true,            // Hide distracting comments
    shorts: true
}
```

---

## Troubleshooting Quick Fixes

### Problem: Quality not changing
```javascript
// Try these formats instead:
autoVideoQuality: "hd720"   // Not "720p"
autoVideoQuality: "hd1080"  // Not "1080p"
autoVideoQuality: "large"   // 480p
autoVideoQuality: "medium"  // 360p
```

### Problem: Mini player not working
```javascript
// Increase trigger offset
miniPlayerTriggerOffset: 100  // Activates sooner

// Try different position
miniPlayerPosition: "bottom-right"  // More visible

// Check if enabled
miniPlayerEnabled: true
```

### Problem: Volume boost not working
```javascript
// Reduce boost value
volumeBooster: 2  // Start small

// Note: Requires page interaction first
// Click anywhere on page before playback
```

### Problem: Theater mode not enabling
```javascript
// Add delay
autoTheaterMode: true

// Check in script output:
// "Theater mode enabled" should appear in console
```

### Problem: Script stops after navigation
```javascript
// This is fixed in v8.0.0
// If still happening, check browser console for errors
// May need to update YouTube selectors
```

---

## Performance Tips

1. **Disable unused features** - If you don't use mini player, set `miniPlayerEnabled: false`
2. **Reduce quality for battery** - Lower quality = less CPU usage
3. **Limit volume boost** - High boost values (>5) can cause audio artifacts
4. **Don't hide everything** - Only hide what bothers you

---

## Testing Your Configuration

After changing config:

1. Reload YouTube completely (Ctrl+Shift+R)
2. Open browser console (F12)
3. Look for: "YouTube Enhancer initialized successfully"
4. Navigate to a video
5. Check console for feature activations

---

## Update Checklist

When YouTube updates and breaks features:

- [ ] Check browser console for errors
- [ ] Verify video element selector: `video.html5-main-video`
- [ ] Verify player selector: `.html5-video-player`
- [ ] Check navigation detection still works
- [ ] Update quality format strings if needed
- [ ] Test mini player element selectors

---

## Support & Resources

- **Script Version:** 8.0.0
- **Compatible With:** YouTube 2025 layout
- **Browser Compatibility:** Chrome, Firefox, Edge, Opera
- **Dependencies:** None (vanilla JavaScript)

For more details, see the full analysis document: `youtube-enhancer-analysis.md`
