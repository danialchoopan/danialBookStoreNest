export default function FAQPage() {
  const faqs = [
    {
      question: 'چگونه می‌توانم سفارش دهم؟',
      answer: 'پس از انتخاب کتاب‌های مورد نظر، آن‌ها را به سبد خرید اضافه کنید. سپس با تکمیل آدرس ارسال و تأیید نهایی، سفارش شما ثبت می‌شود.',
    },
    {
      question: 'هزینه ارسال چقدر است؟',
      answer: 'ارسال برای خریدهای بالای ۲۰۰ هزار تومان رایگان است. برای خریدهای کمتر از این مبلغ، هزینه ارسال بر اساس وزن و مقصد محاسبه می‌شود.',
    },
    {
      question: 'آیا امکان بازگشت کتاب وجود دارد؟',
      answer: 'بله، تا ۷ روز پس از تحویل سفارش، در صورتی که کتاب آسیب ندیده باشد، امکان بازگشت وجود دارد.',
    },
    {
      question: 'چگونه فروشنده شوم؟',
      answer: 'با ثبت‌نام در سایت و تکمیل پروفایل فروشنده، پس از تأیید مدیریت، می‌توانید کتاب‌های خود را برای فروش قرار دهید.',
    },
    {
      question: 'روش پرداخت چیست؟',
      answer: 'پرداخت از طریق درگاه‌های بانکی انجام می‌شود. پس از ثبت سفارش، به درگاه بانکی هدایت خواهید شد.',
    },
    {
      question: 'کیف پول فروشنده چیست؟',
      answer: 'فروشندگان می‌توانند موجودی کیف پول خود را شارژ کنند و از آن برای پرداخت کمیسیون و سایر هزینه‌ها استفاده کنند.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">سوالات متداول</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">{faq.question}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
