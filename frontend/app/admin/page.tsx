'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">پنل مدیریت</h1>
        <p className="text-gray-500 mt-1">مشاهده و مدیریت کل سیستم</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">👥</div>
            <span className="text-blue-100 text-sm">کاربران</span>
          </div>
          <div className="text-3xl font-bold mb-1">{dashboard.totalUsers}</div>
          <p className="text-blue-100 text-sm">کاربر ثبت‌نام شده</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🏪</div>
            <span className="text-purple-100 text-sm">فروشندگان</span>
          </div>
          <div className="text-3xl font-bold mb-1">{dashboard.totalSellers}</div>
          <p className="text-purple-100 text-sm">فروشنده فعال</p>
        </div>

        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📚</div>
            <span className="text-primary-100 text-sm">محصولات</span>
          </div>
          <div className="text-3xl font-bold mb-1">{dashboard.totalBooks}</div>
          <p className="text-primary-100 text-sm">کتاب در فروشگاه</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📦</div>
            <span className="text-indigo-100 text-sm">سفارشات</span>
          </div>
          <div className="text-3xl font-bold mb-1">{dashboard.totalOrders}</div>
          <p className="text-indigo-100 text-sm">کل سفارشات</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">💰</div>
            <span className="text-green-100 text-sm">فروش کل</span>
          </div>
          <div className="text-2xl font-bold mb-1">{formatPrice(dashboard.totalRevenue)}</div>
          <p className="text-green-100 text-sm">تومان درآمد کل</p>
        </div>

        {dashboard.pendingSellers > 0 && (
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-amber-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">⏳</div>
              <span className="text-amber-100 text-sm">در انتظار</span>
            </div>
            <div className="text-3xl font-bold mb-1">{dashboard.pendingSellers}</div>
            <p className="text-amber-100 text-sm">فروشنده در انتظار تأیید</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/users" className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all group">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800 mb-1 text-lg">مدیریت کاربران</h3>
          <p className="text-sm text-gray-500">مشاهده، ویرایش و غیرفعال کردن کاربران</p>
        </Link>

        <Link href="/admin/sellers" className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-purple-200 transition-all group">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800 mb-1 text-lg">مدیریت فروشندگان</h3>
          <p className="text-sm text-gray-500">تأیید، رد و تنظیم کمیسیون فروشندگان</p>
        </Link>

        <Link href="/admin/categories" className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-green-200 transition-all group">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800 mb-1 text-lg">مدیریت دسته‌بندی‌ها</h3>
          <p className="text-sm text-gray-500">ایجاد، ویرایش و حذف دسته‌بندی‌ها</p>
        </Link>
      </div>

      {/* System Overview */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4">نمای کلی سیستم</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">{dashboard.totalUsers}</div>
            <div className="text-sm text-gray-500 mt-1">کاربر</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">{dashboard.totalSellers}</div>
            <div className="text-sm text-gray-500 mt-1">فروشنده</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">{dashboard.totalBooks}</div>
            <div className="text-sm text-gray-500 mt-1">کتاب</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">{dashboard.totalOrders}</div>
            <div className="text-sm text-gray-500 mt-1">سفارش</div>
          </div>
        </div>
      </div>
    </div>
  );
}
