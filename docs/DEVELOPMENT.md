# Development Guide

## Environment Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Environment Variables

Copy `.env.example` to `.env` in both `backend/` and `frontend/`:

**Backend `.env`:**
```
DATABASE_URL="postgresql://booknest:booknest_secret@localhost:5432/booknest_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-here"
JWT_EXPIRES_IN="7d"
PORT=4000
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Coding Conventions

### TypeScript
- Use strict TypeScript (`strict: true`)
- Define interfaces in `types/` (frontend) or inline in service files (backend)
- Prefer `interface` over `type` for object shapes

### Naming

| Item | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `auth.service.ts` |
| Components | PascalCase | `BookCard.tsx` |
| Variables | camelCase | `bookList` |
| Constants | UPPER_SNAKE | `API_BASE_URL` |
| DB tables | snake_case | `order_items` |
| DB models | PascalCase | `OrderItem` |

### File Organization

**Backend modules:** Follow NestJS convention:
```
module/
├── dto/           # Validation classes
├── module.ts      # NestJS module
├── controller.ts  # Route handlers
└── service.ts     # Business logic
```

**Frontend components:**
```
components/
├── ui/            # Generic, reusable (Button, Card, Modal)
├── layout/        # Header, Footer, Sidebar
└── [feature]/     # Feature-specific (books/, cart/)
```

### CSS / Tailwind
- Use Tailwind utility classes only
- No custom CSS unless absolutely necessary
- Follow the color palette in `tailwind.config.ts`
- Use `font-vazir` class for Persian text
- All layouts must be RTL-compatible

### API Calls
- Always go through `lib/api.ts`
- Use TanStack Query for all data fetching
- Handle loading and error states
- Show Persian toast messages for success/error

## Adding a New Feature

### Backend (New Endpoint)

1. **Create DTO** in `modules/feature/dto/`:
```typescript
export class CreateFeatureDto {
  @IsString()
  name: string;
}
```

2. **Add to Service** in `modules/feature/feature.service.ts`:
```typescript
async create(dto: CreateFeatureDto) {
  return this.prisma.feature.create({ data: dto });
}
```

3. **Add to Controller** in `modules/feature/feature.controller.ts`:
```typescript
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
create(@Body() dto: CreateFeatureDto) {
  return this.service.create(dto);
}
```

4. **Register Module** in `app.module.ts`

5. **Update Schema** if needed: `npx prisma migrate dev --name add_feature`

### Frontend (New Page)

1. **Create page** in `app/feature/page.tsx`:
```tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function FeaturePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['feature'],
    queryFn: async () => {
      const { data } = await api.get('/feature');
      return data;
    },
  });

  if (isLoading) return <div>بارگذاری...</div>;

  return <div>{/* Content */}</div>;
}
```

2. **Add navigation link** in `Header.tsx` if needed

## Testing

```bash
# Backend unit tests
cd backend && npm run test

# Backend e2e tests
cd backend && npm run test:e2e

# Frontend lint
cd frontend && npm run lint
```

## Git Workflow

### Commit Messages
Follow Conventional Commits:
```
feat(scope): description
fix(scope): description
docs(scope): description
refactor(scope): description
```

Examples:
```
feat(books): add advanced filtering
fix(auth): handle expired JWT
docs(api): update endpoint documentation
```

### Branches
- `main` — Production-ready code
- `develop` — Development branch
- `feature/*` — New features
- `fix/*` — Bug fixes

## Common Tasks

### Add a new category
```bash
# Via API
curl -X POST http://localhost:4000/api/categories \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "دسته جدید"}'
```

### Reset database
```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

### View database
```bash
npx prisma studio
```

### Clear Redis cache
```bash
redis-cli FLUSHDB
```
