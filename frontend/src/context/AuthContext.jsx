import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import { setAccessToken, getAccessToken, onTokenChange } from '../api/client';
import { connectSocket, disconnectSocket } from '../api/socket';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

function userFromToken(token) {
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return {
      id: payload.id,
      tier: payload.tier,
      name: payload.name,
      role: payload.role ?? 'user',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => userFromToken(getAccessToken()));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onTokenChange((token) => {
      setUser(userFromToken(token));
      if (token) connectSocket(token);
      else disconnectSocket();
    });
    return unsub;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const stored = getAccessToken();
    const decoded = userFromToken(stored);
    if (decoded) {
      setUser(decoded);
      connectSocket(stored);
      setLoading(false);
      return () => { cancelled = true; };
    }
    authApi.refresh()
      .then((data) => {
        if (cancelled) return;
        setAccessToken(data.accessToken);
        connectSocket(data.accessToken);
      })
      .catch(() => { if (!cancelled) setAccessToken(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  /* Re-fetch current user from the backend (tier/role can change from admin) */
  const refreshUser = useCallback(async () => {
    try {
      const { api } = await import('../api/client');
      const { data } = await api.get('/api/auth/me');
      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          tier: data.tier,
          role: data.role ?? 'user',
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  /* Refresh on window focus so tier/role changes propagate without logout */
  useEffect(() => {
    const onFocus = () => refreshUser();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshUser]);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    setAccessToken(data.accessToken);
    connectSocket(data.accessToken);
    return data;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const data = await authApi.register(email, password, name);
    setAccessToken(data.accessToken);
    connectSocket(data.accessToken);
    return data;
  }, []);

  const continueAsGuest = useCallback(async (name, email) => {
    const data = await authApi.guest(name, email);
    setAccessToken(data.accessToken);
    connectSocket(data.accessToken);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* */ }
    disconnectSocket();
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, continueAsGuest, logout, refreshUser,
      isPremium: user?.tier === 'premium',
      isGuest: user?.tier === 'guest',
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
