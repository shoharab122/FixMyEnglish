import { api } from './client';

export const adminApi = {
  /* Dashboard */
  stats: () => api.get('/api/admin/stats').then((r) => r.data),
  analytics: () => api.get('/api/admin/analytics').then((r) => r.data),

  /* Users */
  users: (p) => api.get('/api/admin/users', { params: p }).then((r) => r.data),
  updateUser: (id, data) => api.patch(`/api/admin/users/${id}`, data).then((r) => r.data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`).then((r) => r.data),

  /* Vocabulary */
  vocab: (p) => api.get('/api/admin/vocab', { params: p }).then((r) => r.data),
  createVocab: (data) => api.post('/api/admin/vocab', data).then((r) => r.data),
  updateVocab: (id, data) => api.patch(`/api/admin/vocab/${id}`, data).then((r) => r.data),
  deleteVocab: (id) => api.delete(`/api/admin/vocab/${id}`).then((r) => r.data),

  /* Grammar */
  grammarTopics: () => api.get('/api/admin/grammar/topics').then((r) => r.data),
  createGrammarTopic: (d) => api.post('/api/admin/grammar/topics', d).then((r) => r.data),
  deleteGrammarTopic: (id) => api.delete(`/api/admin/grammar/topics/${id}`).then((r) => r.data),
  grammarQuestions: (topicId) => api.get('/api/admin/grammar/questions', { params: { topicId } }).then((r) => r.data),
  createGrammarQuestion: (d) => api.post('/api/admin/grammar/questions', d).then((r) => r.data),
  deleteGrammarQuestion: (id) => api.delete(`/api/admin/grammar/questions/${id}`).then((r) => r.data),

  /* Curriculum */
  curriculum: (p) => api.get('/api/admin/curriculum', { params: p }).then((r) => r.data),
  createCurriculum: (d) => api.post('/api/admin/curriculum', d).then((r) => r.data),
  deleteCurriculum: (id) => api.delete(`/api/admin/curriculum/${id}`).then((r) => r.data),

  /* Exams */
  examTracks: () => api.get('/api/admin/exams/tracks').then((r) => r.data),
  createExamTrack: (d) => api.post('/api/admin/exams/tracks', d).then((r) => r.data),
  deleteExamTrack: (id) => api.delete(`/api/admin/exams/tracks/${id}`).then((r) => r.data),
  createExamSet: (d) => api.post('/api/admin/exams/sets', d).then((r) => r.data),
  deleteExamSet: (id) => api.delete(`/api/admin/exams/sets/${id}`).then((r) => r.data),
  examQuestions: (setId) => api.get(`/api/admin/exams/sets/${setId}/questions`).then((r) => r.data),
  createExamQuestion: (d) => api.post('/api/admin/exams/questions', d).then((r) => r.data),
  deleteExamQuestion: (id) => api.delete(`/api/admin/exams/questions/${id}`).then((r) => r.data),

  /* Speaking */
  speakingPrompts: () => api.get('/api/admin/speaking/prompts').then((r) => r.data),
  createSpeakingPrompt: (d) => api.post('/api/admin/speaking/prompts', d).then((r) => r.data),
  deleteSpeakingPrompt: (id) => api.delete(`/api/admin/speaking/prompts/${id}`).then((r) => r.data),

  /* Community */
  threads: () => api.get('/api/admin/community/threads').then((r) => r.data),
  updateThread: (id, d) => api.patch(`/api/admin/community/threads/${id}`, d).then((r) => r.data),
  deleteThread: (id) => api.delete(`/api/admin/community/threads/${id}`).then((r) => r.data),
  chatRooms: () => api.get('/api/admin/community/rooms').then((r) => r.data),
  updateChatRoom: (id, d) => api.patch(`/api/admin/community/rooms/${id}`, d).then((r) => r.data),

  /* Live Rooms */
  liveRooms: () => api.get('/api/admin/live-rooms').then((r) => r.data),
  createLiveRoom: (d) => api.post('/api/admin/live-rooms', d).then((r) => r.data),
  updateLiveRoom: (id, d) => api.patch(`/api/admin/live-rooms/${id}`, d).then((r) => r.data),
  deleteLiveRoom: (id) => api.delete(`/api/admin/live-rooms/${id}`).then((r) => r.data),

  /* Commerce — superadmin only on the backend */
  products: () => api.get('/api/admin/products').then((r) => r.data),
  createProduct: (d) => api.post('/api/admin/products', d).then((r) => r.data),
  updateProduct: (id, d) => api.patch(`/api/admin/products/${id}`, d).then((r) => r.data),
  deleteProduct: (id) => api.delete(`/api/admin/products/${id}`).then((r) => r.data),

  coupons: () => api.get('/api/admin/coupons').then((r) => r.data),
  createCoupon: (d) => api.post('/api/admin/coupons', d).then((r) => r.data),
  deleteCoupon: (id) => api.delete(`/api/admin/coupons/${id}`).then((r) => r.data),

  purchases: (p) => api.get('/api/admin/purchases', { params: p }).then((r) => r.data),
  refund: (id) => api.patch(`/api/admin/purchases/${id}/refund`).then((r) => r.data),

  /* System */
  announcements: () => api.get('/api/admin/announcements').then((r) => r.data),
  createAnnouncement: (d) => api.post('/api/admin/announcements', d).then((r) => r.data),
  deleteAnnouncement: (id) => api.delete(`/api/admin/announcements/${id}`).then((r) => r.data),

  featureFlags: () => api.get('/api/admin/feature-flags').then((r) => r.data),
  upsertFeatureFlag: (d) => api.post('/api/admin/feature-flags', d).then((r) => r.data),
  deleteFeatureFlag: (id) => api.delete(`/api/admin/feature-flags/${id}`).then((r) => r.data),

  auditLog: (p) => api.get('/api/admin/audit-log', { params: p }).then((r) => r.data),
};
