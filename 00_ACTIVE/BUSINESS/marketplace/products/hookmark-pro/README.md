# Hookmark Pro

**Premium Chrome Extension for Web Bookmarking, Ratings, and Team Collaboration**

Transform your browsing experience with intelligent bookmarking, ratings, and AI-powered recommendations. Built for individuals, teams, and enterprises.

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](package.json)
[![Status](https://img.shields.io/badge/status-In%20Development-orange.svg)](IMPLEMENTATION_STATUS.md)

---

## Features

### For Everyone (Free Tier)
- 📌 **50 Bookmarks** - Save your favorite websites
- ⭐ **Basic Ratings** - Rate websites 1-5 stars
- 🔖 **Categories** - Organize with basic categories
- 📱 **Single Device Sync** - Access on one device
- 📤 **CSV Export** - Export your bookmarks

### For Individuals (Pro - $4.99/month)
- ♾️ **Unlimited Bookmarks** - No limits
- 🤖 **AI Recommendations** - Smart suggestions powered by Harbor AI
- 🔄 **Multi-Device Sync** - Real-time sync across all devices
- 🏷️ **Unlimited Tags & Categories** - Advanced organization
- 📝 **Rich Notes** - Add detailed annotations
- ⚡ **Priority Support** - Fast help when you need it
- 📊 **Export to Multiple Formats** - JSON, HTML, CSV

### For Teams ($19/month)
- 👥 **Up to 5 Team Members** - Collaborate with your team
- 🤝 **Shared Collections** - Create and share bookmark collections
- 📈 **Team Analytics** - Track team usage and insights
- 🔐 **Advanced Permissions** - Control who can see what
- 🔑 **SSO Support** - Enterprise authentication
- 🔌 **API Access** - 10,000 calls/month

### For Enterprises ($99/month)
- 🏢 **Unlimited Team Members** - Scale without limits
- 🔒 **Advanced Security** - SOC 2 compliance ready
- 🛠️ **Custom Integrations** - Build custom workflows
- 💬 **Dedicated Support** - Phone & Slack support
- 📋 **SLA Guarantee** - 99.9% uptime commitment
- 🎓 **Custom Training** - Onboarding for your team

---

## Screenshots

### New Tab Dashboard
![Dashboard](https://user-images.githubusercontent.com/68905333/210999306-bcee7347-f160-4ee7-a6af-b73441fbd4a1.png)

### Quick Popup
![Popup](https://user-images.githubusercontent.com/68905333/209943440-51456e1b-f783-4d8f-b237-33eff1a66d1a.png)

### AI-Powered Suggestions
![Suggestions](https://user-images.githubusercontent.com/68905333/209943379-c91b1185-2a71-4d17-909f-0f8fa25df307.png)

### Ratings & Reviews
![Reviews](https://user-images.githubusercontent.com/68905333/209943572-8a82c58f-c191-406b-bab1-ee744154497b.png)

---

## Quick Start

### Installation (Production)

Coming soon to Chrome Web Store! Get notified at [hookmarkpro.com](https://hookmarkpro.com)

### Development Setup

#### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 7+
- Stripe account (for payments)

#### 1. Clone the Repository

```bash
git clone https://github.com/ichoake/hookmark-pro.git
cd hookmark-pro
```

#### 2. Install Dependencies

**Frontend (Chrome Extension):**
```bash
npm install
```

**Backend API:**
```bash
cd backend
npm install
```

#### 3. Set Up Database

```bash
# Create PostgreSQL database
createdb hookmark_pro

# Run migrations
psql hookmark_pro < backend/database/migrations/001_initial_schema.sql
```

#### 4. Configure Environment

Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Edit `.env` with your credentials:
- Database URL
- Redis URL
- JWT secret
- Stripe keys
- Google OAuth credentials

See [Backend Setup Guide](backend/README.md) for details.

#### 5. Start Development Servers

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Chrome Extension:**
```bash
npm start
```

**Terminal 3 - Stripe Webhooks (optional):**
```bash
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
```

#### 6. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `build/` directory
5. Extension is now loaded!

---

## Tech Stack

### Frontend
- **React 17** - UI framework
- **Webpack 5** - Module bundler
- **Sass** - CSS preprocessor
- **Chrome Extension APIs** - Browser integration

### Backend
- **Node.js 18+** - Runtime
- **Express 4** - Web framework
- **PostgreSQL 14+** - Primary database
- **Redis 7+** - Caching layer
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Socket.io** - Real-time sync
- **Harbor AI** - Local LLM (zero cost)

### Infrastructure
- **Database**: Supabase / Railway
- **Cache**: Upstash Redis
- **Hosting**: Railway / Render / Fly.io
- **Monitoring**: Sentry
- **CI/CD**: GitHub Actions

---

## Project Structure

```
hookmark-pro/
├── backend/                    # Backend API
│   ├── auth/                   # Authentication module ✅
│   ├── payments/              # Stripe billing ✅
│   ├── bookmarks/             # Bookmarks API (pending)
│   ├── teams/                 # Teams & collaboration (pending)
│   ├── analytics/             # Analytics tracking (pending)
│   ├── sync/                  # Real-time sync (pending)
│   ├── ai/                    # AI integration (pending)
│   ├── config/                # Database & Redis config ✅
│   ├── database/              # Migrations ✅
│   └── server.js              # Express server ✅
├── src/                       # Chrome extension source
│   ├── components/            # React components
│   ├── pages/                 # Extension pages
│   ├── popup/                 # Browser popup
│   ├── newtab/               # New tab page
│   └── background/           # Background scripts
├── public/                    # Static assets
├── build/                     # Built extension
└── docs/                      # Documentation
    ├── PREMIUM_ARCHITECTURE.md   # Technical architecture
    ├── IMPLEMENTATION_STATUS.md  # Current progress
    └── Monetization-Plan.md      # Business plan
```

---

## Documentation

### For Developers
- **[Premium Architecture](PREMIUM_ARCHITECTURE.md)** - Technical design and database schema
- **[Implementation Status](IMPLEMENTATION_STATUS.md)** - Current progress and roadmap
- **[Backend README](backend/README.md)** - API documentation
- **[Auth Testing Guide](backend/auth/AUTH_TESTING.md)** - Authentication endpoints
- **[Payments Testing Guide](backend/payments/PAYMENTS_TESTING.md)** - Stripe integration
- **[Payments Module](backend/payments/README.md)** - Billing system overview

### For Business
- **[Monetization Plan](~/Documents/Hookmark/Help/Hookmark-Pro-Monetization-Plan.md)** - Revenue strategy and projections
- **[Development Links](~/Documents/Hookmark/Help/Chrome-Extension-Development-Links.md)** - Hookmark macOS integration

---

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /signup` - Register new user
- `POST /login` - Email/password login
- `POST /google` - Google OAuth login
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout (protected)
- `DELETE /account` - Deactivate account (protected)

### Payments (`/api/v1/payments`)
- `GET /pricing` - Get pricing tiers (public)
- `POST /create-checkout-session` - Start subscription (protected)
- `POST /create-portal-session` - Manage subscription (protected)
- `GET /subscription` - Get subscription status (protected)
- `POST /cancel-subscription` - Cancel subscription (protected)
- `POST /reactivate-subscription` - Reactivate subscription (protected)
- `POST /webhook` - Stripe webhooks (signature verified)

### Bookmarks (`/api/v1/bookmarks`) - Coming Soon
- CRUD operations for bookmarks
- Rating system
- Categories and tags
- Search and filtering

### Teams (`/api/v1/teams`) - Coming Soon
- Team management
- Member invitations
- Shared collections

### Analytics (`/api/v1/analytics`) - Coming Soon
- Usage tracking
- Team insights
- Export data

---

## Development Status

**Overall Progress: 35% Complete**

✅ **Completed:**
- Planning & Architecture (100%)
- Backend Infrastructure (100%)
- Authentication Module (100%)
- Payment Module (100%)
- Database Schema (100%)

⏳ **In Progress:**
- Bookmarks API (0%)
- Real-time Sync (0%)
- Teams & Collaboration (0%)

📋 **Planned:**
- Analytics API
- AI Integration (Harbor)
- Frontend Integration
- Testing & QA
- Production Deployment

See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for detailed progress.

---

## Revenue Projections

### Year 1
- Free users: 500
- Pro users: 100 → **$59,880/year**
- Teams: 5 → **$11,400/year**
- **Total: $67,000**

### Year 2
- Free users: 2,000
- Pro users: 250 → **$149,700/year**
- Teams: 15 → **$34,200/year**
- Enterprise: 2 → **$23,760/year**
- **Total: $157,000**

**ROI Year 1**: 72x
**ROI Year 2**: 157x

See [Monetization Plan](~/Documents/Hookmark/Help/Hookmark-Pro-Monetization-Plan.md) for full details.

---

## Testing

### Backend API

```bash
# Test authentication
cd backend
npm test auth

# Test payments (requires Stripe CLI)
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
npm test payments

# Manual testing with curl
curl http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"John","lastName":"Doe"}'
```

### Chrome Extension

```bash
# Start dev server
npm start

# Build for production
npm run build

# Load in Chrome at chrome://extensions
```

---

## Deployment

### Backend (Railway/Render/Fly.io)

```bash
# Set environment variables
railway login
railway init
railway add

# Deploy
railway up
```

### Database (Supabase)

1. Create project at https://supabase.com
2. Copy database URL
3. Run migrations
4. Update `.env` with production URL

### Chrome Web Store

1. Build production version: `npm run build`
2. Create ZIP: `cd build && zip -r hookmark-pro.zip *`
3. Submit at https://chrome.google.com/webstore/devconsole
4. Wait for review (typically 1-3 days)

---

## Contributing

This is a proprietary project. Contributions are currently limited to the core team.

If you find a bug or have a feature request, please open an issue.

---

## License

Proprietary - © 2024 Steven Choake / Passive Income Empire

Based on the open-source [Hookmark extension](https://github.com/hdck007/hookmark) by [@hdck007](https://github.com/hdck007).

---

## Support

- **Email**: support@hookmarkpro.com
- **Documentation**: [Read the Docs](docs/)
- **Status Page**: [status.hookmarkpro.com](https://status.hookmarkpro.com)

---

## Acknowledgments

- Original Hookmark extension by [@hdck007](https://github.com/hdck007)
- Powered by [Harbor AI](https://github.com/ichoake/harbor) for zero-cost LLM features
- Part of [Passive Income Empire](https://github.com/ichoake/passive-income-empire) marketplace

---

**Built with ❤️ by [Steven Choake](https://github.com/ichoake)**

**Status**: In Development | **Launch**: Q1 2025 | **Version**: 2.0.0
