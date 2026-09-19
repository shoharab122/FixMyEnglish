import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examsApi } from '../api/exams';

const CSS = `
.ec-take{--lang-lime:#D4F55C;--lang-ink:#17102E;--lang-ink-soft:#6B6488;--lang-pink-2:#FF8FCB;--lang-purple:#7B5CF0;--lang-yellow:#F5E04D;--lang-line:#17102E;}
.ec-take *{box-sizing:border-box}
.ec-take-wrap{max-width:820px;margin:0 auto;padding:8px 0 120px}
.ec-take-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;flex-wrap:wrap}
.ec-take-title{margin:0;font-size:22px;font-weight:900;color:var(--lang-ink);letter-spacing:-.03em}
.ec-take-meta{margin:6px 0 0;font-size:13px;color:var(--lang-ink-soft);font-weight:700}
.ec-take-timer{padding:10px 18px;border-radius:999px;background:var(--lang-lime);color:var(--lang-ink);
  font-weight:900;font-size:15px;border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);
  font-variant-numeric:tabular-nums;letter-spacing:.02em}
.ec-take-timer--warn{background:var(--lang-yellow)}
.ec-take-timer--danger{background:var(--lang-pink-2);color:#fff;animation:ecTakePulse 1.2s ease-in-out infinite}
@keyframes ecTakePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.ec-take-progress{height:12px;border-radius:999px;background:#E8E5F2;border:2px solid var(--lang-line);
  overflow:hidden;margin-bottom:22px}
.ec-take-progress-fill{height:100%;background:linear-gradient(90deg,#D4F55C,#B8E62E);transition:width .5s ease}
.ec-take-q{background:#fff;border:3px solid var(--lang-line);border-radius:24px;padding:26px;
  box-shadow:0 8px 0 var(--lang-line);margin-bottom:20px}
.ec-take-q-num{font-size:11px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;
  background:var(--lang-lime);color:var(--lang-ink);padding:6px 13px;border-radius:999px;
  border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line);display:inline-block;margin-bottom:14px}
.ec-take-q-text{font-size:19px;font-weight:900;line-height:1.4;margin:0 0 22px;color:var(--lang-ink);letter-spacing:-.02em}
.ec-take-opt{display:flex;align-items:center;gap:14px;padding:15px 18px;border-radius:16px;border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);font-size:14.5px;font-weight:800;text-align:left;cursor:pointer;
  font-family:inherit;width:100%;margin-bottom:12px;box-shadow:0 4px 0 var(--lang-line);transition:all .15s ease}
.ec-take-opt:hover{background:#EDFFB0;transform:translateY(-2px);box-shadow:0 6px 0 var(--lang-line)}
.ec-take-opt--on{background:var(--lang-lime);font-weight:900}
.ec-take-opt-letter{width:30px;height:30px;border-radius:10px;background:#fff;border:2px solid var(--lang-line);
  display:flex;align-items:center;justify-content:center;font-weight:900;flex-shrink:0}
.ec-take-opt--on .ec-take-opt-letter{background:var(--lang-ink);color:var(--lang-lime)}
.ec-take-nav{display:flex;justify-content:space-between;gap:12px;margin-bottom:22px;flex-wrap:wrap}
.ec-take-btn{padding:12px 22px;border-radius:999px;border:2px solid var(--lang-line);font-weight:900;font-size:13.5px;
  cursor:pointer;font-family:inherit;box-shadow:0 4px 0 var(--lang-line);transition:all .15s ease}
.ec-take-btn:disabled{opacity:.5;cursor:not-allowed}
.ec-take-btn--ghost{background:#fff;color:var(--lang-ink)}
.ec-take-btn--primary{background:var(--lang-ink);color:var(--lang-lime)}
.ec-take-btn--submit{background:var(--lang-purple);color:#fff}
.ec-take-palette{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}
.ec-take-pal{width:38px;height:38px;border-radius:10px;border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);
  font-weight:900;font-size:12.5px;cursor:pointer;box-shadow:0 2px 0 var(--lang-line);font-variant-numeric:tabular-nums}
.ec-take-pal--done{background:var(--lang-lime)}
.ec-take-pal--now{background:var(--lang-ink);color:var(--lang-lime);transform:translateY(-2px)}
.ec-take-empty{padding:60px 24px;text-align:center;background:#fff;border:3px dashed var(--lang-line);border-radius:24px}
.ec-take-empty h2{margin:0 0 8px;font-size:20px;font-weight:900;color:var(--lang-ink)}
.ec-take-empty p{margin:0 0 20px;color:var(--lang-ink-soft);font-weight:700}
.ec-take-result{background:#fff;border:3px solid var(--lang-line);border-radius:28px;padding:36px 28px;text-align:center;
  box-shadow:0 10px 0 var(--lang-line);max-width:520px;margin:40px auto}
.ec-take-result-emoji{font-size:64px;line-height:1;margin-bottom:12px}
.ec-take-result h2{margin:0 0 8px;font-size:24px;font-weight:900;letter-spacing:-.03em}
.ec-take-result p{margin:0 0 22px;color:var(--lang-ink-soft);font-weight:700;font-size:14px}
.ec-take-result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
.ec-take-result-cell{padding:16px;border:2px solid var(--lang-line);border-radius:14px;box-shadow:0 3px 0 var(--lang-line)}
.ec-take-result-cell strong{display:block;font-size:24px;font-weight:900;color:var(--lang-ink);line-height:1}
.ec-take-result-cell span{font-size:10.5px;font-weight:900;color:var(--lang-ink-soft);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:6px}
.ec-take-overlay{position:fixed;inset:0;z-index:9999;background:rgba(23,16,46,.6);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;padding:20px}
.ec-take-confirm{background:#fff;border:3px solid var(--lang-line);border-radius:24px;padding:26px;max-width:400px;
  width:100%;text-align:center;box-shadow:0 10px 0 var(--lang-line)}
.ec-take-confirm h3{margin:0 0 10px;font-size:19px;font-weight:900}
.ec-take-confirm p{margin:0 0 20px;color:var(--lang-ink-soft);font-weight:700;font-size:13.5px;line-height:1.55}
.ec-take-confirm-actions{display:flex;gap:10px;justify-content:center}
@media(max-width:640px){
  .ec-take-q{padding:20px;border-radius:20px}
  .ec-take-q-text{font-size:16px}
  .ec-take-nav{flex-direction:column}
  .ec-take-btn{width:100%}
  .ec-take-result-grid{grid-template-columns:1fr 1fr}
  .ec-take-timer{font-size:13px;padding:8px 14px}
  .ec-take-title{font-size:19px}
}
`;

