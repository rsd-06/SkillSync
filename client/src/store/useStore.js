'use client';
import { create } from 'zustand';
import api from '../lib/api';

const useStore = create((set, get) => ({
  user: null,
  token: null,
  theme: 'light',
  hydrated: false,

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('ss_token');
    const userRaw = localStorage.getItem('ss_user');
    const theme = localStorage.getItem('ss_theme') || 'light';
    const user = userRaw ? JSON.parse(userRaw) : null;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ token, user, theme, hydrated: true });
  },

  setAuth: (token, user) => {
    localStorage.setItem('ss_token', token);
    localStorage.setItem('ss_user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    set({ token: null, user: null });
    window.location.href = '/login';
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('ss_theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    set({ theme: next });
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/api/users/me');
      localStorage.setItem('ss_user', JSON.stringify(data));
      set({ user: data });
    } catch {}
  },

  updateUser: (user) => {
    localStorage.setItem('ss_user', JSON.stringify(user));
    set({ user });
  },
}));

export default useStore;
