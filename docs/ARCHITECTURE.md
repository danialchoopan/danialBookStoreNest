# Architecture

## System Overview

BookNest follows a **monolithic frontend + separate backend** architecture:

```
┌─────────────────────────────────────────────────┐
│                    Client                        │
│         Next.js (App Router + RTL)              │
│         Port: 3000                              │
└──────────────────────┬──────────────────────────┘
                       │ HTTP/REST API
                       ▼
┌─────────────────────────────────────────────────┐
│                  Backend API                     │
│              NestJS + Prisma                    │
│              Port: 4000                         │
└──────┬──────────────────────┬───────────────────┘
       │                      │
       ▼                      ▼
┌──────────────┐    ┌──────────────────┐
│  PostgreSQL  │    │      Redis       │
│  Port: 5432  │    │  Port: 6379      │
└──────────────┘    └──────────────────┘
```

## Data Flow

### Authentication Flow
```
1. User submits email/password → POST /api/auth/login
2. Backend validates credentials via Prisma
3. Backend generates JWT (access + refresh tokens)
4. Frontend stores tokens in localStorage
5. Axios interceptor attaches Bearer token to all requests
6. JwtGuard validates token on protected routes
7. RolesGuard checks user role for authorized endpoints
```

### Order Flow
```
1. User adds books to cart → POST /api/cart/items
2. Cart items stored in database (Cart → CartItem → Book)
3. User proceeds to checkout → fills address
4. User submits order → POST /api/orders
5. Backend creates Order + OrderItems in a transaction
6. Stock is decremented for each book
7. Cart is cleared
8. Seller can update order status via PATCH /seller/orders/:id/status
```

### Caching Flow
```
1. GET /api/books → BooksService.findAll()
2. Check Redis for key: "books:{search}:{category}:{page}"
3. If cache HIT → return cached response
4. If cache MISS → query PostgreSQL, cache result (TTL: 300s)
5. When book is created/updated/deleted → invalidate pattern "books:*"
```

## Module Responsibilities

| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| `auth` | Register, login, JWT, profile | `auth.service.ts`, `jwt.strategy.ts` |
| `books` | CRUD, search, filtering | `books.service.ts` (uses Redis) |
| `cart` | Add/remove/update items | `cart.service.ts` |
| `orders` | Create from cart, history, cancel | `orders.service.ts` (uses transactions) |
| `seller` | Dashboard, products, orders, wallet | `seller.service.ts` |
| `admin` | Users, vendors, categories | `admin.service.ts` |
| `reviews` | CRUD with buyer-only restriction | `reviews.service.ts` |
| `payments` | Wallet top-up, commission | `payments.service.ts` |
| `users` | List, toggle active, role change | `users.service.ts` |
| `categories` | Tree structure, CRUD | `categories.service.ts` |

## Security Layers

1. **Global ValidationPipe** — Whitelists and transforms DTOs
2. **JwtAuthGuard** — Validates JWT on protected routes
3. **RolesGuard** — Checks `@Roles()` decorator against `user.role`
4. **AllExceptionsFilter** — Catches all exceptions, returns Persian messages
5. **TransformInterceptor** — Wraps responses in `{ data, success, timestamp }`
6. **CORS** — Allows `localhost:3000` and `localhost:3001`
7. **Helmet** — (add to main.ts for production)
