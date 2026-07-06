'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import BookCard from './BookCard';
import Pagination from '../ui/Pagination';

interface Props {
  search?: string;
  category?: string;
  format?: string;
  page?: number;
  limit?: number;
}

export default function BookGrid({ search, category, format, page = 1, limit = 12 }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['books', search, category, format, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (format) params.set('format', format);
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
        <div className="text-4xl mb-3"><svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>
        <p className="text-gray-500 mb-4">خطا در بارگذاری کتاب‌ها</p>
        <p className="text-sm text-gray-400">لطفاً دوباره تلاش کنید</p>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
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
