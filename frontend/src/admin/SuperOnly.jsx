import { useAuth } from '../context/AuthContext';

export function SuperOnly({ children }) {
  const { user } = useAuth();
  if (user?.role !== 'superadmin') {
    return (
      <div className="ec-admin-role-gate">
        <h3>🔒 Superadmin only</h3>
        <p>This section controls money and permissions. Only a superadmin can access it.</p>
      </div>
    );
  }
  return children;
}
