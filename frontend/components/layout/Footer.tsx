import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">📚 کتاب‌نست</h3>
            <p className="text-sm leading-relaxed">
              بزرگترین فروشگاه آنلاین کتاب‌های فارسی و ترجمه. با بهترین قیمت و ارسال سریع.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/books" className="hover:text-white transition-colors">
                  کتاب‌ها
                </Link>
              </li>
              <li>
                <Link href="/books?category=persian-literature" className="hover:text-white transition-colors">
                  ادبیات فارسی
                </Link>
              </li>
              <li>
                <Link href="/books?category=novel" className="hover:text-white transition-colors">
                  رمان
                </Link>
              </li>
              <li>
                <Link href="/books?category=science" className="hover:text-white transition-colors">
                  کتاب‌های علمی
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">پشتیبانی</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  شرایط استفاده
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">تماس با ما</h4>
            <ul className="space-y-2 text-sm">
              <li>📞 تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>📧 ایمیل: info@booknest.ir</li>
              <li>📍 تهران، خیابان انقلاب</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} کتاب‌نست. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
