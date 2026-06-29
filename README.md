# 📚 BookNest - Multi-Vendor Bookstore Platform

## Overview
BookNest is a full-stack multi-vendor bookstore platform built with Next.js and NestJS. Users can browse, search, and order books. Vendors manage their products and earnings. Admins control the entire platform.

[README فارسی](README_FA.md)

## Tech Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Zustand, TanStack Query
- **Backend:** NestJS, PostgreSQL, Prisma ORM, Redis
- **Infrastructure:** Docker, Docker Compose

## Features

### Customer
- JWT authentication with role-based access
- Advanced book search with category and price filters
- Multi-step checkout flow
- Order history and tracking
- Book reviews and ratings

### Vendor
- Dashboard with sales stats and revenue
- Product management (CRUD books)
- Order management with status workflow
- Wallet with top-up and transaction history

### Admin
- Dashboard with charts and system overview
- User management (activate/deactivate, role changes)
- Vendor management (approve/reject, commission settings)
- Category management with hierarchy
- Full order and review visibility

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- pnpm (recommended)

### Setup

```bash
# 1. Clone and install
git clone https://github.com/danialchoopan/danialBookStoreNest.git
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
| Vendor | seller1@booknest.ir | seller123 |
| Customer | customer1@booknest.ir | customer123 |

## Project Structure

```
booknestjsshop/
├── backend/              # NestJS API
│   ├── prisma/           # Schema & Seeds
│   └── src/
│       ├── common/       # Guards, Decorators, Filters, Interceptors, Redis
│       ├── modules/      # Auth, Books, Cart, Orders, Seller, Admin, Reviews, Payments
│       └── prisma/       # Prisma Service
├── frontend/             # Next.js App (RTL)
│   ├── app/              # Pages (Persian UI)
│   ├── components/       # UI Components
│   ├── lib/              # API Client, Stores, Utils
│   └── types/            # TypeScript Types
├── docker-compose.yml
├── README.md
└── README_FA.md
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/profile | Get current user | Yes |
| GET | /api/books | List books (search/filter) | No |
| GET | /api/books/:id | Book detail | No |
| POST | /api/books | Create book | Seller |
| PUT | /api/books/:id | Update book | Seller |
| DELETE | /api/books/:id | Delete book | Seller |
| GET | /api/cart | Get cart | Yes |
| POST | /api/cart/items | Add to cart | Yes |
| PUT | /api/cart/items/:id | Update quantity | Yes |
| DELETE | /api/cart/items/:id | Remove item | Yes |
| POST | /api/orders | Create order | Yes |
| GET | /api/orders | My orders | Yes |
| GET | /api/reviews/book/:id | Book reviews | No |
| POST | /api/reviews/book/:id | Add review | Yes |
| GET | /api/seller/dashboard | Vendor dashboard | Seller |
| GET | /api/seller/books | Vendor's books | Seller |
| GET | /api/seller/orders | Vendor's orders | Seller |
| POST | /api/payments/wallet/topup | Top up wallet | Seller |
| GET | /api/admin/dashboard | Admin dashboard | Admin |
| GET | /api/admin/sellers | List vendors | Admin |
| PATCH | /api/admin/sellers/:id/approve | Approve vendor | Admin |
| PATCH | /api/admin/sellers/:id/commission | Set commission | Admin |
| GET | /api/users | List users | Admin |

## Environment Variables

See `.env.example` for required variables:

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection | Required |
| REDIS_URL | Redis connection | Required |
| JWT_SECRET | JWT signing secret | Required |
| JWT_EXPIRES_IN | Token expiry | 7d |
| PORT | Backend port | 4000 |

## License

MIT
