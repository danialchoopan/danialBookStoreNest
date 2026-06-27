import Link from 'next/link';
import BookGrid from '@/components/books/BookGrid';

const categories = [
  { name: 'ادبیات فارسی', slug: 'persian-literature', emoji: '📖', color: 'from-amber-50 to-orange-50 border-amber-200' },
  { name: 'رمان', slug: 'novel', emoji: '📕', color: 'from-rose-50 to-pink-50 border-rose-200' },
  { name: 'تاریخ', slug: 'history', emoji: '🏛️', color: 'from-amber-50 to-yellow-50 border-amber-200' },
  { name: 'علمی', slug: 'science', emoji: '🔬', color: 'from-blue-50 to-cyan-50 border-blue-200' },
  { name: 'کودک', slug: 'children', emoji: '🧒', color: 'from-green-50 to-emerald-50 border-green-200' },
  { name: 'روانشناسی', slug: 'psychology', emoji: '🧠', color: 'from-purple-50 to-violet-50 border-purple-200' },
  { name: 'فلسفه', slug: 'philosophy', emoji: '💭', color: 'from-indigo-50 to-blue-50 border-indigo-200' },
  { name: 'مذهبی', slug: 'religious', emoji: '🕌', color: 'from-teal-50 to-cyan-50 border-teal-200' },
  { name: 'اقتصاد', slug: 'economics', emoji: '📊', color: 'from-emerald-50 to-green-50 border-emerald-200' },
  { name: 'هنر', slug: 'art', emoji: '🎨', color: 'from-fuchsia-50 to-pink-50 border-fuchsia-200' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-l from-primary-600 via-primary-700 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-9xl">📚</div>
          <div className="absolute bottom-10 left-10 text-9xl">📖</div>
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
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-xl">📚</div>
              <div>
                <div className="font-bold text-gray-800">+۱,۰۰۰</div>
                <div className="text-sm text-gray-500">کتاب موجود</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">🏪</div>
              <div>
                <div className="font-bold text-gray-800">+۵۰</div>
                <div className="text-sm text-gray-500">فروشنده فعال</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl">🚚</div>
              <div>
                <div className="font-bold text-gray-800">ارسال رایگان</div>
                <div className="text-sm text-gray-500">خرید بالای ۲۰۰K</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl">⭐</div>
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
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</span>
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
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🚚</div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">ارسال سریع و رایگان</h3>
              <p className="text-gray-500 text-sm leading-relaxed">ارسال رایگان برای خریدهای بالای ۲۰۰ هزار تومان و تحویل در کمتر از ۳ روز</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">تضمین اصالت کتاب</h3>
              <p className="text-gray-500 text-sm leading-relaxed">تمام کتاب‌ها از ناشران معتبر با ضمانت اصالت و کیفیت چاپ</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">💳</div>
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
