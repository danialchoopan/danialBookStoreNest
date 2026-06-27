'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

const statusLabels: Record<string, string> = {
  PENDING: 'در انتظار پرداخت',
  PAID: 'پرداخت شده',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
  REFUNDED: 'بازپرداخت شده',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
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
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">برای مشاهده سفارشات ابتدا وارد شوید</p>
        <Link href="/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg">
          ورود
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">سفارشات من</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 mb-4">هنوز سفارشی ثبت نکرده‌اید</p>
          <Link
            href="/books"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700"
          >
            مشاهده کتاب‌ها
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((order: any) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    شماره سفارش: <span className="font-mono">{order.id.slice(0, 8)}...</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {item.book.title} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between font-bold">
                <span>مجموع</span>
                <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
