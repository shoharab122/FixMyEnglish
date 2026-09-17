import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, Select, TextArea } from './Field';
import { SuperOnly } from './SuperOnly';

const EMPTY = { slug: '', name: '', tagline: '', type: 'one_time', priceBdt: '', period: 'one-time', strikeBdt: '', features: '', icon: 'flag', featured: false };

export function Products() {
  return <SuperOnly><ProductsInner /></SuperOnly>;
}

function ProductsInner() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);

  const reload = () => {
    setLoading(true);
    adminApi.products().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!draft.slug || !draft.name || !draft.priceBdt) { alert('Slug, name and price required'); return; }
    await adminApi.createProduct({
      ...draft,
      priceBdt: Number(draft.priceBdt),
      strikeBdt: draft.strikeBdt ? Number(draft.strikeBdt) : null,
      features: draft.features ? draft.features.split('\n').map((s) => s.trim()).filter(Boolean) : [],
    });
    setOpen(false); setDraft(EMPTY); reload();
  };
  const remove = async (id, name) => {
    if (!confirm(`Delete product "${name}"?`)) return;
    await adminApi.deleteProduct(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Products</h1>
          <p className="ec-admin-sub">{products.length} products · superadmin only</p>
        </div>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)}>+ Add product</button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={products}
          empty="No products yet"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'slug', label: 'Slug' },
            { key: 'priceBdt', label: 'Price', render: (p) => `৳${p.priceBdt.toLocaleString()}` },
            { key: 'period', label: 'Period' },
            { key: 'featured', label: 'Featured', render: (p) => p.featured ? '⭐' : '—' },
            { key: 'actions', label: '', render: (p) => <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(p.id, p.name)}>Delete</button> },
          ]}
        />
      </div>

      {open && (
        <AdminModal title="Add product" onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Save</button>
            </>
          }>
          <Field label="Name"><TextInput value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} /></Field>
          <Field label="Slug"><TextInput value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} /></Field>
          <Field label="Tagline"><TextInput value={draft.tagline} onChange={(v) => setDraft({ ...draft, tagline: v })} /></Field>
          <Field label="Type">
            <Select value={draft.type} onChange={(v) => setDraft({ ...draft, type: v })} options={[
              { value: 'one_time', label: 'One-time purchase' },
              { value: 'subscription', label: 'Subscription' },
              { value: 'ielts_mock', label: 'IELTS mock' },
              { value: 'sat_mock', label: 'SAT mock' },
              { value: 'pte_mock', label: 'PTE mock' },
            ]} />
          </Field>
          <Field label="Price (BDT)"><NumInput value={draft.priceBdt} onChange={(v) => setDraft({ ...draft, priceBdt: v })} /></Field>
          <Field label="Strike price (optional)"><NumInput value={draft.strikeBdt} onChange={(v) => setDraft({ ...draft, strikeBdt: v })} /></Field>
          <Field label="Period"><TextInput value={draft.period} onChange={(v) => setDraft({ ...draft, period: v })} /></Field>
          <Field label="Features (one per line)"><TextArea value={draft.features} onChange={(v) => setDraft({ ...draft, features: v })} /></Field>
          <Field label="Featured?">
            <Select value={draft.featured ? 'yes' : 'no'} onChange={(v) => setDraft({ ...draft, featured: v === 'yes' })}
              options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes — Popular badge' }]} />
          </Field>
        </AdminModal>
      )}
    </>
  );
}
