# 📱 iPhone Deployment Guide for QuantumForgeLabs

## 🚀 Quick Start (Local Development)

### Option 1: Using the Script
```bash
cd /Users/steven/MySiTes/QuantumForgeLabs
./start-mobile.sh
```

### Option 2: Manual Start
```bash
cd /Users/steven/MySiTes/QuantumForgeLabs
node server.js
```

**Access from iPhone:** `http://192.168.0.131:3000/`

---

## 🌐 Production Deployment Options

### Option 1: GitHub Pages (Free)
1. Create a new repository: `QuantumForgeLabs.github.io`
2. Upload all files to the repository
3. Enable GitHub Pages in Settings → Pages
4. Your site will be live at: `https://quantumforgelabs.github.io`

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Get instant deployment with custom domain support

### Option 3: Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts for instant deployment

### Option 4: Cloudflare Pages (Free)
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Deploy with automatic HTTPS

---

## 📱 Mobile Optimization

Your site is already mobile-optimized with:
- ✅ Responsive CSS design
- ✅ Mobile viewport meta tag
- ✅ Touch-friendly navigation
- ✅ Optimized images and assets

---

## 🔧 Development Tips

### Making Changes
1. Edit files in your project
2. Refresh browser on iPhone
3. No restart needed for static files

### Adding New Features
- Add new HTML pages in the root directory
- Update `assets/style.css` for styling
- Add new images to `assets/` folder

### Testing on iPhone
- Use Safari's Web Inspector (Settings → Safari → Advanced → Web Inspector)
- Test different screen sizes
- Check touch interactions

---

## 🚨 Troubleshooting

### Can't Access from iPhone?
1. Ensure both devices are on same WiFi
2. Check Mac's firewall settings
3. Try different port: `node server.js` (will use port 3000)

### Site Looks Broken?
1. Check browser console for errors
2. Verify all asset paths are correct
3. Test in different browsers

### Server Won't Start?
1. Check if port 3000 is available: `lsof -i :3000`
2. Kill process: `lsof -ti:3000 | xargs kill -9`
3. Try different port in server.js