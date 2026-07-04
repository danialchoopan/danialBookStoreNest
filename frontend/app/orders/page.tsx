'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '⏳' },
  PAID: { label: 'پرداخت شده', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>' },
  PROCESSING: { label: 'در حال پردازش', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.535.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828c-.424-.35-.535-.954-.26-1.43l1.298-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>' },
  SHIPPED: { label: 'ارسال شده', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.144a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>' },
  DELIVERED: { label: 'تحویل شده', color: 'bg-green-100 text-green-700 border-green-200', icon: '✅' },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700 border-red-200', icon: '<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>' },
  REFUNDED: { label: 'بازپرداخت شده', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>' },
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
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></div>
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
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-5"></div>
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
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        مشاهده جزئیات و پیگیری →
                      </Link>
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
