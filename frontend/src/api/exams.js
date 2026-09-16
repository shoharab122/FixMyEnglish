import { api } from './client';

export const examsApi = {
  tracks: () => api.get('/api/exams/tracks').then((r) => r.data),
  start: (trackId, section) => api.post(`/api/exams/${trackId}/start`, { section }).then((r) => r.data),
  submit: (attemptId, answers) => api.post(`/api/exams/attempts/${attemptId}/submit`, { answers }).then((r) => r.data),
  countdown: () => api.get('/api/exams/countdown').then((r) => r.data),
  setCountdown: (trackId, examDate) => api.post('/api/exams/countdown', { trackId, examDate }).then((r) => r.data),
};
