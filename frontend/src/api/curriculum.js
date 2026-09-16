import { api } from './client';

export const curriculumApi = {
  tracks: () => api.get('/api/curriculum/tracks').then((r) => r.data),
  topics: (params) => api.get('/api/curriculum/topics', { params }).then((r) => r.data),
  writingBank: (type) => api.get('/api/curriculum/writing', { params: { type } }).then((r) => r.data),
  translationSet: () => api.get('/api/curriculum/translation').then((r) => r.data),
};
