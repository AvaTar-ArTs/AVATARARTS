# 🚀 CleanConnect Pro 2.0

## AI-Powered Marketplace for Short-Term Rental Cleaning

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue)](https://postgresql.org/)
[![Package Manager: Yarn](https://img.shields.io/badge/Package%20Manager-Yarn-2C8EBB)](https://yarnpkg.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green)](https://web.dev/progressive-web-apps/)

> **CleanConnect Pro 2.0** is a revolutionary AI-driven platform seamlessly connecting Airbnb and short-term rental hosts with vetted, professional cleaners. Features include instant booking, smart AI matching, real-time status updates, and a satisfaction guarantee — all in one modern experience. Now with enhanced security, improved performance, and better dependency management! ✨

---

## ✨ What's New in 2.0?

- 🔄 **Yarn Migration:** Switched to Yarn for faster, more reliable package management
- 🔒 **Security Updates:** Upgraded `multer` to 2.x to address critical vulnerabilities
- ⚡ **Performance:** Optimized dependencies and build processes
- 🎯 **Better Organization:** Improved folder structure and configuration management
- 📚 **Enhanced Docs:** Updated documentation with clearer setup instructions

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#-project-structure)
- [Common Commands](#-common-development-commands)
- [Testing](#-testing--quality-assurance)
- [Troubleshooting](#-troubleshooting)
- [API Documentation](#-sample-api-usage)
- [Contributing](#-contributing-guidelines)
- [Support](#-support--community)

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement    | Version       | Link                                      |
| -------------- | ------------- | ----------------------------------------- |
| **Node.js**    | 18.0.0+ (LTS) | [nodejs.org](https://nodejs.org/)         |
| **Yarn**       | 3.x+          | [yarnpkg.com](https://yarnpkg.com/)       |
| **PostgreSQL** | 14+           | [postgresql.org](https://postgresql.org/) |
| **Git**        | Latest        | [git-scm.com](https://git-scm.com/)       |

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/quantumforgelabs/cleanconnect-pro.git
cd cleanconnect-pro-2.0
```

#### 2️⃣ Install Dependencies with Yarn

```bash
# Install root dependencies
yarn install

# Install backend dependencies
cd backend && yarn install && cd ..

# Install frontend dependencies
cd frontend && yarn install && cd ..

# (Optional) Install mobile app dependencies
cd mobile && yarn install && cd ..

# (Optional) Install admin dashboard dependencies
cd admin && yarn install && cd ..
```

---

## 🗄️ Database Setup

### Step 1: Start PostgreSQL

```bash
# On macOS with Homebrew
brew services start postgresql

# On Linux with systemd
sudo systemctl start postgresql

# Verify PostgreSQL is running
psql --version
```

### Step 2: Create Database

```bash
# Create development database
createdb cleanconnect_pro_dev

# Verify the database was created
psql -l | grep cleanconnect_pro_dev
```

### Step 3: Apply Schema

```bash
# Apply the database schema
psql -d cleanconnect_pro_dev -f database/database-schema.sql

# (Optional) Load sample data for testing
psql -d cleanconnect_pro_dev -f database/sample-data.sql
```

> **💡 Tip:** Use [pgAdmin](https://www.pgadmin.org/) for a GUI-based database administration tool if you prefer a visual interface.

---

## ⚙️ Configuration

### Step 1: Create Environment File

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit `.env` with your settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cleanconnect_pro_dev
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRY=7d

# Application Configuration
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Stripe Configuration (Optional)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

> ⚠️ **Important:** Never commit the `.env` file. It's already in `.gitignore`.

---

## 🎯 Running the Application

### Option 1: Development Mode (Recommended)

**Terminal 1 - Backend API:**
```bash
cd backend
yarn dev
# API will be available at http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn dev
# Frontend will be available at http://localhost:5173
```

**Terminal 3 - Mobile App (Optional):**
```bash
cd mobile
yarn dev
# Mobile app will be available at http://localhost:5173/mobile-app-interface.html
```

### Option 2: Production Mode

```bash
# Build frontend
cd frontend && yarn build && cd ..

# Start backend in production
cd backend
NODE_ENV=production yarn start
```

### Option 3: Using PM2 (Process Manager)

```bash
# Install PM2 globally
yarn global add pm2

# Start all services
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Monitor processes
pm2 monit
```

---

## 📱 Access Your Apps

Once everything is running, access your applications here:

| Service             | URL                                                                                                | Purpose                     |
| ------------------- | -------------------------------------------------------------------------------------------------- | --------------------------- |
| **Main Website**    | [http://localhost:5173](http://localhost:5173)                                                     | User-facing website         |
| **Mobile App**      | [http://localhost:5173/mobile-app-interface.html](http://localhost:5173/mobile-app-interface.html) | Progressive Web App         |
| **Admin Dashboard** | [http://localhost:5173/admin-dashboard.html](http://localhost:5173/admin-dashboard.html)           | Admin management panel      |
| **API Server**      | [http://localhost:3000](http://localhost:3000)                                                     | REST API backend            |
| **API Docs**        | [http://localhost:3000/api-docs](http://localhost:3000/api-docs)                                   | API documentation (Swagger) |

---

## 📁 Project Structure

```
cleanconnect-pro-2.0/
├── 📂 backend/                 # Node.js/Express API server
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Route handlers
│   │   ├── 📂 middleware/      # Express middleware
│   │   ├── 📂 models/          # Database models
│   │   ├── 📂 routes/          # API routes
│   │   ├── 📂 services/        # Business logic
│   │   ├── 📂 utils/           # Helper utilities
│   │   ├── 📂 validators/      # Input validation
│   │   └── 📄 app.js           # Express app setup
│   ├── 📂 config/              # Configuration files
│   ├── 📂 migrations/          # Database migrations
│   ├── 📂 seeds/               # Database seeds
│   ├── 📂 tests/               # Unit & integration tests
│   ├── 📄 package.json
│   └── 📄 yarn.lock
│
├── 📂 frontend/                # React frontend (Vite)
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable components
│   │   ├── 📂 pages/           # Page components
│   │   ├── 📂 hooks/           # Custom React hooks
│   │   ├── 📂 services/        # API services
│   │   ├── 📂 store/           # State management
│   │   ├── 📂 styles/          # Global styles
│   │   └── 📄 main.jsx         # Entry point
│   ├── 📂 public/              # Static assets
│   ├── 📄 package.json
│   └── 📄 vite.config.js
│
├── 📂 mobile/                  # PWA Mobile App
│   ├── 📄 mobile-app-interface.html
│   ├── 📄 manifest.json        # PWA manifest
│   ├── 📄 sw.js                # Service worker
│   └── 📄 package.json
│
├── 📂 admin/                   # Admin Dashboard
│   ├── 📄 admin-dashboard.html
│   ├── 📄 admin-styles.css
│   └── 📄 package.json
│
├── 📂 database/                # Database files
│   ├── 📄 database-schema.sql  # DB schema
│   ├── 📄 sample-data.sql      # Sample data
│   └── 📂 backups/             # Database backups
│
├── 📂 docs/                    # Documentation
│   ├── 📄 api-endpoints.md     # API reference
│   ├── 📄 DEPLOYMENT_GUIDE.md  # Deployment guide
│   └── 📄 CONTRIBUTING.md      # Contributing guidelines
│
├── 📂 config/                  # Shared configuration
│   ├── 📄 database.js
│   ├── 📄 api.js
│   └── 📄 branding.js
│
├── 📂 tests/                   # Shared tests
│   ├── 📄 integration/
│   └── 📄 e2e/
│
├── 📄 package.json             # Root package.json
├── 📄 yarn.lock                # Yarn lock file
├── 📄 ecosystem.config.js      # PM2 configuration
├── 📄 .env.example             # Environment template
├── 📄 .gitignore               # Git ignore rules
├── 📄 LICENSE                  # MIT License
├── 📄 README.md                # This file
└── 📄 PROJECT_OVERVIEW.md      # Architecture overview
```

---

## 🛠️ Common Development Commands

### Backend Commands

```bash
cd backend

# Development
yarn dev               # Start in watch mode
yarn dev:debug        # Start with debug logging

# Testing
yarn test             # Run all tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Generate coverage report

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Auto-fix lint issues
yarn format           # Format code with Prettier

# Database
yarn migrate          # Run all migrations
yarn migrate:create   # Create a new migration
yarn migrate:up       # Apply migrations
yarn migrate:down     # Revert migrations
yarn seed             # Seed database with sample data
yarn db:reset         # Reset database (dev only)
yarn db:backup        # Backup database
```

### Frontend Commands

```bash
cd frontend

# Development
yarn dev              # Start dev server
yarn preview          # Preview production build

# Building
yarn build            # Build for production
yarn build:analyze    # Analyze bundle size

# Testing
yarn test             # Run tests
yarn test:coverage    # Generate coverage
yarn test:e2e         # Run E2E tests

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Auto-fix issues
yarn format           # Format code
```

### Database Commands

```bash
# Create database
createdb cleanconnect_pro_dev

# Connect to database
psql -d cleanconnect_pro_dev

# Backup database
pg_dump cleanconnect_pro_dev > backup.sql

# Restore database
psql cleanconnect_pro_dev < backup.sql

# Drop database
dropdb cleanconnect_pro_dev
```

---

## 🧪 Testing & Quality Assurance

### Run Full Test Suite

```bash
# Backend tests
cd backend && yarn test

# Frontend tests
cd frontend && yarn test

# Integration tests
yarn test:integration

# End-to-end tests
yarn test:e2e

# All tests
yarn test:all
```

### Generate Coverage Reports

```bash
# Backend coverage
cd backend && yarn test:coverage

# Frontend coverage
cd frontend && yarn test:coverage

# View HTML report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

---

## 🐛 Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
psql --version

# Start PostgreSQL (macOS)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql

# Check PostgreSQL status
psql -l
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 yarn dev
```

### Module Not Found / Dependency Issues

```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn cache clean
yarn install

# Reinstall in all directories
yarn install
cd backend && yarn install && cd ..
cd frontend && yarn install && cd ..
```

### Database Schema Issues

```bash
# Verify schema is loaded
psql -d cleanconnect_pro_dev -c "\dt"

# Reload schema (drops all data)
psql -d cleanconnect_pro_dev -f database/database-schema.sql
```

### Enable Debug Logging

```bash
# Backend debug
DEBUG=cleanconnect:* yarn dev

# Verbose logging
VERBOSE=true yarn dev

# Database query logging
DB_DEBUG=true yarn dev
```

---

## 📚 Sample API Usage

### Authentication

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "host"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### Submit Cleaning Request

```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "propertyId": "uuid",
    "requestType": "turnover",
    "urgency": "same_day",
    "preferredDate": "2025-02-15",
    "specialRequirements": "Eco-friendly products only"
  }'
```

📖 **Full API Documentation:** See [`docs/api-endpoints.md`](docs/api-endpoints.md)

---

## 🤝 Contributing Guidelines

We love contributions! Here's how to get started:

### Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes with meaningful commits
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Coding Standards

- ✅ **ESLint & Prettier:** Enforce consistent code style
- ✅ **Unit Tests:** Write tests for new features
- ✅ **Conventional Commits:** Follow commit message standards
- ✅ **Documentation:** Update docs as you code

### Before Submitting PR

```bash
# Format code
yarn format

# Run linter
yarn lint:fix

# Run tests
yarn test

# Check coverage
yarn test:coverage
```

---

## 📄 License

This project is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 🆘 Support & Community

### Get Help

- 📧 **Email:** dev@quantumforgelabs.org
- 💬 **Discord:** [Join our community](https://discord.gg/quantumforgelabs)
- 📖 **Docs:** [docs.quantumforgelabs.org](https://docs.quantumforgelabs.org)
- 🐛 **Report Issues:** [GitHub Issues](https://github.com/quantumforgelabs/cleanconnect-pro/issues)

### Contribute & Connect

- 🌟 **Star** this repo if you find it useful!
- 🍴 **Fork** and submit pull requests
- 📨 **Spread the word** to your network
- 💡 **Suggest features** via GitHub Issues or Discord

---

## 🚀 Roadmap

### Planned Features

- [ ] Real-time chat between hosts and cleaners
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Voice commands & speech-to-text
- [ ] AR property inspection tools
- [ ] Blockchain payment verification
- [ ] IoT device integrations
- [ ] Mobile app (React Native)

---

## 🎯 Version History

### v2.0 (Current)
- ✅ Migrated to Yarn
- ✅ Upgraded multer to 2.x
- ✅ Enhanced security
- ✅ Improved documentation

### v1.0
- Initial release with core functionality

---

**Built with ❤️ by [Quantum Forge Labs](https://quantumforgelabs.org)**

*Transforming local service experiences through AI, technology, and community.*

---

© 2025 CleanConnect Pro. All rights reserved.
