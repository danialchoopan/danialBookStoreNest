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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post(`/reviews/book/${bookId}`, { rating, comment: comment || undefined });
    },
    onSuccess: () => {
      toast.success('نظر شما ثبت شد');
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
    },
    onError: () => {
      toast.error('خطا در ثبت نظر');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500">
        برای ثبت نظر ابتدا وارد شوید.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-bold text-gray-800 mb-4">ثبت نظر</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">امتیاز</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          نظر شما (اختیاری)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          placeholder="نظر خود را بنویسید..."
        />
      </div>

      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300"
      >
        {mutation.isPending ? 'در حال ارسال...' : 'ثبت نظر'}
      </button>
    </div>
  );
}
