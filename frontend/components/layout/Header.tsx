'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useCartStore } from '@/lib/cart-store';

export default function Header() {
  const { user, isAuthenticated, logout, loadUser } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-all duration-200 ${
        isScrolled ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-105 transition-transform">
              📚
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              کتاب<span className="text-primary-600">نست</span>
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-6 lg:mx-8">
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
                placeholder="جستجوی کتاب، نویسنده، ناشر..."
                className="w-full px-4 py-2.5 pr-11 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all text-sm"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <Link
              href="/books"
              className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              کتاب‌ها
            </Link>

            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden md:inline">سبد خرید</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -left-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Seller Dashboard */}
                {user?.role === 'SELLER' && (
                  <Link
                    href="/seller"
                    className="hidden lg:flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    داشبورد فروشنده
                  </Link>
                )}

                {/* Admin */}
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="hidden lg:flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    پنل مدیریت
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative group mr-2">
                  <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                      {user?.firstName?.[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden md:block">
                      {user?.firstName}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        سفارشات من
                      </Link>
                      {user?.role === 'SELLER' && (
                        <Link
                          href="/seller"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          داشبورد فروشنده
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        خروج
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  ورود
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-all text-sm font-medium shadow-sm shadow-primary-200"
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
