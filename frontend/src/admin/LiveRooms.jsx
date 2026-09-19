import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, Select } from './Field';
import { useAdminMutation } from './useAdminMutation';

const EMPTY = {
  title: '',
  level: 'IELTS',
  durationMins: 60,
  maxSeats: 100,
  scheduledAt: '',
  meetProvider: 'google_meet',
  meetLink: '',
};

const SAFE_STATUS = ['scheduled', 'lobby', 'live', 'ended'];

const MEET_URL_REGEX =
  /^https:\/\/(meet\.google\.com|[\w.-]*zoom\.us|teams\.microsoft\.com)\/.+/i;

export function LiveRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { run, loading: mutating } = useAdminMutation();

  const reload = () => {
    setLoading(true);
    adminApi
      .liveRooms()
      .then((r) => setRooms(Array.isArray(r) ? r : []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  const validate = () => {
    const errs = {};
    if (!draft.title?.trim()) errs.title = 'Title required';
    if (draft.meetLink && !MEET_URL_REGEX.test(draft.meetLink))
      errs.meetLink = 'Must be a Google Meet, Zoom, or Teams URL';
    if (!draft.durationMins || Number(draft.durationMins) < 5)
      errs.durationMins = 'Min 5 minutes';
    if (!draft.maxSeats || Number(draft.maxSeats) < 1)
      errs.maxSeats = 'At least 1 seat';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    run(
      () =>
        adminApi.createLiveRoom({
          ...draft,
          durationMins: Number(draft.durationMins),
          maxSeats: Number(draft.maxSeats),
          scheduledAt: draft.scheduledAt || null,
          meetLink: draft.meetLink || null,
        }),
      { audit: 'liveRoom.create', label: 'Room created' }
    ).then(() => {
      setOpen(false);
      setDraft(EMPTY);
      setFieldErrors({});
      reload();
    });
  };

  const setStatus = (id, status) => {
    if (!SAFE_STATUS.includes(status)) return;
    run(() => adminApi.updateLiveRoom(id, { status }), {
      audit: 'liveRoom.status',
      label: 'Status updated',
    })
      .then(reload)
      .catch(() => reload());
  };

  const copyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      window.dispatchEvent(
        new CustomEvent('admin:toast', {
          detail: { type: 'success', message: 'Link copied' },
        })
      );
    } catch {
      window.dispatchEvent(
        new CustomEvent('admin:toast', {
          detail: { type: 'error', message: 'Could not copy link' },
        })
      );
    }
  };

  const doDelete = () => {
    const target = confirmDelete;
    if (!target) return;
    setConfirmDelete(null);
    run(() => adminApi.deleteLiveRoom(target.id), {
      audit: 'liveRoom.delete',
      label: 'Room deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Live Rooms</h1>
          <p className="ec-admin-sub">
            {rooms.length} rooms · schedule sessions, share Google Meet / Zoom / Teams links
          </p>
        </div>
        <button
          className="ec-admin-btn ec-admin-btn--lime"
          onClick={() => {
            setOpen(true);
            setFieldErrors({});
          }}
        >
          + Schedule room
        </button>
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
              key: 'status',
              label: 'Status',
              render: (r) => (
                <select
                  className="ec-admin-select ec-admin-select--inline"
                  value={r.status}
                  disabled={mutating}
                  onChange={(e) => setStatus(r.id, e.target.value)}
                >
                  {SAFE_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              key: 'meetLink',
              label: 'Meeting link',
              render: (r) =>
                r.meetLink ? (
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                    <a
                      href={r.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ec-admin-btn ec-admin-btn--sm"
                    >
                      Open
                    </a>
                    <button
                      className="ec-admin-btn ec-admin-btn--ghost ec-admin-btn--sm"
                      onClick={() => copyLink(r.meetLink)}
                    >
                      Copy
                    </button>
                  </span>
                ) : (
                  <span className="ec-admin-muted">—</span>
                ),
            },
            {
              key: 'durationMins',
              label: 'Duration',
              render: (r) => `${r.durationMins} min`,
            },
            {
              key: 'participants',
              label: 'Seats',
              render: (r) => `${r.participants ?? 0} / ${r.maxSeats}`,
            },
            {
              key: 'actions',
              label: '',
              render: (r) => (
                <button
                  className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                  onClick={() => setConfirmDelete(r)}
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
          title="Schedule a live room"
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
                {mutating ? 'Creating…' : 'Create'}
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
          <Field label="Level">
            <Select
              value={draft.level}
              onChange={(v) => setDraft({ ...draft, level: v })}
              options={[
                { value: 'IELTS', label: 'IELTS' },
                { value: 'SAT', label: 'SAT' },
                { value: 'PTE', label: 'PTE' },
                { value: 'Speaking', label: 'Speaking' },
                { value: 'General', label: 'General' },
              ]}
            />
          </Field>
          <Field label="Meeting provider">
            <Select
              value={draft.meetProvider}
              onChange={(v) => setDraft({ ...draft, meetProvider: v })}
              options={[
                { value: 'google_meet', label: 'Google Meet' },
                { value: 'zoom', label: 'Zoom' },
                { value: 'teams', label: 'Microsoft Teams' },
              ]}
            />
          </Field>
          <Field
            label="Meeting link"
            hint="Learners get a Join button with this link. Leave blank to use the in-app classroom."
            error={fieldErrors.meetLink}
          >
            <TextInput
              value={draft.meetLink}
              onChange={(v) => setDraft({ ...draft, meetLink: v })}
              placeholder="https://meet.google.com/abc-defg-hij"
              maxLength={500}
            />
          </Field>
          <Field label="Duration (minutes)" error={fieldErrors.durationMins}>
            <NumInput
              value={draft.durationMins}
              onChange={(v) => setDraft({ ...draft, durationMins: v })}
              min={5}
            />
          </Field>
          <Field label="Max seats" error={fieldErrors.maxSeats}>
            <NumInput
              value={draft.maxSeats}
              onChange={(v) => setDraft({ ...draft, maxSeats: v })}
              min={1}
            />
          </Field>
          <Field label="Scheduled at (optional)">
            <TextInput
              type="datetime-local"
              value={draft.scheduledAt}
              onChange={(v) => setDraft({ ...draft, scheduledAt: v })}
            />
          </Field>
        </AdminModal>
      )}

      {confirmDelete && (
        <AdminModal
          title="Delete live room?"
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
            Delete <strong>{confirmDelete.title}</strong>? Anyone in the room will be
            disconnected.
          </p>
        </AdminModal>
      )}
    </>
  );
}