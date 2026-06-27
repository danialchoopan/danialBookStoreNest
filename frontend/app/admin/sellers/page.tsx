'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminSellersPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-sellers'],
    queryFn: async () => {
      const { data } = await api.get('/admin/sellers');
      return data;
    },
  });

  const handleApprove = async (sellerId: string) => {
    try {
      await api.patch(`/admin/sellers/${sellerId}/approve`);
      toast.success('فروشنده تأیید شد');
      refetch();
    } catch {
      toast.error('خطا در تأیید فروشنده');
    }
  };

  const handleReject = async (sellerId: string) => {
    try {
      await api.patch(`/admin/sellers/${sellerId}/reject`);
      toast.success('فروشنده رد شد');
      refetch();
    } catch {
      toast.error('خطا در رد فروشنده');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت فروشندگان</h1>
        <Link href="/admin" className="text-gray-600 hover:text-primary-600 text-sm">
          ← بازگشت
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
      ) : (
        <div className="space-y-4">
          {data?.data?.map((seller: any) => (
            <div key={seller.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{seller.shopName}</h3>
                  <p className="text-sm text-gray-500">
                    مالک: {seller.user.firstName} {seller.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{seller.user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      seller.isApproved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {seller.isApproved ? 'تأیید شده' : 'در انتظار تأیید'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {seller._count.books} کتاب
                  </span>
                  <span className="text-sm text-gray-500">
                    کمیسیون: {seller.commissionRate}%
                  </span>
                  {!seller.isApproved ? (
                    <button
                      onClick={() => handleApprove(seller.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                    >
                      تأیید
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReject(seller.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                    >
                      رد
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
