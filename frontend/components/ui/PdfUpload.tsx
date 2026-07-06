'use client';

import { useState, useRef } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
  value?: string;
  onChange: (url: string, size: number) => void;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function PdfUpload({ value, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('فقط فایل PDF پشتیبانی می‌شود');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('حجم فایل نباید بیشتر از ۱۰۰ مگابایت باشد');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload/ebook', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFileName(file.name);
      setFileSize(data.size);
      onChange(data.url, data.size);
      toast.success('فایل با موفقیت آپلود شد');
    } catch {
      toast.error('خطا در آپلود فایل');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setFileName('');
    setFileSize(0);
    onChange('', 0);
  };

  if (value) {
    return (
      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-emerald-800 truncate">{fileName || 'فایل PDF'}</div>
          <div className="text-xs text-emerald-600">{fileSize ? formatSize(fileSize) : ''}</div>
        </div>
        <button
          onClick={handleRemove}
          className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleUpload}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all text-center disabled:opacity-50"
      >
        {isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" />
            <span className="text-sm text-gray-600">در حال آپلود...</span>
          </div>
        ) : (
          <div>
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3 3m3-3l3 3M9 20H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V18a2 2 0 01-2 2h-2" />
            </svg>
            <p className="text-sm text-gray-600 mb-1">فایل PDF را اینجا بکشید یا کلیک کنید</p>
            <p className="text-xs text-gray-400">حداکثر ۱۰۰ مگابایت</p>
          </div>
        )}
      </button>
    </div>
  );
}
