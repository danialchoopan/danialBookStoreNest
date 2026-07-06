'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function LibraryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const { data: books, isLoading } = useQuery({
    queryKey: ['my-ebooks'],
    queryFn: async () => {
      const { data } = await api.get('/downloads/my-books');
      return data;
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">ورود لازم است</h1>
        <p className="text-gray-500 mb-6">برای دسترسی به کتابخانه ابتدا وارد شوید</p>
        <Link href="/login" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700">
          ورود به حساب
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">کتابخانه من</h1>
        <p className="text-gray-500 mt-1">کتاب‌های الکترونیکی خریداری شده</p>
      </div>

      {!books || books.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 className="text-lg font-bold text-gray-700 mb-2">هنوز کتابی ندارید</h2>
          <p className="text-gray-500 mb-6">کتاب‌های الکترونیکی خریداری شده اینجا نمایش داده می‌شوند</p>
          <Link
            href="/books?format=DIGITAL"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            مرور کتاب‌های الکترونیکی
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {books.map((book: any) => (
            <div key={book.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Cover */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="absolute top-2 right-2">
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">PDF</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1 min-h-[40px]">{book.title}</h3>
                <p className="text-xs text-gray-500 mb-1">{book.author}</p>
                {book.ebookFileSize && (
                  <p className="text-xs text-gray-400 mb-3">{formatSize(book.ebookFileSize)}</p>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/library/read/${book.id}`}
                    className="flex-1 text-center py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors"
                  >
                    خواندن
                  </Link>
                  <a
                    href={`http://localhost:4000/api/downloads/${book.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
                  >
                    دانلود
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
