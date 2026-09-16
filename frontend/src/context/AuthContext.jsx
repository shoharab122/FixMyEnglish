import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import {
  setAccessToken,
  getAccessToken,
  onTokenChange,
} from '../api/client';
import { connectSocket, disconnectSocket } from '../api/socket';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

/* Decode a JWT into a user object, or null if invalid/expired */
function userFromToken(token) {
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    // Drop tokens that are already expired
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return { id: payload.id, tier: payload.tier, name: payload.name };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Optimistically hydrate from any persisted token so we don't
  // flash the login screen on refresh.
  const [user, setUser] = useState(() => userFromToken(getAccessToken()));
  const [loading, setLoading] = useState(true);

  /* ---- Single source of truth for auth state ---- */
  // Any call to setAccessToken (login, logout, 401 refresh, authBridge)
  // flows through this subscriber. React state stays in sync.
  useEffect(() => {
    const unsub = onTokenChange((token) => {
      setUser(userFromToken(token));
      if (token) {
        connectSocket(token);
      } else {
        disconnectSocket();
      }
    });
    return unsub;
  }, []);

  /* ---- Bootstrap on first load ---- */
  useEffect(() => {
    let cancelled = false;

    const stored = getAccessToken();
    const decoded = userFromToken(stored);

    if (decoded) {
      // Token in sessionStorage is still valid — no refresh needed.
      setUser(decoded);
      connectSocket(stored);
      setLoading(false);
      return () => { cancelled = true; };
    }

    // No valid token — try a silent refresh with the httpOnly cookie.
    authApi
      .refresh()
      .then((data) => {
        if (cancelled) return;
        setAccessToken(data.accessToken);
        connectSocket(data.accessToken);
      })
      .catch(() => {
        if (cancelled) return;
        setAccessToken(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  /* ---- Auth actions ---- */
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
    try { await authApi.logout(); } catch { /* ignore — force local logout anyway */ }
    disconnectSocket();
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        continueAsGuest,
        logout,
        isPremium: user?.tier === 'premium',
        isGuest: user?.tier === 'guest',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}