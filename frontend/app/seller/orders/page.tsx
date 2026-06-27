'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

const statusLabels: Record<string, string> = {
  PENDING: 'در انتظار پرداخت',
  PAID: 'پرداخت شده',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
  REFUNDED: 'بازپرداخت شده',
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
      toast.success('وضعیت سفارش تغییر کرد');
      refetch();
    } catch {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">سفارشات فروشنده</h1>
        <Link href="/seller" className="text-gray-600 hover:text-primary-600 text-sm">
          ← بازگشت به داشبورد
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500">هنوز سفارشی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((item: any) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{item.book.title}</h3>
                  <p className="text-sm text-gray-500">
                    خریدار: {item.order.user.firstName} {item.order.user.lastName}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary-600">{formatPrice(item.totalPrice)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.order.createdAt).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  تعداد: {item.quantity} × {formatPrice(item.unitPrice)}
                </span>

                <select
                  value={item.order.status}
                  onChange={(e) => handleStatusChange(item.order.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="PENDING">در انتظار پرداخت</option>
                  <option value="PAID">پرداخت شده</option>
                  <option value="PROCESSING">در حال پردازش</option>
                  <option value="SHIPPED">ارسال شده</option>
                  <option value="DELIVERED">تحویل شده</option>
                  <option value="CANCELLED">لغو شده</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
