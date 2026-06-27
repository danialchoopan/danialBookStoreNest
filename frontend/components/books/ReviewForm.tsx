'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';

interface Props {
  bookId: string;
}

export default function ReviewForm({ bookId }: Props) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post(`/reviews/book/${bookId}`, { rating, comment: comment || undefined });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success('نظر شما با موفقیت ثبت شد');
      setComment('');
      setRating(0);
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'خطا در ثبت نظر');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🔒</div>
        <p className="text-gray-500 mb-3">برای ثبت نظر ابتدا وارد شوید</p>
        <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
          ورود به حساب ←
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 mb-1">نظر شما ثبت شد!</h3>
        <p className="text-gray-500 text-sm mb-4">از نظر شما متشکریم</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          ثبت نظر جدید
        </button>
      </div>
    );
  }

  const ratingLabels: Record<number, string> = {
    1: 'خیلی بد',
    2: 'بد',
    3: 'متوسط',
    4: 'خوب',
    5: 'عالی',
  };

  return (
    <div>
      <h3 className="font-bold text-gray-800 mb-5">نظر خود را بنویسید</h3>

      {/* Rating Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">امتیاز شما</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <span
                className={`text-3xl transition-colors ${
                  star <= (hoveredRating || rating) ? 'text-amber-400' : 'text-gray-200'
                }`}
              >
                ★
              </span>
            </button>
          ))}
          {(hoveredRating || rating) > 0 && (
            <span className="text-sm text-gray-500 mr-2 font-medium">
              {ratingLabels[hoveredRating || rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          نظر شما <span className="text-gray-400 font-normal">(اختیاری)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition-all resize-none text-sm"
          placeholder="تجربه خود از این کتاب را بنویسید..."
        />
      </div>

      {/* Submit */}
      <button
        onClick={() => {
          if (rating === 0) {
            toast.error('لطفاً امتیازی انتخاب کنید');
            return;
          }
          mutation.mutate();
        }}
        disabled={mutation.isPending || rating === 0}
        className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm shadow-primary-200 flex items-center gap-2"
      >
        {mutation.isPending ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            در حال ارسال...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            ثبت نظر
          </>
        )}
      </button>
    </div>
  );
}
