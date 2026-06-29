import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'ادبیات فارسی', slug: 'persian-literature' } }),
    prisma.category.create({ data: { name: 'رمان', slug: 'novel' } }),
    prisma.category.create({ data: { name: 'تاریخ', slug: 'history' } }),
    prisma.category.create({ data: { name: 'فلسفه', slug: 'philosophy' } }),
    prisma.category.create({ data: { name: 'علمی', slug: 'science' } }),
    prisma.category.create({ data: { name: 'کودک و نوجوان', slug: 'children' } }),
    prisma.category.create({ data: { name: 'روانشناسی', slug: 'psychology' } }),
    prisma.category.create({ data: { name: 'مذهبی', slug: 'religious' } }),
    prisma.category.create({ data: { name: 'اقتصاد', slug: 'economics' } }),
    prisma.category.create({ data: { name: 'هنر', slug: 'art' } }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@booknest.ir',
      password: adminPassword,
      firstName: 'مدیر',
      lastName: 'سیستم',
      role: Role.ADMIN,
      phone: '09121234567',
    },
  });

  // Seller users
  const sellerPassword = await bcrypt.hash('seller123', 10);
  const sellers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'seller1@booknest.ir',
        password: sellerPassword,
        firstName: 'علی',
        lastName: 'احمدی',
        role: Role.SELLER,
        phone: '09121111111',
      },
    }),
    prisma.user.create({
      data: {
        email: 'seller2@booknest.ir',
        password: sellerPassword,
        firstName: 'زهرا',
        lastName: 'کریمی',
        role: Role.SELLER,
        phone: '09122222222',
      },
    }),
    prisma.user.create({
      data: {
        email: 'seller3@booknest.ir',
        password: sellerPassword,
        firstName: 'رضا',
        lastName: 'موسوی',
        role: Role.SELLER,
        phone: '09123333333',
      },
    }),
  ]);

  // Seller profiles
  const sellerProfiles = await Promise.all([
    prisma.sellerProfile.create({
      data: {
        userId: sellers[0].id,
        shopName: 'کتابفروشی نور',
        shopSlug: 'noor-bookshop',
        description: 'بزرگترین مجموعه کتاب‌های ادبیات فارسی',
        isApproved: true,
        balance: 5000000,
      },
    }),
    prisma.sellerProfile.create({
      data: {
        userId: sellers[1].id,
        shopName: 'انتشارات دانش',
        shopSlug: 'danesh-publishing',
        description: 'انتشارات تخصصی کتاب‌های علمی و دانشگاهی',
        isApproved: true,
        balance: 3200000,
      },
    }),
    prisma.sellerProfile.create({
      data: {
        userId: sellers[2].id,
        shopName: 'فروشگاه کتاب سبز',
        shopSlug: 'sabz-bookshop',
        description: 'مجموعه کامل کتاب‌های کودک و نوجوان',
        isApproved: true,
        balance: 1800000,
      },
    }),
  ]);

  console.log(`✅ Created ${sellers.length} sellers`);

  // Customer users
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'customer1@booknest.ir',
        password: customerPassword,
        firstName: 'سارا',
        lastName: 'رضایی',
        role: Role.CUSTOMER,
        phone: '09131111111',
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer2@booknest.ir',
        password: customerPassword,
        firstName: 'محمد',
        lastName: 'حسینی',
        role: Role.CUSTOMER,
        phone: '09132222222',
      },
    }),
  ]);

  console.log(`✅ Created ${customers.length} customers`);

  // Books
  const booksData = [
    { title: 'بوف کور', author: 'صادق هدایت', publisher: 'انتشارات نیلوفر', price: 85000, stock: 25, sellerIdx: 0, catIdx: [0, 1] },
    { title: 'شازده احتجاب', author: 'هاتفی تیرانی', publisher: 'انتشارات نیلوفر', price: 72000, stock: 30, sellerIdx: 0, catIdx: [0, 1] },
    { title: 'داش آکل', author: 'محمد علی جمالزاده', publisher: 'انتشارات نیلوفر', price: 65000, stock: 20, sellerIdx: 0, catIdx: [0, 1] },
    { title: 'تاریخ ایران باستان', author: 'حسن تقی‌زاده', publisher: 'بنگاه ترجمه و نشر', price: 120000, stock: 15, sellerIdx: 0, catIdx: [2] },
    { title: 'فلسفه چیست', author: 'برتراند راسل', publisher: 'انتشارات علمی', price: 95000, stock: 40, sellerIdx: 1, catIdx: [3] },
    { title: 'تاریخ فلسفه غرب', author: 'برtrand Russell', publisher: 'انتشارات نیلوفر', price: 180000, stock: 12, sellerIdx: 1, catIdx: [3] },
    { title: 'کیهان‌شناسی', author: 'استیون هاوکینگ', publisher: 'انتشارات علمی', price: 110000, stock: 35, sellerIdx: 1, catIdx: [4] },
    { title: 'جهان در هشت روز', author: 'ریچارد داوکینز', publisher: 'انتشارات نیلوفر', price: 135000, stock: 22, sellerIdx: 1, catIdx: [4] },
    { title: 'خاله سوسکه', author: 'میرزا عبدالرحیم کلباسی', publisher: 'انتشارات کانون پرورش', price: 35000, stock: 100, sellerIdx: 2, catIdx: [5] },
    { title: 'کلیله و دمنه', author: 'ابن مقصور', publisher: 'انتشارات امیرکبیر', price: 68000, stock: 45, sellerIdx: 2, catIdx: [5] },
    { title: 'چهارده معصوم', author: 'محمدباقر مجلسی', publisher: 'انتشارات صهبا', price: 250000, stock: 30, sellerIdx: 2, catIdx: [7] },
    { title: 'نظام اقتصادی ایران', author: 'عباس شاکری', publisher: 'نشر نی', price: 145000, stock: 18, sellerIdx: 1, catIdx: [8] },
    { title: 'دنیای صادق هدایت', author: 'غلامحسین یوسفی', publisher: 'انتشارات علمی', price: 98000, stock: 28, sellerIdx: 0, catIdx: [0] },
    { title: 'تاریخ هنر', author: 'هربرت رید', publisher: 'انتشارات نگاه', price: 220000, stock: 10, sellerIdx: 1, catIdx: [9] },
    { title: 'انسان در جستجوی معنا', author: 'ویکتور فرانکل', publisher: 'انتشارات ا轸', price: 78000, stock: 55, sellerIdx: 2, catIdx: [6] },
    { title: 'صد سال تنهایی', author: 'گابریل گارسیا مارکز', publisher: 'انتشارات نیلوفر', price: 92000, stock: 40, sellerIdx: 0, catIdx: [1] },
    { title: 'شناخت روان انسان', author: 'وندینگ', publisher: 'انتشارات علمی', price: 88000, stock: 32, sellerIdx: 2, catIdx: [6] },
    { title: 'جغرافیای ایران', author: 'مسعود کیانی', publisher: 'انتشارات سمت', price: 65000, stock: 50, sellerIdx: 1, catIdx: [4] },
    { title: 'شعر نو', author: 'نیما یوشیج', publisher: 'انتشارات نیلوفر', price: 55000, stock: 60, sellerIdx: 0, catIdx: [0] },
    { title: 'شیمی عمومی', author: 'چانگ', publisher: 'انتشارات دانشگاهی', price: 175000, stock: 25, sellerIdx: 1, catIdx: [4] },
  ];

  for (const bookData of booksData) {
    const slug = bookData.title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-|-$/g, '');

    const book = await prisma.book.create({
      data: {
        sellerId: sellerProfiles[bookData.sellerIdx].id,
        title: bookData.title,
        slug,
        author: bookData.author,
        publisher: bookData.publisher,
        description: `${bookData.title} نوشته ${bookData.author}، اثری ماندگار در ادبیات فارسی.`,
        price: bookData.price,
        comparePrice: bookData.price * 1.15,
        stock: bookData.stock,
        isPublished: true,
        images: [`/books/${slug}.jpg`],
        categories: {
          create: bookData.catIdx.map((idx) => ({ categoryId: categories[idx].id })),
        },
      },
    });
  }

  console.log(`✅ Created ${booksData.length} books`);

  // Some reviews
  const allBooks = await prisma.book.findMany();
  const reviews = [
    { userId: customers[0].id, bookId: allBooks[0].id, rating: 5, comment: 'شاهکار ادبیات فارسی. بسیار تأثیرگذار بود.' },
    { userId: customers[1].id, bookId: allBooks[0].id, rating: 4, comment: 'خواندنش خیلی سخت بود ولی ارزشش رو داشت.' },
    { userId: customers[0].id, bookId: allBooks[4].id, rating: 5, comment: 'کتاب عالی درباره فلسفه. همه پیشنهاد می‌کنم.' },
    { userId: customers[1].id, bookId: allBooks[6].id, rating: 5, comment: 'استفان هاوکینگ همیشه بهترین است.' },
    { userId: customers[0].id, bookId: allBooks[8].id, rating: 4, comment: 'خاله سوسکه برای بچه‌ها عالیه.' },
    { userId: customers[1].id, bookId: allBooks[15].id, rating: 5, comment: 'مارکز بی‌نظیره.' },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  console.log(`✅ Created ${reviews.length} reviews`);

  // Wallet transactions
  const transactions = [
    { sellerId: sellerProfiles[0].id, amount: 2500000, type: 'CREDIT' as const, description: 'فروش کتاب بوف کور' },
    { sellerId: sellerProfiles[0].id, amount: 1200000, type: 'CREDIT' as const, description: 'فروش شازده احتجاب' },
    { sellerId: sellerProfiles[1].id, amount: 800000, type: 'CREDIT' as const, description: 'فروش کیهان‌شناسی' },
    { sellerId: sellerProfiles[1].id, amount: 500000, type: 'CREDIT' as const, description: 'فروش شیمی عمومی' },
  ];

  for (const txn of transactions) {
    await prisma.walletTransaction.create({ data: txn });
  }

  console.log(`✅ Created ${transactions.length} wallet transactions`);

  // Sample Orders
  const order1 = await prisma.order.create({
    data: {
      userId: customers[0].id,
      status: 'DELIVERED',
      totalAmount: allBooks[0].price + allBooks[4].price,
      shippingAddress: { street: 'خیابان انقلاب، پلاک ۱۲۳', city: 'تهران', province: 'تهران', postalCode: '1234567890' },
      items: {
        create: [
          { bookId: allBooks[0].id, sellerId: sellerProfiles[0].id, quantity: 1, unitPrice: allBooks[0].price, totalPrice: allBooks[0].price },
          { bookId: allBooks[4].id, sellerId: sellerProfiles[1].id, quantity: 1, unitPrice: allBooks[4].price, totalPrice: allBooks[4].price },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: customers[1].id,
      status: 'SHIPPED',
      totalAmount: allBooks[8].price * 2,
      shippingAddress: { street: 'خیابان ولیعصر، پلاک ۴۵۶', city: 'تهران', province: 'تهران', postalCode: '9876543210' },
      items: {
        create: [
          { bookId: allBooks[8].id, sellerId: sellerProfiles[2].id, quantity: 2, unitPrice: allBooks[8].price, totalPrice: allBooks[8].price * 2 },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: customers[0].id,
      status: 'PENDING',
      totalAmount: allBooks[15].price,
      shippingAddress: { street: 'خیابان آزادی، پلاک ۷۸۹', city: 'تهران', province: 'تهران', postalCode: '1122334455' },
      items: {
        create: [
          { bookId: allBooks[15].id, sellerId: sellerProfiles[0].id, quantity: 1, unitPrice: allBooks[15].price, totalPrice: allBooks[15].price },
        ],
      },
    },
  });

  // Update stock for ordered books
  await prisma.book.update({ where: { id: allBooks[0].id }, data: { stock: { decrement: 1 } } });
  await prisma.book.update({ where: { id: allBooks[4].id }, data: { stock: { decrement: 1 } } });
  await prisma.book.update({ where: { id: allBooks[8].id }, data: { stock: { decrement: 2 } } });

  // More orders for richer dashboard data
  const moreOrders = [
    { userId: customers[1].id, status: 'PAID', books: [{ idx: 2, sellerIdx: 0, qty: 1 }] },
    { userId: customers[0].id, status: 'PROCESSING', books: [{ idx: 6, sellerIdx: 1, qty: 1 }, { idx: 7, sellerIdx: 1, qty: 1 }] },
    { userId: customers[1].id, status: 'DELIVERED', books: [{ idx: 10, sellerIdx: 2, qty: 2 }] },
    { userId: customers[0].id, status: 'CANCELLED', books: [{ idx: 12, sellerIdx: 0, qty: 1 }] },
    { userId: customers[1].id, status: 'DELIVERED', books: [{ idx: 14, sellerIdx: 2, qty: 1 }] },
    { userId: customers[0].id, status: 'SHIPPED', books: [{ idx: 16, sellerIdx: 2, qty: 1 }, { idx: 17, sellerIdx: 1, qty: 1 }] },
    { userId: customers[1].id, status: 'PENDING', books: [{ idx: 18, sellerIdx: 0, qty: 1 }] },
    { userId: customers[0].id, status: 'PAID', books: [{ idx: 19, sellerIdx: 1, qty: 1 }] },
    { userId: customers[1].id, status: 'DELIVERED', books: [{ idx: 3, sellerIdx: 0, qty: 1 }] },
    { userId: customers[0].id, status: 'DELIVERED', books: [{ idx: 5, sellerIdx: 1, qty: 1 }] },
    { userId: customers[1].id, status: 'PROCESSING', books: [{ idx: 9, sellerIdx: 2, qty: 1 }, { idx: 11, sellerIdx: 1, qty: 1 }] },
    { userId: customers[0].id, status: 'SHIPPED', books: [{ idx: 1, sellerIdx: 0, qty: 1 }] },
  ];

  for (const orderData of moreOrders) {
    let totalAmount = 0;
    const items = orderData.books.map((b) => {
      const price = Number(allBooks[b.idx].price);
      totalAmount += price * b.qty;
      return { bookId: allBooks[b.idx].id, sellerId: sellerProfiles[b.sellerIdx].id, quantity: b.qty, unitPrice: allBooks[b.idx].price, totalPrice: price * b.qty };
    });

    await prisma.order.create({
      data: {
        userId: orderData.userId,
        status: orderData.status as any,
        totalAmount,
        shippingAddress: { street: 'خیابان نمونه', city: 'تهران', province: 'تهران', postalCode: '1234567890' },
        items: { create: items },
      },
    });
  }

  console.log(`✅ Created ${3 + moreOrders.length} sample orders`);

  // More reviews
  const moreReviews = [
    { userId: customers[1].id, bookId: allBooks[1].id, rating: 4, comment: 'کتاب خوبی بود، پیشنهاد می‌کنم.' },
    { userId: customers[0].id, bookId: allBooks[5].id, rating: 5, comment: 'تاریخ فلسفه عالی نوشته شده.' },
    { userId: customers[1].id, bookId: allBooks[9].id, rating: 4, comment: 'کلیله و دمنه همیشه جذابه.' },
    { userId: customers[0].id, bookId: allBooks[11].id, rating: 3, comment: 'محتوا خوب ولی چاپ متوسط بود.' },
    { userId: customers[1].id, bookId: allBooks[13].id, rating: 5, comment: 'کتاب هنر عالیه.' },
    { userId: customers[0].id, bookId: allBooks[16].id, rating: 4, comment: 'روانشناسی کاربردی خوبی بود.' },
    { userId: customers[1].id, bookId: allBooks[18].id, rating: 5, comment: 'شعر نو نیما بی‌نظیره.' },
    { userId: customers[0].id, bookId: allBooks[19].id, rating: 4, comment: 'شیمی عمومی برای دانشگاه عالیه.' },
  ];

  for (const review of moreReviews) {
    await prisma.review.create({ data: review });
  }

  console.log(`✅ Created ${reviews.length + moreReviews.length} total reviews`);

  // More wallet transactions
  const moreTransactions = [
    { sellerId: sellerProfiles[0].id, amount: 85000, type: 'CREDIT' as const, description: 'فروش داش آکل' },
    { sellerId: sellerProfiles[0].id, amount: 40000, type: 'DEBIT' as const, description: 'کمیسیون سفارش' },
    { sellerId: sellerProfiles[1].id, amount: 245000, type: 'CREDIT' as const, description: 'فروش تاریخ فلسفه غرب' },
    { sellerId: sellerProfiles[2].id, amount: 136000, type: 'CREDIT' as const, description: 'فروش کلیله و دمنه' },
    { sellerId: sellerProfiles[2].id, amount: 500000, type: 'CREDIT' as const, description: 'شارژ کیف پول' },
    { sellerId: sellerProfiles[0].id, amount: 92000, type: 'CREDIT' as const, description: 'فروش صد سال تنهایی' },
  ];

  for (const txn of moreTransactions) {
    await prisma.walletTransaction.create({ data: txn });
  }

  console.log(`✅ Created ${transactions.length + moreTransactions.length} total wallet transactions`);

  console.log('🎉 Seeding completed!');
  console.log('\n📋 Login credentials:');
  console.log('  Admin:    admin@booknest.ir / admin123');
  console.log('  Seller1:  seller1@booknest.ir / seller123');
  console.log('  Seller2:  seller2@booknest.ir / seller123');
  console.log('  Seller3:  seller3@booknest.ir / seller123');
  console.log('  Customer1: customer1@booknest.ir / customer123');
  console.log('  Customer2: customer2@booknest.ir / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
