import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'کتاب‌نست | فروشگاه آنلاین کتاب',
  description: 'بزرگترین فروشگاه آنلاین کتاب‌های فارسی و ترجمه',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-vazir min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
