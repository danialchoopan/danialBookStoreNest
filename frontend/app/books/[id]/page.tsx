'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import ReviewForm from '@/components/books/ReviewForm';

export default function BookDetailPage() {
  const params = useParams();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/books/${params.id}`);
      return data;
    },
  });

  const handleAddToCart = async () => {
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="flex gap-8">
            <div className="w-80 h-96 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
        کتاب یافت نشد.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center text-6xl text-gray-300">
            📖
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h1>
          <p className="text-gray-500 mb-1">نویسنده: {book.author}</p>
          {book.publisher && (
            <p className="text-gray-500 mb-1">ناشر: {book.publisher}</p>
          )}
          {book.isbn && (
            <p className="text-gray-500 mb-4">ISBN: {book.isbn}</p>
          )}

          {/* Seller */}
          <p className="text-sm text-gray-400 mb-4">
            فروشنده: {book.seller?.shopName}
          </p>

          {/* Categories */}
          {book.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {book.categories.map((cat: any) => (
                <span
                  key={cat.category.id}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  {cat.category.name}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          {book.averageRating && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-gray-600">{book.averageRating.toFixed(1)} از ۵</span>
              <span className="text-gray-400">({book.reviews?.length || 0} نظر)</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(book.price)}
            </span>
            {book.comparePrice && book.comparePrice > book.price && (
              <span className="text-lg text-gray-400 line-through mr-3">
                {formatPrice(book.comparePrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          <p className={`text-sm mb-6 ${book.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {book.stock > 0 ? `موجود در انبار (${book.stock} عدد)` : 'ناموجود'}
          </p>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            افزودن به سبد خرید
          </button>

          {/* Description */}
          {book.description && (
            <div className="mt-8">
              <h3 className="font-bold text-gray-800 mb-3">توضیحات</h3>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Reviews */}
          {book.reviews?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-bold text-gray-800 mb-4">نظرات کاربران</h3>
              <div className="space-y-4">
                {book.reviews.map((review: any) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-800">
                        {review.user.firstName} {review.user.lastName}
                      </span>
                      <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Form */}
          <div className="mt-8">
            <ReviewForm bookId={book.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
