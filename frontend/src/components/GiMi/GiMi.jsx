import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGiMi } from './useGiMi';
import './GiMi.css';

/* ============================================================
   Page-aware suggested prompts
   ============================================================ */
const PAGE_CHIPS = {
  '/': ['What can I do first?', 'How does the streak work?', 'Show me pricing'],
  '/vocabulary': ['How does spaced repetition work?', 'Tips to remember words', 'Word families explained'],
  '/grammar': ['Explain prepositions', 'When to use articles', 'Common tense mistakes'],
  '/curriculum': ['SSC vs HSC writing', 'How to answer seen passages', 'Translation tips'],
  '/exams': ['IELTS vs PTE', 'Which exam should I start with?', 'How are mocks scored?'],
  '/speaking': ['IELTS Part 2 example', 'How to improve fluency', 'How am I scored?'],
  '/progress': ['How do I earn XP fast?', 'What badges can I unlock?', 'How is my rank calculated?'],
  '/community': ['Which room should I join?', 'How do squads work?', 'Community rules'],
  '/live-rooms': ['How do live rooms work?', 'What is priority seating?', 'When do classes run?'],
  '/pricing': ['Which plan is best for IELTS?', 'Can I cancel any time?', 'Payment methods'],
  '/profile': ['How do I reset my password?', 'How do I upgrade?', 'Delete my account'],
};

const PAGE_ACTIONS = {
  '/vocabulary': [{ to: '/grammar', label: 'Try grammar' }],
  '/grammar': [{ to: '/vocabulary', label: 'Learn words' }],
  '/exams': [{ to: '/speaking', label: 'Practice speaking' }],
  '/speaking': [{ to: '/exams', label: 'Take a mock' }],
  '/live-rooms': [{ to: '/community', label: 'Join community' }],
  '/pricing': [{ to: '/exams', label: 'See free mocks' }],
  '/progress': [{ to: '/vocabulary', label: 'Keep the streak' }],
};

function chipsFor(path) {
  return PAGE_CHIPS[path] || PAGE_CHIPS['/'];
}

function actionsFor(path) {
  return PAGE_ACTIONS[path] || [];
}

/* ============================================================
   Tiny markdown renderer — bold, italic, code, lists, links
   ============================================================ */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s) {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\s)\*([^*\n]+)\*(?=\s|$)/g, '$1<em>$2</em>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function renderMarkdown(text) {
  const safe = escapeHtml(text);
  const lines = safe.split('\n');
  const out = [];
  let listType = null;
  const closeList = () => {
    if (listType) { out.push(`</${listType}>`); listType = null; }
  };

  for (const raw of lines) {
    const line = raw;
    if (/^---+$/.test(line.trim())) { closeList(); out.push('<hr/>'); continue; }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) { closeList(); out.push(`<h4>${inline(h3[1])}</h4>`); continue; }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) {
      if (listType !== 'ul') { closeList(); out.push('<ul>'); listType = 'ul'; }
      out.push(`<li>${inline(bullet[1])}</li>`); continue;
    }
    const num = line.match(/^\s*\d+\.\s+(.+)$/);
    if (num) {
      if (listType !== 'ol') { closeList(); out.push('<ol>'); listType = 'ol'; }
      out.push(`<li>${inline(num[1])}</li>`); continue;
    }
    if (!line.trim()) { closeList(); out.push('<br/>'); continue; }
    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return out.join('');
}

/* ============================================================
   Icons (inline — no external deps)
   ============================================================ */
const ICONS = {
  spark: (<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>),
  close: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>),
  send: (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l16-8-8 16-2-6-6-2z"/></svg>),
  stop: (<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>),
  trash: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>),
  mic: (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 11.5a7 7 0 0 0 14 0M12 18.5v3M8.5 21.5h7"/></svg>),
  copy: (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>),
  refresh: (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>),
};

/* ============================================================
   Message component
   ============================================================ */
