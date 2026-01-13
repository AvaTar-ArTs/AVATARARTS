# Hookmark Pro Backend API

Premium SaaS backend for Hookmark Pro Chrome extension.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
nano .env
```

### Database Setup

```bash
# Create database
createdb hookmark_pro

# Run migrations
psql hookmark_pro < database/migrations/001_initial_schema.sql

# Verify
psql hookmark_pro -c "\dt"
```

### Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will be available at `http://localhost:5000`

---

## API Endpoints

### Health Check
```
GET /health
```

### API Root
```
GET /api/v1
```

### Authentication (To Implement)
```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/google
GET    /api/v1/auth/me
POST   /api/v1/auth/logout
```

### Bookmarks (To Implement)
```
GET    /api/v1/bookmarks
POST   /api/v1/bookmarks
GET    /api/v1/bookmarks/:id
PUT    /api/v1/bookmarks/:id
DELETE /api/v1/bookmarks/:id
```

### Analytics (To Implement)
```
GET /api/v1/analytics/overview
GET /api/v1/analytics/visits
GET /api/v1/analytics/ratings
```

### Payments (To Implement)
```
POST   /api/v1/payments/checkout
POST   /api/v1/payments/webhook
GET    /api/v1/payments/subscription
POST   /api/v1/payments/cancel
```

### Teams (To Implement)
```
GET    /api/v1/teams
POST   /api/v1/teams
GET    /api/v1/teams/:id
PUT    /api/v1/teams/:id
DELETE /api/v1/teams/:id
```

---

## Project Structure

```
backend/
├── auth/              # Authentication logic
├── payments/          # Stripe integration
├── sync/              # WebSocket sync
├── analytics/         # Analytics & metrics
├── ai/                # Harbor AI integration
├── teams/             # Team collaboration
├── config/            # Configuration files
│   ├── database.js
│   └── redis.js
├── middleware/        # Express middleware
├── utils/             # Helper functions
├── database/
│   └── migrations/    # SQL migrations
├── server.js          # Main server file
├── package.json
└── .env.example       # Environment template
```

---

## Environment Variables

See `.env.example` for all required variables.

**Required**:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens
- `STRIPE_SECRET_KEY` - Stripe API key

**Optional**:
- `HARBOR_BOOST_URL` - Harbor AI endpoint (default: http://localhost:8080/v1)
- `SENDGRID_API_KEY` - Email service
- `GOOGLE_CLIENT_ID` - OAuth login

---

## Database Schema

### Core Tables
- `users` - User accounts
- `subscriptions` - Stripe subscriptions
- `bookmarks` - User bookmarks
- `teams` - Team accounts
- `team_members` - Team membership
- `collections` - Shared bookmark collections
- `analytics_events` - Usage tracking
- `api_keys` - API access tokens
- `comments` - Collaboration comments
- `exports` - Export jobs

---

## Development

### Code Structure (To Implement)

Each module should follow this pattern:

```
auth/
├── authController.js   # Route handlers
├── authService.js      # Business logic
├── authMiddleware.js   # Express middleware
├── authValidation.js   # Input validation
└── authRoutes.js       # Express routes
```

### Adding a New Feature

1. Create module folder (e.g., `auth/`)
2. Implement controller, service, routes
3. Add routes to `server.js`
4. Write tests
5. Update API documentation

---

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## Deployment

### Database Migrations

```bash
# Production migration
psql $DATABASE_URL < database/migrations/001_initial_schema.sql
```

### Environment

Set these in production:
- `NODE_ENV=production`
- Secure `JWT_SECRET`
- Enable SSL for PostgreSQL
- Use production Stripe keys

---

## Integration with Harbor AI

Hookmark Pro uses Harbor Boost for AI features:

```javascript
const axios = require('axios');

const categorize = async (title, url) => {
  const response = await axios.post(`${process.env.HARBOR_BOOST_URL}/chat/completions`, {
    model: 'llama-3.1-70b',
    messages: [{
      role: 'user',
      content: `Categorize this bookmark: ${title}`
    }]
  });

  return response.data.choices[0].message.content;
};
```

**Cost**: $0/token (local LLM via Harbor)

---

## Reusable Code Sources

### Authentication
Copy from: `~/workspace/cleanconnect-complete/backend/src/middleware/auth.js`

### Payments (Stripe)
Copy from: `~/workspace/cleanconnect-complete/backend/src/payments/`

### Billing Logic
Copy from: `~/workspace/retention-suite-complete/saas-applications/billing/`

---

## Next Steps

### Phase 1 (Week 1) - Foundation
- [ ] Implement authentication module
- [ ] Integrate Stripe payments
- [ ] Set up WebSocket server
- [ ] Create basic bookmark CRUD

### Phase 2 (Week 2) - Core Features
- [ ] Analytics dashboard API
- [ ] Export functionality
- [ ] AI categorization
- [ ] Rate limiting

### Phase 3 (Week 3) - Teams
- [ ] Team management API
- [ ] Shared collections
- [ ] Collaboration features
- [ ] Admin dashboard API

### Phase 4 (Week 4) - Polish
- [ ] Testing
- [ ] Documentation
- [ ] Performance optimization
- [ ] Security audit

---

## Links

- Frontend: `../src/`
- Architecture: `../PREMIUM_ARCHITECTURE.md`
- Monetization Plan: `~/Documents/Hookmark/Help/Hookmark-Pro-Monetization-Plan.md`

---

**Status**: Backend structure created, ready for implementation
**Last Updated**: December 26, 2024
