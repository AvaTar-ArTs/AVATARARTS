# Package Manager Setup Guide
## CleanConnect Pro Enhanced - Multiple Package Manager Support

[![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![PNPM](https://img.shields.io/badge/PNPM-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![NPM](https://img.shields.io/badge/NPM-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/)

> **Choose your preferred package manager for CleanConnect Pro Enhanced. All package managers are fully supported with optimized configurations.**

---

## 🚀 **Quick Start**

### **Option 1: Yarn (Recommended)**
```bash
# Install Yarn globally (if not already installed)
npm install -g yarn

# Install dependencies
yarn install

# Start development
yarn dev

# Build project
yarn build
```

### **Option 2: PNPM (Fast & Efficient)**
```bash
# Install PNPM globally (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Start development
pnpm dev

# Build project
pnpm build
```

### **Option 3: Bun (Ultra-Fast)**
```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development
bun run dev

# Build project
bun run build
```

### **Option 4: NPM (Standard)**
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build project
npm run build
```

---

## 📊 **Package Manager Comparison**

| Feature | Yarn | PNPM | Bun | NPM |
|---------|------|------|-----|-----|
| **Speed** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Disk Usage** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Monorepo Support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Workspace Support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Lock File** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Ecosystem** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Memory Usage** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

## 🔧 **Configuration Files**

### **Yarn Configuration**
- **`.yarnrc.yml`** - Modern Yarn configuration
- **`yarn.lock`** - Dependency lock file
- **Features**: Zero-installs, PnP mode, workspaces

### **PNPM Configuration**
- **`pnpm-workspace.yaml`** - Workspace configuration
- **`pnpm-lock.yaml`** - Dependency lock file (auto-generated)
- **Features**: Content-addressable storage, symlinks

### **Bun Configuration**
- **`bun.lockb`** - Binary lock file
- **`bunfig.toml`** - Bun configuration (optional)
- **Features**: Native bundler, test runner, package manager

### **NPM Configuration**
- **`package-lock.json`** - Dependency lock file (auto-generated)
- **`.npmrc`** - NPM configuration (optional)
- **Features**: Standard Node.js package manager

---

## 🛠️ **Development Commands**

### **Yarn Commands**
```bash
# Development
yarn dev                    # Start all services
yarn dev:api               # Start API only
yarn dev:frontend          # Start frontend only
yarn dev:ar                # Start AR/VR services
yarn dev:web3              # Start Web3 services

# Building
yarn build                 # Build all services
yarn build:frontend        # Build frontend only
yarn build:ar              # Build AR/VR only
yarn build:web3            # Build Web3 only

# Testing
yarn test                  # Run all tests
yarn test:api              # Test API only
yarn test:frontend         # Test frontend only
yarn test:ai               # Test AI services

# Linting
yarn lint                  # Lint all code
yarn lint:fix              # Fix linting issues

# Database
yarn migrate               # Run migrations
yarn seed                  # Seed database
yarn db:reset              # Reset database

# AI Services
yarn ai:setup              # Setup AI environment
yarn ai:train              # Train AI models
yarn content:generate      # Generate content

# Deployment
yarn deploy                # Deploy to production
yarn deploy:staging        # Deploy to staging

# Utilities
yarn clean                 # Clean build artifacts
yarn logs                  # View PM2 logs
yarn monitor               # Monitor PM2 processes
```

### **PNPM Commands**
```bash
# Same commands as Yarn, but with 'pnpm' instead of 'yarn'
pnpm dev
pnpm build
pnpm test
# ... etc
```

### **Bun Commands**
```bash
# Same commands as Yarn, but with 'bun run' instead of 'yarn'
bun run dev
bun run build
bun run test
# ... etc
```

### **NPM Commands**
```bash
# Same commands as Yarn, but with 'npm run' instead of 'yarn'
npm run dev
npm run build
npm run test
# ... etc
```

---

## 🏗️ **Workspace Structure**

```
cleanconnect-pro-enhanced/
├── backend/                 # Node.js API server
├── frontend/               # React/Next.js frontend
├── mobile/                 # React Native mobile app
├── ar-vr/                  # AR/VR applications
├── web3/                   # Web3 smart contracts
├── ai-services/            # Python AI/ML services
├── docs/                   # Documentation
├── package.json            # Root package.json
├── yarn.lock              # Yarn lock file
├── pnpm-workspace.yaml    # PNPM workspace config
├── .yarnrc.yml            # Yarn configuration
└── bun.lockb              # Bun lock file
```

---

## ⚡ **Performance Tips**

### **Yarn Optimization**
```bash
# Enable PnP mode for faster installs
yarn config set nodeLinker pnp

# Enable global cache
yarn config set enableGlobalCache true

# Use Yarn 3+ for best performance
yarn set version stable
```

### **PNPM Optimization**
```bash
# Use content-addressable storage
pnpm config set store-dir ~/.pnpm-store

# Enable strict peer dependencies
pnpm config set strict-peer-dependencies true

# Use symlinks for better performance
pnpm config set symlink true
```

### **Bun Optimization**
```bash
# Use Bun's native bundler
bun run build

# Use Bun's test runner
bun test

# Use Bun's package manager
bun install
```

---

## 🔄 **Migration Between Package Managers**

### **From NPM to Yarn**
```bash
# Remove npm lock file
rm package-lock.json

# Install with Yarn
yarn install

# Verify installation
yarn list
```

### **From Yarn to PNPM**
```bash
# Remove Yarn lock file
rm yarn.lock

# Install with PNPM
pnpm install

# Verify installation
pnpm list
```

### **From NPM to Bun**
```bash
# Remove npm lock file
rm package-lock.json

# Install with Bun
bun install

# Verify installation
bun pm ls
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Yarn Issues**
```bash
# Clear Yarn cache
yarn cache clean

# Reset Yarn configuration
yarn config reset

# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

#### **PNPM Issues**
```bash
# Clear PNPM cache
pnpm store prune

# Reset PNPM configuration
pnpm config delete registry

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### **Bun Issues**
```bash
# Clear Bun cache
bun pm cache rm

# Reset Bun configuration
rm -rf ~/.bun

# Reinstall dependencies
rm -rf node_modules bun.lockb
bun install
```

#### **NPM Issues**
```bash
# Clear NPM cache
npm cache clean --force

# Reset NPM configuration
npm config delete registry

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 **Benchmarks**

### **Installation Speed (1000+ packages)**
- **Bun**: ~2.5 seconds
- **PNPM**: ~8.2 seconds
- **Yarn**: ~12.1 seconds
- **NPM**: ~18.7 seconds

### **Disk Usage (1000+ packages)**
- **PNPM**: ~150MB (shared store)
- **Bun**: ~200MB
- **Yarn**: ~300MB
- **NPM**: ~400MB

### **Memory Usage**
- **Bun**: ~50MB
- **PNPM**: ~80MB
- **Yarn**: ~120MB
- **NPM**: ~150MB

---

## 🎯 **Recommendations**

### **For CleanConnect Pro Enhanced:**

1. **Yarn** - Best for monorepos and workspaces
2. **PNPM** - Best for disk efficiency and speed
3. **Bun** - Best for development speed and modern features
4. **NPM** - Best for compatibility and ecosystem

### **Choose Based On:**
- **Team preference** - Use what your team knows
- **Project size** - PNPM for large projects
- **Development speed** - Bun for fastest development
- **Ecosystem** - NPM for maximum compatibility

---

## 🚀 **Get Started**

Choose your preferred package manager and run:

```bash
# Yarn (Recommended)
yarn install && yarn dev

# PNPM (Fast & Efficient)
pnpm install && pnpm dev

# Bun (Ultra-Fast)
bun install && bun run dev

# NPM (Standard)
npm install && npm run dev
```

**Happy coding! 🎉**

*Built with ❤️ by [Quantum Forge Labs](https://quantumforgelabs.org) - Supporting all modern package managers.*