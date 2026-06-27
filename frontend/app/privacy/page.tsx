export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">حریم خصوصی</h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="font-bold text-gray-800 mb-2">جمع‌آوری اطلاعات</h2>
          <p className="text-gray-600 leading-relaxed">
            ما اطلاعات شخصی شما مانند نام، ایمیل، شماره تلفن و آدرس را برای پردازش سفارشات و بهبود خدمات جمع‌آوری می‌کنیم.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 mb-2">استفاده از اطلاعات</h2>
          <p className="text-gray-600 leading-relaxed">
            اطلاعات شما صرفاً برای موارد زیر استفاده می‌شود:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>پردازش و ارسال سفارشات</li>
            <li>ارتباط با شما در مورد سفارشات</li>
            <li>بهبود تجربه کاربری</li>
            <li>ارسال اطلاعیه‌های مهم</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 mb-2">امنیت اطلاعات</h2>
          <p className="text-gray-600 leading-relaxed">
            ما از روش‌های امنیتی مناسب برای محافظت از اطلاعات شما استفاده می‌کنیم. اطلاعات پرداخت شما مستقیماً به درگاه بانکی ارسال شده و در سرور ما ذخیره نمی‌شود.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 mb-2">اشتراک‌گذاری اطلاعات</h2>
          <p className="text-gray-600 leading-relaxed">
            اطلاعات شخصی شما به هیچ شخص ثالثی فروخته یا اجاره داده نمی‌شود. تنها در صورت لزوم قانونی، اطلاعات با مقامات قضایی به اشتراک گذاشته می‌شود.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 mb-2">حقوق شما</h2>
          <p className="text-gray-600 leading-relaxed">
            شما حق دسترسی، ویرایش و حذف اطلاعات شخصی خود را دارید. برای استفاده از این حقوق، با ما تماس بگیرید.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 mb-2">تماس با ما</h2>
          <p className="text-gray-600 leading-relaxed">
            برای سوالات مربوط به حریم خصوصی، با ایمیل privacy@booknest.ir تماس بگیرید.
          </p>
        </div>
      </div>
    </div>
  );
}
