import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, Select } from './Field';

const EMPTY = { classLevel: 'SSC', paper: '1st Paper', board: '', topic: '', tag: 'Grammar', type: 'question_set', body: '', modelAnswer: '', banglaExplain: '' };

export function Curriculum() {
  const [rows, setRows] = useState([]);
  const [cls, setCls] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);

  const reload = () => {
    setLoading(true);
    adminApi.curriculum({ class: cls || undefined, type: type || undefined })
      .then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
  };
  useEffect(reload, [cls, type]);

  const save = async () => {
    if (!draft.classLevel || !draft.topic) { alert('Class and topic required'); return; }
    await adminApi.createCurriculum(draft);
    setOpen(false); setDraft(EMPTY); reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this content?')) return;
    await adminApi.deleteCurriculum(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Curriculum</h1>
          <p className="ec-admin-sub">{rows.length} items · SSC / HSC content bank</p>
        </div>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)}>+ Add content</button>
      </div>

      <div className="ec-admin-toolbar">
        <select className="ec-admin-select" value={cls} onChange={(e) => setCls(e.target.value)}>
          <option value="">All classes</option>
          <option value="SSC">SSC</option>
          <option value="HSC">HSC</option>
        </select>
        <select className="ec-admin-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="question_set">Question set</option>
          <option value="paragraph">Paragraph</option>
          <option value="composition">Composition</option>
          <option value="letter">Letter</option>
          <option value="translation">Translation</option>
        </select>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={rows}
          empty="No content yet"
          columns={[
            { key: 'classLevel', label: 'Class' },
            { key: 'paper', label: 'Paper' },
            { key: 'topic', label: 'Topic' },
            { key: 'tag', label: 'Tag' },
            { key: 'type', label: 'Type' },
            { key: 'actions', label: '', render: (r) => <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(r.id)}>Delete</button> },
          ]}
        />
      </div>

      {open && (
        <AdminModal
          title="Add curriculum content"
          onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Save</button>
            </>
          }
        >
          <Field label="Class">
            <Select value={draft.classLevel} onChange={(v) => setDraft({ ...draft, classLevel: v })} options={[
              { value: 'SSC', label: 'SSC' }, { value: 'HSC', label: 'HSC' },
            ]} />
          </Field>
          <Field label="Paper">
            <Select value={draft.paper} onChange={(v) => setDraft({ ...draft, paper: v })} options={[
              { value: '1st Paper', label: '1st Paper' }, { value: '2nd Paper', label: '2nd Paper' },
            ]} />
          </Field>
          <Field label="Board (optional)"><TextInput value={draft.board} onChange={(v) => setDraft({ ...draft, board: v })} /></Field>
          <Field label="Topic"><TextInput value={draft.topic} onChange={(v) => setDraft({ ...draft, topic: v })} /></Field>
          <Field label="Tag (Reading / Grammar / Writing)"><TextInput value={draft.tag} onChange={(v) => setDraft({ ...draft, tag: v })} /></Field>
          <Field label="Type">
            <Select value={draft.type} onChange={(v) => setDraft({ ...draft, type: v })} options={[
              { value: 'question_set', label: 'Question set' },
              { value: 'paragraph', label: 'Paragraph' },
              { value: 'composition', label: 'Composition' },
              { value: 'letter', label: 'Letter' },
              { value: 'translation', label: 'Translation' },
            ]} />
          </Field>
          <Field label="Body / source text"><TextInput value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} /></Field>
          <Field label="Model answer"><TextInput value={draft.modelAnswer} onChange={(v) => setDraft({ ...draft, modelAnswer: v })} /></Field>
        </AdminModal>
      )}
    </>
  );
}
