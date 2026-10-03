import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const STORAGE_KEY = 'ec_gimi_history_v2';
const MAX_STORED = 40;

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey! I'm **GiMi** 👋 — your FixMyEnglish guide.\n\nAsk me anything: how a page works, exam tips, pricing, streak rules… I know the whole app.",
  ts: Date.now(),
};

function loadHistory() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map((m) => ({ ...m, streaming: false }));
    }
  } catch {}
  return [WELCOME];
}

function saveHistory(msgs) {
  try {
    const clean = msgs.filter((m) => !m.streaming).slice(-MAX_STORED);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch {}
}

const PAGE_FALLBACK_CHIPS = {
  '/': ['What can I do first?', 'How does the streak work?', 'Show me pricing'],
  '/vocabulary': ['How does spaced repetition work?', 'Tips to remember words'],
  '/grammar': ['Explain prepositions', 'When to use articles'],
  '/exams': ['IELTS vs PTE', 'Which exam should I start with?'],
  '/speaking': ['IELTS Part 2 example', 'How to improve fluency'],
  '/pricing': ['Which plan is best?', 'Payment methods'],
  '/profile': ['How do I reset my password?', 'Delete my account'],
};

export function useGiMi() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const [messages, setMessages] = useState(loadHistory);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const abortRef = useRef(null);
  const lastUserRef = useRef(null);

  /* ─── Persist ─── */
  useEffect(() => { saveHistory(messages); }, [messages]);

  /* ─── Fetch page-aware suggestions ─── */
  useEffect(() => {
    let cancelled = false;
    const url = `${API_URL}/api/gimi/suggestions?page=${encodeURIComponent(pathname)}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data && Array.isArray(data.suggestions) && data.suggestions.length) {
          setSuggestions(data.suggestions);
        } else {
          setSuggestions(PAGE_FALLBACK_CHIPS[pathname] || PAGE_FALLBACK_CHIPS['/']);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions(PAGE_FALLBACK_CHIPS[pathname] || PAGE_FALLBACK_CHIPS['/']);
      });
    return () => { cancelled = true; };
  }, [pathname]);

  /* ─── Abort on unmount ─── */
  useEffect(() => () => abortRef.current?.abort(), []);

  /* ─── Core send ─── */
  const send = useCallback(async (text) => {
    const content = String(text || '').trim();
    if (!content || sending) return;

    setError(null);
    lastUserRef.current = content;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', content, ts: Date.now() };
    const botId = `a-${Date.now()}`;
    const botMsg = { id: botId, role: 'assistant', content: '', ts: Date.now(), streaming: true };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setSending(true);

    const history = [...messages.filter((m) => m.id !== 'welcome'), userMsg]
      .slice(-12)
      .map(({ role, content }) => ({ role, content }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_URL}/api/gimi/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          page: pathname,
          userName: user?.name,
          tier: user?.tier,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let acc = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          try {
            const payload = JSON.parse(trimmed.slice(5).trim());
            if (payload.delta) {
              acc += payload.delta;
              setMessages((prev) =>
                prev.map((m) => m.id === botId ? { ...m, content: acc, streaming: true } : m)
              );
            }
            if (payload.error) throw new Error(payload.error);
          } catch (err) {
            if (err instanceof SyntaxError) continue;
            throw err;
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId ? { ...m, content: acc || '*(no response)*', streaming: false } : m
        )
      );
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setError(err?.message || 'GiMi hit a snag. Try again?');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? { ...m, content: "Sorry — I couldn't reach my brain just now. Try again in a moment.", streaming: false, error: true }
            : m
        )
      );
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }, [messages, pathname, user, sending]);

  /* ─── Stop generation ─── */
  const stop = useCallback(() => {
    abortRef.current?.abort();
    setSending(false);
    setMessages((prev) => prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)));
  }, []);

  /* ─── Clear history ─── */
  const clear = useCallback(() => {
    setMessages([WELCOME]);
    setError(null);
  }, []);

  /* ─── Regenerate last response ─── */
  const regenerate = useCallback(() => {
    const lastUser = lastUserRef.current;
    if (!lastUser || sending) return;

    // Remove last assistant message
    setMessages((prev) => {
      const copy = [...prev];
      while (copy.length && copy[copy.length - 1].role === 'assistant') copy.pop();
      return copy;
    });

    // Small delay so state settles
    setTimeout(() => { send(lastUser); }, 80);
  }, [send, sending]);

  return {
    messages,
    suggestions,
    sending,
    error,
    send,
    stop,
    clear,
    regenerate,
    page: pathname,
  };
}
