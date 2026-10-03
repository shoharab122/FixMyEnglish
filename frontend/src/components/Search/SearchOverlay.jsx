import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchOverlay.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const KIND_LABEL = {
  vocabulary: 'Vocab', grammar: 'Grammar', curriculum: 'Curriculum',
  exam: 'Exam', live: 'Live',
};
const KIND_COLOR = {
  vocabulary: 'lime', grammar: 'pink', curriculum: 'purple',
  exam: 'yellow', live: 'pink2',
};

export function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setActive(0);
    } else {
      setQ(''); setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === 'Enter' && results[active]) { e.preventDefault(); navigate(results[active].to); onClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active, onClose, navigate]);

  useEffect(() => {
    if (!open) return;
    if (q.trim().length < 2) { setResults([]); return; }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!cancelled) { setResults(Array.isArray(data.results) ? data.results : []); setActive(0); }
      } catch { if (!cancelled) setResults([]); }
      finally { if (!cancelled) setLoading(false); }
    }, 200);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q, open]);

  const go = (r) => { navigate(r.to); onClose(); };

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-bar">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search words, grammar, exams…"
            aria-label="Search"
          />
          <kbd>Esc</kbd>
        </div>
        <div className="search-body">
          {q.trim().length < 2 && (
            <div className="search-hint">Type at least 2 letters to search words, grammar topics, curriculum, exams, live rooms.</div>
          )}
          {loading && <div className="search-hint">Searching…</div>}
          {!loading && q.trim().length >= 2 && results.length === 0 && (
            <div className="search-hint">No matches for “{q}”.</div>
          )}
          {!loading && results.length > 0 && (
            <ul className="search-results">
              {results.map((r, i) => (
                <li
                  key={`${r.kind}-${r.id}`}
                  className={`search-result${i === active ? ' search-result--active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                >
                  <span className={`search-result-kind search-result-kind--${KIND_COLOR[r.kind] || 'lime'}`}>
                    {KIND_LABEL[r.kind] || r.kind}
                  </span>
                  <span className="search-result-main">
                    <strong>{r.title}</strong>
                    {r.subtitle && <small>{r.subtitle}</small>}
                  </span>
                  <span className="search-result-arrow" aria-hidden="true">→</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
