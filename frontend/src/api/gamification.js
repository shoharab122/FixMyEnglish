import { api } from './client';

export const gamificationApi = {
  summary: () => api.get('/api/gamification/summary').then((r) => r.data),
  badges: () => api.get('/api/gamification/badges').then((r) => r.data),
  progress: () => api.get('/api/progress').then((r) => r.data),
  overview: () => api.get('/api/gamification/overview', { params: { tz: new Date().getTimezoneOffset() } }).then((r) => r.data),
  leaderboard: (scope = 'weekly') => api.get('/api/gamification/leaderboard', { params: { scope } }).then((r) => r.data),
};
