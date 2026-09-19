import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput } from './Field';
import { useAdminMutation } from './useAdminMutation';

const EMPTY = { code: '', discountPct: '', validTo: '', maxUses: 100 };

export function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { run, loading: mutating } = useAdminMutation();

  const reload = () => {
    setLoading(true);
    adminApi
      .coupons()
      .then((r) => setCoupons(Array.isArray(r) ? r : []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const validate = () => {
    const errs = {};
    if (!/^[A-Z0-9]{3,20}$/.test(draft.code || ''))
      errs.code = 'Code must be A–Z / 0–9 (3–20 chars)';
    const pct = Number(draft.discountPct);
    if (!pct || pct < 1 || pct > 100) errs.discountPct = 'Discount 1–100';
    const mx = Number(draft.maxUses);
    if (!mx || mx < 1) errs.maxUses = 'At least 1';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    run(
      () =>
        adminApi.createCoupon({
          code: draft.code,
          discountPct: Number(draft.discountPct),
          validTo: draft.validTo || null,
          maxUses: Number(draft.maxUses),
        }),
      { audit: 'coupon.create', label: 'Coupon saved' }
    ).then(() => {
      setOpen(false);
      setDraft(EMPTY);
      setFieldErrors({});
      reload();
    });
  };

  const doDelete = () => {
    const target = confirmDelete;
    if (!target) return;
    setConfirmDelete(null);
    run(() => adminApi.deleteCoupon(target.id), {
      audit: 'coupon.delete',
      label: 'Coupon deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Coupons</h1>
          <p className="ec-admin-sub">{coupons.length} discount codes</p>
        </div>
        <button
          className="ec-admin-btn ec-admin-btn--lime"
          onClick={() => { setOpen(true); setFieldErrors({}); }}
        >
          + Add coupon
        </button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={coupons}
          empty="No coupons yet"
          columns={[
            { key: 'code', label: 'Code', render: (c) => <strong>{c.code}</strong> },
            { key: 'discountPct', label: 'Discount', render: (c) => `${c.discountPct}%` },
            { key: 'usedCount', label: 'Used', render: (c) => c.usedCount ?? 0 },
            { key: 'maxUses', label: 'Max uses' },
            {
              key: 'validTo',
              label: 'Valid to',
              render: (c) => (c.validTo ? new Date(c.validTo).toLocaleDateString() : '∞'),
            },
            {
              key: 'actions',
              label: '',
              render: (c) => (
                <button
                  className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                  onClick={() => setConfirmDelete(c)}
                >
                  Delete
                </button>
              ),
            },
          ]}
        />
      </div>

      {open && (
        <AdminModal
          title="Add coupon"
          onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--lime"
                onClick={save}
                disabled={mutating}
              >
                {mutating ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <Field label="Code" error={fieldErrors.code}>
            <TextInput
              value={draft.code}
              onChange={(v) =>
                setDraft({ ...draft, code: v.toUpperCase().replace(/[^A-Z0-9]/g, '') })
              }
              maxLength={20}
            />
          </Field>
          <Field label="Discount %" error={fieldErrors.discountPct}>
            <NumInput
              value={draft.discountPct}
              onChange={(v) => setDraft({ ...draft, discountPct: v })}
              min={1}
              max={100}
            />
          </Field>
          <Field label="Valid until (optional)">
            <TextInput
              type="date"
              value={draft.validTo}
              onChange={(v) => setDraft({ ...draft, validTo: v })}
            />
          </Field>
          <Field label="Max uses" error={fieldErrors.maxUses}>
            <NumInput
              value={draft.maxUses}
              onChange={(v) => setDraft({ ...draft, maxUses: v })}
              min={1}
            />
          </Field>
        </AdminModal>
      )}

      {confirmDelete && (
        <AdminModal
          title="Delete coupon?"
          onClose={() => setConfirmDelete(null)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="ec-admin-btn ec-admin-btn--danger" onClick={doDelete}>
                Delete
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
            Delete coupon <strong>{confirmDelete.code}</strong>?
          </p>
        </AdminModal>
      )}
    </>
  );
}

export default Coupons;
