import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RequireAdmin;
