import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, Select } from './Field';
import { SuperOnly } from './SuperOnly';

const EMPTY = { key: '', enabled: true, tierScope: 'all' };

export function FeatureFlags() {
  return <SuperOnly><FeatureFlagsInner /></SuperOnly>;
}

function FeatureFlagsInner() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);

  const reload = () => {
    setLoading(true);
    adminApi.featureFlags().then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!draft.key) { alert('Key required'); return; }
    await adminApi.upsertFeatureFlag(draft);
    setOpen(false); setDraft(EMPTY); reload();
  };
  const toggle = async (flag) => {
    await adminApi.upsertFeatureFlag({ key: flag.key, enabled: !flag.enabled, tierScope: flag.tierScope });
    reload();
  };
  const remove = async (id, key) => {
    if (!confirm(`Delete flag "${key}"?`)) return;
    await adminApi.deleteFeatureFlag(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Feature Flags</h1>
          <p className="ec-admin-sub">{rows.length} flags · toggle features per tier</p>
        </div>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)}>+ Add flag</button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={rows}
          empty="No flags yet"
          columns={[
            { key: 'key', label: 'Key', render: (r) => <strong>{r.key}</strong> },
            { key: 'enabled', label: 'Enabled', render: (r) => r.enabled ? '✅ on' : '⏸ off' },
            { key: 'tierScope', label: 'Tier' },
            {
              key: 'actions', label: '', render: (r) => (
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button className="ec-admin-btn ec-admin-btn--sm" onClick={() => toggle(r)}>{r.enabled ? 'Disable' : 'Enable'}</button>
                  <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(r.id, r.key)}>Delete</button>
                </span>
              ),
            },
          ]}
        />
      </div>

      {open && (
        <AdminModal title="Add / update feature flag" onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Save</button>
            </>
          }>
          <Field label="Key (e.g. ai_speaking)"><TextInput value={draft.key} onChange={(v) => setDraft({ ...draft, key: v })} /></Field>
          <Field label="Enabled">
            <Select value={draft.enabled ? 'yes' : 'no'} onChange={(v) => setDraft({ ...draft, enabled: v === 'yes' })}
              options={[{ value: 'yes', label: 'Enabled' }, { value: 'no', label: 'Disabled' }]} />
          </Field>
          <Field label="Tier scope">
            <Select value={draft.tierScope} onChange={(v) => setDraft({ ...draft, tierScope: v })} options={[
              { value: 'all', label: 'All users' }, { value: 'premium', label: 'Premium only' },
              { value: 'free', label: 'Free only' }, { value: 'guest', label: 'Guests only' },
            ]} />
          </Field>
        </AdminModal>
      )}
    </>
  );
}
