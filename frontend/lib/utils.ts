export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

export function formatPriceShort(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
