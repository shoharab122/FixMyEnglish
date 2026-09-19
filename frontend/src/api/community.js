import { api } from './client';
import { normalizeCommunityRoom, normalizeThread } from './normalizers';
const asArr = (v) => (Array.isArray(v) ? v : []);
export const communityApi = {
  rooms: () => api.get('/api/community/rooms').then((r) => asArr(r.data).map(normalizeCommunityRoom)),
  threads: (roomId) => api.get(`/api/community/rooms/${roomId}/threads`).then((r) => asArr(r.data).map(normalizeThread)),
  postThread: (roomId, body) => api.post(`/api/community/rooms/${roomId}/threads`, { body }).then((r) => r.data),
  squads: () => api.get('/api/community/squads').then((r) => asArr(r.data)),
  challengeFriend: (quizId, friendEmail) => api.post('/api/community/challenges', { quizId, friendEmail }).then((r) => r.data),
};
