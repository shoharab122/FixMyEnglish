import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, TextArea, Select } from './Field';

const EMPTY = { trackSlug: 'ielts', category: 'part2', promptText: '', prepSeconds: 30, responseSeconds: 120 };

export function Speaking() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);

  const reload = () => {
    setLoading(true);
    adminApi.speakingPrompts().then(setPrompts).catch(() => setPrompts([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!draft.promptText) { alert('Prompt text required'); return; }
    await adminApi.createSpeakingPrompt({
      ...draft,
      prepSeconds: Number(draft.prepSeconds) || 0,
      responseSeconds: Number(draft.responseSeconds) || 60,
    });
    setOpen(false); setDraft(EMPTY); reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this prompt?')) return;
    await adminApi.deleteSpeakingPrompt(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Speaking prompts</h1>
          <p className="ec-admin-sub">{prompts.length} prompts</p>
        </div>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)}>+ Add prompt</button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={prompts}
          empty="No prompts yet"
          columns={[
            { key: 'trackSlug', label: 'Track' },
            { key: 'category', label: 'Category' },
            { key: 'promptText', label: 'Prompt' },
            { key: 'prepSeconds', label: 'Prep', render: (p) => `${p.prepSeconds}s` },
            { key: 'responseSeconds', label: 'Response', render: (p) => `${p.responseSeconds}s` },
            { key: 'actions', label: '', render: (p) => <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(p.id)}>Delete</button> },
          ]}
        />
      </div>

      {open && (
        <AdminModal title="Add speaking prompt" onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Save</button>
            </>
          }>
          <Field label="Track">
            <Select value={draft.trackSlug} onChange={(v) => setDraft({ ...draft, trackSlug: v })} options={[
              { value: 'ielts', label: 'IELTS' }, { value: 'general', label: 'General' },
            ]} />
          </Field>
          <Field label="Category"><TextInput value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} /></Field>
          <Field label="Prompt text"><TextArea value={draft.promptText} onChange={(v) => setDraft({ ...draft, promptText: v })} /></Field>
          <Field label="Prep seconds"><NumInput value={draft.prepSeconds} onChange={(v) => setDraft({ ...draft, prepSeconds: v })} /></Field>
          <Field label="Response seconds"><NumInput value={draft.responseSeconds} onChange={(v) => setDraft({ ...draft, responseSeconds: v })} /></Field>
        </AdminModal>
      )}
    </>
  );
}
