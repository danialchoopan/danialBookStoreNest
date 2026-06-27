'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import BookCard from './BookCard';

interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  price: number;
  comparePrice?: number;
  images: string[];
  averageRating: number | null;
  seller: { shopName: string };
}

interface Props {
  search?: string;
  category?: string;
  limit?: number;
}

export default function BookGrid({ search, category, limit = 20 }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['books', search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (limit) params.set('limit', limit.toString());
      const { data } = await api.get(`/books?${params.toString()}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-gray-500">
        خطا در بارگذاری کتاب‌ها. لطفاً دوباره تلاش کنید.
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        کتابی یافت نشد.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {data.data.map((book: Book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
