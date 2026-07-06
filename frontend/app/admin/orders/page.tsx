'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Pagination from '@/components/ui/Pagination';

const statusLabels: Record<string, string> = {
  PENDING: 'در انتظار',
  PAID: 'پرداخت شده',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const allStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{ orderId: string; status: string } | null>(null);
  const [statusNote, setStatusNote] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: '15' });
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      const { data } = await api.get(`/admin/orders?${params}`);
      return data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status, note }: { orderId: string; status: string; note?: string }) => {
      const { data } = await api.patch(`/admin/orders/${orderId}/status`, { status, note });
      return data;
    },
    onSuccess: () => {
      toast.success('وضعیت سفارش بروزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setUpdateStatus(null);
      setStatusNote('');
    },
    onError: () => toast.error('خطا در بروزرسانی وضعیت'),
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت سفارشات</h1>
        <p className="text-gray-500 mt-1">{meta?.total || 0} سفارش</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="جستجو بر اساس شماره سفارش یا نام مشتری..."
            className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="">همه وضعیت‌ها</option>
          {allStatuses.map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <p className="text-gray-500">سفارشی یافت نشد</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right px-4 py-3 font-medium text-gray-600">شماره سفارش</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">مشتری</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">اقلام</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">مبلغ</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">وضعیت</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">تاریخ</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <>
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{order.user.firstName} {order.user.lastName}</div>
                        <div className="text-xs text-gray-400">{order.user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{order.items.length} کالا</td>
                      <td className="px-4 py-3 font-bold text-gray-800">{formatPrice(order.totalAmount)} تومان</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            title="جزئیات"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button
                            onClick={() => setUpdateStatus({ orderId: order.id, status: order.status })}
                            className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
                            title="تغییر وضعیت"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={`${order.id}-detail`}>
                        <td colSpan={7} className="px-4 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-bold text-gray-700 mb-2">اقلام سفارش</h4>
                              {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-200">
                                  <span>{item.book.title} × {item.quantity}</span>
                                  <span className="font-medium">{formatPrice(item.totalPrice)} ت</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-700 mb-2">تاریخچه وضعیت</h4>
                              {order.statusHistory?.length > 0 ? (
                                order.statusHistory.map((h: any) => (
                                  <div key={h.id} className="text-sm py-1 border-b border-gray-200">
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${statusColors[h.status] || ''}`}>{statusLabels[h.status] || h.status}</span>
                                    <span className="text-gray-400 mr-2">{new Date(h.createdAt).toLocaleString('fa-IR')}</span>
                                    {h.note && <span className="text-gray-500 mr-2">— {h.note}</span>}
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-400 text-sm">بدون تاریخچه</p>
                              )}
                            </div>
                          </div>
                          {order.shippingAddress && (
                            <div className="mt-3 text-sm text-gray-600">
                              <strong>آدرس ارسال:</strong> {order.shippingAddress}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Status Update Modal */}
      {updateStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="font-bold text-gray-800 mb-4">تغییر وضعیت سفارش</h3>
            <select
              value={updateStatus.status}
              onChange={(e) => setUpdateStatus({ ...updateStatus, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-3 outline-none focus:ring-2 focus:ring-primary-500"
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="توضیحات (اختیاری)..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-4 outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={2}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setUpdateStatus(null); setStatusNote(''); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
              >
                انصراف
              </button>
              <button
                onClick={() => statusMutation.mutate({ orderId: updateStatus.orderId, status: updateStatus.status, note: statusNote || undefined })}
                disabled={statusMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-bold disabled:bg-gray-300"
              >
                {statusMutation.isPending ? 'در حال بروزرسانی...' : 'بروزرسانی'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
