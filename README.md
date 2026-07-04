# 📚 BookNest — Multi-Vendor Bookstore Platform

> A full-stack multi-vendor bookstore with Persian RTL UI, built with Next.js + NestJS + SQLite (no Docker required).

[📖 فارسی](README_FA.md) | [🚀 Setup Guide](docs/SETUP.html) | [📖 Documentation](docs/index.html)

---

## Quick Start (No Docker)

```bash
git clone https://github.com/danialchoopan/danialBookStoreNest.git
cd booknestjsshop

# Backend
cd backend && npm install && npx prisma generate && npx prisma migrate dev --name init && npm run prisma:seed && npm run start:dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

Open **http://localhost:3000** — Login with `admin@booknest.ir` / `admin123`

**[Full Setup Guide →](docs/SETUP.html)**

---

## What's Included

| Feature | Description |
|---------|-------------|
| 🔐 Auth | JWT login, 3 roles (Admin/Seller/Customer), demo accounts |
| 📚 Books | 30 seeded books with ISBNs, search, filtering, pagination |
| 🛒 Cart | Add/remove/update, multi-step checkout |
| 📦 Orders | Status tracking timeline, 22 sample orders |
| ⭐ Reviews | 25 reviews with ratings and Persian comments |
| ❤️ Wishlist | Save books for later |
| 🏪 Seller Dashboard | Stats, products, orders, wallet with transactions |
| 👑 Admin Dashboard | Charts, user/vendor management, CSV reports |
| 🔍 Search | Autocomplete with book + category suggestions |
| 🌙 Dark Mode | Toggle with localStorage persistence |
| 📱 Mobile | Responsive design with touch-friendly targets |
| 📧 Email | Order confirmation + status update templates |
| 🔌 WebSocket | Live order status updates |
| 🛡️ Rate Limiting | API abuse protection |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React, Tailwind CSS, Zustand, TanStack Query |
| Backend | NestJS, Prisma ORM, Socket.io |
| Database | SQLite (local dev) / PostgreSQL (production) |
| Cache | Redis (optional) |

---

## Project Structure

```
booknestjsshop/
├── backend/          # NestJS API (port 4000) — 18 modules
├── frontend/         # Next.js App (port 3000) — 16 pages, RTL
├── docs/             # HTML documentation (10 pages)
├── docker-compose.yml
└── README.md
```

---

## Documentation

| Doc | Description |
|-----|-------------|
| [Setup Guide](docs/SETUP.html) | Step-by-step installation |
| [Architecture](docs/ARCHITECTURE.html) | System design, data flow |
| [Backend Guide](docs/BACKEND.html) | NestJS patterns, caching |
| [Frontend Guide](docs/FRONTEND.html) | Next.js, RTL, state management |
| [Database](docs/DATABASE.html) | Schema, relationships |
| [API Reference](docs/API.html) | All endpoints documented |
| [Swagger Guide](docs/SWAGGER.html) | How to test auth in Swagger |
| [Development](docs/DEVELOPMENT.html) | Conventions, adding features |
| [Deployment](docs/DEPLOYMENT.html) | Docker, production |

---

## License

MIT
