'use client';

export default function LoadingSkeleton({ count = 4, type = 'card' }: { count?: number; type?: 'card' | 'list' | 'table' }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-50" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-100 rounded-full w-3/4" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2" />
              <div className="h-3 bg-gray-100 rounded-full w-1/3" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-gray-100 rounded-full w-1/3" />
                <div className="h-8 bg-gray-100 rounded-lg w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse flex gap-4">
            <div className="w-20 h-24 bg-gray-100 rounded-lg shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-100 rounded-full w-2/3" />
              <div className="h-3 bg-gray-100 rounded-full w-1/3" />
              <div className="h-4 bg-gray-100 rounded-full w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}
