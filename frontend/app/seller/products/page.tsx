'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SellerProductsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    description: '',
    price: '',
    stock: '',
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['seller-books'],
    queryFn: async () => {
      const { data } = await api.get('/seller/books');
      return data;
    },
  });

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/books', {
        ...newBook,
        price: Number(newBook.price),
        stock: Number(newBook.stock),
      });
      toast.success('کتاب با موفقیت اضافه شد');
      setShowAddModal(false);
      setNewBook({ title: '', author: '', isbn: '', publisher: '', description: '', price: '', stock: '' });
      refetch();
    } catch {
      toast.error('خطا در افزودن کتاب');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">محصولات من</h1>
          <p className="text-gray-500 mt-1">{data?.meta?.total || 0} کتاب در فروشگاه</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/seller"
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            ← بازگشت
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            افزودن کتاب
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-5">📚</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">هنوز کتابی اضافه نکرده‌اید</h2>
          <p className="text-gray-500 mb-6">اولین کتاب خود را به فروشگاه اضافه کنید!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700"
          >
            افزودن کتاب
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right py-4 px-6 font-medium text-gray-600">کتاب</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-600">قیمت</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-600">موجودی</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-600">وضعیت</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-600">فروش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.data.map((book: any) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-primary-50 rounded-lg flex items-center justify-center text-lg shrink-0">
                          📖
                        </div>
                        <div>
                          <Link href={`/books/${book.id}`} className="font-bold text-gray-800 hover:text-primary-600 line-clamp-1">
                            {book.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-primary-600">{formatPrice(book.price)}</span>
                      <span className="text-xs text-gray-400 mr-1">ت</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-medium ${book.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {book.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        book.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {book.isPublished ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {book._count?.orderItems || 0} فروش
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-lg">افزودن کتاب جدید</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddBook} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان کتاب *</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="بوف کور"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نویسنده *</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="صادق هدایت"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">شابک</label>
                  <input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="978-964-..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ناشر</label>
                <input
                  type="text"
                  value={newBook.publisher}
                  onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="انتشارات نیلوفر"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان) *</label>
                  <input
                    type="number"
                    value={newBook.price}
                    onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                    required
                    min="0"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="85000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">موجودی *</label>
                  <input
                    type="number"
                    value={newBook.stock}
                    onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                    required
                    min="0"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="25"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                <textarea
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="توضیحات کتاب..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
                >
                  افزودن کتاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
