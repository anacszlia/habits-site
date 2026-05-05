import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const habitsApi = {
  getAll: () => api.get('/habits'),
  create: (data: { title: string; description?: string }) => api.post('/habits', data),
  update: (id: number, data: { title?: string; description?: string; active?: boolean }) =>
    api.put(`/habits/${id}`, data),
  complete: (id: number) => api.post(`/habits/${id}/complete`),
};

export const streakApi = {
  get: () => api.get('/streaks'),
};

export default api;
