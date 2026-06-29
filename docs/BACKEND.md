# Backend Guide (NestJS)

## Getting Started

```bash
cd backend
npm install
npx prisma migrate dev    # Run migrations
npm run prisma:seed       # Seed database
npm run start:dev         # Start dev server (port 4000)
```

## Module Structure

Every module follows this pattern:
```
modules/
└── feature/
    ├── dto/                # Data Transfer Objects (validation)
    │   ├── create-xxx.dto.ts
    │   └── query-xxx.dto.ts
    ├── feature.service.ts  # Business logic
    ├── feature.controller.ts # API routes
    └── feature.module.ts   # NestJS module definition
```

### Adding a New Module

1. Create folder: `src/modules/newmodule/`
2. Create files: `dto/`, `service.ts`, `controller.ts`, `module.ts`
3. Register in `app.module.ts` imports
4. Add Prisma models if needed

### Example: Adding a Notification Module

```typescript
// modules/notifications/notifications.service.ts
@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, message }
    });
  }
}
```

## Common Patterns

### Guards & Decorators

```typescript
// Protected route (requires JWT)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get('profile')
getProfile(@CurrentUser('id') userId: string) { ... }

// Role-restricted route
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get('admin-only')
adminOnly() { ... }
```

### DTO Validation

```typescript
// Using class-validator decorators
export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}
```

### Prisma Transactions

```typescript
// Multi-step operations in a single transaction
await this.prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData });
  await tx.book.update({ where: { id }, data: { stock: { decrement: qty } } });
  await tx.cartItem.deleteMany({ where: { cartId } });
  return order;
});
```

### Redis Caching

```typescript
// Cache-aside pattern
async findAll(query: QueryBooksDto) {
  const cacheKey = `books:${query.search}:${query.category}:${query.page}`;
  const cached = await this.redis.get(cacheKey);
  if (cached) return cached;

  const result = await this.prisma.book.findMany({ ... });
  await this.redis.set(cacheKey, result, 300); // 5 min TTL
  return result;
}

// Invalidate on write
async create(dto: CreateBookDto) {
  const book = await this.prisma.book.create({ data: dto });
  await this.redis.delPattern('books:*'); // Clear all book caches
  return book;
}
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/main.ts` | Bootstrap, global pipes, CORS, Swagger |
| `src/app.module.ts` | Root module, all imports |
| `src/prisma/prisma.service.ts` | Prisma client lifecycle |
| `src/common/guards/jwt-auth.guard.ts` | JWT validation |
| `src/common/guards/roles.guard.ts` | Role checking |
| `src/common/decorators/current-user.decorator.ts` | Extract user from request |
| `src/common/decorators/roles.decorator.ts` | Set required roles |
| `src/common/filters/all-exceptions.filter.ts` | Persian error messages |
| `src/common/interceptors/transform.interceptor.ts` | Response wrapping |
| `src/common/redis/redis.service.ts` | Redis client wrapper |

## Database Operations

### Run Migrations
```bash
npx prisma migrate dev              # Create new migration
npx prisma migrate dev --name NAME  # Named migration
npx prisma db push                  # Push without migration
```

### Reset Database
```bash
npx prisma migrate reset            # Reset + reseed
npm run prisma:seed                 # Seed only
```

### Prisma Studio
```bash
npx prisma studio                   # Visual database browser
```

## API Response Format

All responses are wrapped by `TransformInterceptor`:
```json
{
  "data": { ... },
  "success": true,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

Paginated responses include meta:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## Error Handling

Errors are caught by `AllExceptionsFilter` and return:
```json
{
  "statusCode": 400,
  "message": "این ایمیل قبلاً ثبت شده است",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```
