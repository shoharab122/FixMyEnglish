import { api } from './client';
import { normalizeCurriculum } from './normalizers';
const asArr = (v) => (Array.isArray(v) ? v : []);
export const curriculumApi = {
  tracks: () => api.get('/api/curriculum/tracks').then((r) => asArr(r.data)),
  topics: (params) => api.get('/api/curriculum/topics', { params }).then((r) => asArr(r.data).map(normalizeCurriculum)),
  writingBank: (type) => api.get('/api/curriculum/writing', { params: { type } }).then((r) => asArr(r.data)),
  translationSet: () => api.get('/api/curriculum/translation').then((r) => r.data),
};
