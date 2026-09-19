import { api } from './client';
import { normalizeSpeakingPrompt } from './normalizers';
export const speakingApi = {
  prompts: () => api.get('/api/speaking/prompts').then((r) => (Array.isArray(r.data) ? r.data : []).map(normalizeSpeakingPrompt)),
  submitAttempt: (promptId, audioBlob) => {
    const form = new FormData();
    form.append('audio', audioBlob, 'attempt.webm');
    return api.post(`/api/speaking/${promptId}/attempt`, form).then((r) => r.data);
  },
  history: () => api.get('/api/speaking/history').then((r) => r.data),
  conversationTurn: (sessionId, audioBlob) => {
    const form = new FormData();
    form.append('audio', audioBlob, 'turn.webm');
    return api.post(`/api/speaking/conversation/${sessionId}/turn`, form).then((r) => r.data);
  },
};
