import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGiMi } from './useGiMi';
import './GiMi.css';

/* ---------------- Page-aware quick actions ---------------- */
const PAGE_ACTIONS = {
  '/vocabulary': [{ to: '/grammar', label: 'Try grammar' }],
  '/grammar': [{ to: '/vocabulary', label: 'Learn words' }],
  '/exams': [{ to: '/speaking', label: 'Practice speaking' }],
  '/speaking': [{ to: '/exams', label: 'Take a mock' }],
  '/live-rooms': [{ to: '/community', label: 'Join community' }],
  '/pricing': [{ to: '/exams', label: 'See free mocks' }],
  '/progress': [{ to: '/vocabulary', label: 'Keep the streak' }],
};

/* ---------------- Starter topics (empty state) ---------------- */
const TOPICS = [
  { emoji: '🚀', label: 'Where to start', q: 'Where do I start?' },
  { emoji: '🔥', label: 'Streaks & XP', q: 'How do streaks and XP work?' },
  { emoji: '🎯', label: 'Pick an exam', q: 'Which exam should I start with?' },
  { emoji: '🗣️', label: 'Speak better', q: 'How do I improve fluency?' },
  { emoji: '💳', label: 'Plans & pricing', q: 'Which plan is best for me?' },
  { emoji: '💡', label: 'Study advice', q: 'Give me a study plan' },
];

/* In-app routes GiMi may mention in `backticks` — rendered as tappable links */
const ROUTES = new Set([
  '/', '/vocabulary', '/grammar', '/curriculum', '/exams', '/speaking', '/progress',
  '/community', '/live-rooms', '/pricing', '/profile', '/login', '/admin',
]);

