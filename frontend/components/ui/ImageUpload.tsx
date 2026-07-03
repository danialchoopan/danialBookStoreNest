'use client';

import { useState, useRef } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
  images: string[];
  onImagesChange: (images: string[]) => void;
  disabled?: boolean;
}

export default function ImageUpload({ images, onImagesChange, disabled }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post('/upload/book', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedUrls.push(data.url);
      }

      onImagesChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} تصویر آپلود شد`);
    } catch {
      toast.error('خطا در آپلود تصویر');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">تصاویر کتاب</label>

      {/* Upload Button */}
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50 cursor-pointer'
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            در حال آپلود...
          </div>
        ) : (
          <>
            <div className="text-3xl mb-2">📸</div>
            <p className="text-sm text-gray-600">
              کلیک کنید یا فایل‌ها را بکشید
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP — حداکثر ۵ مگابایت
            </p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {images.map((url, idx) => (
            <div key={idx} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">
                  📖
                </div>
              </div>
              {!disabled && (
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              )}
              {idx === 0 && (
                <span className="absolute bottom-1 right-1 bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                  اصلی
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
