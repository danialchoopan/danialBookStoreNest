/**
 * API Client - Centralized HTTP client for all backend requests
 *
 * Features:
 * - Base URL from environment variable (NEXT_PUBLIC_API_URL)
 * - Auto-attaches JWT token from localStorage on every request
 * - Auto-redirects to /login on 401 Unauthorized
 *
 * Usage:
 *   import api from '@/lib/api';
 *   const { data } = await api.get('/books');
 *   const { data } = await api.post('/orders', { shippingAddress });
 *
 * @see docs/API.md for all available endpoints
 * @see docs/FRONTEND.md for API client usage
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
