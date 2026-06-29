# API Reference

Base URL: `http://localhost:4000/api`

Swagger docs: `http://localhost:4000/api/docs`

## Authentication

All protected endpoints require `Authorization: Bearer <token>` header.

### POST /auth/register
Register a new user.
```json
Request: { "email": "user@example.com", "password": "pass123", "firstName": "Ali", "lastName": "Rezaei", "role": "CUSTOMER" }
Response: { "data": { "user": {...}, "accessToken": "...", "refreshToken": "..." } }
```

### POST /auth/login
Login.
```json
Request: { "email": "user@example.com", "password": "pass123" }
Response: { "data": { "user": {...}, "accessToken": "...", "refreshToken": "..." } }
```

### GET /auth/profile
Get current user profile. 🔒

---

## Books

### GET /books
List books with search and filters.
```
Query: ?search=هدایت&category=novel&minPrice=50000&maxPrice=200000&page=1&limit=20
Response: { "data": [...books], "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 } }
```

### GET /books/:id
Get book detail with reviews and categories.

### POST /books
Create a new book. 🔒 SELLER only.
```json
Request: { "title": "بوف کور", "author": "صادق هدایت", "price": 85000, "stock": 25, "categoryIds": ["..."] }
```

### PUT /books/:id
Update a book. 🔒 SELLER only (owner).

### DELETE /books/:id
Delete a book. 🔒 SELLER only (owner).

---

## Cart

### GET /cart
Get current user's cart. 🔒

### POST /cart/items
Add item to cart. 🔒
```json
Request: { "bookId": "...", "quantity": 2 }
```

### PUT /cart/items/:itemId
Update item quantity. 🔒
```json
Request: { "quantity": 3 }
```

### DELETE /cart/items/:itemId
Remove item from cart. 🔒

### DELETE /cart
Clear entire cart. 🔒

---

## Orders

### POST /orders
Create order from cart. 🔒
```json
Request: { "shippingAddress": { "street": "...", "city": "تهران", "province": "تهران", "postalCode": "1234567890" }, "note": "optional" }
```

### GET /orders
List user's orders. 🔒

### GET /orders/:id
Get order detail. 🔒

### DELETE /orders/:id
Cancel order (PENDING only). 🔒

---

## Reviews

### GET /reviews/book/:bookId
List reviews for a book.

### POST /reviews/book/:bookId
Add a review. 🔒 (must be a buyer)
```json
Request: { "rating": 5, "comment": "عالی بود" }
```

### PUT /reviews/:id
Update own review. 🔒

### DELETE /reviews/:id
Delete own review. 🔒

### GET /reviews/my
List current user's reviews. 🔒

---

## Seller

### GET /seller/profile
Get seller profile. 🔒

### POST /seller/profile
Create seller profile. 🔒 SELLER

### GET /seller/dashboard
Get dashboard stats. 🔒 SELLER

### GET /seller/books
List seller's books. 🔒 SELLER

### GET /seller/orders
List seller's orders. 🔒 SELLER

### GET /seller/wallet
List wallet transactions. 🔒 SELLER

### PATCH /seller/orders/:orderId/status
Update order status. 🔒 SELLER
```json
Request: { "status": "SHIPPED" }
```

---

## Admin

### GET /admin/dashboard
Get admin dashboard stats. 🔒 ADMIN

### GET /admin/sellers
List all sellers. 🔒 ADMIN

### PATCH /admin/sellers/:id/approve
Approve a seller. 🔒 ADMIN

### PATCH /admin/sellers/:id/reject
Reject a seller. 🔒 ADMIN

### PATCH /admin/sellers/:id/commission
Set seller commission rate. 🔒 ADMIN
```json
Request: { "rate": 15 }
```

### GET /admin/orders
List all orders. 🔒 ADMIN

### GET /admin/reviews
List all reviews. 🔒 ADMIN

### DELETE /admin/reviews/:id
Delete a review. 🔒 ADMIN

---

## Users

### GET /users
List all users. 🔒 ADMIN

### GET /users/seller/stats
Get seller stats. 🔒 SELLER

### GET /users/:id
Get user detail. 🔒 ADMIN

### PATCH /users/:id/toggle-active
Toggle user active status. 🔒 ADMIN

### PATCH /users/:id/role
Change user role. 🔒 ADMIN
```json
Request: { "role": "SELLER" }
```

---

## Payments

### POST /payments/wallet/topup
Top up seller wallet. 🔒 SELLER
```json
Request: { "amount": 1000000 }
```

### GET /payments/wallet/summary
Get wallet summary. 🔒 SELLER

### POST /payments/deduct-commission/:orderId
Deduct commission from order. 🔒 ADMIN

---

## Categories

### GET /categories
List all categories (tree structure).

### GET /categories/:id
Get category detail with books.

### POST /categories
Create category. 🔒 ADMIN

### PUT /categories/:id
Update category. 🔒 ADMIN

### DELETE /categories/:id
Delete category. 🔒 ADMIN

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (wrong role) |
| 404 | Not found |
| 500 | Server error |
