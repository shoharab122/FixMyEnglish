import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, Select } from './Field';

const EMPTY = { title: '', level: 'IELTS', durationMins: 60, maxSeats: 100, scheduledAt: '' };

export function LiveRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);

  const reload = () => {
    setLoading(true);
    adminApi.liveRooms().then(setRooms).catch(() => setRooms([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!draft.title) { alert('Title required'); return; }
    await adminApi.createLiveRoom({
      ...draft,
      durationMins: Number(draft.durationMins) || 60,
      maxSeats: Number(draft.maxSeats) || 100,
    });
    setOpen(false); setDraft(EMPTY); reload();
  };
  const setStatus = async (id, status) => { await adminApi.updateLiveRoom(id, { status }); reload(); };
  const remove = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await adminApi.deleteLiveRoom(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Live Rooms</h1>
          <p className="ec-admin-sub">{rooms.length} rooms · schedule & monitor live sessions</p>
        </div>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)}>+ Schedule room</button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={rooms}
          empty="No rooms yet"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'level', label: 'Level' },
            {
              key: 'status', label: 'Status', render: (r) => (
                <select className="ec-admin-select" style={{ fontSize: 11, padding: '5px 8px', minWidth: 110 }} value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}>
                  <option value="scheduled">scheduled</option>
                  <option value="lobby">lobby</option>
                  <option value="live">live</option>
                  <option value="ended">ended</option>
                </select>
              ),
            },
            { key: 'durationMins', label: 'Duration', render: (r) => `${r.durationMins} min` },
            { key: 'participants', label: 'Seats', render: (r) => `${r.participants} / ${r.maxSeats}` },
            { key: 'actions', label: '', render: (r) => <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(r.id, r.title)}>Delete</button> },
          ]}
        />
      </div>

      {open && (
        <AdminModal title="Schedule a live room" onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Create</button>
            </>
          }>
          <Field label="Title"><TextInput value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} /></Field>
          <Field label="Level">
            <Select value={draft.level} onChange={(v) => setDraft({ ...draft, level: v })} options={[
              { value: 'IELTS', label: 'IELTS' }, { value: 'SAT', label: 'SAT' },
              { value: 'PTE', label: 'PTE' }, { value: 'Speaking', label: 'Speaking' },
              { value: 'General', label: 'General' },
            ]} />
          </Field>
          <Field label="Duration (minutes)"><NumInput value={draft.durationMins} onChange={(v) => setDraft({ ...draft, durationMins: v })} /></Field>
          <Field label="Max seats"><NumInput value={draft.maxSeats} onChange={(v) => setDraft({ ...draft, maxSeats: v })} /></Field>
          <Field label="Scheduled at (optional)"><TextInput type="datetime-local" value={draft.scheduledAt} onChange={(v) => setDraft({ ...draft, scheduledAt: v })} /></Field>
        </AdminModal>
      )}
    </>
  );
}
