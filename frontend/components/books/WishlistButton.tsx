'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';

interface Props {
  bookId: string;
}

export default function WishlistButton({ bookId }: Props) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['wishlist-check', bookId],
    queryFn: async () => {
      const { data } = await api.get('/wishlist');
      return data.some((item: any) => item.bookId === bookId);
    },
    enabled: isAuthenticated,
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/wishlist/${bookId}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-check', bookId] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  if (!isAuthenticated) return null;

  const isLiked = data || false;

  return (
    <button
      onClick={() => toggleMutation.mutate()}
      disabled={toggleMutation.isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
        isLiked
          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
      }`}
    >
      <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {isLiked ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    </button>
  );
}
