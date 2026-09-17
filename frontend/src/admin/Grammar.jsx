import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, Select } from './Field';

export function Grammar() {
  const [tab, setTab] = useState('topics');

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Grammar</h1>
          <p className="ec-admin-sub">Topics and questions</p>
        </div>
      </div>

      <div className="ec-admin-toolbar">
        <button className={`ec-admin-btn ${tab === 'topics' ? 'ec-admin-btn--purple' : 'ec-admin-btn--ghost'}`} onClick={() => setTab('topics')}>Topics</button>
        <button className={`ec-admin-btn ${tab === 'questions' ? 'ec-admin-btn--purple' : 'ec-admin-btn--ghost'}`} onClick={() => setTab('questions')}>Questions</button>
      </div>

      {tab === 'topics' && <Topics />}
      {tab === 'questions' && <Questions />}
    </>
  );
}

function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ slug: '', name: '', category: 'tenses' });

  const reload = () => {
    setLoading(true);
    adminApi.grammarTopics().then(setTopics).catch(() => setTopics([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!draft.slug || !draft.name) { alert('Slug and name required'); return; }
    await adminApi.createGrammarTopic(draft);
    setOpen(false); setDraft({ slug: '', name: '', category: 'tenses' }); reload();
  };
  const remove = async (id, name) => {
    if (!confirm(`Delete topic "${name}" and all its questions?`)) return;
    await adminApi.deleteGrammarTopic(id); reload();
  };

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)}>+ Add topic</button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={topics}
          empty="No topics yet"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'slug', label: 'Slug' },
            { key: 'category', label: 'Category' },
            { key: 'questionCount', label: 'Questions' },
            { key: 'actions', label: '', render: (t) => <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(t.id, t.name)}>Delete</button> },
          ]}
        />
      </div>

      {open && (
        <AdminModal
          title="Add grammar topic"
          onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Save</button>
            </>
          }
        >
          <Field label="Name"><TextInput value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} /></Field>
          <Field label="Slug (URL-safe)"><TextInput value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} /></Field>
          <Field label="Category"><TextInput value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} /></Field>
        </AdminModal>
      )}
    </>
  );
}

function Questions() {
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ prompt: '', options: '', correctAnswer: '', explanation: '', banglaExplain: '' });

  useEffect(() => {
    adminApi.grammarTopics().then((t) => {
      setTopics(t);
      if (t.length && !topicId) setTopicId(t[0].id);
    }).catch(() => {});
  }, []);

  const reload = () => {
    if (!topicId) return;
    setLoading(true);
    adminApi.grammarQuestions(topicId).then(setQuestions).catch(() => setQuestions([])).finally(() => setLoading(false));
  };
  useEffect(reload, [topicId]);

  const save = async () => {
    if (!draft.prompt || !draft.correctAnswer || !draft.options) { alert('Prompt, options and correct answer required'); return; }
    await adminApi.createGrammarQuestion({
      topicId,
      prompt: draft.prompt,
      options: draft.options.split('|').map((s) => s.trim()),
      correctAnswer: draft.correctAnswer,
      explanation: draft.explanation,
      banglaExplain: draft.banglaExplain,
    });
    setOpen(false);
    setDraft({ prompt: '', options: '', correctAnswer: '', explanation: '', banglaExplain: '' });
    reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this question?')) return;
    await adminApi.deleteGrammarQuestion(id); reload();
  };

  return (
    <>
      <div className="ec-admin-toolbar">
        <select className="ec-admin-select" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
          {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button className="ec-admin-btn ec-admin-btn--lime" onClick={() => setOpen(true)} disabled={!topicId}>+ Add question</button>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={questions}
          empty="No questions for this topic"
          columns={[
            { key: 'prompt', label: 'Prompt' },
            { key: 'correctAnswer', label: 'Answer' },
            { key: 'actions', label: '', render: (q) => <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(q.id)}>Delete</button> },
          ]}
        />
      </div>

      {open && (
        <AdminModal
          title="Add grammar question"
          onClose={() => setOpen(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={save}>Save</button>
            </>
          }
        >
          <Field label="Prompt"><TextInput value={draft.prompt} onChange={(v) => setDraft({ ...draft, prompt: v })} /></Field>
          <Field label="Options (separate with |)"><TextInput placeholder="go | goes | going" value={draft.options} onChange={(v) => setDraft({ ...draft, options: v })} /></Field>
          <Field label="Correct answer (must match an option)"><TextInput value={draft.correctAnswer} onChange={(v) => setDraft({ ...draft, correctAnswer: v })} /></Field>
          <Field label="Explanation (English)"><TextInput value={draft.explanation} onChange={(v) => setDraft({ ...draft, explanation: v })} /></Field>
          <Field label="Explanation (Bangla)"><TextInput value={draft.banglaExplain} onChange={(v) => setDraft({ ...draft, banglaExplain: v })} /></Field>
        </AdminModal>
      )}
    </>
  );
}
