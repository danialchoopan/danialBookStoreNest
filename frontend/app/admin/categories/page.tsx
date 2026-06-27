'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function AdminCategoriesPage() {
  const [newCategory, setNewCategory] = useState('');
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await api.post('/categories', { name: newCategory });
      toast.success('دسته‌بندی ایجاد شد');
      setNewCategory('');
      refetch();
    } catch {
      toast.error('خطا در ایجاد دسته‌بندی');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('دسته‌بندی حذف شد');
      refetch();
    } catch {
      toast.error('خطا در حذف دسته‌بندی');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت دسته‌بندی‌ها</h1>
        <Link href="/admin" className="text-gray-600 hover:text-primary-600 text-sm">
          ← بازگشت
        </Link>
      </div>

      {/* Create Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">افزودن دسته‌بندی جدید</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="نام دسته‌بندی"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700"
          >
            افزودن
          </button>
        </form>
      </div>

      {/* Categories List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-3 px-4 font-medium text-gray-600">نام</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">slug</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">زیرمجموعه</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((cat: any) => (
                <tr key={cat.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{cat.name}</td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {cat.children?.length || 0} زیرمجموعه
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-500 hover:text-red-600 text-xs"
                    >
                      حذف
                    </button>
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
