'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const amounts = [100000, 500000, 1000000, 5000000];

export default function SellerWalletPage() {
  const [customAmount, setCustomAmount] = useState('');
  const queryClient = useQueryClient();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['wallet-summary'],
    queryFn: async () => {
      const { data } = await api.get('/payments/wallet/summary');
      return data;
    },
  });

  const { data: transactions, isLoading: txnsLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const { data } = await api.get('/seller/wallet');
      return data;
    },
  });

  const topUpMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data } = await api.post('/payments/wallet/topup', { amount });
      return data;
    },
    onSuccess: () => {
      toast.success('کیف پول با موفقیت شارژ شد');
      queryClient.invalidateQueries({ queryKey: ['wallet-summary'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
      setCustomAmount('');
    },
    onError: () => {
      toast.error('خطا در شارژ کیف پول');
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const handleTopUp = (amount: number) => {
    topUpMutation.mutate(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">کیف پول</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="text-2xl font-bold text-primary-600">
            {summaryLoading ? '...' : formatPrice(summary.balance)}
          </h3>
          <p className="text-sm text-gray-500">موجودی فعلی</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">📈</div>
          <h3 className="text-2xl font-bold text-green-600">
            {summaryLoading ? '...' : formatPrice(summary.totalCredit)}
          </h3>
          <p className="text-sm text-gray-500">کل واریزی‌ها</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-2">📉</div>
          <h3 className="text-2xl font-bold text-red-600">
            {summaryLoading ? '...' : formatPrice(summary.totalDebit)}
          </h3>
          <p className="text-sm text-gray-500">کل برداشت‌ها</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Up */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">شارژ کیف پول</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleTopUp(amount)}
                disabled={topUpMutation.isPending}
                className="border border-gray-300 rounded-lg py-3 text-center hover:border-primary-500 hover:bg-primary-50 transition-all disabled:opacity-50"
              >
                <span className="font-bold text-gray-800">{formatPrice(amount)}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="مبلغ دلخواه (تومان)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <button
              onClick={() => {
                const amount = parseInt(customAmount);
                if (amount >= 10000) handleTopUp(amount);
              }}
              disabled={!customAmount || parseInt(customAmount) < 10000 || topUpMutation.isPending}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300"
            >
              شارژ
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">تاریخچه تراکنش‌ها</h2>

          {txnsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse h-12 bg-gray-200 rounded" />
              ))}
            </div>
          ) : !transactions?.data?.length ? (
            <p className="text-gray-500 text-center py-8">هنوز تراکنشی ثبت نشده است.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {transactions.data.map((txn: any) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm text-gray-800">{txn.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(txn.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <span
                    className={`font-bold ${
                      txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {txn.type === 'CREDIT' ? '+' : '-'}
                    {formatPrice(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
