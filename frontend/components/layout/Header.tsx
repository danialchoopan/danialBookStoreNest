'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useCartStore } from '@/lib/cart-store';

export default function Header() {
  const { user, isAuthenticated, logout, loadUser } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUser();
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, loadUser, fetchCart]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">📚 کتاب‌نست</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/books?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی کتاب، نویسنده، ISBN..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
              >
                🔍
              </button>
            </form>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-4">
            <Link
              href="/books"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              کتاب‌ها
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/cart"
                  className="relative text-gray-600 hover:text-primary-600 transition-colors"
                >
                  🛒 سبد خرید
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {user?.role === 'SELLER' && (
                  <Link
                    href="/seller"
                    className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                  >
                    داشبورد فروشنده
                  </Link>
                )}

                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                  >
                    پنل مدیریت
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center gap-1 text-gray-700 font-medium">
                    {user?.firstName} {user?.lastName}
                    <span className="text-xs">▼</span>
                  </button>
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      سفارشات من
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      خروج
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  ورود
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
