import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'ec_access_token';

function readStored() {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function writeStored(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

let accessToken = readStored();

const handlers = new Set();
export function setAccessToken(token) {
  accessToken = token || null;
  writeStored(accessToken);
  handlers.forEach((h) => { try { h(accessToken); } catch {} });
}
export function getAccessToken() { return accessToken; }
export function onTokenChange(handler) {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

const AUTH_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/guest',
  '/api/auth/refresh',
  '/api/auth/logout',
];

function isAuthEndpoint(url = '') {
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    const url = original.url || '';

    if (status !== 401 || original._retry || isAuthEndpoint(url)) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api.post('/api/auth/refresh').finally(() => {
          setTimeout(() => { refreshPromise = null; }, 0);
        });
      }
      const { data } = await refreshPromise;
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      }
      setAccessToken(null);
      return Promise.reject(error);
    } catch (refreshErr) {
      setAccessToken(null);
      return Promise.reject(refreshErr);
    }
  }
);
