'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalAmount, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    province: '',
    postalCode: '',
  });
  const [note, setNote] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/orders', {
        shippingAddress: address,
        note: note || undefined,
      });
      toast.success('سفارش با موفقیت ثبت شد');
      fetchCart();
      router.push('/orders');
    } catch {
      toast.error('خطا در ثبت سفارش');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">برای تسویه حساب ابتدا وارد شوید</p>
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
        <p className="text-gray-500 mb-6">ابتدا کتابی به سبد خرید اضافه کنید.</p>
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">تسویه حساب</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Address Form */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">آدرس ارسال</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  خیابان و آدرس
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="خیابان انقلاب، پلاک ۱۲۳"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شهر
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="تهران"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    استان
                  </label>
                  <input
                    type="text"
                    value={address.province}
                    onChange={(e) => setAddress({ ...address, province: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="تهران"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  کد پستی
                </label>
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات (اختیاری)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="توضیحات اضافی برای سفارش..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors disabled:bg-gray-300"
              >
                {isLoading ? 'در حال ثبت سفارش...' : 'ثبت سفارش'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">خلاصه سفارش</h3>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1">
                    {item.book.title} × {item.quantity}
                  </span>
                  <span className="font-medium shrink-0 mr-2">
                    {formatPrice(Number(item.book.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">جمع</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ارسال</span>
                <span className="text-green-600">رایگان</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>مبلغ قابل پرداخت</span>
                <span className="text-primary-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
