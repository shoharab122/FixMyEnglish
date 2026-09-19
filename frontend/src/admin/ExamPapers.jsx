import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { Field, TextInput, NumInput, Select, TextArea } from './Field';
import { useAdminMutation } from './useAdminMutation';

const PAPER_EMPTY = {
  title: '', classLevel: 'SSC', paper: '1st Paper', board: 'Dhaka',
  year: new Date().getFullYear(), durationMins: 180, totalMarks: 100,
  status: 'draft', instructions: '',
};

const SECTION_EMPTY = { name: '', marks: 10, instructions: '' };
const QUESTION_EMPTY = { prompt: '', options: '', answer: '', marks: 1, explanation: '' };

const SAFE_STATUS = ['draft', 'published', 'live', 'ended', 'archived'];

const BOARDS = [
  'Dhaka', 'Rajshahi', 'Chattogram', 'Sylhet', 'Barishal', 'Cumilla',
  'Jashore', 'Dinajpur', 'Mymensingh', 'Madrasah', 'Technical',
];

export function ExamPapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPaper, setOpenPaper] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [paperDraft, setPaperDraft] = useState(PAPER_EMPTY);
  const [sectionDraft, setSectionDraft] = useState(SECTION_EMPTY);
  const [questionDraft, setQuestionDraft] = useState(QUESTION_EMPTY);

  const [fieldErrors, setFieldErrors] = useState({});
  const { run, loading: mutating } = useAdminMutation();

  const reload = () => {
    setLoading(true);
    adminApi
      .examPapers()
      .then((r) => setPapers(Array.isArray(r) ? r : []))
      .catch(() => setPapers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const validatePaper = () => {
    const errs = {};
    if (!paperDraft.title?.trim()) errs.title = 'Title required';
    if (!paperDraft.durationMins || Number(paperDraft.durationMins) < 5) errs.durationMins = 'Min 5 minutes';
    if (!paperDraft.totalMarks || Number(paperDraft.totalMarks) < 1) errs.totalMarks = 'Min 1 mark';
    if (!SAFE_STATUS.includes(paperDraft.status)) errs.status = 'Invalid status';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const savePaper = () => {
    if (!validatePaper()) return;
    run(
      () => adminApi.createExamPaper({
        ...paperDraft,
        durationMins: Number(paperDraft.durationMins),
        totalMarks: Number(paperDraft.totalMarks),
        year: Number(paperDraft.year) || undefined,
      }),
      { audit: 'examPaper.create', label: 'Paper saved' }
    ).then(() => {
      setOpenPaper(false); setPaperDraft(PAPER_EMPTY); setFieldErrors({}); reload();
    });
  };

  const setPaperStatus = (id, status) => {
    if (!SAFE_STATUS.includes(status)) return;
    run(() => adminApi.updateExamPaper(id, { status }), {
      audit: 'examPaper.status', label: `Paper marked ${status}`,
    }).then(reload).catch(() => reload());
  };

  /* Launch = go live immediately. Learners see it instantly on /exams. */
  const launchLive = (paper) => {
    run(() => adminApi.launchExamPaper(paper.id, new Date().toISOString()), {
      audit: 'examPaper.launch', label: `🔴 ${paper.title} is LIVE`,
    }).then(reload).catch(() => reload());
  };

  /* End = stop accepting new attempts, show results only. */
  const endLive = (paper) => {
    run(() => adminApi.endExamPaper(paper.id), {
      audit: 'examPaper.end', label: `${paper.title} ended`,
    }).then(reload).catch(() => reload());
  };

  const saveSection = () => {
    if (!sectionDraft.name?.trim()) { setFieldErrors({ name: 'Section name required' }); return; }
    run(
      () => adminApi.createExamPaperSection({
        paperId: openSection,
        name: sectionDraft.name,
        marks: Number(sectionDraft.marks) || 0,
        instructions: sectionDraft.instructions,
      }),
      { audit: 'examPaper.section.create', label: 'Section added' }
    ).then(() => {
      setOpenSection(null); setSectionDraft(SECTION_EMPTY); setFieldErrors({}); reload();
    });
  };

  const saveQuestion = () => {
    const errs = {};
    const opts = questionDraft.options.split('|').map((s) => s.trim()).filter(Boolean);
    if (!questionDraft.prompt?.trim()) errs.prompt = 'Prompt required';
    if (opts.length < 2) errs.options = 'At least 2 options';
    if (!questionDraft.answer?.trim()) errs.answer = 'Answer required';
    else if (!opts.includes(questionDraft.answer.trim())) errs.answer = 'Answer must match an option';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    run(
      () => adminApi.createExamPaperQuestion({
        paperId: openQuestion.paperId,
        sectionId: openQuestion.sectionId,
        prompt: questionDraft.prompt,
        options: opts,
        answer: questionDraft.answer.trim(),
        marks: Number(questionDraft.marks) || 1,
        explanation: questionDraft.explanation,
      }),
      { audit: 'examPaper.question.create', label: 'Question added' }
    ).then(() => {
      setOpenQuestion(null); setQuestionDraft(QUESTION_EMPTY); setFieldErrors({}); reload();
    });
  };

  const doDelete = () => {
    const target = confirmDelete;
    if (!target) return;
    setConfirmDelete(null);
    run(() => adminApi.deleteExamPaper(target.id), {
      audit: 'examPaper.delete', label: 'Paper deleted',
    }).then(reload).catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Exam Papers</h1>
          <p className="ec-admin-sub">
            {papers.length} papers · build, publish, launch live, or end
          </p>
        </div>
        <button
          className="ec-admin-btn ec-admin-btn--lime"
          onClick={() => { setOpenPaper(true); setFieldErrors({}); }}
        >
          + New paper
        </button>
      </div>

      {loading ? (
        <div className="ec-admin-loading">Loading papers…</div>
      ) : papers.length === 0 ? (
        <div className="ec-admin-empty">No papers yet — create your first one.</div>
      ) : (
        papers.map((p) => {
          const isLive = p.status === 'live';
          const isEnded = p.status === 'ended';
          const isPublished = p.status === 'published';
          const isDraft = p.status === 'draft';

          return (
            <div
              key={p.id}
              className={`ec-admin-card${isLive ? ' ec-admin-card--live' : ''}`}
            >
              <h2>
                <span>
                  📝 {p.title}{' '}
                  {isLive && <span className="ec-admin-live-pill">● LIVE NOW</span>}
                  <span className={`ec-admin-badge ec-admin-badge--${p.status || 'draft'}`}>
                    {p.status || 'draft'}
                  </span>
                </span>
                <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {/* Primary lifecycle action */}
                  {(isDraft || isPublished) && (
                    <button
                      className="ec-admin-btn ec-admin-btn--purple ec-admin-btn--sm"
                      disabled={mutating}
                      onClick={() => launchLive(p)}
                      title="Push to learners now"
                    >
                      🔴 Go Live
                    </button>
                  )}
                  {isLive && (
                    <button
                      className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                      disabled={mutating}
                      onClick={() => endLive(p)}
                    >
                      ⏹ End
                    </button>
                  )}
                  {isEnded && (
                    <button
                      className="ec-admin-btn ec-admin-btn--sm"
                      disabled={mutating}
                      onClick={() => setPaperStatus(p.id, 'published')}
                      title="Reopen for practice"
                    >
                      Reopen
                    </button>
                  )}
                  <select
                    className="ec-admin-select ec-admin-select--inline"
                    value={p.status}
                    disabled={mutating}
                    onChange={(e) => setPaperStatus(p.id, e.target.value)}
                  >
                    {SAFE_STATUS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    className="ec-admin-btn ec-admin-btn--lime ec-admin-btn--sm"
                    onClick={() => { setOpenSection(p.id); setFieldErrors({}); }}
                  >
                    + Section
                  </button>
                  <button
                    className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                    onClick={() => setConfirmDelete(p)}
                  >
                    Delete
                  </button>
                </span>
              </h2>

              <div className="ec-admin-paper-meta">
                <span>🏫 {p.classLevel} · {p.paper}</span>
                <span>🏛 {p.board} Board {p.year ? `· ${p.year}` : ''}</span>
                <span>⏱ {p.durationMins} min</span>
                <span>🎯 {p.totalMarks} marks</span>
                {typeof p.attemptsCount === 'number' && (
                  <span>👥 {p.attemptsCount} attempts</span>
                )}
              </div>

              {(p.sections || []).length === 0 ? (
                <div className="ec-admin-empty" style={{ padding: '24px 16px' }}>
                  No sections yet. Add a section to start writing questions.
                </div>
              ) : (
                p.sections.map((s) => (
                  <div key={s.id} className="ec-admin-paper-section">
                    <div className="ec-admin-paper-section-head">
                      <div>
                        <strong>{s.name}</strong>{' '}
                        <span className="ec-admin-muted">
                          · {s.marks} marks · {(s.questions || []).length} Qs
                        </span>
                      </div>
                      <button
                        className="ec-admin-btn ec-admin-btn--purple ec-admin-btn--sm"
                        onClick={() => {
                          setOpenQuestion({ paperId: p.id, sectionId: s.id });
                          setFieldErrors({});
                        }}
                      >
                        + Question
                      </button>
                    </div>
                    {(s.questions || []).length === 0 ? (
                      <div className="ec-admin-muted" style={{ fontSize: 12, padding: '6px 0' }}>
                        No questions in this section.
                      </div>
                    ) : (
                      <AdminTable
                        rows={s.questions}
                        loading={false}
                        empty="—"
                        columns={[
                          { key: 'prompt', label: 'Question' },
                          { key: 'answer', label: 'Answer' },
                          { key: 'marks', label: 'Marks' },
                        ]}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          );
        })
      )}

      {/* Paper Modal */}
      {openPaper && (
        <AdminModal
          title="New exam paper"
          onClose={() => setOpenPaper(false)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpenPaper(false)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={savePaper} disabled={mutating}>
                {mutating ? 'Saving…' : 'Save paper'}
              </button>
            </>
          }
        >
          <Field label="Title" error={fieldErrors.title}>
            <TextInput value={paperDraft.title} onChange={(v) => setPaperDraft({ ...paperDraft, title: v })} maxLength={180} />
          </Field>
          <Field label="Class">
            <Select value={paperDraft.classLevel} onChange={(v) => setPaperDraft({ ...paperDraft, classLevel: v })}
              options={[{ value: 'SSC', label: 'SSC' }, { value: 'HSC', label: 'HSC' }]} />
          </Field>
          <Field label="Paper">
            <Select value={paperDraft.paper} onChange={(v) => setPaperDraft({ ...paperDraft, paper: v })}
              options={[{ value: '1st Paper', label: '1st Paper' }, { value: '2nd Paper', label: '2nd Paper' }]} />
          </Field>
          <Field label="Board">
            <Select value={paperDraft.board} onChange={(v) => setPaperDraft({ ...paperDraft, board: v })}
              options={BOARDS.map((b) => ({ value: b, label: b }))} />
          </Field>
          <Field label="Year">
            <NumInput value={paperDraft.year} onChange={(v) => setPaperDraft({ ...paperDraft, year: v })} min={1990} max={2100} />
          </Field>
          <Field label="Duration (minutes)" error={fieldErrors.durationMins}>
            <NumInput value={paperDraft.durationMins} onChange={(v) => setPaperDraft({ ...paperDraft, durationMins: v })} min={5} />
          </Field>
          <Field label="Total marks" error={fieldErrors.totalMarks}>
            <NumInput value={paperDraft.totalMarks} onChange={(v) => setPaperDraft({ ...paperDraft, totalMarks: v })} min={1} />
          </Field>
          <Field label="Status" error={fieldErrors.status}>
            <Select value={paperDraft.status} onChange={(v) => setPaperDraft({ ...paperDraft, status: v })}
              options={SAFE_STATUS.map((s) => ({ value: s, label: s }))} />
          </Field>
          <Field label="Instructions (optional)">
            <TextArea value={paperDraft.instructions} onChange={(v) => setPaperDraft({ ...paperDraft, instructions: v })} rows={3} maxLength={1000} />
          </Field>
        </AdminModal>
      )}

      {/* Section Modal */}
      {openSection && (
        <AdminModal
          title="Add section"
          onClose={() => setOpenSection(null)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpenSection(null)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={saveSection} disabled={mutating}>
                {mutating ? 'Saving…' : 'Add section'}
              </button>
            </>
          }
        >
          <Field label="Section name" error={fieldErrors.name}>
            <TextInput value={sectionDraft.name} onChange={(v) => setSectionDraft({ ...sectionDraft, name: v })} maxLength={80} />
          </Field>
          <Field label="Marks">
            <NumInput value={sectionDraft.marks} onChange={(v) => setSectionDraft({ ...sectionDraft, marks: v })} min={0} />
          </Field>
          <Field label="Instructions (optional)">
            <TextArea value={sectionDraft.instructions} onChange={(v) => setSectionDraft({ ...sectionDraft, instructions: v })} rows={3} maxLength={600} />
          </Field>
        </AdminModal>
      )}

      {/* Question Modal */}
      {openQuestion && (
        <AdminModal
          title="Add question"
          onClose={() => setOpenQuestion(null)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setOpenQuestion(null)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--lime" onClick={saveQuestion} disabled={mutating}>
                {mutating ? 'Saving…' : 'Add question'}
              </button>
            </>
          }
        >
          <Field label="Prompt" error={fieldErrors.prompt}>
            <TextArea value={questionDraft.prompt} onChange={(v) => setQuestionDraft({ ...questionDraft, prompt: v })} rows={3} maxLength={500} />
          </Field>
          <Field label="Options (separate with |)" hint="e.g. go | goes | going | gone" error={fieldErrors.options}>
            <TextInput value={questionDraft.options} onChange={(v) => setQuestionDraft({ ...questionDraft, options: v })} maxLength={500} />
          </Field>
          <Field label="Correct answer" error={fieldErrors.answer}>
            <TextInput value={questionDraft.answer} onChange={(v) => setQuestionDraft({ ...questionDraft, answer: v })} maxLength={200} />
          </Field>
          <Field label="Marks">
            <NumInput value={questionDraft.marks} onChange={(v) => setQuestionDraft({ ...questionDraft, marks: v })} min={1} />
          </Field>
          <Field label="Explanation (optional)">
            <TextArea value={questionDraft.explanation} onChange={(v) => setQuestionDraft({ ...questionDraft, explanation: v })} rows={2} maxLength={600} />
          </Field>
        </AdminModal>
      )}

      {confirmDelete && (
        <AdminModal
          title="Delete paper?"
          onClose={() => setConfirmDelete(null)}
          actions={
            <>
              <button className="ec-admin-btn ec-admin-btn--ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="ec-admin-btn ec-admin-btn--danger" onClick={doDelete}>Delete</button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
            Delete <strong>{confirmDelete.title}</strong> and all its sections and questions?
          </p>
        </AdminModal>
      )}
    </>
  );
}

export default ExamPapers;
