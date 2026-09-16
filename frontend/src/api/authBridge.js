import { authApi } from '../api/auth';
import { setAccessToken } from '../api/client';
import { connectSocket } from '../api/socket';

// Call this once from App.jsx's useEffect, alongside initLegacyApp().
export function initAuthBridge() {
  window.doLogin = async function (email, password) {
    try {
      const { accessToken } = await authApi.login(email, password);
      setAccessToken(accessToken);
      connectSocket(accessToken);
      window.go('dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  window.doRegister = async function (email, password, name) {
    try {
      const { accessToken } = await authApi.register(email, password, name);
      setAccessToken(accessToken);
      connectSocket(accessToken);
      window.go('dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  // Wired to "Join lobby as guest" in your existing guestModal.
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
    await authApi.logout();
    setAccessToken(null);
    window.go('dashboard');
  };
}
