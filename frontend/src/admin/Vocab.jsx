import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, Select } from './Field';

const EMPTY = { word: '', meaningEn: '', meaningBn: '', example: '', pos: 'noun', synonyms: '', textbookUnit: '' };

export function Vocab() {
  const [words, setWords] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);

  const reload = () => {
    setLoading(true);
    adminApi.vocab({ q }).then(setWords).catch(() => setWords([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, [q]);

  const save = async () => {
    if (!draft.word || !draft.meaningEn) { alert('Word and meaning are required'); return; }
    await adminApi.createVocab({
      ...draft,
      synonyms: draft.synonyms ? draft.synonyms.split(',').map((s) => s.trim()) : [],
      textbookUnit: draft.textbookUnit ? Number(draft.textbookUnit) : null,
    });
    setOpen(false); setDraft(EMPTY); reload();
  };

  const remove = async (id, word) => {
    if (!confirm(`Delete "${word}"?`)) return;
    await adminApi.deleteVocab(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Vocabulary</h1>
          <p className="ec-admin-sub">{words.length} words</p>
        </div>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)}>+ Add word</button>
      </div>

      <div className="ec-admin-toolbar">
        <input className="ec-admin-input" placeholder="Search words…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={words}
          empty="No words yet"
          columns={[
            { key: 'word', label: 'Word', render: (w) => <strong>{w.word}</strong> },
            { key: 'meaningEn', label: 'Meaning' },
            { key: 'pos', label: 'POS' },
            { key: 'textbookUnit', label: 'Unit', render: (w) => w.textbookUnit ?? '—' },
            { key: 'actions', label: '', render: (w) => <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(w.id, w.word)}>Delete</button> },
          ]}
        />
      </div>

      {open && (
        <AdminModal
          title="Add vocabulary word"
          onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Save word</button>
            </>
          }
        >
          <Field label="Word"><TextInput value={draft.word} onChange={(v) => setDraft({ ...draft, word: v })} /></Field>
          <Field label="Meaning (English)"><TextInput value={draft.meaningEn} onChange={(v) => setDraft({ ...draft, meaningEn: v })} /></Field>
          <Field label="Example sentence"><TextInput value={draft.example} onChange={(v) => setDraft({ ...draft, example: v })} /></Field>
          <Field label="Part of speech">
            <Select value={draft.pos} onChange={(v) => setDraft({ ...draft, pos: v })} options={[
              { value: 'noun', label: 'noun' }, { value: 'verb', label: 'verb' },
              { value: 'adjective', label: 'adjective' }, { value: 'adverb', label: 'adverb' },
            ]} />
          </Field>
          <Field label="Synonyms (comma separated)"><TextInput value={draft.synonyms} onChange={(v) => setDraft({ ...draft, synonyms: v })} /></Field>
          <Field label="Textbook unit (1–10)"><NumInput value={draft.textbookUnit} onChange={(v) => setDraft({ ...draft, textbookUnit: v })} /></Field>
        </AdminModal>
      )}
    </>
  );
}
