'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BookGrid from '@/components/books/BookGrid';
import Pagination from '@/components/ui/Pagination';

export default function BooksPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);

  const categories = [
    { name: 'همه کتاب‌ها', slug: '', emoji: '📚' },
    { name: 'ادبیات فارسی', slug: 'persian-literature', emoji: '📖' },
    { name: 'رمان', slug: 'novel', emoji: '📕' },
    { name: 'تاریخ', slug: 'history', emoji: '🏛️' },
    { name: 'فلسفه', slug: 'philosophy', emoji: '💭' },
    { name: 'علمی', slug: 'science', emoji: '🔬' },
    { name: 'کودک و نوجوان', slug: 'children', emoji: '🧒' },
    { name: 'روانشناسی', slug: 'psychology', emoji: '🧠' },
    { name: 'مذهبی', slug: 'religious', emoji: '🕌' },
    { name: 'اقتصاد', slug: 'economics', emoji: '📊' },
    { name: 'هنر', slug: 'art', emoji: '🎨' },
  ];

  const activeCategory = categories.find(c => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {search ? `نتایج جستجو برای "${search}"` : 'فروشگاه کتاب'}
        </h1>
        <p className="text-gray-500">
          {activeCategory?.name || 'مشاهده همه کتاب‌ها'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">جستجو</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="نام کتاب یا نویسنده..."
                  className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">دسته‌بندی</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => { setCategory(cat.slug); setPage(1); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      category === cat.slug
                        ? 'bg-primary-50 text-primary-700 font-bold border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Books Grid */}
        <div className="flex-1">
          <BookGrid search={search} category={category} page={page} />
          {/* Pagination handled inside BookGrid via page prop */}
        </div>
      </div>
    </div>
  );
}
