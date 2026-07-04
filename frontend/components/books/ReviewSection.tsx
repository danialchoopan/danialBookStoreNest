'use client';

import { useState } from 'react';
import ReviewForm from './ReviewForm';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

interface Props {
  bookId: string;
  reviews: Review[];
  averageRating: number | null;
}

export default function ReviewSection({ bookId, reviews, averageRating }: Props) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'form'>('reviews');

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length
      ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
      : 0,
  }));

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-primary-600 rounded-full" />
        <h2 className="text-xl font-bold text-gray-800">نظرات کاربران</h2>
        <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
          {reviews.length} نظر
        </span>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            نظرات ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'form'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ثبت نظر
          </button>
        </div>

        {activeTab === 'reviews' ? (
          <div className="p-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.609 2.25 5.003 2.25 6.603v6.02z" /></svg></div>
                <p className="text-gray-500 mb-2">هنوز نظری ثبت نشده است</p>
                <p className="text-sm text-gray-400">اولین نفری باشید که نظر می‌دهید!</p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Rating Summary */}
                <div className="lg:w-64 shrink-0">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-gray-800 mb-1">
                      {averageRating?.toFixed(1) || '—'}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${
                            averageRating && star <= Math.round(averageRating)
                              ? 'text-amber-400'
                              : 'text-gray-200'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">از {reviews.length} نظر</p>
                  </div>

                  {/* Rating Bars */}
                  <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.rating} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-8">{item.rating}★</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-left">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="flex-1 space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm shrink-0">
                          {review.user.firstName[0]}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-bold text-gray-800 text-sm">
                                {review.user.firstName} {review.user.lastName}
                              </span>
                              <span className="text-xs text-gray-400 mr-2">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-sm ${
                                    star <= review.rating ? 'text-amber-400' : 'text-gray-200'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>

                          {review.comment && (
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <ReviewForm bookId={bookId} />
          </div>
        )}
      </div>
    </div>
  );
}
