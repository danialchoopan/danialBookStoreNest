'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import BookCard from './BookCard';
import Pagination from '../ui/Pagination';

interface Props {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export default function BookGrid({ search, category, page = 1, limit = 12 }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['books', search, category, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      const { data } = await api.get(`/books?${params.toString()}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-50" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-gray-100 rounded-full w-1/3" />
                  <div className="h-8 bg-gray-100 rounded-xl w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-gray-500 mb-4">خطا در بارگذاری کتاب‌ها</p>
        <p className="text-sm text-gray-400">لطفاً دوباره تلاش کنید</p>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
        <div className="text-5xl mb-4">📚</div>
        <p className="text-gray-500 mb-2">کتابی یافت نشد</p>
        <p className="text-sm text-gray-400">فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
      </div>
    );
  }

  return (
    <>
      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {data.meta.total} کتاب یافت شد
        </p>
        <p className="text-sm text-gray-400">
          صفحه {data.meta.page} از {data.meta.totalPages}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {data.data.map((book: any) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination */}
      {data.meta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={() => {}}
          />
        </div>
      )}
    </>
  );
}
