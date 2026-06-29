# Frontend Guide (Next.js)

## Getting Started

```bash
cd frontend
npm install
npm run dev    # Start dev server (port 3000)
```

## App Router Structure

All pages use Next.js App Router with file-based routing:

```
app/
├── layout.tsx              # Root layout (RTL + font + providers)
├── providers.tsx           # TanStack Query + Toast providers
├── page.tsx                # Homepage
├── globals.css             # Tailwind + Vazirmatn font
├── (auth)/
│   ├── login/page.tsx      # Login (route group, no layout change)
│   └── register/page.tsx
├── books/
│   ├── page.tsx            # Book listing + search
│   └── [id]/page.tsx       # Book detail (dynamic route)
├── cart/page.tsx
├── checkout/page.tsx       # Multi-step checkout
├── orders/page.tsx
├── seller/
│   ├── page.tsx            # Vendor dashboard
│   ├── products/page.tsx
│   ├── orders/page.tsx
│   └── wallet/page.tsx
├── admin/
│   ├── page.tsx            # Admin dashboard (charts)
│   ├── users/page.tsx
│   ├── sellers/page.tsx
│   └── categories/page.tsx
├── contact/page.tsx
├── faq/page.tsx
├── terms/page.tsx
└── privacy/page.tsx
```

## RTL Setup

The entire UI is in Persian (Farsi) with RTL direction:

```tsx
// app/layout.tsx
<html lang="fa" dir="rtl">
  <body className="font-vazir min-h-screen flex flex-col">
```

```css
/* globals.css */
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');

html {
  direction: rtl;
}

body {
  font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
}
```

## State Management

### Zustand Stores

**Auth Store** (`lib/store.ts`):
```typescript
const { user, isAuthenticated, login, logout, loadUser } = useAuthStore();
```

**Cart Store** (`lib/cart-store.ts`):
```typescript
const { items, totalAmount, itemCount, addItem, removeItem, fetchCart } = useCartStore();
```

### TanStack Query

Used for server state (API data):
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['books', search, category],
  queryFn: async () => {
    const { data } = await api.get('/books', { params: { search, category } });
    return data;
  },
});
```

Mutations:
```typescript
const mutation = useMutation({
  mutationFn: (newData) => api.post('/endpoint', newData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['data'] });
    toast.success('موفقیت‌آمیز');
  },
});
```

## Component Patterns

### Reusable UI Components

Located in `components/ui/`:
- `Button` — Variants: primary, secondary, danger, ghost
- `Card` — With optional hover effect
- `Badge` — Status indicators
- `Pagination` — Page navigation
- `ConfirmDialog` — Modal confirmations
- `LoadingSkeleton` — Loading states

### Page Component Pattern

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function SomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['some-data'],
    queryFn: async () => {
      const { data } = await api.get('/endpoint');
      return data;
    },
  });

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

## API Client

All API calls go through `lib/api.ts`:
- Base URL: `http://localhost:4000/api`
- Auto-attaches JWT from localStorage
- Auto-redirects to login on 401

```typescript
import api from '@/lib/api';

// GET
const { data } = await api.get('/books');

// POST
const { data } = await api.post('/orders', { shippingAddress });

// PATCH
await api.patch(`/users/${id}/toggle-active`);

// DELETE
await api.delete(`/cart/items/${itemId}`);
```

## Adding a New Page

1. Create `app/newpage/page.tsx`
2. Add `'use client'` directive (if using hooks)
3. Use TanStack Query for data fetching
4. Use Zustand stores for global state
5. Follow Persian UI conventions

## Adding a New Component

1. Create in `components/` (ui for reusable, feature-specific folders)
2. Use Tailwind classes (no custom CSS)
3. Follow RTL layout conventions
4. Export as default

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, RTL, font, providers |
| `app/providers.tsx` | TanStack Query + Toast setup |
| `lib/api.ts` | Axios client with JWT interceptor |
| `lib/store.ts` | Auth Zustand store |
| `lib/cart-store.ts` | Cart Zustand store |
| `lib/utils.ts` | formatPrice, formatDate, etc. |
| `types/index.ts` | TypeScript interfaces |
| `tailwind.config.ts` | Theme, colors, font |
