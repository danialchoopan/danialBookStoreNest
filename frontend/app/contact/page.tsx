'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulated send
    await new Promise(r => setTimeout(r, 1000));
    toast.success('پیام شما با موفقیت ارسال شد');
    setForm({ name: '', email: '', subject: '', message: '' });
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">تماس با ما</h1>
      <p className="text-gray-500 mb-8">سوال یا پیشنهادی دارید؟ ما خوشحال می‌شویم بشنویم.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">📞</div>
          <h3 className="font-bold text-gray-800 mb-1">تلفن</h3>
          <p className="text-sm text-gray-500">۰۲۱-۱۲۳۴۵۶۷۸</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">📧</div>
          <h3 className="font-bold text-gray-800 mb-1">ایمیل</h3>
          <p className="text-sm text-gray-500">info@booknest.ir</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">📍</div>
          <h3 className="font-bold text-gray-800 mb-1">آدرس</h3>
          <p className="text-sm text-gray-500">تهران، خیابان انقلاب</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="نام شما"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="example@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">موضوع</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="موضوع پیام"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">پیام</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              placeholder="پیام خود را بنویسید..."
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:bg-gray-300"
          >
            {isLoading ? 'در حال ارسال...' : 'ارسال پیام'}
          </button>
        </form>
      </div>
    </div>
  );
}
