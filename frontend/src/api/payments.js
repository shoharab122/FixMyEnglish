import { api } from './client';

export const paymentsApi = {
  packages: () => api.get('/api/payments/packages').then((r) => r.data),
  checkout: (productType, method) => api.post('/api/payments/checkout', { productType, method }).then((r) => r.data),
  history: () => api.get('/api/payments/history').then((r) => r.data),
};
