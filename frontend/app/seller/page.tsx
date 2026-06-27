'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function SellerDashboardPage() {
  const { user } = useAuthStore();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['seller-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/seller/dashboard');
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard?.isApproved) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">در انتظار تأیید</h1>
        <p className="text-gray-500">پروفایل فروشنده شما در انتظار تأیید مدیریت است.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          داشبورد فروشنده - {dashboard.shopName}
        </h1>
        <Link
          href="/seller/products"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          مدیریت محصولات
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-2xl font-bold text-gray-800">{dashboard.totalBooks}</h3>
          <p className="text-sm text-gray-500">تعداد کتاب‌ها</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="text-2xl font-bold text-gray-800">{dashboard.totalOrders}</h3>
          <p className="text-sm text-gray-500">تعداد سفارشات</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="text-2xl font-bold text-primary-600">
            {formatPrice(dashboard.totalRevenue)}
          </h3>
          <p className="text-sm text-gray-500">کل فروش</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">💳</div>
          <h3 className="text-2xl font-bold text-green-600">
            {formatPrice(dashboard.walletBalance)}
          </h3>
          <p className="text-sm text-gray-500">موجودی کیف پول</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">آخرین سفارشات</h2>
          <Link href="/seller/orders" className="text-primary-600 hover:text-primary-700 text-sm">
            مشاهده همه →
          </Link>
        </div>

        {!dashboard.recentOrders?.length ? (
          <p className="text-gray-500 text-center py-8">هنوز سفارشی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-2 font-medium text-gray-600">کتاب</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">وضعیت</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentOrders.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 px-2">{item.book.title}</td>
                    <td className="py-3 px-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {item.order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">
                      {new Date(item.order.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