function fmt(sec) {
  if (sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ExamTake() {
  const { paperId } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [idx, setIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  /* Fetch paper + start attempt */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await examsApi.paper(paperId);
        if (cancelled) return;
        setPaper(p);
        setSecondsLeft((Number(p.durationMins) || 60) * 60);
        try {
          const a = await examsApi.startPaper(paperId);
          if (!cancelled) setAttempt(a);
        } catch { /* offline ok */ }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.error || 'Could not load this paper.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [paperId]);

  /* Timer */
  useEffect(() => {
    if (submitted || !paper || loading || error) return;
    if (secondsLeft <= 0) { submit(true); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, submitted, paper, loading, error]);

  const flat = useMemo(() => {
    if (!paper?.sections) return [];
    const out = [];
    paper.sections.forEach((s) => {
      (s.questions || []).forEach((q) => out.push({ ...q, sectionName: s.name }));
    });
    return out;
  }, [paper]);

  const current = flat[idx];
  const answered = Object.keys(answers).length;

  const pick = (opt) => {
    if (!current) return;
    setAnswers((a) => ({ ...a, [current.id]: opt }));
  };

  const submit = async (auto = false) => {
    if (submitted) return;
    setSubmitted(true);
    setConfirmSubmit(false);
    let correct = 0;
    flat.forEach((q) => { if (answers[q.id] === q.answer) correct++; });
    const total = flat.length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    setResult({ correct, total, score, auto });
    if (attempt?.id) {
      try { await examsApi.submitPaper(attempt.id, answers); } catch { /* ignore */ }
    }
  };

  if (loading) {
    return (
      <div className="ec-take">
        <style>{CSS}</style>
        <div className="ec-take-empty"><h2>Loading paper…</h2></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ec-take">
        <style>{CSS}</style>
        <div className="ec-take-wrap">
          <div className="ec-take-empty">
            <h2>⚠️ {error}</h2>
            <p>This paper may not be published yet.</p>
            <button className="ec-take-btn ec-take-btn--primary" onClick={() => navigate('/exams')}>
              ← Back to Exams
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    const emoji = result.score >= 80 ? '🎉' : result.score >= 60 ? '👍' : '💪';
    return (
      <div className="ec-take">
        <style>{CSS}</style>
        <div className="ec-take-result">
          <div className="ec-take-result-emoji">{emoji}</div>
          <h2>{result.auto ? "Time's up!" : 'Exam submitted'}</h2>
          <p>{paper.title} — your responses have been recorded.</p>
          <div className="ec-take-result-grid">
            <div className="ec-take-result-cell"><strong>{result.correct}</strong><span>Correct</span></div>
            <div className="ec-take-result-cell"><strong>{result.total}</strong><span>Total</span></div>
            <div className="ec-take-result-cell"><strong>{result.score}%</strong><span>Score</span></div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="ec-take-btn ec-take-btn--ghost" onClick={() => navigate('/exams')}>
              ← Back to Exams
            </button>
            <button
              className="ec-take-btn ec-take-btn--primary"
              onClick={() => {
                setAnswers({}); setIdx(0); setSubmitted(false);
                setResult(null); setSecondsLeft((Number(paper.durationMins) || 60) * 60);
              }}
            >
              Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = flat.length || 1;
  const pct = Math.round(((idx + 1) / total) * 100);
  const timerCls = secondsLeft <= 60 ? 'ec-take-timer--danger'
    : secondsLeft <= 5 * 60 ? 'ec-take-timer--warn' : '';

  return (
    <div className="ec-take">
      <style>{CSS}</style>
      <div className="ec-take-wrap">
        <div className="ec-take-head">
          <div>
            <h1 className="ec-take-title">{paper.title}</h1>
            <p className="ec-take-meta">
              🏫 {paper.classLevel} · {paper.paper} · {paper.board} Board · 🎯 {paper.totalMarks} marks
            </p>
          </div>
          <div className={`ec-take-timer ${timerCls}`}>⏱ {fmt(secondsLeft)}</div>
        </div>

        <div className="ec-take-progress">
          <div className="ec-take-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {current ? (
          <div className="ec-take-q">
            <div className="ec-take-q-num">
              Question {idx + 1} of {flat.length} · {current.sectionName || 'General'}
            </div>
            <p className="ec-take-q-text">{current.prompt}</p>
            {(current.options || []).map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const on = answers[current.id] === opt;
              return (
                <button
                  key={i}
                  className={`ec-take-opt${on ? ' ec-take-opt--on' : ''}`}
                  onClick={() => pick(opt)}
                >
                  <span className="ec-take-opt-letter">{letter}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="ec-take-empty">
            <h2>No questions in this paper</h2>
            <p>Contact the admin or try another paper.</p>
          </div>
        )}

        <div className="ec-take-palette">
          {flat.map((_, i) => {
            const isAnswered = answers[flat[i].id] != null;
            const now = i === idx;
            return (
              <button
                key={i}
                className={`ec-take-pal${isAnswered ? ' ec-take-pal--done' : ''}${now ? ' ec-take-pal--now' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Go to question ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="ec-take-nav">
          <button
            className="ec-take-btn ec-take-btn--ghost"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
          >
            ← Previous
          </button>
          {idx < flat.length - 1 ? (
            <button
              className="ec-take-btn ec-take-btn--primary"
              onClick={() => setIdx((i) => Math.min(flat.length - 1, i + 1))}
            >
              Next →
            </button>
          ) : (
            <button
              className="ec-take-btn ec-take-btn--submit"
              onClick={() => setConfirmSubmit(true)}
            >
              ✓ Submit Exam
            </button>
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--lang-ink-soft)', fontSize: 12.5, fontWeight: 700 }}>
          {answered} of {flat.length} answered
        </p>
      </div>

      {confirmSubmit && (
        <div className="ec-take-overlay" onClick={() => setConfirmSubmit(false)}>
          <div className="ec-take-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Submit your exam?</h3>
            <p>
              You've answered <strong>{answered}</strong> of <strong>{flat.length}</strong> questions.
              You cannot change answers after submitting.
            </p>
            <div className="ec-take-confirm-actions">
              <button className="ec-take-btn ec-take-btn--ghost" onClick={() => setConfirmSubmit(false)}>
                Keep working
              </button>
              <button className="ec-take-btn ec-take-btn--submit" onClick={() => submit(false)}>
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamTake;
