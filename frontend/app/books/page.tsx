'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BookGrid from '@/components/books/BookGrid';

export default function BooksPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = [
    { name: 'همه', slug: '' },
    { name: 'ادبیات فارسی', slug: 'persian-literature' },
    { name: 'رمان', slug: 'novel' },
    { name: 'تاریخ', slug: 'history' },
    { name: 'فلسفه', slug: 'philosophy' },
    { name: 'علمی', slug: 'science' },
    { name: 'کودک و نوجوان', slug: 'children' },
    { name: 'روانشناسی', slug: 'psychology' },
    { name: 'مذهبی', slug: 'religious' },
    { name: 'اقتصاد', slug: 'economics' },
    { name: 'هنر', slug: 'art' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {search ? `نتایج جستجو برای "${search}"` : 'همه کتاب‌ها'}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-24">
            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                جستجو
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="نام کتاب یا نویسنده..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                دسته‌بندی
              </label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setCategory(cat.slug)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                      category === cat.slug
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محدوده قیمت
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="از"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="تا"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Books Grid */}
        <div className="flex-1">
          <BookGrid search={search} category={category} />
        </div>
      </div>
    </div>
  );
}