function Message({ msg, onCopy, onRegenerate, isLast, canRegen }) {
  const isUser = msg.role === 'user';
  const html = renderMarkdown(msg.content || '');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className={`gimi-msg${isUser ? ' gimi-msg--user' : ''}${msg.error ? ' gimi-msg--error' : ''}`}>
      {!isUser && <span className="gimi-msg-avatar" aria-hidden="true">G</span>}
      <div className="gimi-msg-bubble">
        <div className="gimi-msg-text" dangerouslySetInnerHTML={{ __html: html }} />
        {msg.streaming && <span className="gimi-caret" aria-hidden="true" />}
        {!isUser && !msg.streaming && msg.content && (
          <div className="gimi-msg-actions">
            <button type="button" className="gimi-msg-action" onClick={copy} title="Copy">
              {copied ? '✓' : ICONS.copy}
            </button>
            {isLast && canRegen && (
              <button type="button" className="gimi-msg-action" onClick={onRegenerate} title="Regenerate">
                {ICONS.refresh}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Main GiMi component
   ============================================================ */
export function GiMi() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { messages, suggestions, sending, send, stop, clear, regenerate } = useGiMi();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  /* ─── Mobile detection ─── */
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ─── Voice support detection ─── */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  /* ─── Auto-scroll on new messages ─── */
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [messages, open, sending]);

  /* ─── Focus input when opened (desktop only, avoids mobile keyboard popping) ─── */
  useEffect(() => {
    if (open && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open, isMobile]);

  /* ─── Escape closes ─── */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* ─── Global hotkey: ⌘K / Ctrl+K ─── */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ─── Lock body scroll on mobile when open ─── */
  useEffect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open, isMobile]);

  /* ─── Close on route change (mobile) ─── */
  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [pathname, isMobile]);

  /* ─── Voice input ─── */
  const toggleVoice = useCallback(() => {
    if (!voiceSupported) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join('');
      setInput(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening, voiceSupported]);

  /* ─── Send handler ─── */
  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    send(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (text) => {
    if (!sending) send(text);
  };

  const handleRegenerate = () => {
    if (sending) return;
    regenerate();
  };

  const chips = suggestions.length ? suggestions : chipsFor(pathname);
  const actions = actionsFor(pathname);

  /* ─── Render ─── */
  return (
    <>
      {/* Backdrop — mobile only */}
      {open && isMobile && (
        <div className="gimi-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      {/* Panel */}
      <div
        className={
          `gimi-panel${isMobile ? ' gimi-panel--mobile' : ''}${open ? ' gimi-panel--open' : ''}`
        }
        role="dialog"
        aria-label="GiMi assistant"
        aria-modal={isMobile || undefined}
      >
        {/* Header */}
        <header className="gimi-head">
          <div className="gimi-head-avatar" aria-hidden="true">
            <span className="gimi-head-avatar-inner">G</span>
            <span className="gimi-head-dot" />
          </div>
          <div className="gimi-head-text">
            <div className="gimi-head-title">
              GiMi
              <span className="gimi-head-badge">AI</span>
            </div>
            <div className="gimi-head-sub">
              {user?.name ? `Hi ${user.name.split(' ')[0]} — ask me anything` : 'Your FixMyEnglish guide'}
            </div>
          </div>
          <div className="gimi-head-actions">
            <button
              type="button"
              className="gimi-icon-btn"
              onClick={clear}
              title="Clear chat"
              aria-label="Clear chat"
            >
              {ICONS.trash}
            </button>
            <button
              type="button"
              className="gimi-icon-btn"
              onClick={() => setOpen(false)}
              title="Close"
              aria-label="Close"
            >
              {ICONS.close}
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="gimi-scroll" ref={scrollRef}>
          {messages.map((m, i) => (
            <Message
              key={m.id}
              msg={m}
              onCopy={() => {}}
              onRegenerate={handleRegenerate}
              isLast={i === messages.length - 1}
              canRegen={!sending}
            />
          ))}

          {/* Suggestion chips — only shown before first user message */}
          {messages.length <= 1 && chips.length > 0 && (
            <div className="gimi-suggestions">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="gimi-suggestion"
                  onClick={() => handleSuggestion(c)}
                  disabled={sending}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Quick actions — deep links to related pages */}
          {actions.length > 0 && messages.length > 1 && !sending && (
            <div className="gimi-quick-actions">
              {actions.map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="gimi-quick-action"
                  onClick={() => isMobile && setOpen(false)}
                >
                  {a.label} →
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <form className="gimi-composer" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="gimi-input"
            placeholder="Ask GiMi anything…"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            maxLength={2000}
          />
          {voiceSupported && (
            <button
              type="button"
              className={`gimi-voice${listening ? ' gimi-voice--on' : ''}`}
              onClick={toggleVoice}
              disabled={sending}
              title={listening ? 'Stop listening' : 'Voice input'}
              aria-label={listening ? 'Stop listening' : 'Voice input'}
            >
              {ICONS.mic}
            </button>
          )}
          {sending ? (
            <button
              type="button"
              className="gimi-send gimi-send--stop"
              onClick={stop}
              title="Stop"
              aria-label="Stop generating"
            >
              {ICONS.stop}
            </button>
          ) : (
            <button
              type="submit"
              className="gimi-send"
              disabled={!input.trim()}
              title="Send"
              aria-label="Send"
            >
              {ICONS.send}
            </button>
          )}
        </form>
      </div>

      {/* Floating bubble */}
      <button
        type="button"
        className={`gimi-bubble${open ? ' gimi-bubble--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close GiMi' : 'Open GiMi assistant'}
        aria-expanded={open}
        title="Ask GiMi (⌘K)"
      >
        {!open && <span className="gimi-bubble-pulse" aria-hidden="true" />}
        {open ? ICONS.close : ICONS.spark}
      </button>
    </>
  );
}

export default GiMi;
