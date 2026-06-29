/**
 * Auth Store - Zustand store for authentication state
 *
 * Manages:
 * - Current user data
 * - Login/logout/register actions
 * - Token persistence in localStorage
 * - Auto-load user on app init
 *
 * Usage:
 *   const { user, isAuthenticated, login, logout } = useAuthStore();
 *
 * @see docs/FRONTEND.md for state management patterns
 */

import { create } from 'zustand';
import api from './api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Login: call API, store tokens, update state
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    set({ user: data.user, isAuthenticated: true });
  },

  // Register: same flow as login
  register: async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.removeItem('refreshToken');
    set({ user: data.user, isAuthenticated: true });
  },

  // Logout: clear tokens and state
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  // Load user: called on app init to restore session from token
  loadUser: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const { data } = await api.get('/auth/profile');
      set({ user: data, isAuthenticated: true });
    } catch {
      // Token expired or invalid — clear it
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },
}));
