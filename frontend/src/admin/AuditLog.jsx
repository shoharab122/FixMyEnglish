import { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';

export function AuditLog() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    adminApi
      .auditLog()
      .then((r) => setRows(Array.isArray(r) ? r : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (action && r.action !== action) return false;
      if (!needle) return true;
      return (
        (r.actorName || '').toLowerCase().includes(needle) ||
        (r.action || '').toLowerCase().includes(needle) ||
        (r.targetId || '').toLowerCase().includes(needle)
      );
    });
  }, [rows, q, action]);

  const actions = useMemo(() => {
    const set = new Set(rows.map((r) => r.action).filter(Boolean));
    return Array.from(set).sort();
  }, [rows]);

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Audit Log</h1>
          <p className="ec-admin-sub">
            {filtered.length} of {rows.length} entries · every admin action is recorded
          </p>
        </div>
      </div>

      <div className="ec-admin-toolbar">
        <input
          className="ec-admin-input"
          placeholder="Search actor, action or target…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="ec-admin-select"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="">All actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={filtered}
          empty="No audit entries yet"
          columns={[
            {
              key: 'createdAt',
              label: 'When',
              render: (r) =>
                r.createdAt ? new Date(r.createdAt).toLocaleString() : '—',
            },
            { key: 'actorName', label: 'Actor', render: (r) => r.actorName || '—' },
            { key: 'action', label: 'Action' },
            { key: 'targetType', label: 'Target', render: (r) => r.targetType || '—' },
            { key: 'targetId', label: 'ID', render: (r) => r.targetId || '—' },
            {
              key: 'meta',
              label: 'Details',
              render: (r) =>
                r.meta ? (
                  <span className="ec-admin-muted" style={{ fontSize: 11 }}>
                    {safeStringify(r.meta)}
                  </span>
                ) : (
                  '—'
                ),
            },
          ]}
        />
      </div>
    </>
  );
}

function safeStringify(value) {
  try {
    return JSON.stringify(value).slice(0, 160);
  } catch {
    return '—';
  }
}