'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '⏳' },
  PAID: { label: 'پرداخت شده', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💳' },
  PROCESSING: { label: 'در حال پردازش', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '⚙️' },
  SHIPPED: { label: 'ارسال شده', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '🚚' },
  DELIVERED: { label: 'تحویل شده', color: 'bg-green-100 text-green-700 border-green-200', icon: '✅' },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700 border-red-200', icon: '❌' },
  REFUNDED: { label: 'بازپرداخت شده', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '↩️' },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data;
    },
    enabled: isAuthenticated,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">🔒</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">ورود لازم است</h1>
        <p className="text-gray-500 mb-6">برای مشاهده سفارشات ابتدا وارد شوید</p>
        <Link href="/login" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700">
          ورود به حساب
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">سفارشات من</h1>
        <p className="text-gray-500 mt-1">تاریخچه و وضعیت سفارشات شما</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded-full w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-5">📦</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">هنوز سفارشی ثبت نکرده‌اید</h2>
          <p className="text-gray-500 mb-6">اولین سفارش خود را ثبت کنید!</p>
          <Link
            href="/books"
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 shadow-sm shadow-primary-200 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            مشاهده کتاب‌ها
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((order: any) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500">شماره سفارش</p>
                      <p className="font-mono text-sm font-bold text-gray-800">{order.id.slice(0, 12)}...</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">تاریخ</p>
                      <p className="text-sm text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${status.color}`}>
                    <span>{status.icon}</span>
                    {status.label}
                  </span>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-primary-50 rounded-lg flex items-center justify-center text-xl shrink-0">
                          📖
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm line-clamp-1">{item.book.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.quantity} × {formatPrice(item.unitPrice)} تومان
                          </p>
                        </div>
                        <span className="font-bold text-gray-800 text-sm shrink-0">
                          {formatPrice(item.totalPrice)} ت
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {order.items.length} کالا
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <span className="text-xs text-gray-500 block">مبلغ کل</span>
                        <span className="font-bold text-lg text-primary-600">{formatPrice(order.totalAmount)} تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
