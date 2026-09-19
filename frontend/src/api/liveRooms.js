import { api } from './client';
import { normalizeLiveRoom } from './normalizers';

/* Unwrap any of: [ ... ] | { rooms: [...] } | { data: [...] } | { items: [...] } */
function unwrapArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.rooms)) return payload.rooms;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export const liveRoomsApi = {
  upcoming: async () => {
    try {
      const res = await api.get('/api/live-rooms');
      const raw = unwrapArray(res?.data);
      const normalized = raw.map(normalizeLiveRoom).filter(Boolean);
      // eslint-disable-next-line no-console
      console.log('[liveRoomsApi.upcoming] raw:', res?.data, '→ normalized:', normalized);
      return normalized;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[liveRoomsApi.upcoming] failed:', err?.message || err);
      return [];
    }
  },
  join: (roomId, guestInfo) =>
    api.post(`/api/live-rooms/${roomId}/join`, guestInfo || {}).then((r) => r.data),
  leaderboard: (roomId) =>
    api.get(`/api/live-rooms/${roomId}/leaderboard`).then((r) => r.data),
  zoom: (roomId) =>
    api.get(`/api/live-rooms/${roomId}/zoom`).then((r) => r.data),
};
