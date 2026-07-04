'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/wishlist');
      return data;
    },
    enabled: isAuthenticated,
  });

  const removeMutation = useMutation({
    mutationFn: async (bookId: string) => {
      await api.delete(`/wishlist/${bookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('از علاقه‌مندی‌ها حذف شد');
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">ورود لازم است</h1>
        <Link href="/login" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700">
          ورود به حساب
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">علاقه‌مندی‌های من</h1>
      <p className="text-gray-500 mb-8">{items?.length || 0} کتاب ذخیره شده</p>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : !items?.length ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">هنوز کتابی ذخیره نکرده‌اید</h2>
          <p className="text-gray-500 mb-6">کتاب‌های مورد علاقه خود را اینجا ذخیره کنید.</p>
          <Link href="/books" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700">
            مشاهده کتاب‌ها
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item: any) => {
            const book = item.book;
            const avgRating = book.reviews?.length
              ? book.reviews.reduce((s: number, r: any) => s + r.rating, 0) / book.reviews.length
              : null;

            return (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <Link href={`/books/${book.id}`}>
                  <div className="h-40 bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary-200 opacity-50 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/books/${book.id}`}>
                    <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                  <p className="text-xs text-gray-400">{book.seller?.shopName}</p>
                  {avgRating && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="text-xs text-gray-500">{avgRating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-primary-600">{formatPrice(book.price)} ت</span>
                    <button
                      onClick={() => removeMutation.mutate(book.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
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
