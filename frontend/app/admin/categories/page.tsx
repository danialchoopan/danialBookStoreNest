'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminCategoriesPage() {
  const [newCategory, setNewCategory] = useState('');
  const [parentId, setParentId] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [editCategory, setEditCategory] = useState<{ id: string; name: string } | null>(null);
  const [editName, setEditName] = useState('');

  const { data: categories, isLoading, refetch } = useQuery({
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
      await api.post('/categories', { name: newCategory, parentId: parentId || undefined });
      toast.success('دسته‌بندی ایجاد شد');
      setNewCategory('');
      setParentId('');
      refetch();
    } catch {
      toast.error('خطا در ایجاد دسته‌بندی');
    }
  };

  const handleUpdate = async () => {
    if (!editCategory || !editName.trim()) return;
    try {
      await api.put(`/categories/${editCategory.id}`, { name: editName });
      toast.success('دسته‌بندی بروزرسانی شد');
      setEditCategory(null);
      refetch();
    } catch {
      toast.error('خطا در بروزرسانی');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success('دسته‌بندی حذف شد');
      setConfirmDelete(null);
      refetch();
    } catch {
      toast.error('خطا در حذف دسته‌بندی (ممکنه زیرمجموعه داشته باشه)');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-gray-500 mt-1">{categories?.length || 0} دسته‌بندی</p>
        </div>
        <Link href="/admin" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
          ← بازگشت به پنل مدیریت
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-bold text-gray-800 mb-4">افزودن دسته‌بندی</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="مثلاً: ادبیات معاصر"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  زیرمجموعه <span className="text-gray-400 font-normal">(اختیاری)</span>
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">دسته اصلی</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors"
              >
                افزودن
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse h-16" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {categories?.map((cat: any) => (
                <div key={cat.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                        📂
                      </div>
                      <div>
                        {editCategory?.id === cat.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                              autoFocus
                            />
                            <button
                              onClick={handleUpdate}
                              className="text-green-600 hover:bg-green-50 p-1 rounded-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setEditCategory(null)}
                              className="text-gray-400 hover:bg-gray-50 p-1 rounded-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="font-bold text-gray-800">{cat.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                        {cat.children?.length || 0} زیرمجموعه • {cat._count?.books || 0} کتاب
                      </span>
                      {!editCategory?.id === cat.id && (
                        <button
                          onClick={() => { setEditCategory(cat); setEditName(cat.name); }}
                          className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete({ id: cat.id, name: cat.name })}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  {cat.children?.length > 0 && (
                    <div className="border-t border-gray-50 px-5 py-3 bg-gray-50/50 rounded-b-2xl">
                      <div className="flex flex-wrap gap-2">
                        {cat.children.map((child: any) => (
                          <span key={child.id} className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg">
                            {child.name}
                            <span className="text-gray-400 mr-1">({child._count?.books || 0})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {categories?.length === 0 && (
                <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
                  <div className="text-4xl mb-3">📂</div>
                  <p className="text-gray-500">هنوز دسته‌بندی ایجاد نشده است.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="حذف دسته‌بندی"
        message={`آیا مطمئن هستید "${confirmDelete?.name}" حذف شود؟ این عمل قابل بازگشت نیست.`}
        confirmLabel="حذف"
        variant="danger"
        onConfirm={() => confirmDelete && handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
