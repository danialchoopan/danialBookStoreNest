# Phase 1: Project Structure & Prisma Schema

---

## Directory Structure (Separated Backend / Frontend)

```
booknestjsshop/
├── docker-compose.yml
├── .env
├── .env.example
├── .gitignore
├── README.md
│
├── backend/                        # NestJS API
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── interceptors/
│   │   │   └── pipes/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── books/
│   │   │   ├── categories/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── seller/
│   │   │   └── admin/
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       ├── seed.ts
│   │       └── prisma.service.ts
│   ├── test/
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── package.json
│   └── .env
│
├── frontend/                       # Next.js (3 apps or 1 with routing)
│   ├── app/
│   │   ├── layout.tsx              # RTL root + Vazirmatn font
│   │   ├── page.tsx                # صفحه اصلی
│   │   ├── (auth)/login/page.tsx
│   │   ├── (auth)/register/page.tsx
│   │   ├── books/page.tsx
│   │   ├── books/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── seller/
│   │   │   ├── page.tsx            # داشبورد فروشنده
│   │   │   ├── products/page.tsx
│   │   │   └── orders/page.tsx
│   │   └── admin/
│   │       ├── page.tsx            # پنل مدیریت
│   │       ├── users/page.tsx
│   │       ├── sellers/page.tsx
│   │       └── categories/page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── books/
│   │   ├── cart/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── store.ts
│   │   └── utils.ts
│   ├── hooks/
│   ├── types/
│   ├── public/fonts/
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.local
│
└── prisma/
    └── migrations/
```

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CUSTOMER
  SELLER
  ADMIN
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  firstName     String
  lastName      String
  phone         String?   @unique
  role          Role      @default(CUSTOMER)
  avatar        String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sellerProfile SellerProfile?
  orders        Order[]
  cart          Cart?
  reviews       Review[]

  @@map("users")
}

model SellerProfile {
  id              String    @id @default(cuid())
  userId          String    @unique
  shopName        String
  shopSlug        String    @unique
  description     String?
  logo            String?
  balance         Decimal   @default(0) @db.Decimal(12, 2)
  commissionRate  Decimal   @default(10) @db.Decimal(5, 2)
  isApproved      Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id])
  books           Book[]
  walletTxns      WalletTransaction[]

  @@map("seller_profiles")
}

model Book {
  id            String    @id @default(cuid())
  sellerId      String
  title         String
  slug          String    @unique
  isbn          String?   @unique
  author        String
  publisher     String?
  description   String?
  price         Decimal   @db.Decimal(10, 2)
  comparePrice  Decimal?  @db.Decimal(10, 2)
  stock         Int       @default(0)
  images        String[]
  isPublished   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  seller        SellerProfile  @relation(fields: [sellerId], references: [id])
  categories    BookCategory[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
  reviews       Review[]

  @@index([sellerId])
  @@index([title, author])
  @@map("books")
}

model Category {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  parentId      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  parent        Category?    @relation("CategoryTree", fields: [parentId], references: [id])
  children      Category[]   @relation("CategoryTree")
  books         BookCategory[]

  @@map("categories")
}

model BookCategory {
  bookId       String
  categoryId   String

  book         Book       @relation(fields: [bookId], references: [id], onDelete: Cascade)
  category     Category   @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([bookId, categoryId])
  @@map("book_categories")
}

model Cart {
  id           String     @id @default(cuid())
  userId       String     @unique
  updatedAt    DateTime   @updatedAt

  user         User       @relation(fields: [userId], references: [id])
  items        CartItem[]

  @@map("carts")
}

model CartItem {
  id           String    @id @default(cuid())
  cartId       String
  bookId       String
  quantity     Int       @default(1)
  createdAt    DateTime  @default(now())

  cart         Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)
  book         Book      @relation(fields: [bookId], references: [id])

  @@unique([cartId, bookId])
  @@map("cart_items")
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  status          OrderStatus @default(PENDING)
  totalAmount     Decimal     @db.Decimal(12, 2)
  shippingAddress Json?
  note            String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]

  @@index([userId])
  @@map("orders")
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  bookId      String
  sellerId    String
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
  totalPrice  Decimal  @db.Decimal(10, 2)

  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  book        Book     @relation(fields: [bookId], references: [id])

  @@map("order_items")
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  bookId    String
  rating    Int      @db.SmallInt
  comment   String?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  book      Book     @relation(fields: [bookId], references: [id])

  @@unique([userId, bookId])
  @@map("reviews")
}

enum WalletTxnType {
  CREDIT
  DEBIT
}

model WalletTransaction {
  id          String       @id @default(cuid())
  sellerId    String
  amount      Decimal      @db.Decimal(12, 2)
  type        WalletTxnType
  description String?
  createdAt   DateTime     @default(now())

  seller      SellerProfile @relation(fields: [sellerId], references: [id])

  @@index([sellerId])
  @@map("wallet_transactions")
}
```

---

## Git Commit

```
git commit -m "feat(prisma): add initial schema with users, books, cart, orders, and wallet models"
```
