import Link from 'next/link';
import BookGrid from '@/components/books/BookGrid';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="bg-gradient-to-l from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          به کتاب‌نست خوش آمدید 📚
        </h1>
        <p className="text-lg text-primary-100 mb-6 max-w-2xl">
          بزرگترین مجموعه کتاب‌های فارسی و ترجمه با بهترین قیمت و ارسال سریع به سراسر کشور.
        </p>
        <Link
          href="/books"
          className="inline-block bg-white text-primary-700 px-6 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors"
        >
          مشاهده کتاب‌ها →
        </Link>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">دسته‌بندی‌های محبوب</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'ادبیات فارسی', slug: 'persian-literature', emoji: '📖' },
            { name: 'رمان', slug: 'novel', emoji: '📕' },
            { name: 'تاریخ', slug: 'history', emoji: '🏛️' },
            { name: 'علمی', slug: 'science', emoji: '🔬' },
            { name: 'کودک و نوجوان', slug: 'children', emoji: '🧒' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/books?category=${cat.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-primary-500 hover:shadow-md transition-all"
            >
              <span className="text-3xl block mb-2">{cat.emoji}</span>
              <span className="font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">کتاب‌های ویژه</h2>
          <Link href="/books" className="text-primary-600 hover:text-primary-700 font-medium">
            مشاهده همه →
          </Link>
        </div>
        <BookGrid />
      </section>

      {/* Features */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">چرا کتاب‌نست؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold text-gray-800 mb-2">ارسال سریع</h3>
            <p className="text-gray-600 text-sm">ارسال رایگان برای خریدهای بالای ۲۰۰ هزار تومان</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold text-gray-800 mb-2">تضمین اصالت</h3>
            <p className="text-gray-600 text-sm">تمام کتاب‌ها از ناشران معتبر و با ضمانت اصالت</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💳</div>
            <h3 className="font-bold text-gray-800 mb-2">پرداخت امن</h3>
            <p className="text-gray-600 text-sm">پرداخت امن از طریق درگاه‌های بانکی معتبر</p>
          </div>
        </div>
      </section>
    </div>
  );
}
