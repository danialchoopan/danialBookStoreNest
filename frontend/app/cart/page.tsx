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
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">🔒</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">ورود لازم است</h1>
        <p className="text-gray-500 mb-6">برای مشاهده سبد خرید ابتدا وارد شوید</p>
        <Link href="/login" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700">
          ورود به حساب
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mb-4">🛒</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">سبد خرید خالی است</h1>
        <p className="text-gray-500 mb-6">کتاب مورد علاقه خود را پیدا کنید!</p>
        <Link
          href="/books"
          className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 shadow-sm shadow-primary-200"
        >
          مشاهده کتاب‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">سبد خرید</h1>
          <p className="text-gray-500 mt-1">{itemCount} کالا در سبد خرید شما</p>
        </div>
        <button
          onClick={async () => {
            await clearCart();
            toast.success('سبد خرید خالی شد');
          }}
          className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          خالی کردن سبد
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="w-24 h-32 bg-gradient-to-br from-primary-50 to-white rounded-xl flex items-center justify-center text-3xl text-gray-300 shrink-0 border border-gray-100">
                📖
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col">
                <Link
                  href={`/books/${item.book.id}`}
                  className="font-bold text-gray-800 hover:text-primary-600 line-clamp-1 text-lg transition-colors"
                >
                  {item.book.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{item.book.seller.shopName}</p>
                <div className="mt-auto">
                  <span className="text-xl font-bold text-primary-600">
                    {formatPrice(item.book.price)}
                  </span>
                  <span className="text-xs text-gray-400 mr-1">تومان</span>
                </div>
              </div>

              {/* Quantity & Remove */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center gap-1 bg-gray-50 rounded-xl border border-gray-200">
                  <button
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeItem(item.id);
                      } else {
                        updateQuantity(item.id, item.quantity - 1);
                      }
                    }}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-800 text-lg mb-5">خلاصه سفارش</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">تعداد اقلام</span>
                <span className="font-medium">{itemCount} عدد</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">جمع سبد خرید</span>
                <span className="font-medium">{formatPrice(totalAmount)} تومان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">هزینه ارسال</span>
                <span className="text-green-600 font-medium">رایگان</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-lg">مبلغ قابل پرداخت</span>
                <div className="text-left">
                  <span className="font-bold text-xl text-primary-600">{formatPrice(totalAmount)}</span>
                  <span className="text-xs text-gray-400 block">تومان</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200"
            >
              تسویه حساب
            </button>

            <Link
              href="/books"
              className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4"
            >
              ← ادامه خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
