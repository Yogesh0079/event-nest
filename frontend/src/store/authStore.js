import { create } from 'zustand';
import { apiClient } from '../lib/api.js';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoggedIn: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token, isLoggedIn: true });
  },

  register: async (name, email, password) => {
    const { data } = await apiClient.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isLoggedIn: false });
  },

  fetchUser: async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      set({ user: data, isLoggedIn: true });
    } catch (error) {
      set({ user: null, token: null, isLoggedIn: false });
      localStorage.removeItem('token');
    }
  },
}));
