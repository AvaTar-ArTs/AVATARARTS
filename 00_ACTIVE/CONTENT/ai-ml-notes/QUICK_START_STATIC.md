# 🚀 Quick Start - Static HTML/CSS/JS Projects

All 5 AvatarArts projects have been **converted to pure HTML/CSS/JavaScript**.

**No npm. No yarn. No build tools. Just pure web technologies.** ⚡

---

## 🎯 Pick a Project & Run It

### 🖼️ **Gallery** - http://localhost:8000
```bash
cd /Users/steven/tehSiTes/avatararts-gallery/public
python3 -m http.server 8000
```

### 🌐 **Hub** - http://localhost:8001
```bash
cd /Users/steven/tehSiTes/avatararts-hub/public
python3 -m http.server 8001
```

### 💼 **Portfolio** - http://localhost:8002
```bash
cd /Users/steven/tehSiTes/avatararts-portfolio/public
python3 -m http.server 8002
```

### 🛠️ **Tools** - http://localhost:8003
```bash
cd /Users/steven/tehSiTes/avatararts-tools/public
python3 -m http.server 8003
```

### 🌍 **Main Site** - http://localhost:8004
```bash
cd /Users/steven/tehSiTes/avatararts.org/public
python3 -m http.server 8004
```

---

## 📁 What's In Each Project

```
project-name/
├── public/
│   ├── index.html                    ← Your website!
│   ├── styles/
│   │   └── AVATARARTS_GLOBAL_STYLES.css  ← All CSS
│   ├── js/
│   │   └── theme.js                 ← Dark/Light toggle
│   └── images/                       ← Add your images here
└── README.md                         ← Setup guide
```

---

## ✨ Features

✅ **🌓 Dark/Light Mode** - Click 🌙 button to toggle  
✅ **📱 Responsive Design** - Works on all devices  
✅ **💫 Smooth Animations** - Professional transitions  
✅ **♿ Accessible** - WCAG compliant  
✅ **⚡ Lightning Fast** - No build process, instant load  
✅ **🎨 Beautiful Styling** - 40+ CSS variables  

---

## 🎯 Edit Your Content

### 1. Add Content
Edit: `project-name/public/index.html`

Find the sections and customize:
```html
<section>
  <h2>Welcome</h2>
  <p>Your content here</p>
</section>

<div class="gallery">
  <!-- Add gallery items -->
</div>
```

### 2. Add Images
1. Put images in: `project-name/public/images/`
2. Reference in HTML: `<img src="./images/your-image.jpg">`

### 3. Change Colors
Edit: `project-name/public/styles/AVATARARTS_GLOBAL_STYLES.css`

Find `:root {` and change:
```css
--page-text: #0d0d0d;      /* Main text */
--page-bg: #fff;           /* Background */
--accent-color: #3b82f6;   /* Accent */
```

---

## 🌐 Browser Testing

**Test theme switcher:**
- Click 🌙 button → switches to dark mode
- Click ☀️ button → switches to light mode
- Refresh → preference saved

**Test responsive design:**
- Resize browser window
- View on mobile device
- Check tablet view

---

## 💡 Using CSS Variables

In your own CSS, use variables like:
```css
.my-element {
  background: var(--page-bg);
  color: var(--page-text);
  padding: var(--spacing-md);
  border: 1px solid var(--border-light);
}
```

Available variables:
- `--page-text` - Text color
- `--page-bg` - Background
- `--accent-color` - Primary accent
- `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`
- `--border-light` - Light borders
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` - Shadows

---

## 📱 Gallery Grid Classes

Use built-in gallery class:
```html
<div class="gallery">
  <div class="gallery-item">
    <img src="./images/pic1.jpg" alt="Image 1">
    <div class="gallery-item-content">
      <h3>Title</h3>
      <p>Description</p>
    </div>
  </div>
  <!-- Repeat for more items -->
</div>
```

---

## 🔥 Alternative: Direct File Open

Want to skip the server? Just open directly:
```bash
open /Users/steven/tehSiTes/avatararts-gallery/public/index.html
```

Works fine for local development!

---

## 🎨 Alternative: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Open `project/public/index.html`
3. Right-click → "Open with Live Server"
4. Auto-refreshes on save!

---

## 📚 File Locations

| File | Location |
|------|----------|
| HTML | `project/public/index.html` |
| CSS | `project/public/styles/AVATARARTS_GLOBAL_STYLES.css` |
| JS | `project/public/js/theme.js` |
| README | `project/README.md` |

---

## 🚀 Deploy Anywhere

Since it's just static HTML/CSS/JS:
- Deploy to **Netlify** - drag & drop `public/` folder
- Deploy to **GitHub Pages** - push `public/` folder
- Upload to **FTP/SFTP** - copy `public/` folder
- Host on **AWS S3** - upload `public/` folder
- Use **any static host** - works everywhere!

---

## ✅ Checklist

- [ ] Picked a project
- [ ] Ran Python server
- [ ] Opened in browser
- [ ] Clicked theme button ✅
- [ ] Resized window ✅
- [ ] Customized content ✅
- [ ] Added images ✅
- [ ] Changed colors ✅

---

## 🎉 That's It!

You now have 5 beautiful, responsive websites ready to go!

**No build tools. No complexity. Just pure HTML/CSS/JavaScript.**

Happy coding! 🚀

