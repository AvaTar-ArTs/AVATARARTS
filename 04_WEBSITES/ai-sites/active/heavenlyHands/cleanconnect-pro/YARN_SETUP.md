# 🧶 CleanConnect Pro 2.0 - Complete Yarn Setup Guide

## Overview

CleanConnect Pro 2.0 has been fully migrated to use **Yarn** as the package manager instead of npm. This guide walks you through the complete setup process.

---

## ✅ Prerequisites

Before starting, ensure you have:

| Tool           | Version       | Installation                                                 |
| -------------- | ------------- | ------------------------------------------------------------ |
| **Node.js**    | 18.0.0+ (LTS) | [nodejs.org](https://nodejs.org/)                            |
| **Yarn**       | 3.x+          | `npm install -g yarn` or [yarnpkg.com](https://yarnpkg.com/) |
| **PostgreSQL** | 14+           | [postgresql.org](https://postgresql.org/)                    |
| **Git**        | Latest        | [git-scm.com](https://git-scm.com/)                          |

### Verify Installation

```bash
node --version      # Should be v18.0.0+
yarn --version      # Should be 3.x+
psql --version      # Should be 14+
git --version       # Should be present
```

---

## 🚀 Step-by-Step Setup

### Step 1: Clone & Navigate to Project

```bash
git clone https://github.com/quantumforgelabs/cleanconnect-pro.git
cd cleanconnect-pro
```

### Step 2: Install Root Dependencies

```bash
# Install all root dependencies with Yarn
yarn install

# You should see output like:
# ➤ YN0000: ┌ Link step
# ➤ YN0000: └ Completed in XXs
# ➤ YN0000: Done in XXs
```

### Step 3: Install Backend Dependencies

```bash
cd backend

# Install backend-specific dependencies
yarn install

# Return to root
cd ..
```

### Step 4: Install Frontend Dependencies

```bash
cd frontend

# Install frontend-specific dependencies
yarn install

# Return to root
cd ..
```

### Step 5: (Optional) Install Mobile App Dependencies

```bash
cd mobile

# Install mobile-specific dependencies
yarn install

# Return to root
cd ..
```

### Step 6: (Optional) Install Admin Dashboard Dependencies

```bash
cd admin

# Install admin-specific dependencies
yarn install

# Return to root
cd ..
```

---

## 🗄️ Database Setup

### Start PostgreSQL

```bash
# macOS with Homebrew
brew services start postgresql

# Linux with systemd
sudo systemctl start postgresql

# Verify it's running
psql --version
```

### Create Development Database

```bash
# Create the database
createdb cleanconnect_pro_dev

# Verify it was created
psql -l | grep cleanconnect_pro_dev
```

### Apply Database Schema

```bash
# Apply the schema
psql -d cleanconnect_pro_dev -f database/database-schema.sql

# (Optional) Load sample data
psql -d cleanconnect_pro_dev -f database/sample-data.sql
```

---

## ⚙️ Environment Configuration

### Create .env File

```bash
cp .env.example .env
```

### Configure Environment Variables

Edit `.env` with your settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cleanconnect_pro_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRY=7d

# Application
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

---

## 🎯 Running the Application

### Option 1: Development Mode (Recommended)

**Terminal 1 - Backend:**
```bash
yarn dev:api
# Backend runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
yarn dev:frontend
# Frontend runs on http://localhost:5173
```

**Terminal 3 - Mobile (Optional):**
```bash
yarn dev:mobile
# Mobile app runs on http://localhost:8080
```

### Option 2: Production Build

```bash
# Build frontend for production
yarn build

# Start backend in production
cd backend
NODE_ENV=production yarn start
```

### Option 3: Using PM2

```bash
# Start all processes with PM2
yarn start

# View logs
pm2 logs

# Monitor processes
pm2 monit
```

---

## 📝 Common Yarn Commands

### Root Level Commands

```bash
# Development
yarn dev                    # Run API + Frontend
yarn dev:api               # Backend only
yarn dev:frontend          # Frontend only

# Testing
yarn test                  # All tests
yarn test:backend          # Backend tests only
yarn test:frontend         # Frontend tests only
yarn test:coverage         # Coverage reports

# Code Quality
yarn lint                  # Lint all code
yarn lint:fix              # Auto-fix linting issues

# Database
yarn migrate               # Run migrations
yarn seed                  # Seed database
yarn db:reset              # Reset database

# Deployment
yarn build                 # Build for production
yarn deploy                # Build + migrate + start
```

### Backend Commands

```bash
cd backend

# Development
yarn dev                   # Start in watch mode
yarn dev:debug             # With debug logging

# Testing
yarn test                  # Run all tests
yarn test:watch            # Watch mode
yarn test:coverage         # Coverage report

# Database
yarn migrate               # Run migrations
yarn migrate:create        # Create new migration
yarn migrate:up            # Apply migrations
yarn migrate:down          # Revert migrations
yarn seed                  # Seed database
yarn db:reset              # Reset database
yarn db:backup             # Backup database

# Code Quality
yarn lint                  # Run ESLint
yarn lint:fix              # Auto-fix issues
yarn format                # Format with Prettier
```

### Frontend Commands

```bash
cd frontend

# Development
yarn dev                   # Start dev server
yarn preview               # Preview production build

# Building
yarn build                 # Build for production
yarn build:analyze         # Analyze bundle

# Testing
yarn test                  # Run tests
yarn test:coverage         # Coverage report
yarn test:e2e              # E2E tests

# Code Quality
yarn lint                  # Run ESLint
yarn lint:fix              # Auto-fix issues
yarn format                # Format code
```

---

## 🌐 Access Your Applications

Once running, access them here:

| Service             | URL                          | Terminal   |
| ------------------- | ---------------------------- | ---------- |
| **Frontend**        | http://localhost:5173        | Terminal 2 |
| **API Server**      | http://localhost:3000        | Terminal 1 |
| **Mobile App**      | http://localhost:5173/mobile | Terminal 3 |
| **Admin Dashboard** | http://localhost:5173/admin  | Terminal 2 |

---

## 🧪 Running Tests

### Test Everything

```bash
yarn test                  # Runs all tests
```

### Test Specific Areas

```bash
yarn test:backend          # Backend tests only
yarn test:frontend         # Frontend tests only
yarn test:integration      # Integration tests
yarn test:e2e              # End-to-end tests
```

### Generate Coverage Reports

```bash
yarn test:coverage         # All coverage
cd backend && yarn test:coverage  # Backend coverage
cd frontend && yarn test:coverage # Frontend coverage

# View reports
open coverage/index.html   # macOS
xdg-open coverage/index.html # Linux
```

---

## 🐛 Troubleshooting

### Problem: "yarn: command not found"

**Solution:**
```bash
# Install Yarn globally
npm install -g yarn

# Or with corepack (Node 16.13+)
corepack enable yarn
```

### Problem: Dependencies not installing

**Solution:**
```bash
# Clear cache
yarn cache clean

# Remove lock files
rm yarn.lock
rm -rf node_modules

# Reinstall
yarn install
```

### Problem: Port already in use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 yarn dev:api
```

### Problem: Database connection failed

**Solution:**
```bash
# Check PostgreSQL is running
psql --version

# Start PostgreSQL (macOS)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql

# Create database if missing
createdb cleanconnect_pro_dev
```

### Problem: "Module not found" errors

**Solution:**
```bash
# Complete reinstall
yarn cache clean
rm -rf node_modules yarn.lock
yarn install

# Install in all directories
cd backend && yarn install && cd ..
cd frontend && yarn install && cd ..
cd mobile && yarn install && cd ..
```

---

## 📊 Migration from npm to Yarn

### What Changed?

| npm                 | Yarn           |
| ------------------- | -------------- |
| `npm install`       | `yarn install` |
| `npm run dev`       | `yarn dev`     |
| `npm test`          | `yarn test`    |
| `npm start`         | `yarn start`   |
| `package-lock.json` | `yarn.lock`    |
| `node_modules`      | `node_modules` |

### Benefits of Yarn

✅ **Faster Installation:** Parallel downloads
✅ **Better Caching:** Smarter dependency caching
✅ **Improved Security:** Better dependency resolution
✅ **Workspace Support:** Better monorepo management
✅ **Consistency:** Lock files ensure same versions across machines

---

## 🔒 Key Improvements in 2.0

### Security Updates

- ✅ **Multer 2.x:** Upgraded from 1.x to address vulnerabilities
- ✅ **Dependency Audit:** All dependencies checked for security issues
- ✅ **Lock File:** `yarn.lock` ensures reproducible installs

### Package Manager

- ✅ **Yarn 3+:** Modern package manager with better performance
- ✅ **Monorepo Support:** Better workspace management
- ✅ **Workspace Protocols:** Improved local dependency management

---

## 📚 Additional Resources

- [Yarn Documentation](https://yarnpkg.com/docs)
- [CleanConnect Pro API Docs](docs/api-endpoints.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Project Overview](PROJECT_OVERVIEW.md)

---

## 🆘 Need Help?

### Support Channels

- 📧 **Email:** dev@quantumforgelabs.org
- 💬 **Discord:** [Community Server](https://discord.gg/quantumforgelabs)
- 🐛 **GitHub Issues:** [Report Issues](https://github.com/quantumforgelabs/cleanconnect-pro/issues)

### Common Questions

**Q: Should I commit `yarn.lock`?**
A: Yes! Commit `yarn.lock` to ensure all team members use the same versions.

**Q: Can I still use npm?**
A: Technically yes, but Yarn is recommended for this project. The lock file ensures consistency.

**Q: How do I add a new package?**
A: `yarn add package-name` (production) or `yarn add -D package-name` (dev)

**Q: How do I remove a package?**
A: `yarn remove package-name`

---

## ✨ What's Next?

After setup, you can:

1. Read [API Documentation](docs/api-endpoints.md)
2. Explore [Project Overview](PROJECT_OVERVIEW.md)
3. Join our [Discord Community](https://discord.gg/quantumforgelabs)
4. Submit your first PR! 🎉

---

**Built with ❤️ by [Quantum Forge Labs](https://quantumforgelabs.org)**

*Transforming local service experiences through AI, technology, and community.*

---

© 2025 CleanConnect Pro. All rights reserved.
