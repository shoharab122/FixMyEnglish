import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { useAdminMutation } from './useAdminMutation';

function safeStatusClass(status) {
  const map = { paid: 'paid', pending: 'pending', refunded: 'refunded' };
  return map[status] || 'guest';
}

export function Purchases() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmRefund, setConfirmRefund] = useState(null);
  const { run, loading: mutating } = useAdminMutation();

  const reload = () => {
    setLoading(true);
    adminApi
      .purchases({ status: status || undefined })
      .then((r) => setRows(Array.isArray(r) ? r : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const doRefund = () => {
    const target = confirmRefund;
    if (!target) return;
    setConfirmRefund(null);
    run(() => adminApi.refund(target.id), {
      audit: 'purchase.refund',
      label: 'Refund issued',
    })
      .then(reload)
      .catch(() => reload());
  };

  const total = rows
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + Number(p.amountBdt || 0), 0);

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Purchases</h1>
          <p className="ec-admin-sub">
            {rows.length} records · ৳{total.toLocaleString()} total paid
          </p>
        </div>
      </div>

      <div className="ec-admin-toolbar">
        <select
          className="ec-admin-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
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
            {
              key: 'user',
              label: 'User',
              render: (p) => (
                <>
                  {p.user?.name}
                  <br />
                  <span className="ec-admin-muted" style={{ fontSize: 11 }}>
                    {p.user?.email}
                  </span>
                </>
              ),
            },
            {
              key: 'product',
              label: 'Product',
              render: (p) => p.product?.name || p.product || '—',
            },
            {
              key: 'amountBdt',
              label: 'Amount',
              render: (p) => `৳${Number(p.amountBdt || 0).toLocaleString()}`,
            },
            { key: 'method', label: 'Method' },
            {
              key: 'status',
              label: 'Status',
              render: (p) => (
                <span className={`ec-admin-badge ec-admin-badge--${safeStatusClass(p.status)}`}>
                  {p.status}
                </span>
              ),
            },
            {
              key: 'purchasedAt',
              label: 'Date',
              render: (p) =>
                p.purchasedAt
                  ? new Date(p.purchasedAt).toLocaleDateString()
                  : '—',
            },
            {
              key: 'actions',
              label: '',
              render: (p) =>
                p.status === 'paid' ? (
                  <button
                    className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                    disabled={mutating}
                    onClick={() => setConfirmRefund(p)}
                  >
                    Refund
                  </button>
                ) : null,
            },
          ]}
        />
      </div>

      {confirmRefund && (
        <AdminModal
          title="Issue refund?"
          onClose={() => setConfirmRefund(null)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setConfirmRefund(null)}
              >
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--danger"
                onClick={doRefund}
              >
                Refund
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
            Refund ৳{Number(confirmRefund.amountBdt || 0).toLocaleString()} for{' '}
            <strong>{confirmRefund.user?.name || 'user'}</strong>? Subscriptions are
            downgraded immediately.
          </p>
        </AdminModal>
      )}
    </>
  );
}

export default Purchases;