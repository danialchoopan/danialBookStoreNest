'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/store';

interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  price: number;
  comparePrice?: number;
  images: string[];
  averageRating: number | null;
  seller: { shopName: string };
}

export default function BookCard({ book }: { book: Book }) {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('برای افزودن به سبد خرید ابتدا وارد شوید');
      return;
    }
    try {
      await addItem(book.id);
      toast.success('به سبد خرید اضافه شد');
    } catch {
      toast.error('خطا در افزودن به سبد خرید');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const discount = book.comparePrice && book.comparePrice > book.price
    ? Math.round((1 - book.price / book.comparePrice) * 100)
    : null;

  return (
    <Link
      href={`/books/${book.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-56 bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl opacity-20 group-hover:scale-110 transition-transform duration-300">📖</span>
        </div>
        {discount && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
              {discount}%-
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-600 text-xs px-2 py-1 rounded-md">
            {book.seller.shopName}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[48px]">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {book.averageRating ? (
            <>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= Math.round(book.averageRating!) ? 'text-amber-400' : 'text-gray-200'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 mr-1">
                ({book.averageRating.toFixed(1)})
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-400">بدون امتیاز</span>
          )}
        </div>

        {/* Price + Cart */}
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(book.price)}
              </span>
              <span className="text-xs text-gray-400 mr-1">تومان</span>
            </div>
            {discount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(book.comparePrice!)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-50 text-primary-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 hover:text-white transition-all duration-200 border border-primary-100 hover:border-primary-600"
          >
            افزودن به سبد خرید
          </button>
        </div>
      </div>
    </Link>
  );
}
