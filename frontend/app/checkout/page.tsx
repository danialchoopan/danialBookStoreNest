'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Step = 'address' | 'review' | 'success';

export default function CheckoutPage() {
  const { items, totalAmount, fetchCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>('address');
  const [orderId, setOrderId] = useState('');
  const [address, setAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
  });
  const [note, setNote] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: address,
        note: note || undefined,
      });
      setOrderId(data.id);
      setStep('success');
      fetchCart();
    } catch {
      toast.error('خطا در ثبت سفارش');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">🔒</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">ورود لازم است</h1>
        <p className="text-gray-500 mb-6">برای تسویه حساب ابتدا وارد شوید</p>
        <Link href="/login" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700">
          ورود به حساب
        </Link>
      </div>
    );
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">سبد خرید خالی است</h1>
        <p className="text-gray-500 mb-6">ابتدا کتابی به سبد خرید اضافه کنید.</p>
        <Link href="/books" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700">
          مشاهده کتاب‌ها
        </Link>
      </div>
    );
  }

  // Success State
  if (step === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">سفارش شما ثبت شد!</h1>
          <p className="text-gray-500 mb-2">شماره سفارش:</p>
          <p className="font-mono text-lg font-bold text-primary-600 mb-6 bg-primary-50 py-2 px-4 rounded-xl inline-block">
            {orderId.slice(0, 12)}...
          </p>
          <p className="text-gray-500 mb-8 leading-relaxed">
            سفارش شما با موفقیت ثبت شد و به زودی پردازش خواهد شد.
            <br />
            می‌توانید وضعیت سفارش را از بخش «سفارشات من» پیگیری کنید.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/orders"
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all"
            >
              مشاهده سفارشات
            </Link>
            <Link
              href="/books"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/cart" className="hover:text-primary-600 transition-colors">سبد خرید</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">تسویه حساب</span>
      </nav>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center gap-0">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            step === 'address' ? 'bg-primary-600 text-white' : 'bg-green-100 text-green-700'
          }`}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20">۱</span>
            <span className="text-sm font-medium">آدرس ارسال</span>
          </div>
          <div className={`w-12 h-0.5 ${step === 'review' || step === 'success' ? 'bg-green-400' : 'bg-gray-200'}`} />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            step === 'review' ? 'bg-primary-600 text-white' : step === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
          }`}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20">۲</span>
            <span className="text-sm font-medium">بررسی سفارش</span>
          </div>
          <div className={`w-12 h-0.5 ${step === 'success' ? 'bg-green-400' : 'bg-gray-200'}`} />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            step === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
          }`}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20">۳</span>
            <span className="text-sm font-medium">تأیید نهایی</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {step === 'address' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">آدرس ارسال</h2>
                  <p className="text-sm text-gray-500">آدرس تحویل سفارش را وارد کنید</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                      placeholder="علی رضایی"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                      placeholder="09121234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">آدرس کامل</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                    placeholder="خیابان انقلاب، کوچه بهار، پلاک ۱۲۳، واحد ۴"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">شهر</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                      placeholder="تهران"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">استان</label>
                    <input
                      type="text"
                      value={address.province}
                      onChange={(e) => setAddress({ ...address, province: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                      placeholder="تهران"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">کد پستی</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all"
                      placeholder="1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات <span className="text-gray-400 font-normal">(اختیاری)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all resize-none"
                    placeholder="زنگ در طبقه سوم، کد ۱۲۳۴..."
                  />
                </div>

                <button
                  onClick={() => setStep('review')}
                  disabled={!address.fullName || !address.phone || !address.street || !address.city || !address.province || !address.postalCode}
                  className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  بررسی سفارش
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              {/* Address Summary */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800">آدرس ارسال</h3>
                  </div>
                  <button
                    onClick={() => setStep('address')}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    ویرایش
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-800">{address.fullName}</p>
                  <p className="text-sm text-gray-600 mt-1">{address.street}</p>
                  <p className="text-sm text-gray-600">{address.city}، {address.province} - {address.postalCode}</p>
                  <p className="text-sm text-gray-600 mt-1">تلفن: {address.phone}</p>
                  {note && <p className="text-sm text-gray-500 mt-2 italic">توضیحات: {note}</p>}
                </div>
              </div>

              {/* Items Review */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  اقلام سفارش ({items.length})
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-12 h-16 bg-primary-50 rounded-lg flex items-center justify-center text-xl shrink-0">
                        📖
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm line-clamp-1">{item.book.title}</p>
                        <p className="text-xs text-gray-500">{item.book.seller.shopName} × {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-800 text-sm shrink-0">
                        {formatPrice(Number(item.book.price) * item.quantity)} ت
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200 flex items-center justify-center gap-2 text-lg disabled:bg-gray-300"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    در حال ثبت سفارش...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ثبت نهایی سفارش
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('address')}
                className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium"
              >
                بازگشت به مرحله قبل
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-800 text-lg mb-5">خلاصه سفارش</h3>

            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-sm shrink-0">
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 line-clamp-1">{item.book.title}</p>
                    <p className="text-xs text-gray-400">{item.quantity}×</p>
                  </div>
                  <span className="text-sm font-medium text-gray-800 shrink-0">
                    {formatPrice(Number(item.book.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">جمع کل</span>
                <span className="font-medium">{formatPrice(totalAmount)} تومان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ارسال</span>
                <span className="text-green-600 font-medium">رایگان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">مالیات</span>
                <span className="text-gray-400">—</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-gray-500">مبلغ قابل پرداخت</span>
                <div>
                  <span className="text-2xl font-bold text-primary-600">{formatPrice(totalAmount)}</span>
                  <span className="text-xs text-gray-400 block">تومان</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">پرداخت امن و مطمئن</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">ارسال رایگان بالای ۲۰۰ هزار تومان</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">ضمانت بازگشت ۷ روزه</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
