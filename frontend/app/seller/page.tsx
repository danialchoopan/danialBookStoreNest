'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: 'پرداخت شده', color: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'در حال پردازش', color: 'bg-purple-100 text-purple-700' },
  SHIPPED: { label: 'ارسال شده', color: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { label: 'تحویل شده', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700' },
};

export default function SellerDashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['seller-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/seller/dashboard');
      return data;
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard?.isApproved) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-5xl mb-5">⏳</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">در انتظار تأیید</h1>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          پروفایل فروشنده شما در انتظار تأیید مدیریت است. پس از تأیید، امکان فعالیت در پلتفرم را خواهید داشت.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-sm">
          <p className="text-sm text-yellow-700 text-center">
            معمولاً تأیید پروفایل فروشنده تا ۲۴ ساعت انجام می‌شود.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">داشبورد فروشنده</h1>
          <p className="text-gray-500 mt-1">خوش آمدید، {dashboard.shopName}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/seller/wallet"
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            کیف پول
          </Link>
          <Link
            href="/seller/products"
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            محصولات
          </Link>
          <Link
            href="/seller/orders"
            className="bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            سفارشات
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📚</div>
            <span className="text-blue-100 text-sm">محصولات</span>
          </div>
          <div className="text-3xl font-bold mb-1">{dashboard.totalBooks}</div>
          <p className="text-blue-100 text-sm">کتاب در فروشگاه</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📦</div>
            <span className="text-purple-100 text-sm">سفارشات</span>
          </div>
          <div className="text-3xl font-bold mb-1">{dashboard.totalOrders}</div>
          <p className="text-purple-100 text-sm">سفارش دریافت شده</p>
        </div>

        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">💰</div>
            <span className="text-primary-100 text-sm">فروش کل</span>
          </div>
          <div className="text-2xl font-bold mb-1">{formatPrice(dashboard.totalRevenue)}</div>
          <p className="text-primary-100 text-sm">تومان درآمد</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">💳</div>
            <span className="text-green-100 text-sm">کیف پول</span>
          </div>
          <div className="text-2xl font-bold mb-1">{formatPrice(dashboard.walletBalance)}</div>
          <p className="text-green-100 text-sm">تومان موجودی</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/seller/products" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-primary-200 transition-all group">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">افزودن محصول</h3>
          <p className="text-sm text-gray-500">کتاب جدید به فروشگاه اضافه کنید</p>
        </Link>

        <Link href="/seller/wallet" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-green-200 transition-all group">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">شارژ کیف پول</h3>
          <p className="text-sm text-gray-500">موجودی کیف پول خود را افزایش دهید</p>
        </Link>

        <Link href="/seller/orders" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-purple-200 transition-all group">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800 mb-1">مدیریت سفارشات</h3>
          <p className="text-sm text-gray-500">وضعیت سفارشات را بروزرسانی کنید</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">آخرین سفارشات</h2>
          <Link href="/seller/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            مشاهده همه →
          </Link>
        </div>

        {!dashboard.recentOrders?.length ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-500">هنوز سفارشی ثبت نشده است.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {dashboard.recentOrders.map((item: any) => {
              const status = statusLabels[item.order.status] || statusLabels.PENDING;
              return (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg shrink-0">
                      📖
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.book.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(item.order.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
