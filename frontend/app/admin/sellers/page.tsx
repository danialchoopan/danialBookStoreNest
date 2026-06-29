'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminSellersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [commissionModal, setCommissionModal] = useState<{ sellerId: string; currentRate: number; shopName: string } | null>(null);
  const [newRate, setNewRate] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{ sellerId: string; action: 'approve' | 'reject'; shopName: string } | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-sellers', page],
    queryFn: async () => {
      const { data } = await api.get(`/admin/sellers?page=${page}&limit=10`);
      return data;
    },
  });

  const handleApprove = async (sellerId: string) => {
    try {
      await api.patch(`/admin/sellers/${sellerId}/approve`);
      toast.success('فروشنده تأیید شد');
      setConfirmDialog(null);
      refetch();
    } catch {
      toast.error('خطا در تأیید فروشنده');
    }
  };

  const handleReject = async (sellerId: string) => {
    try {
      await api.patch(`/admin/sellers/${sellerId}/reject`);
      toast.success('فروشنده رد شد');
      setConfirmDialog(null);
      refetch();
    } catch {
      toast.error('خطا در رد فروشنده');
    }
  };

  const handleCommission = async () => {
    if (!commissionModal || !newRate) return;
    const rate = parseFloat(newRate);
    if (rate < 0 || rate > 100) {
      toast.error('کمیسیون باید بین ۰ تا ۱۰۰ باشد');
      return;
    }
    try {
      await api.patch(`/admin/sellers/${commissionModal.sellerId}/commission`, { rate });
      toast.success('کمیسیون بروزرسانی شد');
      setCommissionModal(null);
      setNewRate('');
      refetch();
    } catch {
      toast.error('خطا در بروزرسانی کمیسیون');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const filteredSellers = data?.data?.filter((seller: any) => {
    if (statusFilter === 'approved') return seller.isApproved;
    if (statusFilter === 'pending') return !seller.isApproved;
    return true;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت فروشندگان</h1>
          <p className="text-gray-500 mt-1">{data?.meta?.total || 0} فروشنده</p>
        </div>
        <Link href="/admin" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
          ← بازگشت به پنل مدیریت
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { value: '', label: 'همه' },
          { value: 'approved', label: 'تأیید شده' },
          { value: 'pending', label: 'در انتظار تأیید' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-200'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSellers.map((seller: any) => (
            <div key={seller.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                    🏪
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{seller.shopName}</h3>
                    <p className="text-sm text-gray-500">
                      مالک: {seller.user.firstName} {seller.user.lastName} • {seller.user.email}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{seller._count.books} کتاب</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">کمیسیون: {seller.commissionRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    seller.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${seller.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    {seller.isApproved ? 'تأیید شده' : 'در انتظار'}
                  </span>

                  <button
                    onClick={() => setCommissionModal({
                      sellerId: seller.id,
                      currentRate: seller.commissionRate,
                      shopName: seller.shopName,
                    })}
                    className="text-xs font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    کمیسیون
                  </button>

                  {!seller.isApproved ? (
                    <button
                      onClick={() => setConfirmDialog({
                        sellerId: seller.id,
                        action: 'approve',
                        shopName: seller.shopName,
                      })}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      تأیید
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDialog({
                        sellerId: seller.id,
                        action: 'reject',
                        shopName: seller.shopName,
                      })}
                      className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
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

      {/* Pagination */}
      {data?.meta && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Commission Modal */}
      {commissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setCommissionModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-1">تنظیم کمیسیون</h3>
              <p className="text-sm text-gray-500 mb-4">{commissionModal.shopName}</p>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">درصد کمیسیون</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    min="0"
                    max="100"
                    step="0.5"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder={commissionModal.currentRate.toString()}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-xl text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1"> فعلی: {commissionModal.currentRate}%</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={() => { setCommissionModal(null); setNewRate(''); }}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleCommission}
                className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl font-bold hover:bg-primary-700"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDialog}
        title={confirmDialog?.action === 'approve' ? 'تأیید فروشنده' : 'رد فروشنده'}
        message={confirmDialog?.action === 'approve'
          ? `آیا مطمئن هستید فروشنده "${confirmDialog?.shopName}" تأیید شود؟`
          : `آیا مطمئن هستید فروشنده "${confirmDialog?.shopName}" رد شود؟`
        }
        confirmLabel={confirmDialog?.action === 'approve' ? 'تأیید' : 'رد'}
        variant={confirmDialog?.action === 'approve' ? 'primary' : 'danger'}
        onConfirm={() => {
          if (!confirmDialog) return;
          if (confirmDialog.action === 'approve') handleApprove(confirmDialog.sellerId);
          else handleReject(confirmDialog.sellerId);
        }}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
}
