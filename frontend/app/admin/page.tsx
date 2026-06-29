'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  trend?: string;
}

function StatCard({ icon, label, value, color, trend }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">{icon}</div>
        {trend && <span className="text-white/70 text-xs">{trend}</span>}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <p className="text-white/70 text-sm">{label}</p>
    </div>
  );
}

function MiniBarChart({ data, maxHeight = 80 }: { data: number[]; maxHeight?: number }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height: maxHeight }}>
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 bg-primary-400/30 rounded-t-md transition-all hover:bg-primary-400/50"
          style={{ height: `${(value / max) * 100}%`, minHeight: 4 }}
          title={`${value}`}
        />
      ))}
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let accumulated = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {segments.map((segment, i) => {
            const percent = total > 0 ? (segment.value / total) * 100 : 0;
            const dasharray = `${percent} ${100 - percent}`;
            const dashoffset = -accumulated;
            accumulated += percent;
            return (
              <circle
                key={i}
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="none"
                stroke={segment.color}
                strokeWidth="3.5"
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800">{total}</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-xs text-gray-600">{segment.label}</span>
            <span className="text-xs font-bold text-gray-800">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
      return data;
    },
  });

  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders-chart'],
    queryFn: async () => {
      const { data } = await api.get('/admin/orders?limit=100');
      return data;
    },
  });

  const { data: sellersData } = useQuery({
    queryKey: ['admin-sellers-chart'],
    queryFn: async () => {
      const { data } = await api.get('/admin/sellers?limit=100');
      return data;
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  // Compute order stats by status
  const orderStatusCounts = ordersData?.data?.reduce((acc: Record<string, number>, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {}) || {};

  // Monthly orders (mock last 12 months)
  const monthlyOrders = [3, 7, 12, 8, 15, 22, 18, 25, 30, 28, 35, 42];

  // Seller status
  const approvedSellers = sellersData?.data?.filter((s: any) => s.isApproved).length || 0;
  const pendingSellers = sellersData?.data?.filter((s: any) => !s.isApproved).length || 0;

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
        <StatCard icon="👥" label="کل کاربران" value={dashboard.totalUsers} color="from-blue-500 to-blue-600" trend="+۱۲٪" />
        <StatCard icon="🏪" label="فروشندگان" value={dashboard.totalSellers} color="from-purple-500 to-purple-600" />
        <StatCard icon="📚" label="کتاب‌ها" value={dashboard.totalBooks} color="from-primary-500 to-primary-600" />
        <StatCard icon="📦" label="کل سفارشات" value={dashboard.totalOrders} color="from-indigo-500 to-indigo-600" />
        <StatCard icon="💰" label="فروش کل" value={`${formatPrice(dashboard.totalRevenue)} ت`} color="from-green-500 to-green-600" />
        {dashboard.pendingSellers > 0 && (
          <StatCard icon="⏳" label="در انتظار تأیید" value={dashboard.pendingSellers} color="from-amber-500 to-orange-500" />
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Orders Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">سفارشات ماهانه</h3>
            <span className="text-xs text-gray-400">۱۲ ماه اخیر</span>
          </div>
          <MiniBarChart data={monthlyOrders} maxHeight={120} />
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            <span>فروردین</span>
            <span>اردیبهشت</span>
            <span>خرداد</span>
            <span>تیر</span>
            <span>مرداد</span>
            <span>شهریور</span>
            <span>مهر</span>
            <span>آبان</span>
            <span>آذر</span>
            <span>دی</span>
            <span>بهمن</span>
            <span>اسفند</span>
          </div>
        </div>

        {/* Order Status Donut */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">وضعیت سفارشات</h3>
          <DonutChart
            segments={[
              { label: 'در انتظار', value: orderStatusCounts.PENDING || 0, color: '#fbbf24' },
              { label: 'پرداخت شده', value: orderStatusCounts.PAID || 0, color: '#3b82f6' },
              { label: 'در حال پردازش', value: orderStatusCounts.PROCESSING || 0, color: '#a855f7' },
              { label: 'ارسال شده', value: orderStatusCounts.SHIPPED || 0, color: '#6366f1' },
              { label: 'تحویل شده', value: orderStatusCounts.DELIVERED || 0, color: '#22c55e' },
              { label: 'لغو شده', value: orderStatusCounts.CANCELLED || 0, color: '#ef4444' },
            ]}
          />
        </div>

        {/* Vendor Status */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">وضعیت فروشندگان</h3>
          <DonutChart
            segments={[
              { label: 'تأیید شده', value: approvedSellers, color: '#22c55e' },
              { label: 'در انتظار', value: pendingSellers, color: '#fbbf24' },
            ]}
          />
        </div>

        {/* Revenue Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">خلاصه مالی</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-sm text-green-700">کل درآمد</span>
              <span className="font-bold text-green-800">{formatPrice(dashboard.totalRevenue)} تومان</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <span className="text-sm text-blue-700">میانگین سفارش</span>
              <span className="font-bold text-blue-800">
                {dashboard.totalOrders > 0
                  ? `${formatPrice(Math.round(dashboard.totalRevenue / dashboard.totalOrders))} تومان`
                  : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <span className="text-sm text-purple-700">فروشنده به ازای هر ۱۰۰ کاربر</span>
              <span className="font-bold text-purple-800">
                {dashboard.totalUsers > 0
                  ? Math.round((dashboard.totalSellers / dashboard.totalUsers) * 100)
                  : 0}
                نفر
              </span>
            </div>
          </div>
        </div>
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
