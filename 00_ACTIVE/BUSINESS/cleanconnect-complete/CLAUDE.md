# CleanConnect Pro - AI-Powered Airbnb Cleaning Marketplace

## Overview
Full-stack marketplace connecting Airbnb hosts with verified cleaning professionals. Features real-time booking, AI voice agents, and payment processing.

## Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS (in `frontend/`)
- **Backend**: Express.js + Node.js + PostgreSQL (in `backend/`)
- **Real-time**: Socket.io for live updates
- **Payments**: Stripe integration
- **AI**: OpenAI voice agents, GPT-4 for call center

## Key Files
- `backend/src/app.js` - Main API entry point
- `frontend/` - React SPA
- `code_intelligence_engine.py` - AST-based code analysis
- `openai_voice_agent.py` - Voice AI with GPT-4
- `heavenly_hands_call_center_agent.py` - Call center automation

## Commands
```bash
yarn dev          # Start both frontend + backend
yarn dev:api      # Backend only
yarn dev:frontend # Frontend only
yarn build        # Production build
yarn test         # Run all tests
yarn migrate      # Run database migrations
```

## Environment
Copy `.env` from `.env.example` or `env_example.txt`. Required:
- `DATABASE_URL` - PostgreSQL connection
- `STRIPE_SECRET_KEY` - Payment processing
- `JWT_SECRET` - Auth tokens
- `OPENAI_API_KEY` - Voice agents (load via `source ~/.env.d/loader.sh llm-apis`)

## Architecture
- RESTful API with JWT auth
- Real-time WebSocket events for bookings
- Rate limiting via express-rate-limit
- Helmet for security headers
- Winston for logging

## Completion: 75%
Remaining: E2E tests, production deployment, mobile app polish
