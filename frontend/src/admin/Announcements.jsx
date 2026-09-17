import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, TextArea, Select } from './Field';
import { SuperOnly } from './SuperOnly';

const EMPTY = { title: '', body: '', audienceTier: 'all', expiresAt: '' };

export function Announcements() {
  return <SuperOnly><AnnouncementsInner /></SuperOnly>;
}

function AnnouncementsInner() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);

  const reload = () => {
    setLoading(true);
    adminApi.announcements().then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!draft.title || !draft.body) { alert('Title and body required'); return; }
    await adminApi.createAnnouncement({ ...draft, expiresAt: draft.expiresAt || null });
    setOpen(false); setDraft(EMPTY); reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    await adminApi.deleteAnnouncement(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Announcements</h1>
          <p className="ec-admin-sub">Push banners and notifications to users</p>
        </div>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)}>+ New announcement</button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={rows}
          empty="No announcements yet"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'audienceTier', label: 'Audience' },
            { key: 'active', label: 'Active', render: (a) => a.active ? '✅' : '⏸' },
            { key: 'createdAt', label: 'Created', render: (a) => new Date(a.createdAt).toLocaleDateString() },
            { key: 'actions', label: '', render: (a) => <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(a.id)}>Delete</button> },
          ]}
        />
      </div>

      {open && (
        <AdminModal title="New announcement" onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Publish</button>
            </>
          }>
          <Field label="Title"><TextInput value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} /></Field>
          <Field label="Body"><TextArea value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} /></Field>
          <Field label="Audience">
            <Select value={draft.audienceTier} onChange={(v) => setDraft({ ...draft, audienceTier: v })} options={[
              { value: 'all', label: 'Everyone' },
              { value: 'premium', label: 'Premium only' },
              { value: 'free', label: 'Free users only' },
              { value: 'guest', label: 'Guests only' },
            ]} />
          </Field>
          <Field label="Expires at (optional)"><TextInput type="date" value={draft.expiresAt} onChange={(v) => setDraft({ ...draft, expiresAt: v })} /></Field>
        </AdminModal>
      )}
    </>
  );
}
