import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getUserIdFromToken(): number {
  const token = localStorage.getItem('token');
  if (!token) return 0;
  const decoded = jwtDecode<{ userId: number }>(token);
  return decoded.userId;
}

export const usersApi = {
  updatePassword: (id: number, password: string) =>
    api.put(`/users/${id}`, { password }),

  updateName: (id: number, name: string) =>
    api.put(`/users/${id}`, { name }),

  updateEmail: (id: number, email: string) =>
    api.put(`/users/${id}`, { email }),

  delete: (id: number) =>
    api.delete(`/users/${id}`),
};

export const habitsApi = {
  getAll: () => api.get('/habits'),
  create: (data: { title: string; description?: string }) => {
    const userId = getUserIdFromToken();
    return api.post('/habits', { ...data, userId });
  },
  update: (id: number, data: { title?: string; description?: string; active?: boolean }) =>
    api.put(`/habits/${id}`, data),
  complete: (id: number) => api.post(`/habits/${id}/complete`),
  delete: (id: number) => api.delete(`/habits/${id}`),
};

export const streakApi = {
  get: () => api.get('/streaks'),
  getByUser: (userId: number) => api.get(`/streaks/${userId}`),
};

export default api;
