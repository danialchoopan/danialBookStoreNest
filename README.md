# BookNest - Multi-Vendor Bookstore Platform

## Overview
A full-stack multi-vendor bookstore platform built with Next.js and NestJS, featuring Persian (Farsi) RTL interface.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Zustand, TanStack Query
- **Backend:** NestJS, PostgreSQL, Prisma ORM, Redis
- **Infrastructure:** Docker, Docker Compose

## Features
- JWT Authentication with Role-based Access (Admin, Seller, Customer)
- Product Management (Books with ISBN, Authors, Categories)
- Advanced Search & Filtering
- Shopping Cart & Multi-step Checkout
- Order Management & History
- Seller Dashboard (Sales stats, Wallet, Product management)
- Admin Dashboard (Users, Sellers, Commission, Categories)
- Reviews & Ratings System
- Redis Caching
- Swagger API Documentation

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- pnpm (recommended)

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd booknestjsshop

# 2. Start Docker services (PostgreSQL + Redis)
docker-compose up -d

# 3. Setup Backend
cd backend
cp ../.env.example .env
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev

# 4. Setup Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Swagger Docs: http://localhost:4000/api/docs

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@booknest.ir | admin123 |
| Seller | seller1@booknest.ir | seller123 |
| Customer | customer1@booknest.ir | customer123 |

## Project Structure
```
booknestjsshop/
├── backend/          # NestJS API
│   ├── prisma/       # Schema & Seeds
│   └── src/
│       ├── common/   # Guards, Decorators, Filters, Interceptors
│       ├── modules/  # Auth, Books, Cart, Orders, Seller, Admin, Reviews, Payments
│       └── prisma/   # Prisma Service
├── frontend/         # Next.js App
│   ├── app/          # Pages (RTL)
│   ├── components/   # UI Components
│   └── lib/          # API Client, Stores
└── docker-compose.yml
```

## Environment Variables
See `.env.example` for required variables:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `JWT_SECRET` - JWT signing secret
- `PORT` - Backend port (default: 4000)

## License
MIT
