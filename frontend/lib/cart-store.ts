import { create } from 'zustand';
import api from './api';

interface CartItem {
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

interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (bookId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,
  itemCount: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({
        items: data.items,
        totalAmount: data.totalAmount,
        itemCount: data.itemCount,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (bookId: string, quantity = 1) => {
    const { data } = await api.post('/cart/items', { bookId, quantity });
    set({
      items: data.items,
      totalAmount: data.totalAmount,
      itemCount: data.itemCount,
    });
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    set({
      items: data.items,
      totalAmount: data.totalAmount,
      itemCount: data.itemCount,
    });
  },

  removeItem: async (itemId: string) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    set({
      items: data.items,
      totalAmount: data.totalAmount,
      itemCount: data.itemCount,
    });
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [], totalAmount: 0, itemCount: 0 });
  },
}));
