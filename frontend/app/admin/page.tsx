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
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">پنل مدیریت</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-2xl font-bold text-gray-800">{dashboard.totalUsers}</h3>
          <p className="text-sm text-gray-500">کل کاربران</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">🏪</div>
          <h3 className="text-2xl font-bold text-gray-800">{dashboard.totalSellers}</h3>
          <p className="text-sm text-gray-500">فروشندگان</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-2xl font-bold text-gray-800">{dashboard.totalBooks}</h3>
          <p className="text-sm text-gray-500">کل کتاب‌ها</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="text-2xl font-bold text-gray-800">{dashboard.totalOrders}</h3>
          <p className="text-sm text-gray-500">کل سفارشات</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="text-2xl font-bold text-primary-600">
            {formatPrice(dashboard.totalRevenue)}
          </h3>
          <p className="text-sm text-gray-500">کل فروش</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-6">
          <div className="text-3xl mb-2">⏳</div>
          <h3 className="text-2xl font-bold text-red-600">{dashboard.pendingSellers}</h3>
          <p className="text-sm text-gray-500">فروشندگان در انتظار تأیید</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/users"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-bold text-gray-800">مدیریت کاربران</h3>
          <p className="text-sm text-gray-500">مشاهده و مدیریت کاربران سیستم</p>
        </Link>
        <Link
          href="/admin/sellers"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-2">🏪</div>
          <h3 className="font-bold text-gray-800">مدیریت فروشندگان</h3>
          <p className="text-sm text-gray-500">تأیید و مدیریت فروشندگان</p>
        </Link>
        <Link
          href="/admin/categories"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-2">📂</div>
          <h3 className="font-bold text-gray-800">مدیریت دسته‌بندی‌ها</h3>
          <p className="text-sm text-gray-500">ایجاد و ویرایش دسته‌بندی‌ها</p>
        </Link>
      </div>
    </div>
  );
}
