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
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <Link
      href={`/books/${book.id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
          📖
        </div>
        {book.comparePrice && book.comparePrice > book.price && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {Math.round((1 - book.price / book.comparePrice) * 100)}% تخفیف
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{book.author}</p>
        <p className="text-xs text-gray-400 mb-3">{book.seller.shopName}</p>

        {/* Rating */}
        {book.averageRating && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">{book.averageRating.toFixed(1)}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(book.price)}
            </span>
            {book.comparePrice && (
              <span className="text-sm text-gray-400 line-through mr-2">
                {formatPrice(book.comparePrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          افزودن به سبد خرید
        </button>
      </div>
    </Link>
  );
}
