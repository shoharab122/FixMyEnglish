import { api } from './client';
import { normalizeTrack } from './normalizers';

const asArr = (v) => (Array.isArray(v) ? v : []);

export const examsApi = {
  /* Practice tracks */
  tracks: () => api.get('/api/exams/tracks').then((r) => asArr(r.data).map(normalizeTrack)),

  /* Admin-published exam papers */
  papers: () => api.get('/api/exams/papers').then((r) => asArr(r.data)),
  paper: (id) => api.get(`/api/exams/papers/${id}`).then((r) => r.data),
  startPaper: (id) => api.post(`/api/exams/papers/${id}/start`).then((r) => r.data),
  submitPaper: (attemptId, answers) =>
    api.post(`/api/exams/papers/attempts/${attemptId}/submit`, { answers }).then((r) => r.data),
  myAttempts: () => api.get('/api/exams/papers/attempts/me').then((r) => asArr(r.data)),

  /* Existing track-level countdown */
  start: (trackId, section) => api.post(`/api/exams/${trackId}/start`, { section }).then((r) => r.data),
  submit: (attemptId, answers) =>
    api.post(`/api/exams/attempts/${attemptId}/submit`, { answers }).then((r) => r.data),
  countdown: () => api.get('/api/exams/countdown').then((r) => r.data),
  setCountdown: (trackId, examDate) =>
    api.post('/api/exams/countdown', { trackId, examDate }).then((r) => r.data),
};
