'use client';

import { useEffect, useState } from 'react';
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
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId);
    try {
      await removeItem(itemId);
      toast.success('کتاب از سبد حذف شد');
    } catch {
      toast.error('خطا در حذف کتاب');
    } finally {
      setRemovingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></div>
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
        <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mb-5"><svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">سبد خرید شما خالی است</h1>
        <p className="text-gray-500 mb-8">کتاب مورد علاقه خود را پیدا کنید!</p>
        <Link
          href="/books"
          className="bg-primary-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-700 shadow-sm shadow-primary-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          مشاهده کتاب‌ها
        </Link>
      </div>
    );
  }

  // Group items by seller
  const sellerGroups = items.reduce((acc: Record<string, typeof items>, item) => {
    const sellerName = item.book.seller.shopName;
    if (!acc[sellerName]) acc[sellerName] = [];
    acc[sellerName].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">سبد خرید</h1>
          <p className="text-gray-500 mt-1">{itemCount} کالا از {Object.keys(sellerGroups).length} فروشنده</p>
        </div>
        <button
          onClick={async () => {
            if (confirm('آیا مطمئن هستید؟ تمام آیتم‌ها حذف خواهند شد.')) {
              await clearCart();
              toast.success('سبد خرید خالی شد');
            }
          }}
          className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors border border-red-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          خالی کردن سبد
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          {Object.entries(sellerGroups).map(([sellerName, sellerItems]) => (
            <div key={sellerName} className="mb-6">
              {/* Seller Header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-bold text-gray-700">{sellerName}</span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {sellerItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white border border-gray-100 rounded-2xl p-5 flex gap-5 shadow-sm transition-all duration-300 ${
                      removingId === item.id ? 'opacity-50 scale-[0.98]' : 'hover:shadow-md'
                    }`}
                  >
                    {/* Image */}
                    <Link href={`/books/${item.book.id}`} className="shrink-0">
                      <div className="w-24 h-32 bg-gradient-to-br from-primary-50 to-white rounded-xl flex items-center justify-center border border-gray-100 hover:border-primary-200 transition-colors">
                        <svg className="w-8 h-8 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <Link
                        href={`/books/${item.book.id}`}
                        className="font-bold text-gray-800 hover:text-primary-600 line-clamp-1 text-lg transition-colors"
                      >
                        {item.book.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{item.book.author}</p>

                      {/* Price */}
                      <div className="mt-auto flex items-end gap-3">
                        <span className="text-xl font-bold text-primary-600">
                          {formatPrice(Number(item.book.price) * item.quantity)}
                        </span>
                        <span className="text-xs text-gray-400 mb-1">تومان</span>
                        {item.quantity > 1 && (
                          <span className="text-xs text-gray-400 mb-1">
                            ({formatPrice(item.book.price)} × {item.quantity})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        disabled={removingId === item.id}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      <div className="flex items-center gap-1 bg-gray-50 rounded-xl border border-gray-200">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              handleRemove(item.id);
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.book.stock}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-800 text-lg mb-6">خلاصه سفارش</h3>

            {/* Items Summary */}
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-sm shrink-0">
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 line-clamp-1">{item.book.title}</p>
                    <p className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.book.price)}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-800 shrink-0">
                    {formatPrice(Number(item.book.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">جمع ({itemCount} کالا)</span>
                <span className="font-medium">{formatPrice(totalAmount)} تومان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ارسال</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  رایگان
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm text-gray-500 block">مبلغ قابل پرداخت</span>
                  <span className="text-2xl font-bold text-primary-600">{formatPrice(totalAmount)}</span>
                  <span className="text-xs text-gray-400 mr-1">تومان</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200 mt-6 flex items-center justify-center gap-2 text-lg"
            >
              تسویه حساب
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <Link
              href="/books"
              className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4"
            >
              ← ادامه خرید
            </Link>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-3">
              <div className="text-center">
                <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                <p className="text-[10px] text-gray-500">پرداخت امن</p>
              </div>
              <div className="text-center">
                <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.144a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                <p className="text-[10px] text-gray-500">ارسال رایگان</p>
              </div>
              <div className="text-center">
                <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-[10px] text-gray-500">ضمانت بازگشت</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
