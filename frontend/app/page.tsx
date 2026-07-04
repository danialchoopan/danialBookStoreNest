import Link from 'next/link';
import BookGrid from '@/components/books/BookGrid';

const categories = [
  { name: 'ادبیات فارسی', slug: 'persian-literature', color: 'from-amber-50 to-orange-50 border-amber-200', iconColor: 'text-amber-600' },
  { name: 'رمان', slug: 'novel', color: 'from-rose-50 to-pink-50 border-rose-200', iconColor: 'text-rose-600' },
  { name: 'تاریخ', slug: 'history', color: 'from-amber-50 to-yellow-50 border-amber-200', iconColor: 'text-amber-700' },
  { name: 'علمی', slug: 'science', color: 'from-blue-50 to-cyan-50 border-blue-200', iconColor: 'text-blue-600' },
  { name: 'کودک', slug: 'children', color: 'from-green-50 to-emerald-50 border-green-200', iconColor: 'text-green-600' },
  { name: 'روانشناسی', slug: 'psychology', color: 'from-purple-50 to-violet-50 border-purple-200', iconColor: 'text-purple-600' },
  { name: 'فلسفه', slug: 'philosophy', color: 'from-indigo-50 to-blue-50 border-indigo-200', iconColor: 'text-indigo-600' },
  { name: 'مذهبی', slug: 'religious', color: 'from-teal-50 to-cyan-50 border-teal-200', iconColor: 'text-teal-600' },
  { name: 'اقتصاد', slug: 'economics', color: 'from-emerald-50 to-green-50 border-emerald-200', iconColor: 'text-emerald-600' },
  { name: 'هنر', slug: 'art', color: 'from-fuchsia-50 to-pink-50 border-fuchsia-200', iconColor: 'text-fuchsia-600' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-l from-primary-600 via-primary-700 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10">
            <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
          </div>
          <div className="absolute bottom-10 left-10">
            <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm">بیش از ۱۰۰۰ کتاب موجود</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              به <span className="text-yellow-300">کتاب‌نست</span> خوش آمدید
            </h1>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              بزرگترین مجموعه کتاب‌های فارسی و ترجمه با بهترین قیمت، ارسال رایگان و ضمانت اصالت.
              هزاران کتاب از صدها فروشنده معتبر.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/books"
                className="bg-white text-primary-700 px-8 py-3.5 rounded-xl font-bold hover:bg-primary-50 transition-all shadow-lg shadow-primary-900/30"
              >
                مشاهده کتاب‌ها
              </Link>
              <Link
                href="/register"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                ثبت‌نام فروشنده
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg></div>
              <div>
                <div className="font-bold text-gray-800">+۱,۰۰۰</div>
                <div className="text-sm text-gray-500">کتاب موجود</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg></div>
              <div>
                <div className="font-bold text-gray-800">+۵۰</div>
                <div className="text-sm text-gray-500">فروشنده فعال</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.144a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg></div>
              <div>
                <div className="font-bold text-gray-800">ارسال رایگان</div>
                <div className="text-sm text-gray-500">خرید بالای ۲۰۰K</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor"><path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" /></svg></div>
              <div>
                <div className="font-bold text-gray-800">۴.۸</div>
                <div className="text-sm text-gray-500">رضایت مشتریان</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">دسته‌بندی‌های محبوب</h2>
            <p className="text-gray-500 mt-1">دسته‌بندی مورد علاقه خود را پیدا کنید</p>
          </div>
          <Link href="/books" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            مشاهده همه →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/books?category=${cat.slug}`}
              className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-5 text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group`}
            >
              <span className={`block mb-3 group-hover:scale-110 transition-transform ${cat.iconColor}`}>
                <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
              </span>
              <span className="font-bold text-gray-700 text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">کتاب‌های ویژه</h2>
            <p className="text-gray-500 mt-1">پرفروش‌ترین کتاب‌های این هفته</p>
          </div>
          <Link href="/books" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            مشاهده همه →
          </Link>
        </div>
        <BookGrid />
      </section>

      {/* Features */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">چرا کتاب‌نست؟</h2>
            <p className="text-gray-500">بیش از ۱۰,۰۰۰ مشتری راضی</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.144a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg></div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">ارسال سریع و رایگان</h3>
              <p className="text-gray-500 text-sm leading-relaxed">ارسال رایگان برای خریدهای بالای ۲۰۰ هزار تومان و تحویل در کمتر از ۳ روز</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">تضمین اصالت کتاب</h3>
              <p className="text-gray-500 text-sm leading-relaxed">تمام کتاب‌ها از ناشران معتبر با ضمانت اصالت و کیفیت چاپ</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg></div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">پرداخت امن و مطمئن</h3>
              <p className="text-gray-500 text-sm leading-relaxed">پرداخت امن از طریق درگاه‌های بانکی معتبر با پشتیبانی ۲۴ ساعته</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-l from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            فروشنده کتاب هستید؟
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            با ثبت‌نام به عنوان فروشنده، کتاب‌های خود را به هزاران مشتری بفروشید و درآمد کسب کنید.
          </p>
          <Link
            href="/register"
            className="inline-block bg-primary-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-500 transition-all shadow-lg"
          >
            شروع به فروش کنید
          </Link>
        </div>
      </section>
    </div>
  );
}
