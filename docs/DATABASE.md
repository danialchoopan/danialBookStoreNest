# Database Schema

## Overview

The database uses PostgreSQL with Prisma ORM. All models are defined in `backend/prisma/schema.prisma`.

## Entity Relationship Diagram

```
User ──────────── SellerProfile ──── Book ──── BookCategory ──── Category
  │                    │                │
  ├── Cart ──── CartItem               ├── OrderItem ──── Order
  │                                        │
  ├── Order ──── OrderItem                 ├── Review
  │
  └── Review

SellerProfile ──── WalletTransaction
```

## Models

### User
Core authentication model.

| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| email | String (unique) | Login identifier |
| password | String | bcrypt hashed |
| firstName | String | Display name |
| lastName | String | Display name |
| phone | String? (unique) | Optional phone |
| role | Role enum | CUSTOMER, SELLER, ADMIN |
| avatar | String? | Profile image URL |
| isActive | Boolean | Can login? |
| createdAt | DateTime | Registration date |

### SellerProfile
Vendor profile linked to a User.

| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String (unique) | Links to User |
| shopName | String | Display name |
| shopSlug | String (unique) | URL slug |
| description | String? | About the shop |
| logo | String? | Logo URL |
| balance | Decimal(12,2) | Wallet balance |
| commissionRate | Decimal(5,2) | Default 10% |
| isApproved | Boolean | Admin approved? |

### Book
The core product model.

| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| sellerId | String | Owner seller |
| title | String | Book title |
| slug | String (unique) | URL slug |
| isbn | String? (unique) | ISBN number |
| author | String | Author name |
| publisher | String? | Publisher name |
| description | String? | Book description |
| price | Decimal(10,2) | Sale price |
| comparePrice | Decimal? | Original price (for discount) |
| stock | Int | Available quantity |
| images | String[] | Image URLs |
| isPublished | Boolean | Visible to customers? |

### Category
Hierarchical category tree (self-referencing).

| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| name | String | Category name |
| slug | String (unique) | URL slug |
| parentId | String? | Parent category (null = root) |

### Cart / CartItem
Shopping cart per user.

- **Cart**: One per user (`userId` unique)
- **CartItem**: Multiple per cart, unique on `(cartId, bookId)`

### Order / OrderItem
Purchase records.

- **Order**: Contains status, total, shipping address
- **OrderItem**: Per-book line item with `sellerId` for multi-vendor orders

### OrderStatus Enum
```
PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
                                      → CANCELLED
                                      → REFUNDED
```

### Review
User reviews for books. Unique on `(userId, bookId)`.

| Field | Type | Description |
|-------|------|-------------|
| rating | SmallInt | 1-5 stars |
| comment | String? | Review text |

### WalletTransaction
Financial ledger for sellers.

| Field | Type | Description |
|-------|------|-------------|
| amount | Decimal(12,2) | Transaction amount |
| type | WalletTxnType | CREDIT or DEBIT |
| description | String? | What it's for |

## Common Queries

### Find books with filters
```typescript
const where: Prisma.BookWhereInput = {
  isPublished: true,
  ...(search && {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } },
    ],
  }),
  ...(category && {
    categories: { some: { category: { slug: category } } },
  }),
};
```

### Multi-vendor order creation
```typescript
await prisma.$transaction(async (tx) => {
  // Create order
  const order = await tx.order.create({ data: { ... } });

  // Create order items (each with sellerId)
  for (const item of cart.items) {
    await tx.orderItem.create({
      data: {
        orderId: order.id,
        bookId: item.bookId,
        sellerId: item.book.sellerId, // Track which seller
        quantity: item.quantity,
        unitPrice: item.book.price,
        totalPrice: item.book.price * item.quantity,
      }
    });

    // Decrement stock
    await tx.book.update({
      where: { id: item.bookId },
      data: { stock: { decrement: item.quantity } }
    });
  }

  // Clear cart
  await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
});
```

## Migrations

```bash
# Create migration
npx prisma migrate dev --name add_reviews_table

# Apply pending migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```
