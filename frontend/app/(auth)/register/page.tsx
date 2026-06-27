'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }
    setIsLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      });
      toast.success('ثبت‌نام موفقیت‌آمیز بود');
      router.push('/');
    } catch {
      toast.error('خطا در ثبت‌نام');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg shadow-primary-200">
            📚
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ایجاد حساب کاربری</h1>
          <p className="text-gray-500 mt-1">به کتاب‌نست خوش آمدید</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                  placeholder="نام"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                  placeholder="نام خانوادگی"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن (اختیاری)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                placeholder="09121234567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                placeholder="حداقل ۸ کاراکتر"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تکرار رمز عبور</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                placeholder="تکرار رمز عبور"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-all disabled:bg-gray-300 shadow-sm shadow-primary-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  در حال ثبت‌نام...
                </span>
              ) : 'ثبت‌نام'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
