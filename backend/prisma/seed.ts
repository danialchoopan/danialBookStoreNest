import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');
}

function randomDate(daysAgo: number): Date {
  const now = new Date();
  now.setDate(now.getDate() - Math.floor(Math.random() * daysAgo));
  return now;
}

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── CATEGORIES ──────────────────────────────────────
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
    prisma.category.create({ data: { name: 'شعر', slug: 'poetry' } }),
    prisma.category.create({ data: { name: 'زبان خارجی', slug: 'foreign-language' } }),
    prisma.category.create({ data: { name: ' jurists', slug: 'jurisprudence' } }),
    prisma.category.create({ data: { name: 'کامپیوتر', slug: 'computer' } }),
  ]);

  // Subcategories
  const subCategories = await Promise.all([
    prisma.category.create({ data: { name: 'ادبیات داستانی', slug: 'fiction-literature', parentId: categories[0].id } }),
    prisma.category.create({ data: { name: 'ادبیات غیرداستانی', slug: 'non-fiction-literature', parentId: categories[0].id } }),
    prisma.category.create({ data: { name: 'رمان ایرانی', slug: 'iranian-novel', parentId: categories[1].id } }),
    prisma.category.create({ data: { name: 'رمان خارجی', slug: 'foreign-novel', parentId: categories[1].id } }),
    prisma.category.create({ data: { name: 'برنامه‌نویسی', slug: 'programming', parentId: categories[13].id } }),
  ]);

  console.log(`✅ Created ${categories.length} categories + ${subCategories.length} subcategories`);

  // ─── USERS ───────────────────────────────────────────
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

  const sellerPassword = await bcrypt.hash('seller123', 10);
  const sellers = await Promise.all([
    prisma.user.create({ data: { email: 'seller1@booknest.ir', password: sellerPassword, firstName: 'علی', lastName: 'احمدی', role: Role.SELLER, phone: '09121111111' } }),
    prisma.user.create({ data: { email: 'seller2@booknest.ir', password: sellerPassword, firstName: 'زهرا', lastName: 'کریمی', role: Role.SELLER, phone: '09122222222' } }),
    prisma.user.create({ data: { email: 'seller3@booknest.ir', password: sellerPassword, firstName: 'رضا', lastName: 'موسوی', role: Role.SELLER, phone: '09123333333' } }),
    prisma.user.create({ data: { email: 'seller4@booknest.ir', password: sellerPassword, firstName: 'مریم', lastName: 'نوری', role: Role.SELLER, phone: '09124444444' } }),
    prisma.user.create({ data: { email: 'seller5@booknest.ir', password: sellerPassword, firstName: 'حسن', lastName: 'جانمحمدی', role: Role.SELLER, phone: '09125555555' } }),
  ]);

  const customerPassword = await bcrypt.hash('customer123', 10);
  const customers = await Promise.all([
    prisma.user.create({ data: { email: 'customer1@booknest.ir', password: customerPassword, firstName: 'سارا', lastName: 'رضایی', role: Role.CUSTOMER, phone: '09131111111' } }),
    prisma.user.create({ data: { email: 'customer2@booknest.ir', password: customerPassword, firstName: 'محمد', lastName: 'حسینی', role: Role.CUSTOMER, phone: '09132222222' } }),
    prisma.user.create({ data: { email: 'customer3@booknest.ir', password: customerPassword, firstName: 'نیلوفر', lastName: 'صمدی', role: Role.CUSTOMER, phone: '09133333333' } }),
    prisma.user.create({ data: { email: 'customer4@booknest.ir', password: customerPassword, firstName: 'امیر', lastName: 'каспی', role: Role.CUSTOMER, phone: '09134444444' } }),
    prisma.user.create({ data: { email: 'customer5@booknest.ir', password: customerPassword, firstName: 'لیلا', lastName: 'محمدی', role: Role.CUSTOMER, phone: '09135555555' } }),
    prisma.user.create({ data: { email: 'customer6@booknest.ir', password: customerPassword, firstName: 'بهنام', lastName: 'ставрی', role: Role.CUSTOMER, phone: '09136666666' } }),
    prisma.user.create({ data: { email: 'customer7@booknest.ir', password: customerPassword, firstName: 'نرگس', lastName: 'جعفری', role: Role.CUSTOMER, phone: '09137777777' } }),
    prisma.user.create({ data: { email: 'customer8@booknest.ir', password: customerPassword, firstName: 'فرهاد', lastName: 'اکبری', role: Role.CUSTOMER, phone: '09138888888' } }),
  ]);

  console.log(`✅ Created 1 admin, ${sellers.length} sellers, ${customers.length} customers`);

  // ─── SELLER PROFILES ─────────────────────────────────
  const sellerProfiles = await Promise.all([
    prisma.sellerProfile.create({ data: { userId: sellers[0].id, shopName: 'کتابفروشی نور', shopSlug: 'noor-bookshop', description: 'بزرگترین مجموعه کتاب‌های ادبیات فارسی و ترجمه. ارسال رایگان بالای ۲۰۰ هزار تومان.', isApproved: true, balance: 5000000, commissionRate: 10 } }),
    prisma.sellerProfile.create({ data: { userId: sellers[1].id, shopName: 'انتشارات دانش', shopSlug: 'danesh-publishing', description: 'انتشارات تخصصی کتاب‌های علمی و دانشگاهی. بیش از ۵۰۰ عنوان کتاب.', isApproved: true, balance: 3200000, commissionRate: 12 } }),
    prisma.sellerProfile.create({ data: { userId: sellers[2].id, shopName: 'فروشگاه کتاب سبز', shopSlug: 'sabz-bookshop', description: 'مجموعه کامل کتاب‌های کودک و نوجوان با بهترین قیمت.', isApproved: true, balance: 1800000, commissionRate: 8 } }),
    prisma.sellerProfile.create({ data: { userId: sellers[3].id, shopName: 'کتابستان مجازی', shopSlug: 'ketabestan', description: 'فروشگاه تخصصی کتاب‌های کامپیوتر و فناوری اطلاعات.', isApproved: true, balance: 2400000, commissionRate: 10 } }),
    prisma.sellerProfile.create({ data: { userId: sellers[4].id, shopName: 'انتشارات فردا', shopSlug: 'farda-publishing', description: 'انتشارات تازه تأسیس منتظر تأیید مدیریت.', isApproved: false, balance: 0, commissionRate: 10 } }),
  ]);

  console.log(`✅ Created ${sellerProfiles.length} seller profiles (4 approved, 1 pending)`);

  // ─── BOOKS ───────────────────────────────────────────
  const booksData = [
    { title: 'بوف کور', author: 'صادق هدایت', publisher: 'انتشارات نیلوفر', isbn: '978-964-448-123-1', price: 85000, stock: 25, sellerIdx: 0, catIdx: [0, 1], desc: 'شاهکار ادبیات مدرن فارسی. رمانی نمادین که زندگی درونی روایتگر را به تصویر می‌کشد.' },
    { title: 'شازده احتجاب', author: 'هاتفی تیرانی', publisher: 'انتشارات نیلوفر', isbn: '978-964-448-124-8', price: 72000, stock: 30, sellerIdx: 0, catIdx: [0, 1], desc: 'داستان افول یک خاندان قاجاری که با نثری شاعرانه روایت می‌شود.' },
    { title: 'داش آکل', author: 'محمد علی جمالزاده', publisher: 'انتشارات نیلوفر', isbn: '978-964-448-125-5', price: 65000, stock: 20, sellerIdx: 0, catIdx: [0], desc: 'مجموعه داستان‌های کوتاه جمالزاده، پدر داستان‌نویسی مدرن فارسی.' },
    { title: 'تاریخ ایران باستان', author: 'حسن تقی‌زاده', publisher: 'بنگاه ترجمه و نشر', isbn: '978-964-448-126-2', price: 120000, stock: 15, sellerIdx: 0, catIdx: [2], desc: 'جامع‌ترین اثر درباره تاریخ ایران از دوران هخامنشیان تا ساسانیان.' },
    { title: 'فلسفه چیست', author: 'برتراند راسل', publisher: 'انتشارات علمی', isbn: '978-964-448-127-9', price: 95000, stock: 40, sellerIdx: 1, catIdx: [3], desc: 'معرفی مختصر و مفید فلسفه غرب برای خوانندگان مبتدی.' },
    { title: 'تاریخ فلسفه غرب', author: 'برtrand Russell', publisher: 'انتشارات نیلوفر', isbn: '978-964-448-128-6', price: 180000, stock: 12, sellerIdx: 1, catIdx: [3], desc: 'سفری در تاریخ اندیشه‌های فلسفی از یونان باستان تا عصر حاضر.' },
    { title: 'کیهان‌شناسی', author: 'استیون هاوکینگ', publisher: 'انتشارات علمی', isbn: '978-964-448-129-3', price: 110000, stock: 35, sellerIdx: 1, catIdx: [4], desc: 'معرفی مفاهیم بنیادین کیهان‌شناسی نوین توسط بزرگترین فیزیکدان زنده.' },
    { title: 'جهان در هشت روز', author: 'ریچارد داوکینز', publisher: 'انتشارات نیلوفر', isbn: '978-964-448-130-9', price: 135000, stock: 22, sellerIdx: 1, catIdx: [4], desc: 'توضیح ساده و جذاب تئوری تکامل و ژنتیک برای همه.' },
    { title: 'خاله سوسکه', author: 'میرزا عبدالرحیم کلباسی', publisher: 'انتشارات کانون پرورش', isbn: '978-964-448-131-6', price: 35000, stock: 100, sellerIdx: 2, catIdx: [5], desc: 'داستان محبوب و کلاسیک کودکان ایرانی با تصویرگری رنگارنگ.' },
    { title: 'کلیله و دمنه', author: 'ابن مقصور', publisher: 'انتشارات امیرکبیر', isbn: '978-964-448-132-3', price: 68000, stock: 45, sellerIdx: 2, catIdx: [5, 2], desc: 'مجموعه حکایت‌های آموزنده کلاسیک با زبان ساده برای نوجوانان.' },
    { title: 'چهارده معصوم', author: 'محمدباقر مجلسی', publisher: 'انتشارات صهبا', isbn: '978-964-448-133-0', price: 250000, stock: 30, sellerIdx: 2, catIdx: [7], desc: 'زندگینامه چهارده معصوم (ع) با روایتی ساده و روان.' },
    { title: 'نظام اقتصادی ایران', author: 'عباس شاکری', publisher: 'نشر نی', isbn: '978-964-448-134-7', price: 145000, stock: 18, sellerIdx: 1, catIdx: [8], desc: 'تحلیل جامع اقتصاد ایران از انقلاب تاکنون.' },
    { title: 'دنیای صادق هدایت', author: 'غلامحسین یوسفی', publisher: 'انتشارات علمی', isbn: '978-964-448-135-4', price: 98000, stock: 28, sellerIdx: 0, catIdx: [0], desc: 'بررسی آثار و اندیشه‌های صادق هدایت، نویسنده بزرگ معاصر.' },
    { title: 'تاریخ هنر', author: 'هربرت رید', publisher: 'انتشارات نگاه', isbn: '978-964-448-136-1', price: 220000, stock: 10, sellerIdx: 1, catIdx: [9], desc: 'مروری جامع بر تاریخ هنر از دوران غارنشینی تا هنر معاصر.' },
    { title: 'انسان در جستجوی معنا', author: 'ویکتور فرانکل', publisher: 'انتشارات ا轸', isbn: '978-964-448-137-8', price: 78000, stock: 55, sellerIdx: 2, catIdx: [6], desc: 'تجربیات روانپزشکی که در اردوگاه‌های کار اجباری نازی‌ها کسب کرد.' },
    { title: 'صد سال تنهایی', author: 'گابریل گارسیا مارکز', publisher: 'انتشارات نیلوفر', isbn: '978-964-448-138-5', price: 92000, stock: 40, sellerIdx: 0, catIdx: [1], desc: 'شاهکار رئالیسم جادویی و یکی از مهمترین رمان‌های قرن بیستم.' },
    { title: 'شناخت روان انسان', author: 'وندینگ', publisher: 'انتشارات علمی', isbn: '978-964-448-139-2', price: 88000, stock: 32, sellerIdx: 2, catIdx: [6], desc: 'معرفی مفاهیم پایه روانشناسی برای عموم خوانندگان.' },
    { title: 'جغرافیای ایران', author: 'مسعود کیانی', publisher: 'انتشارات سمت', isbn: '978-964-448-140-8', price: 65000, stock: 50, sellerIdx: 1, catIdx: [4], desc: 'آشنایی با اقلیم، جغرافیا و منابع طبیعی ایران.' },
    { title: 'شعر نو', author: 'نیما یوشیج', publisher: 'انتشارات نیلوفر', isbn: '978-964-448-141-5', price: 55000, stock: 60, sellerIdx: 0, catIdx: [0, 10], desc: 'مجموعه آثار شعری پدر شعر نو فارسی.' },
    { title: 'شیمی عمومی', author: 'چانگ', publisher: 'انتشارات دانشگاهی', isbn: '978-964-448-142-2', price: 175000, stock: 25, sellerIdx: 1, catIdx: [4], desc: 'متن استاندارد درس شیمی عمومی برای دانشجویان رشته‌های علوم پایه.' },
    { title: 'تنهایی پر هیاهو', author: 'نادر ابراهیمی', publisher: 'انتشارات نیلوفر', isbn: '978-964-448-143-9', price: 62000, stock: 35, sellerIdx: 0, catIdx: [0, 1], desc: 'رمان محبوب نادر ابراهیمی درباره زندگی جوانان تهرانی.' },
    { title: 'برنامه‌نویسی با جاوااسکریپت', author: 'پروین نیک‌خواه', publisher: 'انتشارات دانشگاهی', isbn: '978-964-448-144-6', price: 125000, stock: 40, sellerIdx: 3, catIdx: [13], desc: 'آموزش جامع برنامه‌نویسی وب با جاوااسکریپت از مقدماتی تا پیشرفته.' },
    { title: 'React در عمل', author: 'کوین بیل', publisher: 'انتشارات دانشگاهی', isbn: '978-964-448-145-3', price: 155000, stock: 30, sellerIdx: 3, catIdx: [13], desc: 'راهنمای عملی ساخت اپلیکیشن‌های وب با React و Next.js.' },
    { title: 'پایگاه داده SQL', author: 'امیر حسین مقدم', publisher: 'انتشارات دانشگاهی', isbn: '978-964-448-146-0', price: 110000, stock: 45, sellerIdx: 3, catIdx: [13], desc: 'آموزش طراحی و مدیریت پایگاه‌های داده رابطه‌ای با SQL.' },
    { title: 'ادبیات داستانی معاصر', author: 'احمد مهدوی دامغانی', publisher: 'انتشارات نیلوفر', isbn: '978-964-448-147-7', price: 95000, stock: 22, sellerIdx: 0, catIdx: [0], desc: 'نقد و بررسی آثار برجسته ادبیات داستانی معاصر ایران.' },
    { title: 'اقتصاد خرد', author: 'علی دینی ترکمانی', publisher: 'نشر نی', isbn: '978-964-448-148-4', price: 130000, stock: 35, sellerIdx: 1, catIdx: [8], desc: 'مبانی اقتصاد خرد با رویکرد کاربردی و مثال‌های واقعی.' },
    { title: 'نقاشی با آبرنگ', author: 'فریده لاشایی', publisher: 'انتشارات نگاه', isbn: '978-964-448-149-1', price: 85000, stock: 18, sellerIdx: 2, catIdx: [9], desc: 'آموزش تکنیک‌های نقاشی با آبرنگ برای هنرجویان مبتدی.' },
    { title: 'زبان انگلیسی برای همه', author: 'دیوید نسل', publisher: 'انتشارات علمی', isbn: '978-964-448-150-7', price: 72000, stock: 65, sellerIdx: 3, catIdx: [11], desc: 'دوره جامع یادگیری زبان انگلیسی از سطح مبتدی تا پیشرفته.' },
    { title: 'گلستان سعدی', author: 'سعدی شیرازی', publisher: 'انتشارات امیرکبیر', isbn: '978-964-448-151-4', price: 48000, stock: 80, sellerIdx: 0, catIdx: [0, 10], desc: 'اثر جاودان سعدی با توضیحات و حواشی علمی.' },
  ];

  const allBooks = [];
  for (const bookData of booksData) {
    const book = await prisma.book.create({
      data: {
        sellerId: sellerProfiles[bookData.sellerIdx].id,
        title: bookData.title,
        slug: slugify(bookData.title),
        author: bookData.author,
        isbn: bookData.isbn,
        publisher: bookData.publisher,
        description: bookData.desc,
        price: bookData.price,
        comparePrice: Math.round(bookData.price * 1.15),
        stock: bookData.stock,
        isPublished: true,
        images: [`/books/${slugify(bookData.title)}.jpg`],
        categories: {
          create: bookData.catIdx.map((idx) => ({ categoryId: categories[idx]?.id || categories[0].id })),
        },
      },
    });
    allBooks.push(book);
  }

  console.log(`✅ Created ${allBooks.length} books with descriptions and ISBNs`);

  // ─── REVIEWS ─────────────────────────────────────────
  const reviewData = [
    { userId: customers[0].id, bookId: allBooks[0].id, rating: 5, comment: 'شاهکار ادبیات فارسی. بسیار تأثیرگذار بود.' },
    { userId: customers[1].id, bookId: allBooks[0].id, rating: 4, comment: 'خواندنش خیلی سخت بود ولی ارزشش رو داشت.' },
    { userId: customers[2].id, bookId: allBooks[0].id, rating: 5, comment: 'هر کسی باید حداقل یک بار این کتاب رو بخونه.' },
    { userId: customers[0].id, bookId: allBooks[4].id, rating: 5, comment: 'کتاب عالی درباره فلسفه. همه پیشنهاد می‌کنم.' },
    { userId: customers[3].id, bookId: allBooks[4].id, rating: 4, comment: 'زبان ساده و روان. مناسب مبتدی‌ها.' },
    { userId: customers[1].id, bookId: allBooks[6].id, rating: 5, comment: 'استفان هاوکینگ همیشه بهترین است.' },
    { userId: customers[4].id, bookId: allBooks[6].id, rating: 4, comment: 'محتوا عالی ولی ترجمه کمی سنگین بود.' },
    { userId: customers[0].id, bookId: allBooks[8].id, rating: 4, comment: 'خاله سوسکه برای بچه‌ها عالیه.' },
    { userId: customers[5].id, bookId: allBooks[8].id, rating: 5, comment: 'خاطرات دوران کودکی رو زنده کرد.' },
    { userId: customers[1].id, bookId: allBooks[15].id, rating: 5, comment: 'مارکز بی‌نظیره. بهترین رمانی که خوندم.' },
    { userId: customers[6].id, bookId: allBooks[15].id, rating: 5, comment: 'هر صفحه‌اش یک شاهکاره.' },
    { userId: customers[2].id, bookId: allBooks[1].id, rating: 4, comment: 'کتاب خوبی بود، پیشنهاد می‌کنم.' },
    { userId: customers[3].id, bookId: allBooks[5].id, rating: 5, comment: 'تاریخ فلسفه عالی نوشته شده.' },
    { userId: customers[4].id, bookId: allBooks[9].id, rating: 4, comment: 'کلیله و دمنه همیشه جذابه.' },
    { userId: customers[5].id, bookId: allBooks[11].id, rating: 3, comment: 'محتوا خوب ولی چاپ متوسط بود.' },
    { userId: customers[6].id, bookId: allBooks[13].id, rating: 5, comment: 'کتاب هنر عالیه. تصاویر باکیفیت.' },
    { userId: customers[7].id, bookId: allBooks[16].id, rating: 4, comment: 'روانشناسی کاربردی خوبی بود.' },
    { userId: customers[0].id, bookId: allBooks[18].id, rating: 5, comment: 'شعر نو نیما بی‌نظیره.' },
    { userId: customers[1].id, bookId: allBooks[19].id, rating: 4, comment: 'شیمی عمومی برای دانشگاه عالیه.' },
    { userId: customers[2].id, bookId: allBooks[20].id, rating: 5, comment: 'تنهایی پر هیاهو بهترین رمان ایرانیه.' },
    { userId: customers[3].id, bookId: allBooks[21].id, rating: 5, comment: 'بهترین منبع فارسی برای یادگیری جاوااسکریپت.' },
    { userId: customers[4].id, bookId: allBooks[22].id, rating: 4, comment: 'React رو خیلی خوب توضیح داده.' },
    { userId: customers[5].id, bookId: allBooks[23].id, rating: 5, comment: 'پایگاه داده رو از صفر یاد گرفتم.' },
    { userId: customers[6].id, bookId: allBooks[28].id, rating: 5, comment: 'گلستان سعدی گنجینه فرهنگ ماست.' },
    { userId: customers[7].id, bookId: allBooks[27].id, rating: 4, comment: 'زبان انگلیسی رو خیلی بهتر شدم.' },
  ];

  for (const review of reviewData) {
    await prisma.review.create({ data: review });
  }

  console.log(`✅ Created ${reviewData.length} reviews`);

  // ─── ORDERS ──────────────────────────────────────────
  const addresses = [
    { street: 'خیابان انقلاب، پلاک ۱۲۳', city: 'تهران', province: 'تهران', postalCode: '1234567890' },
    { street: 'خیابان ولیعصر، پلاک ۴۵۶', city: 'تهران', province: 'تهران', postalCode: '9876543210' },
    { street: 'خیابان آزادی، پلاک ۷۸۹', city: 'تهران', province: 'تهران', postalCode: '1122334455' },
    { street: 'خیابان شریعتی، پلاک ۱۰۱', city: 'تهران', province: 'تهران', postalCode: '5566778899' },
    { street: 'خیابان میرداماد، پلاک ۲۰۲', city: 'تهران', province: 'تهران', postalCode: '3344556677' },
    { street: 'خیابان سعدی، پلاک ۳۰۳', city: 'اصفهان', province: 'اصفهان', postalCode: '8899001122' },
    { street: 'خیابان چهارباغ، پلاک ۴۰۴', city: 'اصفهان', province: 'اصفهان', postalCode: '4455667788' },
    { street: 'خیابان زند، پلاک ۵۰۵', city: 'شیراز', province: 'فارس', postalCode: '2233445566' },
    { street: 'خیابان کریم خان، پلاک ۶۰۶', city: 'شیراز', province: 'فارس', postalCode: '7788990011' },
    { street: 'خیابان امام، پلاک ۷۰۷', city: 'تبریز', province: 'آذربایجان شرقی', postalCode: '1212121212' },
    { street: 'خیابان شهناز، پلاک ۸۰۸', city: 'تبریز', province: 'آذربایجان شرقی', postalCode: '3434343434' },
    { street: 'خیابان ولیعصر، پلاک ۹۰۹', city: 'مشهد', province: 'خراسان رضوی', postalCode: '5656565656' },
    { street: 'خیابان آزادی، پلاک ۱۱۱', city: 'مشهد', province: 'خراسان رضوی', postalCode: '7878787878' },
    { street: 'خیابان بلوار کشاورز، پلاک ۱۲۱', city: 'مشهد', province: 'خراسان رضوی', postalCode: '9090909090' },
    { street: 'خیابان چمران، پلاک ۱۳۱', city: 'اهواز', province: 'خوزستان', postalCode: '1111222233' },
    { street: 'خیابان نادری، پلاک ۱۴۱', city: 'اهواز', province: 'خوزستان', postalCode: '4444555566' },
    { street: 'خیابان سی تیر، پلاک ۱۵۱', city: 'کرمان', province: 'کرمان', postalCode: '7777888899' },
    { street: 'خیابان شریعتی، پلاک ۱۶۱', city: 'یزد', province: 'یزد', postalCode: '0011001100' },
    { street: 'خیابان قائم‌مقام، پلاک ۱۷۱', city: 'ارومیه', province: 'آذربایجان غربی', postalCode: '2233223322' },
    { street: 'خیابان دانشگاه، پلاک ۱۸۱', city: 'همدان', province: 'همدان', postalCode: '4455445544' },
    { street: 'خیابان خلیج فارس، پلاک ۱۹۱', city: 'بندرعباس', province: 'هرمزگان', postalCode: '6677667766' },
    { street: 'خیابان معلم، پلاک ۲۰۱', city: 'رشت', province: 'گیلان', postalCode: '8899889988' },
    { street: 'خیابان جهاد، پلاک ۲۱۱', city: 'ساری', province: 'مازندران', postalCode: '1010101010' },
    { street: 'خیابان پاسداران، پلاک ۲۲۱', city: 'قم', province: 'قم', postalCode: '2020202020' },
    { street: 'خیابان بهار، پلاک ۲۳۱', city: 'زنجان', province: 'زنجان', postalCode: '3030303030' },
    { street: 'خیابان جمهوری، پلاک ۲۴۱', city: 'بیرجند', province: 'خراسان جنوبی', postalCode: '5050505050' },
    { street: 'خیابان امیرکبیر، پلاک ۲۵۱', city: 'اراک', province: 'مرکزی', postalCode: '6060606060' },
    { street: 'خیابان دماوند، پلاک ۲۶۱', city: 'گرگان', province: 'گلستان', postalCode: '7070707070' },
    { street: 'خیابان سلمان فارسی، پلاک ۲۷۱', city: 'بوشهر', province: 'بوشهر', postalCode: '8080808080' },
    { street: 'خیابان سلامت، پلاک ۲۸۱', city: 'بجنورد', province: 'خراسان شمالی', postalCode: '9090909091' },
    { street: 'خیابان آیت‌الله طالقانی، پلاک ۲۹۱', city: 'اردبیل', province: 'اردبیل', postalCode: '1111111111' },
    { street: 'خیابان انقلاب، پلاک ۳۰۱', city: 'کرج', province: 'البرز', postalCode: '3333333333' },
  ];

  const orderStatuses: Array<{ status: string; count: number }> = [
    { status: 'DELIVERED', count: 8 },
    { status: 'SHIPPED', count: 3 },
    { status: 'PROCESSING', count: 2 },
    { status: 'PAID', count: 3 },
    { status: 'PENDING', count: 3 },
    { status: 'CANCELLED', count: 2 },
    { status: 'REFUNDED', count: 1 },
  ];

  let orderCount = 0;
  for (const { status, count } of orderStatuses) {
    for (let i = 0; i < count; i++) {
      const customerIdx = Math.floor(Math.random() * customers.length);
      const addrIdx = Math.floor(Math.random() * addresses.length);
      const numBooks = Math.floor(Math.random() * 3) + 1;
      const bookIndices: number[] = [];
      while (bookIndices.length < numBooks) {
        const idx = Math.floor(Math.random() * allBooks.length);
        if (!bookIndices.includes(idx)) bookIndices.push(idx);
      }

      let totalAmount = 0;
      const items = bookIndices.map((idx) => {
        const price = Number(allBooks[idx].price);
        const qty = Math.floor(Math.random() * 2) + 1;
        totalAmount += price * qty;
        const sellerIdx = booksData[idx].sellerIdx;
        return { bookId: allBooks[idx].id, sellerId: sellerProfiles[sellerIdx].id, quantity: qty, unitPrice: allBooks[idx].price, totalPrice: price * qty };
      });

      await prisma.order.create({
        data: {
          userId: customers[customerIdx].id,
          status: status as any,
          totalAmount,
          shippingAddress: addresses[addrIdx],
          createdAt: randomDate(90),
          items: { create: items },
        },
      });
      orderCount++;
    }
  }

  console.log(`✅ Created ${orderCount} orders across all statuses`);

  // ─── WALLET TRANSACTIONS ─────────────────────────────
  const walletData = [
    { sellerId: sellerProfiles[0].id, amount: 2500000, type: 'CREDIT' as const, description: 'شارژ اولیه کیف پول' },
    { sellerId: sellerProfiles[0].id, amount: 850000, type: 'CREDIT' as const, description: 'فروش بوف کور - ۱۰ نسخه' },
    { sellerId: sellerProfiles[0].id, amount: 120000, type: 'DEBIT' as const, description: 'کمیسیون سفارشات آبان ماه' },
    { sellerId: sellerProfiles[0].id, amount: 720000, type: 'CREDIT' as const, description: 'فروش شازده احتجاب' },
    { sellerId: sellerProfiles[1].id, amount: 3200000, type: 'CREDIT' as const, description: 'شارژ اولیه کیف پول' },
    { sellerId: sellerProfiles[1].id, amount: 950000, type: 'CREDIT' as const, description: 'فروش فلسفه چیست' },
    { sellerId: sellerProfiles[1].id, amount: 2450000, type: 'CREDIT' as const, description: 'فروش تاریخ فلسفه غرب' },
    { sellerId: sellerProfiles[1].id, amount: 180000, type: 'DEBIT' as const, description: 'کمیسیون سفارشات آذر ماه' },
    { sellerId: sellerProfiles[2].id, amount: 1800000, type: 'CREDIT' as const, description: 'شارژ اولیه کیف پول' },
    { sellerId: sellerProfiles[2].id, amount: 350000, type: 'CREDIT' as const, description: 'فروش خاله سوسکه - ۱۰ نسخه' },
    { sellerId: sellerProfiles[2].id, amount: 136000, type: 'CREDIT' as const, description: 'فروش کلیله و دمنه' },
    { sellerId: sellerProfiles[2].id, amount: 500000, type: 'CREDIT' as const, description: 'شارژ کیف پول' },
    { sellerId: sellerProfiles[3].id, amount: 2400000, type: 'CREDIT' as const, description: 'شارژ اولیه کیف پول' },
    { sellerId: sellerProfiles[3].id, amount: 1250000, type: 'CREDIT' as const, description: 'فروش برنامه‌نویسی جاوااسکریپت' },
    { sellerId: sellerProfiles[3].id, amount: 95000, type: 'DEBIT' as const, description: 'کمیسیون فروش دی ماه' },
  ];

  for (const txn of walletData) {
    await prisma.walletTransaction.create({ data: txn });
  }

  console.log(`✅ Created ${walletData.length} wallet transactions`);

  // ─── SUMMARY ─────────────────────────────────────────
  console.log('\n🎉 Seeding completed!\n');
  console.log('═══════════════════════════════════════');
  console.log('  📊 SEED SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`  Categories:  ${categories.length} main + ${subCategories.length} sub`);
  console.log(`  Users:       1 admin + ${sellers.length} sellers + ${customers.length} customers`);
  console.log(`  Books:       ${allBooks.length}`);
  console.log(`  Reviews:     ${reviewData.length}`);
  console.log(`  Orders:      ${orderCount}`);
  console.log(`  Wallet Txns: ${walletData.length}`);
  console.log('═══════════════════════════════════════');
  console.log('  📋 LOGIN CREDENTIALS');
  console.log('═══════════════════════════════════════');
  console.log('  Admin:     admin@booknest.ir / admin123');
  console.log('  Seller 1:  seller1@booknest.ir / seller123');
  console.log('  Seller 2:  seller2@booknest.ir / seller123');
  console.log('  Seller 3:  seller3@booknest.ir / seller123');
  console.log('  Seller 4:  seller4@booknest.ir / seller123');
  console.log('  Seller 5:  seller5@booknest.ir / seller123 (pending)');
  console.log('  Customer 1: customer1@booknest.ir / customer123');
  console.log('  Customer 2: customer2@booknest.ir / customer123');
  console.log('  Customer 3-8: customerN@booknest.ir / customer123');
  console.log('═══════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
