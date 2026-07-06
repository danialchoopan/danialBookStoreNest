'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', page, ratingFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: '15' });
      if (ratingFilter) params.set('rating', ratingFilter.toString());
      const { data } = await api.get(`/admin/reviews?${params}`);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/reviews/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('نظر حذف شد');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      setDeleteId(null);
    },
    onError: () => toast.error('خطا در حذف نظر'),
  });

  const reviews = data?.data || [];
  const meta = data?.meta;

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-amber-400' : 'text-gray-200'}>★</span>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت نظرات</h1>
        <p className="text-gray-500 mt-1">{meta?.total || 0} نظر ثبت شده</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => { setRatingFilter(''); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${ratingFilter === '' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-500'}`}
          >
            همه
          </button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => { setRatingFilter(r); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${ratingFilter === r ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-500'}`}
            >
              {r} <span className="text-amber-400">★</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <p className="text-gray-500">نظری یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review: any) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {review.user.firstName[0]}{review.user.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{review.user.firstName} {review.user.lastName}</div>
                      <div className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('fa-IR')}</div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    کتاب: <span className="font-medium text-gray-700">{review.book.title}</span>
                  </div>
                  <p className={`text-sm text-gray-600 ${expandedId !== review.id ? 'line-clamp-2' : ''}`}>
                    {review.comment}
                  </p>
                  {review.comment && review.comment.length > 100 && (
                    <button
                      onClick={() => setExpandedId(expandedId === review.id ? null : review.id)}
                      className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                    >
                      {expandedId === review.id ? 'بستن' : 'بیشتر...'}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setDeleteId(review.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors shrink-0"
                  title="حذف نظر"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          isOpen={true}
          title="حذف نظر"
          message="آیا مطمئن هستید این نظر حذف شود؟"
          variant="danger"
          onConfirm={() => deleteMutation.mutate(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
