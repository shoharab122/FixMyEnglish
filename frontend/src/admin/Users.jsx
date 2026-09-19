import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { useAuth } from '../context/AuthContext';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { useAdminMutation } from './useAdminMutation';

const SAFE_TIERS = ['guest', 'free', 'premium'];
const SAFE_ROLES = ['user', 'admin', 'superadmin'];

export function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [tier, setTier] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { run, loading: mutating } = useAdminMutation();

  const isSuper = me?.role === 'superadmin';

  const reload = () => {
    setLoading(true);
    adminApi
      .users({ q, tier: tier || undefined, role: role || undefined })
      .then((rows) => setUsers(Array.isArray(rows) ? rows : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tier, role]);

  const changeTier = (id, newTier) => {
    if (!SAFE_TIERS.includes(newTier)) return;
    run(() => adminApi.updateUser(id, { tier: newTier }), {
      audit: 'user.tier.change',
      label: 'Tier updated',
    })
      .then(reload)
      .catch(() => reload());
  };

  const changeRole = (id, newRole) => {
    if (!isSuper) return;
    if (!SAFE_ROLES.includes(newRole)) return;
    run(() => adminApi.updateUser(id, { role: newRole }), {
      audit: 'user.role.change',
      label: 'Role updated',
    })
      .then(reload)
      .catch(() => reload());
  };

  const doDelete = () => {
    const target = confirmDelete;
    if (!target) return;
    setConfirmDelete(null);
    run(() => adminApi.deleteUser(target.id), {
      audit: 'user.delete',
      label: 'User deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Users</h1>
          <p className="ec-admin-sub">
            {users.length} users shown · role changes and deletions are superadmin-only
          </p>
        </div>
      </div>

      <div className="ec-admin-toolbar">
        <input
          className="ec-admin-input"
          placeholder="Search name or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="ec-admin-select"
          value={tier}
          onChange={(e) => setTier(e.target.value)}
        >
          <option value="">All tiers</option>
          <option value="guest">Guest</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <select
          className="ec-admin-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={users}
          empty="No users found"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email', render: (u) => u.email || '—' },
            {
              key: 'tier',
              label: 'Tier',
              render: (u) => (
                <select
                  className="ec-admin-select ec-admin-select--inline"
                  value={u.tier}
                  disabled={mutating}
                  onChange={(e) => changeTier(u.id, e.target.value)}
                >
                  {SAFE_TIERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              key: 'role',
              label: 'Role',
              render: (u) => (
                <select
                  className="ec-admin-select ec-admin-select--inline"
                  value={u.role}
                  disabled={!isSuper || mutating}
                  title={!isSuper ? 'Superadmin only' : ''}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  {SAFE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              ),
            },
            { key: 'xp', label: 'XP', render: (u) => u.xp ?? 0 },
            {
              key: 'actions',
              label: '',
              render: (u) =>
                isSuper && u.id !== me?.id ? (
                  <button
                    className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                    onClick={() => setConfirmDelete(u)}
                  >
                    Delete
                  </button>
                ) : (
                  <span className="ec-admin-muted">—</span>
                ),
            },
          ]}
        />
      </div>

      {confirmDelete && (
        <AdminModal
          title="Delete user?"
          onClose={() => setConfirmDelete(null)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--danger"
                onClick={doDelete}
              >
                Delete forever
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
            Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
            This action cannot be undone.
          </p>
        </AdminModal>
      )}
    </>
  );
}
