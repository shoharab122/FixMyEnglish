import { useAuth } from '../context/AuthContext';

/**
 * Role gate.
 * - Default: allow admin + superadmin.
 * - `superOnly`: allow superadmin only.
 */
export function SuperOnly({ children, superOnly = false, fallback }) {
  const { user } = useAuth();
  const role = user?.role;

  const ok = superOnly
    ? role === 'superadmin'
    : role === 'admin' || role === 'superadmin';

  if (!ok) {
    return (
      fallback ?? (
        <div className="ec-admin-role-gate">
          <h3>🔒 {superOnly ? 'Superadmin only' : 'Admin access required'}</h3>
          <p>
            {superOnly
              ? 'Only a superadmin can perform this action.'
              : 'You need an admin account to view this section.'}
          </p>
        </div>
      )
    );
  }
  return children;
}

export default SuperOnly;