'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

const roleLabels: Record<string, string> = {
  CUSTOMER: 'کاربر عادی',
  SELLER: 'فروشنده',
  ADMIN: 'مدیر',
};

export default function AdminUsersPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    },
  });

  const handleToggleActive = async (userId: string) => {
    try {
      await api.patch(`/users/${userId}/toggle-active`);
      toast.success('وضعیت کاربر تغییر کرد');
      refetch();
    } catch {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
        <Link href="/admin" className="text-gray-600 hover:text-primary-600 text-sm">
          ← بازگشت
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
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
                <th className="text-right py-3 px-4 font-medium text-gray-600">ایمیل</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">نقش</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">وضعیت</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((user: any) => (
                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(user.id)}
                      className="text-red-500 hover:text-red-600 text-xs"
                    >
                      {user.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
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
