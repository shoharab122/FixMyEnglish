import { authApi } from '../api/auth';
import { setAccessToken } from '../api/client';
import { connectSocket } from '../api/socket';

/**
 * Bridge for legacy vanilla-JS code that calls window.doLogin etc.
 * It sets the token via setAccessToken, which notifies AuthContext —
 * so React's user state updates in real time without duplication.
 */
export function initAuthBridge() {
  window.doLogin = async function (email, password) {
    try {
      const { accessToken } = await authApi.login(email, password);
      setAccessToken(accessToken);       // notifies AuthContext
      connectSocket(accessToken);
      window.go?.('dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  window.doRegister = async function (email, password, name) {
    try {
      const { accessToken } = await authApi.register(email, password, name);
      setAccessToken(accessToken);
      connectSocket(accessToken);
      window.go?.('dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  window.joinGuestAccount = async function (name, email) {
    try {
      const { accessToken } = await authApi.guest(name, email);
      setAccessToken(accessToken);
      connectSocket(accessToken);
    } catch (err) {
      alert(err.response?.data?.error || 'Could not join');
    }
  };

  window.doLogout = async function () {
    try { await authApi.logout(); } catch { /* ignore */ }
    setAccessToken(null);               // notifies AuthContext
    window.go?.('dashboard');
  };
}