import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, TextArea, Select } from './Field';
import { useAdminMutation } from './useAdminMutation';

const EMPTY = { title: '', body: '', audienceTier: 'all', expiresAt: '' };

export function Announcements() {
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
      .announcements()
      .then((r) => setRows(Array.isArray(r) ? r : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  const validate = () => {
    const errs = {};
    if (!draft.title?.trim()) errs.title = 'Title required';
    else if (draft.title.length > 140) errs.title = 'Keep title under 140 chars';
    if (!draft.body?.trim()) errs.body = 'Body required';
    else if (draft.body.length > 2000) errs.body = 'Body is too long (max 2000)';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    run(
      () =>
        adminApi.createAnnouncement({
          ...draft,
          expiresAt: draft.expiresAt || null,
        }),
      { audit: 'announcement.create', label: 'Announcement published' }
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
    run(() => adminApi.deleteAnnouncement(target.id), {
      audit: 'announcement.delete',
      label: 'Announcement deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Announcements</h1>
          <p className="ec-admin-sub">
            {rows.length} announcements · visible to targeted tiers
          </p>
        </div>
        <button
          className="ec-admin-btn ec-admin-btn--lime"
          onClick={() => {
            setOpen(true);
            setFieldErrors({});
          }}
        >
          + New announcement
        </button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={rows}
          empty="No announcements yet"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'audienceTier', label: 'Audience' },
            {
              key: 'active',
              label: 'Active',
              render: (a) => (a.active ? '✅' : '⏸'),
            },
            {
              key: 'createdAt',
              label: 'Created',
              render: (a) =>
                a.createdAt
                  ? new Date(a.createdAt).toLocaleDateString()
                  : '—',
            },
            {
              key: 'actions',
              label: '',
              render: (a) => (
                <button
                  className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                  onClick={() => setConfirmDelete(a)}
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
          title="New announcement"
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
                {mutating ? 'Publishing…' : 'Publish'}
              </button>
            </>
          }
        >
          <Field label="Title" error={fieldErrors.title}>
            <TextInput
              value={draft.title}
              onChange={(v) => setDraft({ ...draft, title: v })}
              maxLength={140}
            />
          </Field>
          <Field label="Body" error={fieldErrors.body}>
            <TextArea
              value={draft.body}
              onChange={(v) => setDraft({ ...draft, body: v })}
              rows={5}
              maxLength={2000}
            />
          </Field>
          <Field label="Audience">
            <Select
              value={draft.audienceTier}
              onChange={(v) => setDraft({ ...draft, audienceTier: v })}
              options={[
                { value: 'all', label: 'Everyone' },
                { value: 'premium', label: 'Premium only' },
                { value: 'free', label: 'Free users only' },
                { value: 'guest', label: 'Guests only' },
              ]}
            />
          </Field>
          <Field label="Expires at (optional)">
            <TextInput
              type="date"
              value={draft.expiresAt}
              onChange={(v) => setDraft({ ...draft, expiresAt: v })}
            />
          </Field>
        </AdminModal>
      )}

      {confirmDelete && (
        <AdminModal
          title="Delete announcement?"
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
            Delete <strong>{confirmDelete.title}</strong>?
          </p>
        </AdminModal>
      )}
    </>
  );
}