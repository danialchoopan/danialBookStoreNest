'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['autocomplete', query],
    queryFn: async () => {
      const { data } = await api.get(`/search/autocomplete?q=${encodeURIComponent(query)}`);
      return data;
    },
    enabled: query.length >= 2,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const hasResults = data?.books?.length > 0 || data?.categories?.length > 0;

  return (
    <div ref={ref} className="relative flex-1 max-w-xl mx-6 lg:mx-8">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setShow(true); }}
        onFocus={() => query.length >= 2 && setShow(true)}
        placeholder="جستجوی کتاب، نویسنده، ناشر..."
        className="w-full px-4 py-2.5 pr-11 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
      <button
        onClick={() => {
          if (query.trim()) {
            window.location.href = `/books?search=${encodeURIComponent(query)}`;
          }
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Dropdown */}
      {show && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          {!hasResults ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              نتیجه‌ای یافت نشد
            </div>
          ) : (
            <>
              {/* Books */}
              {data.books?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-bold text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    کتاب‌ها
                  </div>
                  {data.books.map((book: any) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      onClick={() => { setShow(false); setQuery(''); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-10 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-lg shrink-0">
                        📖
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-white text-sm line-clamp-1">{book.title}</p>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>
                      <span className="text-sm font-bold text-primary-600 shrink-0">
                        {formatPrice(book.price)} ت
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Categories */}
              {data.categories?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-bold text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    دسته‌بندی‌ها
                  </div>
                  {data.categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/books?category=${cat.slug}`}
                      onClick={() => { setShow(false); setQuery(''); }}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span>📂</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* View All */}
              <Link
                href={`/books?search=${encodeURIComponent(query)}`}
                onClick={() => { setShow(false); setQuery(''); }}
                className="block px-4 py-3 text-center text-sm font-medium text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
              >
                مشاهده همه نتایج برای "{query}"
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
