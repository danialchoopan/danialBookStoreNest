'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const roleLabels: Record<string, string> = {
  CUSTOMER: 'کاربر عادی',
  SELLER: 'فروشنده',
  ADMIN: 'مدیر',
};

const roleBadgeColors: Record<string, string> = {
  CUSTOMER: 'bg-blue-100 text-blue-700',
  SELLER: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-amber-100 text-amber-700',
};

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{ userId: string; action: string; label: string } | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: async () => {
      const { data } = await api.get(`/users?page=${page}&limit=10`);
      return data;
    },
  });

  const handleToggleActive = async (userId: string) => {
    try {
      await api.patch(`/users/${userId}/toggle-active`);
      toast.success('وضعیت کاربر تغییر کرد');
      setConfirmDialog(null);
      refetch();
    } catch {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      toast.success('نقش کاربر تغییر کرد');
      refetch();
    } catch {
      toast.error('خطا در تغییر نقش');
    }
  };

  const filteredUsers = data?.data?.filter((user: any) => {
    const matchesSearch = !search ||
      user.firstName.includes(search) ||
      user.lastName.includes(search) ||
      user.email.includes(search);
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
          <p className="text-gray-500 mt-1">{data?.meta?.total || 0} کاربر ثبت‌نام شده</p>
        </div>
        <Link href="/admin" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
          ← بازگشت به پنل مدیریت
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام یا ایمیل..."
            className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="">همه نقش‌ها</option>
          <option value="CUSTOMER">کاربر عادی</option>
          <option value="SELLER">فروشنده</option>
          <option value="ADMIN">مدیر</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right py-3 px-5 font-medium text-gray-600">کاربر</th>
                <th className="text-right py-3 px-5 font-medium text-gray-600 hidden md:table-cell">ایمیل</th>
                <th className="text-right py-3 px-5 font-medium text-gray-600">نقش</th>
                <th className="text-right py-3 px-5 font-medium text-gray-600">وضعیت</th>
                <th className="text-right py-3 px-5 font-medium text-gray-600">تاریخ عضویت</th>
                <th className="text-right py-3 px-5 font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm shrink-0">
                        {user.firstName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 md:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-gray-500 hidden md:table-cell">{user.email}</td>
                  <td className="py-3 px-5">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border-0 focus:ring-2 focus:ring-primary-500 ${roleBadgeColors[user.role]}`}
                    >
                      <option value="CUSTOMER">کاربر عادی</option>
                      <option value="SELLER">فروشنده</option>
                      <option value="ADMIN">مدیر</option>
                    </select>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      {user.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => setConfirmDialog({
                        userId: user.id,
                        action: user.isActive ? 'deactivate' : 'activate',
                        label: user.isActive ? 'غیرفعال کردن' : 'فعال کردن',
                      })}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        user.isActive
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {user.isActive ? 'غیرفعال' : 'فعال'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              کاربری یافت نشد.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data?.meta && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDialog}
        title={confirmDialog?.action === 'deactivate' ? 'غیرفعال کردن کاربر' : 'فعال کردن کاربر'}
        message={confirmDialog?.action === 'deactivate'
          ? 'آیا مطمئن هستید؟ کاربر دیگر قادر به ورود به سیستم نخواهد بود.'
          : 'آیا می‌خواهید این کاربر را فعال کنید؟'
        }
        confirmLabel={confirmDialog?.label}
        variant={confirmDialog?.action === 'deactivate' ? 'danger' : 'primary'}
        onConfirm={() => confirmDialog && handleToggleActive(confirmDialog.userId)}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
}
