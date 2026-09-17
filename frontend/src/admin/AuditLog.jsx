import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { SuperOnly } from './SuperOnly';

export function AuditLog() {
  return <SuperOnly><AuditLogInner /></SuperOnly>;
}

function AuditLogInner() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.auditLog().then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Audit Log</h1>
          <p className="ec-admin-sub">{rows.length} entries · who did what, and when</p>
        </div>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={rows}
          empty="No audit entries yet"
          columns={[
            { key: 'createdAt', label: 'When', render: (r) => new Date(r.createdAt).toLocaleString() },
            { key: 'actorName', label: 'Actor', render: (r) => r.actorName || '—' },
            { key: 'action', label: 'Action' },
            { key: 'targetType', label: 'Target', render: (r) => r.targetType || '—' },
            { key: 'targetId', label: 'ID', render: (r) => r.targetId || '—' },
          ]}
        />
      </div>
    </>
  );
}
