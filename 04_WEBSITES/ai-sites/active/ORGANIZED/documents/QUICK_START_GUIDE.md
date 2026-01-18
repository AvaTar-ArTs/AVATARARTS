# ⚡ Quick Start - 5 Minute Setup

**TL;DR** - Get everything running in 5 minutes! 🚀

---

## 🎯 The Fastest Way to Start

### **Option 1: Verify Everything Works** (30 seconds)
```bash
cd /Users/steven/tehSiTes
bash AVATARARTS_RESTRUCTURE_VERIFY.sh
```

✅ **Result**: 41/41 checks pass → You're good!

---

### **Option 2: Run Single Project** (2 minutes)

**Gallery:**
```bash
cd /Users/steven/tehSiTes/avatararts-gallery
npm install
npm run dev
# Open http://localhost:3000
```

**Hub:**
```bash
cd /Users/steven/tehSiTes/avatararts-hub
npm install
npm run dev
# Open http://localhost:3000
```

**Portfolio:**
```bash
cd /Users/steven/tehSiTes/avatararts-portfolio
npm install
npm run dev
# Open http://localhost:3002
```

**Tools:**
```bash
cd /Users/steven/tehSiTes/avatararts-tools
npm install
npm run dev
# Open http://localhost:3003
```

**Main Site:**
```bash
cd /Users/steven/tehSiTes/avatararts.org
npm install
npm run dev
# Open http://localhost:3004
```

---

### **Option 3: Run All Projects** (5 minutes)

**Terminal 1 - Verify:**
```bash
cd /Users/steven/tehSiTes
bash AVATARARTS_RESTRUCTURE_VERIFY.sh
```

**Terminal 2 - Tools (start first):**
```bash
cd /Users/steven/tehSiTes/avatararts-tools
npm install && npm run dev
```

**Terminal 3 - Gallery:**
```bash
cd /Users/steven/tehSiTes/avatararts-gallery
npm install && npm run dev
```

**Terminal 4 - Portfolio:**
```bash
cd /Users/steven/tehSiTes/avatararts-portfolio
npm install && npm run dev
```

**Terminal 5 - Hub:**
```bash
cd /Users/steven/tehSiTes/avatararts-hub
npm install && npm run dev
```

**Terminal 6 - Main Site:**
```bash
cd /Users/steven/tehSiTes/avatararts.org
npm install && npm run dev
```

---

## 📍 Access Points

Once everything is running:

| Project     | URL                   | Port |
| ----------- | --------------------- | ---- |
| 🖼️ Gallery   | http://localhost:3001 | 3001 |
| 🌐 Hub       | http://localhost:3000 | 3000 |
| 💼 Portfolio | http://localhost:3002 | 3002 |
| 🛠️ Tools     | http://localhost:3003 | 3003 |
| 🌍 Main Site | http://localhost:3004 | 3004 |

---

## ⚡ Single Command Launch (For Advanced)

```bash
# Install concurrently (one time)
npm install -g concurrently

# Run all at once
cd /Users/steven/tehSiTes && concurrently \
  "cd avatararts-gallery && npm install && npm run dev" \
  "cd avatararts-hub && npm install && npm run dev" \
  "cd avatararts-portfolio && npm install && npm run dev" \
  "cd avatararts-tools && npm install && npm run dev" \
  "cd avatararts.org && npm install && npm run dev"
```

---

## 🐛 Common Issues & Fixes

### Port Already in Use
```bash
# Find what's using the port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3005 npm run dev
```

### npm install stuck
```bash
# Clear cache
npm cache clean --force

# Fresh install
rm -rf node_modules package-lock.json
npm install
```

### Integration not working
```bash
# Verify all services running
curl http://localhost:3000/api/status
curl http://localhost:3001/api/status

# Re-verify structure
bash AVATARARTS_RESTRUCTURE_VERIFY.sh
```

---

## 📚 Where to Go From Here

**Want to understand the structure?**
- Read: `AVATARARTS_RESTRUCTURING_INDEX.md`

**Want integration details?**
- Read: `AVATARARTS_INTEGRATION_GUIDE.md`

**Want full how-to guide?**
- Read: `AVATARARTS_HOW_TO_RUN.md`

**Want project details?**
- Read: `*/README_RESTRUCTURE.md`

---

## 🎯 Your Next Steps

1. **Verify**: `bash AVATARARTS_RESTRUCTURE_VERIFY.sh`
2. **Pick a project** to run first
3. **Install** dependencies: `npm install`
4. **Start dev**: `npm run dev`
5. **Open browser** to the project URL
6. **Explore** and develop!

---

## ✨ Quick Status Check

```bash
# All in one
cd /Users/steven/tehSiTes && \
echo "🔍 Checking structure..." && \
bash AVATARARTS_RESTRUCTURE_VERIFY.sh 2>&1 | tail -15
```

---

**You're all set! 🚀 Pick an option above and start building!**

*Still have questions? Check the full guides in the documentation files.*
