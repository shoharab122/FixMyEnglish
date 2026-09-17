import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput } from './Field';
import { SuperOnly } from './SuperOnly';

const EMPTY = { code: '', discountPct: '', validTo: '', maxUses: 100 };

export function Coupons() {
  return <SuperOnly><CouponsInner /></SuperOnly>;
}

function CouponsInner() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);

  const reload = () => {
    setLoading(true);
    adminApi.coupons().then(setCoupons).catch(() => setCoupons([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!draft.code || !draft.discountPct) { alert('Code and discount required'); return; }
    await adminApi.createCoupon({
      code: draft.code,
      discountPct: Number(draft.discountPct),
      validTo: draft.validTo || null,
      maxUses: Number(draft.maxUses) || 100,
    });
    setOpen(false); setDraft(EMPTY); reload();
  };
  const remove = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await adminApi.deleteCoupon(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Coupons</h1>
          <p className="ec-admin-sub">{coupons.length} codes · superadmin only</p>
        </div>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)}>+ Add coupon</button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={coupons}
          empty="No coupons yet"
          columns={[
            { key: 'code', label: 'Code', render: (c) => <strong>{c.code}</strong> },
            { key: 'discountPct', label: 'Discount', render: (c) => `${c.discountPct}%` },
            { key: 'usedCount', label: 'Used' },
            { key: 'maxUses', label: 'Max uses' },
            { key: 'validTo', label: 'Valid to', render: (c) => c.validTo ? new Date(c.validTo).toLocaleDateString() : '∞' },
            { key: 'actions', label: '', render: (c) => <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(c.id, c.code)}>Delete</button> },
          ]}
        />
      </div>

      {open && (
        <AdminModal title="Add coupon" onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Save</button>
            </>
          }>
          <Field label="Code"><TextInput value={draft.code} onChange={(v) => setDraft({ ...draft, code: v.toUpperCase() })} /></Field>
          <Field label="Discount %"><NumInput value={draft.discountPct} onChange={(v) => setDraft({ ...draft, discountPct: v })} /></Field>
          <Field label="Valid until (optional)"><TextInput type="date" value={draft.validTo} onChange={(v) => setDraft({ ...draft, validTo: v })} /></Field>
          <Field label="Max uses"><NumInput value={draft.maxUses} onChange={(v) => setDraft({ ...draft, maxUses: v })} /></Field>
        </AdminModal>
      )}
    </>
  );
}
