import { api } from './client';
import { normalizeProduct } from './normalizers';
const asArr = (v) => (Array.isArray(v) ? v : []);
export const paymentsApi = {
  packages: () => api.get('/api/payments/packages').then((r) => asArr(r.data).map(normalizeProduct)),
  checkout: (productType, method, coupon) => api.post('/api/payments/checkout', { productType, method, coupon }).then((r) => r.data),
  history: () => api.get('/api/payments/history').then((r) => asArr(r.data)),
};
