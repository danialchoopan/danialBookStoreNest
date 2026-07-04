'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import OrderTracking from '@/components/orders/OrderTracking';

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: 'پرداخت شده', color: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'در حال پردازش', color: 'bg-purple-100 text-purple-700' },
  SHIPPED: { label: 'ارسال شده', color: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { label: 'تحویل شده', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'بازپرداخت شده', color: 'bg-gray-100 text-gray-700' },
};

export default function OrderDetailPage() {
  const params = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${params.id}`);
      return data;
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="h-40 bg-gray-200 rounded-2xl mb-6" />
        <div className="h-60 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-5xl mb-4"></div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">سفارش یافت نشد</h1>
        <Link href="/orders" className="text-primary-600 hover:text-primary-700 mt-4">
          بازگشت به سفارشات
        </Link>
      </div>
    );
  }

  const status = statusLabels[order.status] || statusLabels.PENDING;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">جزئیات سفارش</h1>
          <p className="text-sm text-gray-500 mt-1">
            شماره: <span className="font-mono">{order.id.slice(0, 12)}...</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
            {status.label}
          </span>
          <Link href="/orders" className="text-gray-500 hover:text-gray-700 text-sm">
            ← بازگشت
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Tracking */}
          <OrderTracking orderId={order.id} />

          {/* Order Items */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">اقلام سفارش</h3>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-12 h-16 bg-primary-50 rounded-lg flex items-center justify-center text-xl shrink-0">
                    
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/books/${item.bookId}`} className="font-medium text-gray-800 hover:text-primary-600 line-clamp-1 text-sm">
                      {item.book?.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{item.quantity} × {formatPrice(item.unitPrice)}</p>
                  </div>
                  <span className="font-bold text-gray-800 text-sm shrink-0">
                    {formatPrice(item.totalPrice)} ت
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">خلاصه سفارش</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">تاریخ ثبت</span>
                <span className="text-gray-700">
                  {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">تعداد اقلام</span>
                <span className="text-gray-700">{order.items.length} کالا</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>مبلغ کل</span>
                <span className="text-primary-600">{formatPrice(order.totalAmount)} تومان</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">آدرس ارسال</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {(() => {
                  try {
                    const addr = JSON.parse(order.shippingAddress);
                    return (
                      <>
                        {addr.fullName && <p className="font-medium">{addr.fullName}</p>}
                        <p>{addr.street}</p>
                        <p>{addr.city}، {addr.province}</p>
                        {addr.postalCode && <p className="font-mono">{addr.postalCode}</p>}
                        {addr.phone && <p>تلفن: {addr.phone}</p>}
                      </>
                    );
                  } catch {
                    return <p>{order.shippingAddress}</p>;
                  }
                })()}
              </div>
            </div>
          )}

          {/* Note */}
          {order.note && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <p className="text-sm text-yellow-700 font-medium mb-1">توضیحات</p>
              <p className="text-sm text-yellow-600">{order.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
