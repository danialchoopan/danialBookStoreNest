export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  isbn?: string;
  author: string;
  publisher?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  isPublished: boolean;
  createdAt: string;
  seller: {
    shopName: string;
    shopSlug: string;
  };
  categories?: {
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  averageRating?: number | null;
  reviews?: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  book: {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
    seller: { shopName: string };
  };
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress?: Record<string, any>;
  note?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  book: {
    title: string;
    images: string[];
  };
}

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  _count?: { books: number };
}

export interface SellerProfile {
  id: string;
  userId: string;
  shopName: string;
  shopSlug: string;
  description?: string;
  logo?: string;
  balance: number;
  commissionRate: number;
  isApproved: boolean;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
