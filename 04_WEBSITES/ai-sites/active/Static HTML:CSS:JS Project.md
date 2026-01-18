# Static HTML/CSS/JS Project

This is a pure HTML, CSS, and JavaScript project. No build tools, no npm, no complexity.

## 📁 Project Structure

```
.
├── public/
│   ├── index.html              (Main page)
│   ├── styles/
│   │   └── AVATARARTS_GLOBAL_STYLES.css  (Global styles)
│   ├── js/
│   │   └── theme.js           (Theme switcher)
│   └── images/                (Image assets)
└── README.md                   (This file)
```

## 🚀 How to Run

### Option 1: Python HTTP Server (Recommended)
```bash
cd public
python3 -m http.server 8000
```
Then visit: http://localhost:8000

### Option 2: Live Server (VS Code)
1. Install "Live Server" extension
2. Right-click `public/index.html`
3. Select "Open with Live Server"

### Option 3: Direct File
```bash
open public/index.html
```

## 🎨 Features

✨ **Dark/Light Mode** - Click 🌙 button to toggle  
📱 **Responsive Design** - Works on all screen sizes  
💫 **Smooth Animations** - Professional transitions  
♿ **Accessible** - WCAG compliant  
⚡ **No Dependencies** - Pure vanilla HTML/CSS/JS  

## 📝 Customization

### Change Colors
Edit `public/styles/AVATARARTS_GLOBAL_STYLES.css`:
```css
:root {
  --page-text: #0d0d0d;
  --page-bg: #fff;
  --accent-color: #3b82f6;
}
```

### Add Content
Edit `public/index.html`:
```html
<section>
  <h2>Your Section</h2>
  <p>Your content here</p>
</section>
```

### Change Theme
Modify the theme switcher button in `index.html`:
```html
<button class="theme-switcher" id="themeBtn">🌙</button>
```

## 🎯 CSS Variables

| Variable | Purpose |
|----------|---------|
| `--page-text` | Main text color |
| `--page-bg` | Background color |
| `--accent-color` | Primary accent |
| `--secondary-text` | Secondary text |
| `--border-light` | Light borders |
| `--spacing-xs` | 0.25rem |
| `--spacing-sm` | 0.5rem |
| `--spacing-md` | 1rem |
| `--spacing-lg` | 1.5rem |
| `--spacing-xl` | 2rem |

## 📱 Mobile Responsive

The design includes:
- Mobile-first approach
- Mobile: Single column, full-width
- Tablet: 2 columns
- Desktop: 3-4 columns
- Touch-friendly buttons
- Readable text sizes

## 🌓 Theme Support

- Light mode (default)
- Dark mode
- Auto-detect system preference
- Persistent preference (localStorage)

## ✅ Browser Support

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## 🔧 No Build Tools Required

This project uses:
- Pure HTML5
- CSS3 with variables
- Vanilla JavaScript (ES6)

No npm, no webpack, no build process needed!

## 📖 Learn More

- [MDN Web Docs](https://developer.mozilla.org)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

## 🎉 Ready to Go!

Start serving and enjoy your static HTML project! 🚀

