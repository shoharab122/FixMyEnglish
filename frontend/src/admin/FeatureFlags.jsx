import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, Select } from './Field';
import { useAdminMutation } from './useAdminMutation';

const EMPTY = { key: '', enabled: true, tierScope: 'all' };
const SAFE_TIERS = ['all', 'premium', 'free', 'guest'];

export function FeatureFlags() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { run, loading: mutating } = useAdminMutation();

  const reload = () => {
    setLoading(true);
    adminApi
      .featureFlags()
      .then((r) => setRows(Array.isArray(r) ? r : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  const validate = () => {
    const errs = {};
    if (!/^[a-z0-9_.-]{2,60}$/.test(draft.key || ''))
      errs.key = 'Key must be lowercase a-z/0-9/._- (2–60)';
    if (!SAFE_TIERS.includes(draft.tierScope)) errs.tierScope = 'Invalid tier';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    run(() => adminApi.upsertFeatureFlag(draft), {
      audit: 'flag.upsert',
      label: 'Flag saved',
    }).then(() => {
      setOpen(false);
      setDraft(EMPTY);
      setFieldErrors({});
      reload();
    });
  };

  const toggle = (flag) => {
    run(
      () =>
        adminApi.upsertFeatureFlag({
          key: flag.key,
          enabled: !flag.enabled,
          tierScope: flag.tierScope,
        }),
      {
        audit: 'flag.toggle',
        label: `Flag ${flag.enabled ? 'disabled' : 'enabled'}`,
      }
    )
      .then(reload)
      .catch(() => reload());
  };

  const doDelete = () => {
    const target = confirmDelete;
    if (!target) return;
    setConfirmDelete(null);
    run(() => adminApi.deleteFeatureFlag(target.id), {
      audit: 'flag.delete',
      label: 'Flag deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Feature Flags</h1>
          <p className="ec-admin-sub">{rows.length} flags · toggle features per tier</p>
        </div>
        <button
          className="ec-admin-btn ec-admin-btn--lime"
          onClick={() => {
            setOpen(true);
            setFieldErrors({});
          }}
        >
          + Add flag
        </button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={rows}
          empty="No flags yet"
          columns={[
            { key: 'key', label: 'Key', render: (r) => <strong>{r.key}</strong> },
            {
              key: 'enabled',
              label: 'Enabled',
              render: (r) => (r.enabled ? '✅ on' : '⏸ off'),
            },
            { key: 'tierScope', label: 'Tier' },
            {
              key: 'actions',
              label: '',
              render: (r) => (
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    className="ec-admin-btn ec-admin-btn--sm"
                    disabled={mutating}
                    onClick={() => toggle(r)}
                  >
                    {r.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                    onClick={() => setConfirmDelete(r)}
                  >
                    Delete
                  </button>
                </span>
              ),
            },
          ]}
        />
      </div>

      {open && (
        <AdminModal
          title="Add / update feature flag"
          onClose={() => setOpen(false)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setOpen(false)}
              >
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
          <Field label="Key (e.g. ai_speaking)" error={fieldErrors.key}>
            <TextInput
              value={draft.key}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  key: v.toLowerCase().replace(/[^a-z0-9_.-]/g, ''),
                })
              }
              maxLength={60}
            />
          </Field>
          <Field label="Enabled">
            <Select
              value={draft.enabled ? 'yes' : 'no'}
              onChange={(v) => setDraft({ ...draft, enabled: v === 'yes' })}
              options={[
                { value: 'yes', label: 'Enabled' },
                { value: 'no', label: 'Disabled' },
              ]}
            />
          </Field>
          <Field label="Tier scope" error={fieldErrors.tierScope}>
            <Select
              value={draft.tierScope}
              onChange={(v) => setDraft({ ...draft, tierScope: v })}
              options={[
                { value: 'all', label: 'All users' },
                { value: 'premium', label: 'Premium only' },
                { value: 'free', label: 'Free only' },
                { value: 'guest', label: 'Guests only' },
              ]}
            />
          </Field>
        </AdminModal>
      )}

      {confirmDelete && (
        <AdminModal
          title="Delete feature flag?"
          onClose={() => setConfirmDelete(null)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--danger"
                onClick={doDelete}
              >
                Delete
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
            Delete flag <strong>{confirmDelete.key}</strong>?
          </p>
        </AdminModal>
      )}
    </>
  );
}