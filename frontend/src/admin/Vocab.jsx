import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, Select } from './Field';
import { useAdminMutation } from './useAdminMutation';

const EMPTY = {
  word: '', meaningEn: '', meaningBn: '', example: '',
  pos: 'noun', synonyms: '', textbookUnit: '',
};

export function Vocab() {
  const [words, setWords] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { run, loading: mutating } = useAdminMutation();

  const reload = () => {
    setLoading(true);
    adminApi
      .vocab({ q })
      .then((r) => setWords(Array.isArray(r) ? r : []))
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const validate = () => {
    const errs = {};
    if (!draft.word?.trim()) errs.word = 'Word is required';
    if (!draft.meaningEn?.trim()) errs.meaningEn = 'Meaning is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    run(
      () =>
        adminApi.createVocab({
          ...draft,
          synonyms: draft.synonyms
            ? draft.synonyms.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          textbookUnit: draft.textbookUnit ? Number(draft.textbookUnit) : null,
        }),
      { audit: 'vocab.create', label: 'Word saved' }
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
    run(() => adminApi.deleteVocab(target.id), {
      audit: 'vocab.delete',
      label: 'Word deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Vocabulary</h1>
          <p className="ec-admin-sub">{words.length} words in the bank</p>
        </div>
        <button
          className="ec-admin-btn ec-admin-btn--lime"
          onClick={() => { setOpen(true); setFieldErrors({}); }}
        >
          + Add word
        </button>
      </div>

      <div className="ec-admin-toolbar">
        <input
          className="ec-admin-input"
          placeholder="Search words…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
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
            {
              key: 'actions',
              label: '',
              render: (w) => (
                <button
                  className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                  onClick={() => setConfirmDelete(w)}
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
          title="Add vocabulary word"
          onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--lime"
                onClick={save}
                disabled={mutating}
              >
                {mutating ? 'Saving…' : 'Save word'}
              </button>
            </>
          }
        >
          <Field label="Word" error={fieldErrors.word}>
            <TextInput value={draft.word} onChange={(v) => setDraft({ ...draft, word: v })} maxLength={80} />
          </Field>
          <Field label="Meaning (English)" error={fieldErrors.meaningEn}>
            <TextInput value={draft.meaningEn} onChange={(v) => setDraft({ ...draft, meaningEn: v })} maxLength={300} />
          </Field>
          <Field label="Example sentence">
            <TextInput value={draft.example} onChange={(v) => setDraft({ ...draft, example: v })} maxLength={300} />
          </Field>
          <Field label="Part of speech">
            <Select
              value={draft.pos}
              onChange={(v) => setDraft({ ...draft, pos: v })}
              options={[
                { value: 'noun', label: 'noun' },
                { value: 'verb', label: 'verb' },
                { value: 'adjective', label: 'adjective' },
                { value: 'adverb', label: 'adverb' },
              ]}
            />
          </Field>
          <Field label="Synonyms (comma separated)">
            <TextInput value={draft.synonyms} onChange={(v) => setDraft({ ...draft, synonyms: v })} />
          </Field>
          <Field label="Textbook unit (1–10)">
            <NumInput
              value={draft.textbookUnit}
              onChange={(v) => setDraft({ ...draft, textbookUnit: v })}
              min={1}
              max={10}
            />
          </Field>
        </AdminModal>
      )}

      {confirmDelete && (
        <AdminModal
          title="Delete word?"
          onClose={() => setConfirmDelete(null)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="ec-admin-btn ec-admin-btn--danger" onClick={doDelete}>
                Delete
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
            Delete <strong>{confirmDelete.word}</strong>? This cannot be undone.
          </p>
        </AdminModal>
      )}
    </>
  );
}

export default Vocab;
