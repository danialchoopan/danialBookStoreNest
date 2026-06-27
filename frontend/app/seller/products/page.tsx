'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

export default function SellerProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['seller-books'],
    queryFn: async () => {
      const { data } = await api.get('/seller/books');
      return data;
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">محصولات من</h1>
        <Link
          href="/seller"
          className="text-gray-600 hover:text-primary-600 text-sm"
        >
          ← بازگشت به داشبورد
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500 mb-4">هنوز کتابی اضافه نکرده‌اید</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-3 px-4 font-medium text-gray-600">عنوان</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">نویسنده</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">قیمت</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">موجودی</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((book: any) => (
                <tr key={book.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{book.title}</td>
                  <td className="py-3 px-4 text-gray-600">{book.author}</td>
                  <td className="py-3 px-4 text-primary-600 font-medium">
                    {formatPrice(book.price)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={book.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                      {book.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        book.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {book.isPublished ? 'منتشر شده' : 'پیش‌نویس'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
