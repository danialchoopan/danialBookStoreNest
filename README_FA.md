# 📚 کتاب‌نست - پلتفرم فروشگاه کتاب چند فروشنده‌ای

## معرفی
کتاب‌نست یک پلتفرم فروشگاه آنلاین کتاب با قابلیت چند فروشنده است. کاربران می‌توانند کتاب‌ها را جستجو کنند، سبد خرید تشکیل دهند و سفارش دهند. فروشندگان می‌توانند محصولات خود را مدیریت کنند و درآمد کسب کنند. مدیران کل سیستم را کنترل می‌کنند.

## فناوری‌ها
- **فرانتند:** Next.js 14 (App Router)، React، Tailwind CSS، Zustand، TanStack Query
- **بک‌اند:** NestJS، PostgreSQL، Prisma ORM، Redis
- **زیرساخت:** Docker، Docker Compose

## امکانات
### کاربر عادی
- ثبت‌نام و ورود با JWT
- جستجوی پیشرفته کتاب‌ها با فیلتر دسته‌بندی و قیمت
- سبد خرید و تسویه حساب چند مرحله‌ای
- مشاهده تاریخچه سفارشات
- ثبت نظر و امتیاز برای کتاب‌ها

### فروشنده
- داشبورد فروشنده با آمار فروش و درآمد
- مدیریت محصولات (افزودن، ویرایش، حذف کتاب)
- مدیریت سفارشات و تغییر وضعیت
- کیف پول و شارژ حساب

### مدیر کل
- داشبورد مدیر با نمودارها و آمار کلی
- مدیریت کاربران (فعال/غیرفعال، تغییر نقش)
- مدیریت فروشندگان (تأیید، رد، تنظیم کمیسیون)
- مدیریت دسته‌بندی‌ها
- مشاهده همه سفارشات و نظرات

## شروع سریع
### پیش‌نیازها
- Node.js 18+
- Docker و Docker Compose
- pnpm (توصیه شده)

### راه‌اندازی
```bash
# ۱. کلون و نصب وابسته‌ها
git clone <repo-url>
cd booknestjsshop

# ۲. راه‌اندازی Docker (PostgreSQL + Redis)
docker-compose up -d

# ۳. راه‌اندازی بک‌اند
cd backend
cp ../.env.example .env
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev

# ۴. راه‌اندازی فانتند (ترمینال جدید)
cd frontend
npm install
npm run dev
```

### دسترسی
- فانتند: http://localhost:3000
- بک‌اند API: http://localhost:4000/api
- مستندات Swagger: http://localhost:4000/api/docs

### حساب‌های آزمایشی
| نقش | ایمیل | رمز عبور |
|------|-------|----------|
| مدیر | admin@booknest.ir | admin123 |
| فروشنده | seller1@booknest.ir | seller123 |
| کاربر | customer1@booknest.ir | customer123 |

## ساختار پروژه
```
booknestjsshop/
├── backend/          # بک‌اند NestJS
│   ├── prisma/       # اسکیما و داده‌های اولیه
│   └── src/
│       ├── common/   # گاردها، دکوراتورها، فیلترها
│       ├── modules/  # ماژول‌ها (احراز هویت، کتاب‌ها، سبد خرید، سفارشات، فروشنده، مدیر، نظرات، پرداخت)
│       └── prisma/   # سرویس Prisma
├── frontend/         # اپلیکیشن Next.js
│   ├── app/          # صفحات (RTL)
│   ├── components/   # کامپوننت‌های UI
│   └── lib/          # کلاینت API، استورها
└── docker-compose.yml
```

## متغیرهای محیطی
فایل `.env.example` را ببینید:
- `DATABASE_URL` - اتصال PostgreSQL
- `REDIS_URL` - اتصال Redis
- `JWT_SECRET` - کلید امضای JWT
- `PORT` - پورت بک‌اند (پیش‌فرض: 4000)

## لایسنس
MIT
