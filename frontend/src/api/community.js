import { api } from './client';

export const communityApi = {
  rooms: () => api.get('/api/community/rooms').then((r) => r.data),
  threads: (roomId) => api.get(`/api/community/rooms/${roomId}/threads`).then((r) => r.data),
  postThread: (roomId, body) => api.post(`/api/community/rooms/${roomId}/threads`, { body }).then((r) => r.data),
  squads: () => api.get('/api/community/squads').then((r) => r.data),
  challengeFriend: (quizId, friendEmail) => api.post('/api/community/challenges', { quizId, friendEmail }).then((r) => r.data),
};
