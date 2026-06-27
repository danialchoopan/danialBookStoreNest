'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, totalAmount, itemCount, fetchCart, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">برای مشاهده سبد خرید ابتدا وارد شوید</p>
        <Link href="/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg">
          ورود
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">سبد خرید خالی است</h1>
        <p className="text-gray-500 mb-6">کتاب مورد علاقه خود را پیدا کنید!</p>
        <Link
          href="/books"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700"
        >
          مشاهده کتاب‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          سبد خرید ({itemCount} کالا)
        </h1>
        <button
          onClick={async () => {
            await clearCart();
            toast.success('سبد خرید خالی شد');
          }}
          className="text-red-500 hover:text-red-600 text-sm font-medium"
        >
          خالی کردن سبد
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4"
              >
                {/* Image */}
                <div className="w-20 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-2xl text-gray-300 shrink-0">
                  📖
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/books/${item.book.id}`}
                    className="font-bold text-gray-800 hover:text-primary-600 line-clamp-1"
                  >
                    {item.book.title}
                  </Link>
                  <p className="text-sm text-gray-500">{item.book.seller.shopName}</p>
                  <p className="text-primary-600 font-bold mt-2">
                    {formatPrice(item.book.price)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeItem(item.id);
                        } else {
                          updateQuantity(item.id, item.quantity - 1);
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600 text-xs"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">خلاصه سفارش</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">تعداد اقلام</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">جمع سبد خرید</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">هزینه ارسال</span>
                <span className="text-green-600">رایگان</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>مبلغ قابل پرداخت</span>
                <span className="text-primary-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
            >
              تسویه حساب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
