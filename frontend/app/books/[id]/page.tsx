'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import ReviewSection from '@/components/books/ReviewSection';

export default function BookDetailPage() {
  const params = useParams();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/books/${params.id}`);
      return data;
    },
  });

  const { data: relatedBooks } = useQuery({
    queryKey: ['related-books', book?.categories?.[0]?.category?.slug],
    queryFn: async () => {
      const slug = book?.categories?.[0]?.category?.slug;
      if (!slug) return { data: [] };
      const { data } = await api.get(`/books?category=${slug}&limit=4`);
      return data;
    },
    enabled: !!book?.categories?.[0]?.category?.slug,
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('برای افزودن به سبد خرید ابتدا وارد شوید');
      return;
    }
    try {
      await addItem(book.id, quantity);
      toast.success(`${quantity} نسخه به سبد خرید اضافه شد`);
    } catch {
      toast.error('خطا در افزودن به سبد خرید');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const discount = book?.comparePrice && book.comparePrice > book.price
    ? Math.round((1 - book.price / book.comparePrice) * 100)
    : null;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-8" />
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-96 h-[28rem] bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-5">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
              <div className="h-12 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">کتاب یافت نشد</h1>
        <Link href="/books" className="text-primary-600 hover:text-primary-700 mt-4">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary-600 transition-colors">خانه</Link>
        <span>/</span>
        <Link href="/books" className="hover:text-primary-600 transition-colors">کتاب‌ها</Link>
        {book.categories?.[0] && (
          <>
            <span>/</span>
            <Link
              href={`/books?category=${book.categories[0].category.slug}`}
              className="hover:text-primary-600 transition-colors"
            >
              {book.categories[0].category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-[200px]">{book.title}</span>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-10 mb-16">
        {/* Book Cover */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 rounded-2xl h-[28rem] flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden group">
            <span className="text-[8rem] opacity-30 group-hover:scale-110 transition-transform duration-500">📖</span>
            {discount && (
              <div className="absolute top-4 right-4">
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
                  {discount}% تخفیف
                </span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">{book.seller?.shopName}</span>
                <span className="text-xs text-gray-400">فروشنده</span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1">
          {/* Title & Author */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{book.title}</h1>
          <p className="text-lg text-gray-500 mb-1">نویسنده: <span className="font-medium text-gray-700">{book.author}</span></p>
          {book.publisher && (
            <p className="text-gray-500 mb-4">ناشر: <span className="font-medium text-gray-700">{book.publisher}</span></p>
          )}

          {/* Rating Summary */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl ${
                    book.averageRating && star <= Math.round(book.averageRating)
                      ? 'text-amber-400'
                      : 'text-gray-200'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="text-sm">
              {book.averageRating ? (
                <span className="font-bold text-gray-800">{book.averageRating.toFixed(1)}</span>
              ) : (
                <span className="text-gray-500">بدون امتیاز</span>
              )}
              <span className="text-gray-400 mr-2">
                ({book.reviews?.length || 0} نظر)
              </span>
            </div>
          </div>

          {/* Categories */}
          {book.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {book.categories.map((cat: any) => (
                <Link
                  key={cat.category.id}
                  href={`/books?category=${cat.category.slug}`}
                  className="bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors border border-primary-100"
                >
                  {cat.category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Price Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-end gap-4 mb-4">
              <div>
                <span className="text-4xl font-bold text-primary-600">
                  {formatPrice(book.price)}
                </span>
                <span className="text-sm text-gray-400 mr-2">تومان</span>
              </div>
              {discount && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(book.comparePrice!)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
                    {discount}-
                  </span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              {book.stock > 0 ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-600 text-sm font-medium">
                    موجود در انبار ({book.stock} عدد)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-500 text-sm font-medium">ناموجود</span>
                </>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {book.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-gray-50 rounded-xl border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-lg"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-gray-800 text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-600 text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  افزودن به سبد خرید
                </button>
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {book.isbn && (
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-xs text-gray-500 block">شابک</span>
                <span className="text-sm font-medium text-gray-800 font-mono">{book.isbn}</span>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500 block">زبان</span>
              <span className="text-sm font-medium text-gray-800">فارسی</span>
            </div>
            {book.publisher && (
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-xs text-gray-500 block">ناشر</span>
                <span className="text-sm font-medium text-gray-800">{book.publisher}</span>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500 block">فروشنده</span>
              <span className="text-sm font-medium text-gray-800">{book.seller?.shopName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {book.description && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-primary-600 rounded-full" />
            <h2 className="text-xl font-bold text-gray-800">توضیحات کتاب</h2>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{book.description}</p>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <ReviewSection bookId={book.id} reviews={book.reviews || []} averageRating={book.averageRating} />

      {/* Related Books */}
      {relatedBooks?.data?.filter((b: any) => b.id !== book.id).length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-primary-600 rounded-full" />
            <h2 className="text-xl font-bold text-gray-800">کتاب‌های مرتبط</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedBooks.data
              .filter((b: any) => b.id !== book.id)
              .slice(0, 4)
              .map((relatedBook: any) => (
                <Link
                  key={relatedBook.id}
                  href={`/books/${relatedBook.id}`}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="h-40 bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
                    <span className="text-5xl opacity-20 group-hover:scale-110 transition-transform">📖</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary-600 transition-colors text-sm">
                      {relatedBook.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{relatedBook.author}</p>
                    <p className="text-primary-600 font-bold text-sm mt-2">
                      {formatPrice(relatedBook.price)} تومان
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
