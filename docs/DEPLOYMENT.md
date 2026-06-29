# Deployment

## Docker (Development)

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

## Docker (Production)

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000
CMD ["npm", "run", "start:prod"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### Production docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: booknest
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: booknest_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U booknest']
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - '4000:4000'
    environment:
      DATABASE_URL: postgresql://booknest:${DB_PASSWORD}@postgres:5432/booknest_db
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  frontend:
    build: ./frontend
    ports:
      - '3000:3000'
    environment:
      NEXT_PUBLIC_API_URL: http://backend:4000/api

volumes:
  postgres_data:
  redis_data:
```

## Environment Variables for Production

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| REDIS_URL | Redis connection string | Yes |
| JWT_SECRET | Strong random string (32+ chars) | Yes |
| JWT_EXPIRES_IN | Token expiry (e.g., 7d) | No |
| PORT | Server port | No (default: 4000) |
| DB_PASSWORD | PostgreSQL password | Yes |

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use HTTPS (nginx/caddy reverse proxy)
- [ ] Enable Helmet in `main.ts`
- [ ] Set up rate limiting
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Monitor Redis memory usage
- [ ] Set up logging (Winston/Pino)
- [ ] Configure Next.js `output: 'standalone'`

## Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name api.booknest.ir;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name booknest.ir;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Scaling Notes

- **Database**: Use connection pooling (PgBouncer)
- **Cache**: Redis Cluster for high availability
- **Frontend**: CDN for static assets (Vercel/CloudFlare)
- **Backend**: Multiple instances behind load balancer
