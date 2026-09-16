import { api } from './client';

export const grammarApi = {
  topics: () => api.get('/api/grammar/topics').then((r) => r.data),
  questions: (topicId) => api.get(`/api/grammar/${topicId}/questions`).then((r) => r.data),
  attempt: (questionId, answer) =>
    api.post(`/api/grammar/questions/${questionId}/attempt`, { answer }).then((r) => r.data),
};
