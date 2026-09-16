import { api } from './client';

export const vocabApi = {
  wordOfDay: () => api.get('/api/vocab/word-of-day').then((r) => r.data),
  deck: () => api.get('/api/vocab/deck').then((r) => r.data),
  review: (wordId, grade) =>
    api.post(`/api/vocab/${wordId}/review`, { grade }).then((r) => r.data),
  quiz: (count = 10, textbookUnit) =>
    api.get('/api/vocab/quiz', { params: { count, textbookUnit } }).then((r) => r.data),
  blitz: () => api.get('/api/vocab/blitz').then((r) => r.data),
};
