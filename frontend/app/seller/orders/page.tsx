'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { label: string; color: string; next: string[] }> = {
  PENDING: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-700', next: ['PAID', 'CANCELLED'] },
  PAID: { label: 'پرداخت شده', color: 'bg-blue-100 text-blue-700', next: ['PROCESSING'] },
  PROCESSING: { label: 'در حال پردازش', color: 'bg-purple-100 text-purple-700', next: ['SHIPPED'] },
  SHIPPED: { label: 'ارسال شده', color: 'bg-indigo-100 text-indigo-700', next: ['DELIVERED'] },
  DELIVERED: { label: 'تحویل شده', color: 'bg-green-100 text-green-700', next: [] },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700', next: [] },
};

const nextStatusLabels: Record<string, string> = {
  PAID: 'تأیید پرداخت',
  PROCESSING: 'شروع پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو سفارش',
};

export default function SellerOrdersPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => {
      const { data } = await api.get('/seller/orders');
      return data;
    },
  });

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await api.patch(`/seller/orders/${orderId}/status`, { status });
      toast.success('وضعیت سفارش بروزرسانی شد');
      refetch();
    } catch {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">سفارشات فروشنده</h1>
          <p className="text-gray-500 mt-1">{data?.meta?.total || 0} سفارش دریافت شده</p>
        </div>
        <Link
          href="/seller"
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          ← بازگشت به داشبورد
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-16 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-5">📦</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">هنوز سفارشی ثبت نشده</h2>
          <p className="text-gray-500">وقتی مشتریان سفارش دهند، اینجا نمایش داده می‌شود.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((item: any) => {
            const status = statusConfig[item.order.status] || statusConfig.PENDING;
            const nextStatuses = status.next;

            return (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500">شماره سفارش</p>
                      <p className="font-mono text-sm font-bold text-gray-800">{item.order.id.slice(0, 12)}...</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">تاریخ</p>
                      <p className="text-sm text-gray-700">
                        {new Date(item.order.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="px-6 py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-16 bg-primary-50 rounded-lg flex items-center justify-center text-xl shrink-0">
                      📖
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{item.book.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        خریدار: {item.order.user.firstName} {item.order.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        تلفن: {item.order.user.phone || '—'}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary-600 text-lg">{formatPrice(item.totalPrice)} ت</p>
                      <p className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.unitPrice)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {nextStatuses.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                      {nextStatuses.map((nextStatus) => (
                        <button
                          key={nextStatus}
                          onClick={() => handleStatusChange(item.order.id, nextStatus)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            nextStatus === 'CANCELLED'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                              : 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200'
                          }`}
                        >
                          {nextStatusLabels[nextStatus]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
