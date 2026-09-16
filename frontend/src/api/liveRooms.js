import { api } from './client';

export const liveRoomsApi = {
  upcoming: () => api.get('/api/live-rooms').then((r) => r.data),
  join: (roomId, guestInfo) => api.post(`/api/live-rooms/${roomId}/join`, guestInfo || {}).then((r) => r.data),
  leaderboard: (roomId) => api.get(`/api/live-rooms/${roomId}/leaderboard`).then((r) => r.data),
};