'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);

const statusLabels: Record<string, string> = {
  PENDING: 'در انتظار', PAID: 'پرداخت شده', PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده', DELIVERED: 'تحویل شده', CANCELLED: 'لغو شده',
};
const statusColors: Record<string, string> = {
  PENDING: '#fbbf24', PAID: '#3b82f6', PROCESSING: '#a855f7',
  SHIPPED: '#6366f1', DELIVERED: '#22c55e', CANCELLED: '#ef4444',
};

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let accumulated = 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {total === 0 && <circle cx="18" cy="18" r="15.91549430918954" fill="none" stroke="#e5e7eb" strokeWidth="3.5" />}
          {segments.map((seg, i) => {
            const pct = total > 0 ? (seg.value / total) * 100 : 0;
            const da = `${pct} ${100 - pct}`;
            const offset = -accumulated;
            accumulated += pct;
            return <circle key={i} cx="18" cy="18" r="15.91549430918954" fill="none" stroke={seg.color} strokeWidth="3.5" strokeDasharray={da} strokeDashoffset={offset} />;
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="text-lg font-bold text-gray-800">{total}</span></div>
      </div>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-gray-600">{seg.label}</span>
            <span className="text-xs font-bold text-gray-800">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics?days=30');
      return data;
    },
  });

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const { today, totals, monthlyRevenue, statusBreakdown, topBooks, topSellers } = analytics;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">داشبورد مدیریت</h1>
          <p className="text-gray-500 mt-1">آمار و اطلاعات سیستم</p>
        </div>
        <a
          href="http://localhost:4000/api/reports/sales/csv?days=30"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          دانلود گزارش CSV
        </a>
      </div>

      {/* Today + Total Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="text-3xl font-bold mb-1">{today.orders}</div>
          <p className="text-white/70 text-sm">سفارش امروز</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="text-3xl font-bold mb-1">{formatPrice(today.revenue)}</div>
          <p className="text-white/70 text-sm">درآمد امروز (ت)</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="text-3xl font-bold mb-1">{today.newUsers}</div>
          <p className="text-white/70 text-sm">کاربر جدید امروز</p>
        </div>
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="text-3xl font-bold mb-1">{formatPrice(totals.revenue)}</div>
          <p className="text-white/70 text-sm">کل درآمد (ت)</p>
        </div>
      </div>

      {/* Totals Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-800">{totals.users}</div>
          <div className="text-sm text-gray-500">کاربر</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-800">{totals.sellers}</div>
          <div className="text-sm text-gray-500">فروشنده</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-800">{totals.books}</div>
          <div className="text-sm text-gray-500">کتاب</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">درآمد ماهانه</h3>
          {monthlyRevenue.length > 0 ? (
            <div className="flex items-end gap-1.5" style={{ height: 140 }}>
              {monthlyRevenue.map((m: any, i: number) => {
                const max = Math.max(...monthlyRevenue.map((x: any) => x.revenue), 1);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-primary-400/30 rounded-t-md hover:bg-primary-500/50 transition-colors"
                      style={{ height: `${(m.revenue / max) * 100}%`, minHeight: 4 }}
                      title={`${m.month}: ${formatPrice(m.revenue)} تومان`}
                    />
                    <span className="text-[9px] text-gray-400">{m.month.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">داده‌ای موجود نیست</div>
          )}
        </div>

        {/* Order Status Donut */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">وضعیت سفارشات (۳۰ روز اخیر)</h3>
          <DonutChart
            segments={statusBreakdown.map((s: any) => ({
              label: statusLabels[s.status] || s.status,
              value: s.count,
              color: statusColors[s.status] || '#9ca3af',
            }))}
          />
        </div>
      </div>

      {/* Top Books + Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Books */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">پرفروش‌ترین کتاب‌ها</h3>
          {topBooks.length > 0 ? (
            <div className="space-y-3">
              {topBooks.map((book: any, i: number) => (
                <div key={book.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{book.title}</div>
                    <div className="text-xs text-gray-400">{book.totalSold} فروش</div>
                  </div>
                  <span className="text-sm font-bold text-primary-600 shrink-0">{formatPrice(book.totalRevenue)} ت</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">داده‌ای موجود نیست</div>
          )}
        </div>

        {/* Top Sellers */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">پرفروش‌ترین فروشندگان</h3>
          {topSellers.length > 0 ? (
            <div className="space-y-3">
              {topSellers.map((seller: any, i: number) => (
                <div key={seller.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{seller.shopName}</div>
                    <div className="text-xs text-gray-400">{seller.orderCount} سفارش</div>
                  </div>
                  <span className="text-sm font-bold text-primary-600 shrink-0">{formatPrice(seller.totalRevenue)} ت</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">داده‌ای موجود نیست</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Link href="/admin/users" className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-blue-200 transition-all text-center group">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <span className="text-sm font-medium text-gray-700">کاربران</span>
        </Link>
        <Link href="/admin/sellers" className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-purple-200 transition-all text-center group">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <span className="text-sm font-medium text-gray-700">فروشندگان</span>
        </Link>
        <Link href="/admin/orders" className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-indigo-200 transition-all text-center group">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <span className="text-sm font-medium text-gray-700">سفارشات</span>
        </Link>
        <Link href="/admin/reviews" className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-amber-200 transition-all text-center group">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <span className="text-sm font-medium text-gray-700">نظرات</span>
        </Link>
        <Link href="/admin/categories" className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-green-200 transition-all text-center group">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <span className="text-sm font-medium text-gray-700">دسته‌بندی‌ها</span>
        </Link>
      </div>
    </div>
  );
}
