import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { SuperOnly } from './SuperOnly';

export function Purchases() {
  return <SuperOnly><PurchasesInner /></SuperOnly>;
}

function PurchasesInner() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    adminApi.purchases({ status: status || undefined })
      .then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
  };
  useEffect(reload, [status]);

  const refund = async (id) => {
    if (!confirm('Refund this purchase? User is downgraded if it was a subscription.')) return;
    await adminApi.refund(id); reload();
  };

  const total = rows.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amountBdt, 0);

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Purchases</h1>
          <p className="ec-admin-sub">{rows.length} records · ৳{total.toLocaleString()} total paid</p>
        </div>
      </div>

      <div className="ec-admin-toolbar">
        <select className="ec-admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={rows}
          empty="No purchases yet"
          columns={[
            { key: 'user', label: 'User', render: (p) => <>{p.user?.name}<br /><span style={{ fontSize: 11, color: '#888' }}>{p.user?.email}</span></> },
            { key: 'product', label: 'Product' },
            { key: 'amountBdt', label: 'Amount', render: (p) => `৳${p.amountBdt}` },
            { key: 'method', label: 'Method' },
            { key: 'status', label: 'Status', render: (p) => <span className={`ec-admin-badge ec-admin-badge--${p.status}`}>{p.status}</span> },
            { key: 'purchasedAt', label: 'Date', render: (p) => new Date(p.purchasedAt).toLocaleDateString() },
            { key: 'actions', label: '', render: (p) => p.status === 'paid'
              ? <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => refund(p.id)}>Refund</button>
              : null },
          ]}
        />
      </div>
    </>
  );
}
