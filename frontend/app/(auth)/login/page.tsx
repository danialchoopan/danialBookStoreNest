'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('ورود موفقیت‌آمیز بود');
      const { user } = useAuthStore.getState();
      if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (user?.role === 'SELLER') {
        router.push('/seller');
      } else {
        router.push('/');
      }
    } catch {
      toast.error('ایمیل یا رمز عبور اشتباه است');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">خوش آمدید</h1>
          <p className="text-gray-500 mt-1">به حساب کاربری خود وارد شوید</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                placeholder="رمز عبور خود را وارد کنید"
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
                  در حال ورود...
                </span>
              ) : 'ورود'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              حساب کاربری ندارید؟{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 text-center mb-3">حساب‌های آزمایشی:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setEmail('admin@booknest.ir'); setPassword('admin123'); }}
              className="bg-white border border-gray-200 rounded-lg py-2 hover:border-primary-500 transition-colors"
            >
              <span className="font-medium text-gray-700">مدیر</span>
            </button>
            <button
              onClick={() => { setEmail('seller1@booknest.ir'); setPassword('seller123'); }}
              className="bg-white border border-gray-200 rounded-lg py-2 hover:border-primary-500 transition-colors"
            >
              <span className="font-medium text-gray-700">فروشنده</span>
            </button>
            <button
              onClick={() => { setEmail('customer1@booknest.ir'); setPassword('customer123'); }}
              className="bg-white border border-gray-200 rounded-lg py-2 hover:border-primary-500 transition-colors"
            >
              <span className="font-medium text-gray-700">کاربر</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
