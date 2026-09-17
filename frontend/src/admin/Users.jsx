import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { useAuth } from '../context/AuthContext';
import { AdminTable } from './AdminTable';

export function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [tier, setTier] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  const isSuper = me?.role === 'superadmin';

  const reload = () => {
    setLoading(true);
    adminApi.users({ q, tier: tier || undefined, role: role || undefined })
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, [q, tier, role]);

  const changeTier = async (id, newTier) => {
    await adminApi.updateUser(id, { tier: newTier });
    reload();
  };
  const changeRole = async (id, newRole) => {
    if (!isSuper) { alert('Only superadmin can change roles'); return; }
    await adminApi.updateUser(id, { role: newRole });
    reload();
  };
  const removeUser = async (id, name) => {
    if (!isSuper) { alert('Only superadmin can delete users'); return; }
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    await adminApi.deleteUser(id);
    reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Users</h1>
          <p className="ec-admin-sub">{users.length} users shown</p>
        </div>
      </div>

      <div className="ec-admin-toolbar">
        <input className="ec-admin-input" placeholder="Search name or email…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="ec-admin-select" value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="">All tiers</option>
          <option value="guest">Guest</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <select className="ec-admin-select" value={role} onChange={(e) => setRole(e.target.value)}>
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
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email', render: (u) => u.email || '—' },
            {
              key: 'tier', label: 'Tier', render: (u) => (
                <select className="ec-admin-select" style={{ fontSize: 11, padding: '5px 8px', minWidth: 100 }} value={u.tier} onChange={(e) => changeTier(u.id, e.target.value)}>
                  <option value="guest">guest</option>
                  <option value="free">free</option>
                  <option value="premium">premium</option>
                </select>
              ),
            },
            {
              key: 'role', label: 'Role', render: (u) => (
                <select className="ec-admin-select" style={{ fontSize: 11, padding: '5px 8px', minWidth: 110 }} value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} disabled={!isSuper}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
              ),
            },
            { key: 'xp', label: 'XP' },
            {
              key: 'actions', label: '', render: (u) => (
                isSuper && u.id !== me.id ? (
                  <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => removeUser(u.id, u.name)}>Delete</button>
                ) : null
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
