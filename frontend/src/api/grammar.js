import { api } from './client';
import { normalizeTopic, normalizeQuestion } from './normalizers';
export const grammarApi = {
  topics: () => api.get('/api/grammar/topics').then((r) => (Array.isArray(r.data) ? r.data : []).map(normalizeTopic)),
  questions: (topicId) => api.get(`/api/grammar/${topicId}/questions`).then((r) => (Array.isArray(r.data) ? r.data : []).map(normalizeQuestion)),
  attempt: (questionId, answer) => api.post(`/api/grammar/questions/${questionId}/attempt`, { answer }).then((r) => r.data),
};
