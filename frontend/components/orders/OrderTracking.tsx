'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const statusConfig: Record<string, { label: string; color: string; step: number }> = {
  PENDING: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', step: 0 },
  PAID: { label: 'پرداخت شده', color: 'bg-blue-100 text-blue-700 border-blue-300', step: 1 },
  PROCESSING: { label: 'در حال پردازش', color: 'bg-purple-100 text-purple-700 border-purple-300', step: 2 },
  SHIPPED: { label: 'ارسال شده', color: 'bg-indigo-100 text-indigo-700 border-indigo-300', step: 3 },
  DELIVERED: { label: 'تحویل شده', color: 'bg-green-100 text-green-700 border-green-300', step: 4 },
  CANCELLED: { label: 'لغو شده', color: 'bg-red-100 text-red-700 border-red-300', step: -1 },
  REFUNDED: { label: 'بازپرداخت شده', color: 'bg-gray-100 text-gray-700 border-gray-300', step: -1 },
};

const steps = [
  { label: 'ثبت سفارش' },
  { label: 'پرداخت' },
  { label: 'پردازش' },
  { label: 'ارسال' },
  { label: 'تحویل' },
];

interface Props {
  orderId: string;
}

export default function OrderTracking({ orderId }: Props) {
  const { data: order, isLoading } = useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${orderId}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!order) return null;

  const currentStep = order.statusHistory?.length
    ? order.statusHistory[order.statusHistory.length - 1]
    : null;
  const currentStepIdx = steps.findIndex((s) => s.label === currentStep?.status);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-6">پیگیری سفارش</h3>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => {
          const isActive = idx <= (currentStepIdx >= 0 ? currentStepIdx : 0);
          const isCurrent = idx === (currentStepIdx >= 0 ? currentStepIdx : 0);
          return (
            <div key={step.label} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                    : 'bg-gray-100 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs text-center ${isActive ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <div className={`w-full h-0.5 mt-2 -mb-2 ${isActive ? 'bg-primary-400' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-3 mb-6">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700'}`}>
          {statusConfig[order.status]?.label}
        </span>
      </div>

      {/* Status History Timeline */}
      {order.statusHistory?.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 mb-3">تاریخچه وضعیت</h4>
          <div className="space-y-0">
            {[...order.statusHistory].reverse().map((entry: any, idx: number) => {
              const config = statusConfig[entry.status];
              return (
                <div key={entry.id} className="flex gap-4 pb-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {idx === 0 && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                      {idx !== 0 && <div className="w-2 h-2 rounded-full bg-gray-400" />}
                    </div>
                    {idx < order.statusHistory.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{config?.label}</p>
                    {entry.note && <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(entry.createdAt).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
