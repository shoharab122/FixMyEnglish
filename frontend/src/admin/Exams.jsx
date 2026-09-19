import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, Select } from './Field';
import { useAdminMutation } from './useAdminMutation';

export function Exams() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTrack, setOpenTrack] = useState(false);
  const [openSet, setOpenSet] = useState(null);
  const [openQ, setOpenQ] = useState(null);
  const [confirmDeleteTrack, setConfirmDeleteTrack] = useState(null);
  const [confirmDeleteSet, setConfirmDeleteSet] = useState(null);

  const [trackDraft, setTrackDraft] = useState({ slug: '', name: '', icon: 'flag' });
  const [setDraft, setSetDraft] = useState({
    title: '',
    section: 'Reading',
    durationMinutes: 60,
    isPremium: false,
  });
  const [qDraft, setQDraft] = useState({
    prompt: '',
    options: '',
    correctAnswer: '',
    orderIndex: 0,
    points: 1,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const { run, loading: mutating } = useAdminMutation();

  const reload = () => {
    setLoading(true);
    adminApi
      .examTracks()
      .then((r) => setTracks(Array.isArray(r) ? r : []))
      .catch(() => setTracks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  const saveTrack = () => {
    const errs = {};
    if (!/^[a-z0-9-]{2,40}$/.test(trackDraft.slug || ''))
      errs.slug = 'Slug must be lowercase a-z/0-9/dashes';
    if (!trackDraft.name?.trim()) errs.name = 'Name required';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    run(() => adminApi.createExamTrack(trackDraft), {
      audit: 'exam.track.create',
      label: 'Track created',
    }).then(() => {
      setOpenTrack(false);
      setTrackDraft({ slug: '', name: '', icon: 'flag' });
      setFieldErrors({});
      reload();
    });
  };

  const saveSet = () => {
    const errs = {};
    if (!setDraft.title?.trim()) errs.title = 'Title required';
    if (!setDraft.durationMinutes || Number(setDraft.durationMinutes) < 1)
      errs.durationMinutes = 'Min 1 minute';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    run(
      () =>
        adminApi.createExamSet({
          trackId: openSet,
          ...setDraft,
          durationMinutes: Number(setDraft.durationMinutes),
        }),
      { audit: 'exam.set.create', label: 'Set added' }
    ).then(() => {
      setOpenSet(null);
      setSetDraft({
        title: '',
        section: 'Reading',
        durationMinutes: 60,
        isPremium: false,
      });
      setFieldErrors({});
      reload();
    });
  };

  const saveQ = () => {
    const errs = {};
    const opts = qDraft.options.split('|').map((s) => s.trim()).filter(Boolean);
    if (!qDraft.prompt?.trim()) errs.prompt = 'Prompt required';
    if (opts.length < 2) errs.options = 'At least 2 options';
    if (!qDraft.correctAnswer?.trim()) errs.correctAnswer = 'Answer required';
    else if (!opts.includes(qDraft.correctAnswer.trim()))
      errs.correctAnswer = 'Answer must match an option';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    run(
      () =>
        adminApi.createExamQuestion({
          examSetId: openQ,
          prompt: qDraft.prompt,
          options: opts,
          correctAnswer: qDraft.correctAnswer.trim(),
          orderIndex: Number(qDraft.orderIndex) || 0,
          points: Number(qDraft.points) || 1,
        }),
      { audit: 'exam.question.create', label: 'Question added' }
    ).then(() => {
      setOpenQ(null);
      setQDraft({
        prompt: '',
        options: '',
        correctAnswer: '',
        orderIndex: 0,
        points: 1,
      });
      setFieldErrors({});
    });
  };

  const doDeleteTrack = () => {
    const target = confirmDeleteTrack;
    if (!target) return;
    setConfirmDeleteTrack(null);
    run(() => adminApi.deleteExamTrack(target.id), {
      audit: 'exam.track.delete',
      label: 'Track deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  const doDeleteSet = () => {
    const target = confirmDeleteSet;
    if (!target) return;
    setConfirmDeleteSet(null);
    run(() => adminApi.deleteExamSet(target.id), {
      audit: 'exam.set.delete',
      label: 'Set deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Exam Tracks</h1>
          <p className="ec-admin-sub">IELTS · SAT · PTE tracks and question sets</p>
        </div>
        <button
          className="ec-admin-btn ec-admin-btn--lime"
          onClick={() => {
            setOpenTrack(true);
            setFieldErrors({});
          }}
        >
          + Add track
        </button>
      </div>

      {loading ? (
        <div className="ec-admin-loading">Loading…</div>
      ) : tracks.length === 0 ? (
        <div className="ec-admin-empty">No tracks yet</div>
      ) : (
        tracks.map((t) => (
          <div key={t.id} className="ec-admin-card">
            <h2>
              <span>
                🚩 {t.name}{' '}
                <span className="ec-admin-badge ec-admin-badge--purple">{t.slug}</span>
              </span>
              <span style={{ display: 'flex', gap: 8 }}>
                <button
                  className="ec-admin-btn ec-admin-btn--lime ec-admin-btn--sm"
                  onClick={() => {
                    setOpenSet(t.id);
                    setFieldErrors({});
                  }}
                >
                  + Set
                </button>
                <button
                  className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                  onClick={() => setConfirmDeleteTrack(t)}
                >
                  Delete track
                </button>
              </span>
            </h2>

            <AdminTable
              rows={t.sets || []}
              loading={false}
              empty="No sets yet"
              columns={[
                { key: 'section', label: 'Section' },
                { key: 'title', label: 'Title' },
                { key: 'durationMinutes', label: 'Mins' },
                {
                  key: 'isPremium',
                  label: 'Premium',
                  render: (s) => (s.isPremium ? '✅' : '—'),
                },
                { key: 'questionCount', label: 'Questions' },
                {
                  key: 'actions',
                  label: '',
                  render: (s) => (
                    <span style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="ec-admin-btn ec-admin-btn--purple ec-admin-btn--sm"
                        onClick={() => {
                          setOpenQ(s.id);
                          setFieldErrors({});
                        }}
                      >
                        + Q
                      </button>
                      <button
                        className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                        onClick={() => setConfirmDeleteSet(s)}
                      >
                        Delete
                      </button>
                    </span>
                  ),
                },
              ]}
            />
          </div>
        ))
      )}

      {openTrack && (
        <AdminModal
          title="Add exam track"
          onClose={() => setOpenTrack(false)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setOpenTrack(false)}
              >
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--lime"
                onClick={saveTrack}
                disabled={mutating}
              >
                {mutating ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <Field label="Name" error={fieldErrors.name}>
            <TextInput
              value={trackDraft.name}
              onChange={(v) => setTrackDraft({ ...trackDraft, name: v })}
              maxLength={60}
            />
          </Field>
          <Field label="Slug (e.g. ielts)" error={fieldErrors.slug}>
            <TextInput
              value={trackDraft.slug}
              onChange={(v) =>
                setTrackDraft({
                  ...trackDraft,
                  slug: v.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                })
              }
              maxLength={40}
            />
          </Field>
          <Field label="Icon">
            <TextInput
              value={trackDraft.icon}
              onChange={(v) => setTrackDraft({ ...trackDraft, icon: v })}
              maxLength={40}
            />
          </Field>
        </AdminModal>
      )}

      {openSet && (
        <AdminModal
          title="Add exam set"
          onClose={() => setOpenSet(null)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setOpenSet(null)}
              >
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--lime"
                onClick={saveSet}
                disabled={mutating}
              >
                {mutating ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <Field label="Title" error={fieldErrors.title}>
            <TextInput
              value={setDraft.title}
              onChange={(v) => setSetDraft({ ...setDraft, title: v })}
              maxLength={120}
            />
          </Field>
          <Field label="Section">
            <TextInput
              value={setDraft.section}
              onChange={(v) => setSetDraft({ ...setDraft, section: v })}
              maxLength={40}
            />
          </Field>
          <Field label="Duration (minutes)" error={fieldErrors.durationMinutes}>
            <NumInput
              value={setDraft.durationMinutes}
              onChange={(v) => setSetDraft({ ...setDraft, durationMinutes: v })}
              min={1}
            />
          </Field>
          <Field label="Premium only?">
            <Select
              value={setDraft.isPremium ? 'yes' : 'no'}
              onChange={(v) =>
                setSetDraft({ ...setDraft, isPremium: v === 'yes' })
              }
              options={[
                { value: 'no', label: 'No — free' },
                { value: 'yes', label: 'Yes — premium' },
              ]}
            />
          </Field>
        </AdminModal>
      )}

      {openQ && (
        <AdminModal
          title="Add exam question"
          onClose={() => setOpenQ(null)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setOpenQ(null)}
              >
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--lime"
                onClick={saveQ}
                disabled={mutating}
              >
                {mutating ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <Field label="Prompt" error={fieldErrors.prompt}>
            <TextInput
              value={qDraft.prompt}
              onChange={(v) => setQDraft({ ...qDraft, prompt: v })}
              maxLength={500}
            />
          </Field>
          <Field
            label="Options (separate with |)"
            hint="e.g. A | B | C | D"
            error={fieldErrors.options}
          >
            <TextInput
              value={qDraft.options}
              onChange={(v) => setQDraft({ ...qDraft, options: v })}
              maxLength={500}
            />
          </Field>
          <Field label="Correct answer" error={fieldErrors.correctAnswer}>
            <TextInput
              value={qDraft.correctAnswer}
              onChange={(v) => setQDraft({ ...qDraft, correctAnswer: v })}
              maxLength={200}
            />
          </Field>
          <Field label="Order index">
            <NumInput
              value={qDraft.orderIndex}
              onChange={(v) => setQDraft({ ...qDraft, orderIndex: v })}
              min={0}
            />
          </Field>
          <Field label="Points">
            <NumInput
              value={qDraft.points}
              onChange={(v) => setQDraft({ ...qDraft, points: v })}
              min={1}
            />
          </Field>
        </AdminModal>
      )}

      {confirmDeleteTrack && (
        <AdminModal
          title="Delete track?"
          onClose={() => setConfirmDeleteTrack(null)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setConfirmDeleteTrack(null)}
              >
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--danger"
                onClick={doDeleteTrack}
              >
                Delete
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
            Delete <strong>{confirmDeleteTrack.name}</strong> and all its sets?
          </p>
        </AdminModal>
      )}

      {confirmDeleteSet && (
        <AdminModal
          title="Delete set?"
          onClose={() => setConfirmDeleteSet(null)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setConfirmDeleteSet(null)}
              >
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--danger"
                onClick={doDeleteSet}
              >
                Delete
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
            Delete <strong>{confirmDeleteSet.title}</strong>?
          </p>
        </AdminModal>
      )}
    </>
  );
}