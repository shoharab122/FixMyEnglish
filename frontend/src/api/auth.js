import { api } from './client';

export const authApi = {
  register: (email, password, name) =>
    api.post('/api/auth/register', { email, password, name }).then((r) => r.data),

  login: (email, password) =>
    api.post('/api/auth/login', { email, password }).then((r) => r.data),

  guest: (name, email) =>
    api.post('/api/auth/guest', { name, email }).then((r) => r.data),

  logout: () => api.post('/api/auth/logout'),

  refresh: () => api.post('/api/auth/refresh').then((r) => r.data),
};
