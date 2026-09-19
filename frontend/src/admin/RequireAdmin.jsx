import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#6B6488' }}>
        Checking access…
      </div>
    );
  }

  if (!user) {
    // Not logged in → send to login, remember where they wanted to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    // Logged in but not an admin
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 24, textAlign: 'center',
        fontFamily: 'Inter, sans-serif', background: '#F8F9FC', color: '#17102E',
      }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🔒</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900 }}>Admin access required</h1>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6B6488', maxWidth: 380, lineHeight: 1.55 }}>
          You are signed in as <strong>{user.name}</strong> with role <strong>{user.role}</strong>.
          Log out and sign in with an admin account.
        </p>
        <a href="/login" style={{
          padding: '12px 22px', borderRadius: 999, background: '#17102E', color: '#D4F55C',
          textDecoration: 'none', fontWeight: 900, fontSize: 13.5, border: '2px solid #17102E',
        }}>Go to login</a>
      </div>
    );
  }

  return children;
}

export default RequireAdmin;
