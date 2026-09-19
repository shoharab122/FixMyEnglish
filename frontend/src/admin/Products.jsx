import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, Select, TextArea } from './Field';
import { useAdminMutation } from './useAdminMutation';

const EMPTY = {
  slug: '', name: '', tagline: '', type: 'one_time',
  priceBdt: '', period: 'one-time', strikeBdt: '', features: '',
  icon: 'flag', featured: false,
};

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { run, loading: mutating } = useAdminMutation();

  const reload = () => {
    setLoading(true);
    adminApi
      .products()
      .then((r) => setProducts(Array.isArray(r) ? r : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const validate = () => {
    const errs = {};
    if (!draft.name?.trim()) errs.name = 'Name is required';
    if (!draft.slug?.trim()) errs.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(draft.slug))
      errs.slug = 'Lowercase letters, numbers, dashes only';
    if (!draft.priceBdt || Number(draft.priceBdt) <= 0)
      errs.priceBdt = 'Price must be greater than 0';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    run(
      () =>
        adminApi.createProduct({
          ...draft,
          priceBdt: Number(draft.priceBdt),
          strikeBdt: draft.strikeBdt ? Number(draft.strikeBdt) : null,
          features: draft.features
            ? draft.features.split('\n').map((s) => s.trim()).filter(Boolean)
            : [],
        }),
      { audit: 'product.create', label: 'Product saved' }
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
    run(() => adminApi.deleteProduct(target.id), {
      audit: 'product.delete',
      label: 'Product deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Products</h1>
          <p className="ec-admin-sub">{products.length} subscription plans</p>
        </div>
        <button
          className="ec-admin-btn ec-admin-btn--lime"
          onClick={() => { setOpen(true); setFieldErrors({}); }}
        >
          + Add product
        </button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={products}
          empty="No products yet"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'slug', label: 'Slug' },
            {
              key: 'priceBdt',
              label: 'Price',
              render: (p) => `৳${Number(p.priceBdt || 0).toLocaleString()}`,
            },
            { key: 'period', label: 'Period' },
            {
              key: 'featured',
              label: 'Featured',
              render: (p) => (p.featured ? '⭐' : '—'),
            },
            {
              key: 'actions',
              label: '',
              render: (p) => (
                <button
                  className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                  onClick={() => setConfirmDelete(p)}
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
          title="Add product"
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
          <Field label="Name" error={fieldErrors.name}>
            <TextInput value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} maxLength={120} />
          </Field>
          <Field label="Slug" hint="lowercase letters, numbers, dashes" error={fieldErrors.slug}>
            <TextInput
              value={draft.slug}
              onChange={(v) =>
                setDraft({ ...draft, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, '') })
              }
              maxLength={60}
            />
          </Field>
          <Field label="Tagline">
            <TextInput value={draft.tagline} onChange={(v) => setDraft({ ...draft, tagline: v })} maxLength={200} />
          </Field>
          <Field label="Type">
            <Select
              value={draft.type}
              onChange={(v) => setDraft({ ...draft, type: v })}
              options={[
                { value: 'one_time', label: 'One-time purchase' },
                { value: 'subscription', label: 'Subscription' },
                { value: 'ielts_mock', label: 'IELTS mock' },
                { value: 'sat_mock', label: 'SAT mock' },
                { value: 'pte_mock', label: 'PTE mock' },
              ]}
            />
          </Field>
          <Field label="Price (BDT)" error={fieldErrors.priceBdt}>
            <NumInput value={draft.priceBdt} onChange={(v) => setDraft({ ...draft, priceBdt: v })} min={1} />
          </Field>
          <Field label="Strike price (optional)">
            <NumInput value={draft.strikeBdt} onChange={(v) => setDraft({ ...draft, strikeBdt: v })} min={0} />
          </Field>
          <Field label="Period">
            <TextInput value={draft.period} onChange={(v) => setDraft({ ...draft, period: v })} maxLength={40} />
          </Field>
          <Field label="Features (one per line)">
            <TextArea value={draft.features} onChange={(v) => setDraft({ ...draft, features: v })} rows={5} />
          </Field>
          <Field label="Featured?">
            <Select
              value={draft.featured ? 'yes' : 'no'}
              onChange={(v) => setDraft({ ...draft, featured: v === 'yes' })}
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes — Popular badge' },
              ]}
            />
          </Field>
        </AdminModal>
      )}

      {confirmDelete && (
        <AdminModal
          title="Delete product?"
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
            Delete <strong>{confirmDelete.name}</strong>? Users who bought it keep access.
          </p>
        </AdminModal>
      )}
    </>
  );
}

export default Products;
