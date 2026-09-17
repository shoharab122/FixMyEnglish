import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, Select } from './Field';

export function Exams() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTrack, setOpenTrack] = useState(false);
  const [openSet, setOpenSet] = useState(null); // trackId
  const [openQ, setOpenQ] = useState(null);    // setId
  const [trackDraft, setTrackDraft] = useState({ slug: '', name: '', icon: 'flag' });
  const [setDraft, setSetDraft] = useState({ title: '', section: 'Reading', durationMinutes: 60, isPremium: false });
  const [qDraft, setQDraft] = useState({ prompt: '', options: '', correctAnswer: '', orderIndex: 0, points: 1 });

  const reload = () => {
    setLoading(true);
    adminApi.examTracks().then(setTracks).catch(() => setTracks([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const saveTrack = async () => {
    if (!trackDraft.slug || !trackDraft.name) { alert('Slug and name required'); return; }
    await adminApi.createExamTrack(trackDraft);
    setOpenTrack(false); setTrackDraft({ slug: '', name: '', icon: 'flag' }); reload();
  };
  const saveSet = async () => {
    if (!setDraft.title) { alert('Title required'); return; }
    await adminApi.createExamSet({ trackId: openSet, ...setDraft });
    setOpenSet(null); setSetDraft({ title: '', section: 'Reading', durationMinutes: 60, isPremium: false }); reload();
  };
  const saveQ = async () => {
    if (!qDraft.prompt || !qDraft.options || !qDraft.correctAnswer) { alert('Fill all fields'); return; }
    await adminApi.createExamQuestion({
      examSetId: openQ, prompt: qDraft.prompt,
      options: qDraft.options.split('|').map((s) => s.trim()),
      correctAnswer: qDraft.correctAnswer,
      orderIndex: Number(qDraft.orderIndex) || 0,
      points: Number(qDraft.points) || 1,
    });
    setOpenQ(null); setQDraft({ prompt: '', options: '', correctAnswer: '', orderIndex: 0, points: 1 });
  };
  const removeTrack = async (id, name) => {
    if (!confirm(`Delete "${name}" and all its sets?`)) return;
    await adminApi.deleteExamTrack(id); reload();
  };
  const removeSet = async (id) => {
    if (!confirm('Delete this set?')) return;
    await adminApi.deleteExamSet(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Exams</h1>
          <p className="ec-admin-sub">IELTS · SAT · PTE tracks and question sets</p>
        </div>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpenTrack(true)}>+ Add track</button>
      </div>

      {loading ? <div className="ec-admin-loading">Loading…</div> : tracks.map((t) => (
        <div key={t.id} className="ec-admin-card">
          <h2>
            <span>🚩 {t.name} <span className="ec-admin-badge ec-admin-badge--purple">{t.slug}</span></span>
            <span style={{ display: 'flex', gap: 8 }}>
              <button className="ec-admin-btn ec-admin-btn--lime ec-admin-btn--sm" onClick={() => setOpenSet(t.id)}>+ Set</button>
              <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => removeTrack(t.id, t.name)}>Delete track</button>
            </span>
          </h2>
          <AdminTable
            rows={t.sets}
            loading={false}
            empty="No sets yet"
            columns={[
              { key: 'section', label: 'Section' },
              { key: 'title', label: 'Title' },
              { key: 'durationMinutes', label: 'Mins' },
              { key: 'isPremium', label: 'Premium', render: (s) => s.isPremium ? '✅' : '—' },
              { key: 'questionCount', label: 'Questions' },
              {
                key: 'actions', label: '', render: (s) => (
                  <span style={{ display: 'flex', gap: 6 }}>
                    <button className="ec-admin-btn ec-admin-btn--purple ec-admin-btn--sm" onClick={() => setOpenQ(s.id)}>+ Q</button>
                    <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => removeSet(s.id)}>Delete</button>
                  </span>
                ),
              },
            ]}
          />
        </div>
      ))}

      {openTrack && (
        <AdminModal title="Add exam track" onClose={() => setOpenTrack(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpenTrack(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={saveTrack}>Save</button>
            </>
          }>
          <Field label="Name"><TextInput value={trackDraft.name} onChange={(v) => setTrackDraft({ ...trackDraft, name: v })} /></Field>
          <Field label="Slug (e.g. ielts)"><TextInput value={trackDraft.slug} onChange={(v) => setTrackDraft({ ...trackDraft, slug: v })} /></Field>
          <Field label="Icon"><TextInput value={trackDraft.icon} onChange={(v) => setTrackDraft({ ...trackDraft, icon: v })} /></Field>
        </AdminModal>
      )}

      {openSet && (
        <AdminModal title="Add exam set" onClose={() => setOpenSet(null)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpenSet(null)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={saveSet}>Save</button>
            </>
          }>
          <Field label="Title"><TextInput value={setDraft.title} onChange={(v) => setSetDraft({ ...setDraft, title: v })} /></Field>
          <Field label="Section"><TextInput value={setDraft.section} onChange={(v) => setSetDraft({ ...setDraft, section: v })} /></Field>
          <Field label="Duration (minutes)"><NumInput value={setDraft.durationMinutes} onChange={(v) => setSetDraft({ ...setDraft, durationMinutes: v })} /></Field>
          <Field label="Premium only?">
            <Select value={setDraft.isPremium ? 'yes' : 'no'} onChange={(v) => setSetDraft({ ...setDraft, isPremium: v === 'yes' })}
              options={[{ value: 'no', label: 'No — free' }, { value: 'yes', label: 'Yes — premium' }]} />
          </Field>
        </AdminModal>
      )}

      {openQ && (
        <AdminModal title="Add exam question" onClose={() => setOpenQ(null)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpenQ(null)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={saveQ}>Save</button>
            </>
          }>
          <Field label="Prompt"><TextInput value={qDraft.prompt} onChange={(v) => setQDraft({ ...qDraft, prompt: v })} /></Field>
          <Field label="Options (separate with |)"><TextInput placeholder="A | B | C | D" value={qDraft.options} onChange={(v) => setQDraft({ ...qDraft, options: v })} /></Field>
          <Field label="Correct answer"><TextInput value={qDraft.correctAnswer} onChange={(v) => setQDraft({ ...qDraft, correctAnswer: v })} /></Field>
          <Field label="Order index"><NumInput value={qDraft.orderIndex} onChange={(v) => setQDraft({ ...qDraft, orderIndex: v })} /></Field>
          <Field label="Points"><NumInput value={qDraft.points} onChange={(v) => setQDraft({ ...qDraft, points: v })} /></Field>
        </AdminModal>
      )}
    </>
  );
}
