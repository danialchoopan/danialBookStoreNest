# 📚 BookNest Developer Documentation

Welcome to the BookNest multi-vendor bookstore platform. This documentation is for developers who want to understand, maintain, or extend the codebase.

## Table of Contents

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | System architecture, tech stack, data flow |
| [Backend Guide](./BACKEND.md) | NestJS modules, API endpoints, database schema |
| [Frontend Guide](./FRONTEND.md) | Next.js pages, components, state management |
| [Database Schema](./DATABASE.md) | Prisma models, relationships, migrations |
| [API Reference](./API.md) | Complete API endpoint documentation |
| [Development Guide](./DEVELOPMENT.md) | Setup, environment, coding conventions |
| [Deployment](./DEPLOYMENT.md) | Docker, production setup |

## Quick Start for New Developers

```bash
# 1. Clone the repo
git clone https://github.com/danialchoopan/danialBookStoreNest.git
cd booknestjsshop

# 2. Start infrastructure
docker-compose up -d

# 3. Setup backend
cd backend
cp ../.env.example .env
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev

# 4. Setup frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | SSR/CSR React framework |
| UI | Tailwind CSS | Utility-first CSS |
| State | Zustand | Lightweight state management |
| Data Fetching | TanStack Query | Server state management |
| Backend | NestJS | TypeScript Node.js framework |
| Database | PostgreSQL | Primary database |
| ORM | Prisma | Type-safe database access |
| Cache | Redis | Response caching |
| Auth | JWT | Stateless authentication |

## Project Structure

```
booknestjsshop/
├── backend/                    # NestJS API server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Test data seeder
│   └── src/
│       ├── main.ts             # App entry point
│       ├── app.module.ts       # Root module
│       ├── common/             # Shared utilities
│       │   ├── decorators/     # Custom decorators
│       │   ├── guards/         # Auth & role guards
│       │   ├── filters/        # Exception filters
│       │   ├── interceptors/   # Response transformers
│       │   └── redis/          # Redis service
│       ├── modules/            # Feature modules
│       │   ├── auth/           # Authentication
│       │   ├── books/          # Book CRUD
│       │   ├── cart/           # Shopping cart
│       │   ├── orders/         # Order management
│       │   ├── seller/         # Vendor features
│       │   ├── admin/          # Admin features
│       │   ├── reviews/        # Book reviews
│       │   ├── payments/       # Wallet & payments
│       │   ├── users/          # User management
│       │   └── categories/     # Categories
│       └── prisma/             # Prisma service
├── frontend/                   # Next.js application
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx          # Root layout (RTL)
│   │   ├── page.tsx            # Homepage
│   │   ├── (auth)/             # Auth pages
│   │   ├── books/              # Book listing & detail
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   ├── orders/             # Order history
│   │   ├── seller/             # Vendor dashboard
│   │   ├── admin/              # Admin dashboard
│   │   └── contact/            # Contact page
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Header, Footer
│   │   └── books/              # Book-specific components
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # Axios API client
│   │   ├── store.ts            # Auth Zustand store
│   │   ├── cart-store.ts       # Cart Zustand store
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript types
└── docker-compose.yml          # Infrastructure
```

## Roles & Permissions

| Role | Access |
|------|--------|
| `CUSTOMER` | Browse, search, cart, checkout, orders, reviews |
| `SELLER` | All customer features + product management, wallet, order fulfillment |
| `ADMIN` | All features + user management, vendor approval, commission, categories |

## Key Concepts

1. **RTL Layout** — All UI is in Persian with right-to-left direction
2. **Multi-Vendor** — Each book belongs to a seller; orders can contain items from multiple sellers
3. **Wallet System** — Sellers have wallets; commissions are deducted from sales
4. **Role Guards** — Backend enforces access control via `@Roles()` decorator
5. **Redis Caching** — Book listings are cached for 5 minutes with pattern-based invalidation