/* ---------------- Markdown ---------------- */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function inline(s) {
  return s
    .replace(/`([^`]+)`/g, (m, c) =>
      ROUTES.has(c)
        ? `<a class="gimi-route" href="${c}" data-route="${c}">${c}</a>`
        : `<code>${c}</code>`
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\s)\*([^*\n]+)\*(?=\s|$|[.,!?;:)])/g, '$1<em>$2</em>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}
const splitRow = (line) =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const isTableSep = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l || '');

function renderMarkdown(text) {
  const safe = escapeHtml(text || '');
  const lines = safe.split('\n');
  const out = [];
  let listType = null;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    /* table: header row + separator row + body rows */
    if (line.trim().startsWith('|') && isTableSep(lines[i + 1])) {
      closeList();
      const head = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(splitRow(lines[i])); i++; }
      i--; // for-loop will advance
      out.push(
        '<div class="gimi-table-wrap"><table><thead><tr>' +
        head.map((c) => `<th>${inline(c)}</th>`).join('') +
        '</tr></thead><tbody>' +
        rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('') +
        '</tbody></table></div>'
      );
      continue;
    }

    if (/^---+$/.test(line.trim())) { closeList(); out.push('<hr/>'); continue; }
    const h = line.match(/^#{1,3}\s+(.+)$/);
    if (h) { closeList(); out.push(`<h4>${inline(h[1])}</h4>`); continue; }
    const quote = line.match(/^&gt;\s?(.+)$/);
    if (quote) { closeList(); out.push(`<blockquote>${inline(quote[1])}</blockquote>`); continue; }
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

/* ---------------- Icons ---------------- */
const ICONS = {
  spark: (<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>),
  close: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>),
  send: (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l16-8-8 16-2-6-6-2z"/></svg>),
  stop: (<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>),
  trash: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>),
  mic: (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 11.5a7 7 0 0 0 14 0M12 18.5v3M8.5 21.5h7"/></svg>),
  copy: (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>),
  refresh: (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>),
  down: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>),
};

/* ---------------- Message ---------------- */
function Message({ msg, onRegenerate, onRoute, isLast, canRegen }) {
  const isUser = msg.role === 'user';
  const html = renderMarkdown(msg.content || '');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* ignore */ }
  };

  /* tappable in-app routes inside answers */
  const handleClick = (e) => {
    const a = e.target.closest?.('a[data-route]');
    if (!a) return;
    e.preventDefault();
    onRoute?.(a.getAttribute('data-route'));
  };

  return (
    <div className={`gimi-msg${isUser ? ' gimi-msg--user' : ''}${msg.error ? ' gimi-msg--error' : ''}`}>
      {!isUser && <span className="gimi-msg-avatar" aria-hidden="true">G</span>}
      <div className="gimi-msg-bubble">
        {msg.streaming && !msg.content ? (
          <span className="gimi-typing" role="status" aria-label="GiMi is typing"><i /><i /><i /></span>
        ) : (
          <div className="gimi-msg-text" onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }} />
        )}
        {msg.streaming && msg.content && <span className="gimi-caret" aria-hidden="true" />}
        {!isUser && !msg.streaming && msg.content && (
          <div className="gimi-msg-actions">
            <button type="button" className="gimi-msg-action" onClick={copy} title="Copy" aria-label="Copy answer">
              {copied ? '✓' : ICONS.copy}
            </button>
            {isLast && canRegen && (
              <button type="button" className="gimi-msg-action" onClick={onRegenerate} title="Regenerate" aria-label="Regenerate answer">
                {ICONS.refresh}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Main ---------------- */
export function GiMi() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { messages, suggestions, sending, send, stop, clear, regenerate } = useGiMi();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const [showJump, setShowJump] = useState(false);

  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const headerRef = useRef(null);
  const dragStartRef = useRef(null);
  const stickRef = useRef(true);

  /* Mobile detection */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener?.('change', check);
    return () => mq.removeEventListener?.('change', check);
  }, []);

  /* Voice support */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  /* Smart auto-scroll: follow the answer unless the reader scrolled up */
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    if (stickRef.current) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [messages, open, sending]);

  useEffect(() => { if (open) stickRef.current = true; }, [open]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    stickRef.current = near;
    setShowJump(!near);
  }, []);

  const jumpToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    stickRef.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);

  /* Auto-grow the textarea */
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input, open]);

  /* Autofocus (desktop) */
  useEffect(() => {
    if (open && !isMobile) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open, isMobile]);

  /* Escape closes */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* ⌘K / Ctrl+K */
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

  /* Lock body scroll on mobile when open */
  useEffect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open, isMobile]);

  /* Keyboard-aware sheet: track the visual viewport so the composer is never hidden */
  useEffect(() => {
    if (!open || !isMobile) return;
    const vv = window.visualViewport;
    const panel = panelRef.current;
    if (!vv || !panel) return;
    const update = () => {
      panel.style.setProperty('--gimi-vh', `${vv.height}px`);
      panel.style.setProperty('--gimi-top', `${vv.offsetTop}px`);
      setKbOpen(window.innerHeight - vv.height > 140);
      const el = scrollRef.current;
      if (el && stickRef.current) el.scrollTop = el.scrollHeight;
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      panel.style.removeProperty('--gimi-vh');
      panel.style.removeProperty('--gimi-top');
      setKbOpen(false);
    };
  }, [open, isMobile]);

  /* Close on route change (mobile) */
  useEffect(() => { if (isMobile) setOpen(false); }, [pathname, isMobile]);

  /* Drag-to-close on mobile */
  const onDragStart = useCallback((clientY) => {
    if (!isMobile) return;
    dragStartRef.current = clientY;
    setDragging(true);
  }, [isMobile]);

  const onDragMove = useCallback((clientY) => {
    if (!dragging || dragStartRef.current == null) return;
    const dy = Math.max(0, clientY - dragStartRef.current);
    setDragY(dy);
  }, [dragging]);

  const onDragEnd = useCallback(() => {
    if (!dragging) return;
    if (dragY > 100) {
      setOpen(false);
    }
    setDragY(0);
    setDragging(false);
    dragStartRef.current = null;
  }, [dragging, dragY]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => onDragMove(e.touches ? e.touches[0].clientY : e.clientY);
    const up = () => onDragEnd();
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [dragging, onDragMove, onDragEnd]);

  /* Voice input */
  const toggleVoice = useCallback(() => {
    if (!voiceSupported) return;
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
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

  const ask = useCallback((text) => {
    if (sending) return;
    stickRef.current = true;
    send(text);
  }, [send, sending]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    ask(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const goRoute = useCallback((to) => {
    navigate(to);
    if (isMobile) setOpen(false);
  }, [navigate, isMobile]);

  const chips = suggestions || [];
  const actions = PAGE_ACTIONS[pathname] || [];
  const showEmptyHero = messages.length <= 1;
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  const panelStyle = isMobile && dragY > 0
    ? { transform: `translateY(${dragY}px)`, transition: 'none' }
    : undefined;

  return (
    <>
      {open && isMobile && (
        <div className="gimi-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      <div
        ref={panelRef}
        className={
          `gimi-panel${isMobile ? ' gimi-panel--mobile' : ''}` +
          `${open ? ' gimi-panel--open' : ''}` +
          `${dragging ? ' gimi-panel--dragging' : ''}` +
          `${kbOpen ? ' gimi-panel--kb' : ''}`
        }
        style={panelStyle}
        role="dialog"
        aria-label="GiMi assistant"
        aria-modal={isMobile || undefined}
      >
        <header
          className="gimi-head"
          ref={headerRef}
          onMouseDown={(e) => onDragStart(e.clientY)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
        >
          {isMobile && <span className="gimi-handle" aria-hidden="true" />}
          <div className="gimi-head-avatar" aria-hidden="true">
            <span className="gimi-head-avatar-inner">G</span>
            <span className="gimi-head-dot" />
          </div>
          <div className="gimi-head-text">
            <div className="gimi-head-title">
              GiMi <span className="gimi-head-badge">AI</span>
            </div>
            <div className="gimi-head-sub">
              {sending
                ? 'Typing…'
                : firstName ? `Hi ${firstName} — ask me anything` : 'Your guide, coach & study buddy'}
            </div>
          </div>
          <div className="gimi-head-actions">
            <button type="button" className="gimi-icon-btn" onClick={clear} title="Clear chat" aria-label="Clear chat">
              {ICONS.trash}
            </button>
            <button type="button" className="gimi-icon-btn" onClick={() => setOpen(false)} title="Close" aria-label="Close">
              {ICONS.close}
            </button>
          </div>
        </header>

        <div className="gimi-body">
          <div
            className="gimi-scroll"
            ref={scrollRef}
            onScroll={onScroll}
            role="log"
            aria-live="polite"
          >
            {showEmptyHero && (
              <div className="gimi-empty">
                <div className="gimi-orb" aria-hidden="true"><span>G</span></div>
                <span className="gimi-empty-badge">✦ GiMi · AI assistant</span>
                <h3>Hi{firstName ? `, ${firstName}` : ''} — what can I help with?</h3>
                <p>Ask about the app, exams or grammar — or just ask for study advice.</p>
              </div>
            )}

            {messages.map((m, i) => (
              <Message
                key={m.id}
                msg={m}
                onRegenerate={regenerate}
                onRoute={goRoute}
                isLast={i === messages.length - 1}
                canRegen={!sending}
              />
            ))}

            {showEmptyHero && (
              <>
                <div className="gimi-topics">
                  {TOPICS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      className="gimi-topic"
                      onClick={() => ask(t.q)}
                      disabled={sending}
                    >
                      <span className="gimi-topic-emoji" aria-hidden="true">{t.emoji}</span>
                      <span className="gimi-topic-label">{t.label}</span>
                    </button>
                  ))}
                </div>
                <p className="gimi-note">
                  GiMi is an AI and can make mistakes. For payments or account issues, email support@fixmyenglish.app.
                </p>
              </>
            )}

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

          {showJump && (
            <button type="button" className="gimi-jump" onClick={jumpToBottom} aria-label="Scroll to latest message">
              {ICONS.down}
            </button>
          )}
        </div>

        {chips.length > 0 && !sending && (
          <div className="gimi-chips" aria-label="Suggested questions">
            {chips.map((c) => (
              <button key={c} type="button" className="gimi-chip" onClick={() => ask(c)}>
                {c}
              </button>
            ))}
          </div>
        )}

        <form className="gimi-composer" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="gimi-input"
            placeholder="Ask GiMi anything…"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={2000}
            enterKeyHint="send"
            aria-label="Message GiMi"
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