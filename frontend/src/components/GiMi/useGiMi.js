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
    "Hey! I'm **GiMi** 👋 — your FixMyEnglish guide.\n\nAsk me anything: how a page works, exam tips, pricing, streak rules… I know the whole app.\n\nTry a suggestion below to get started.",
  ts: Date.now(),
};

const FALLBACK_CHIPS = {
  '/': ['What can I do first?', 'How does the streak work?', 'Show me pricing'],
  '/vocabulary': ['How does spaced repetition work?', 'Tips to remember words', 'How does Blitz work?'],
  '/grammar': ['Explain prepositions', 'When to use articles', 'Common tense mistakes'],
  '/curriculum': ['SSC vs HSC writing', 'How to answer seen passages', 'Translation tips'],
  '/exams': ['IELTS vs PTE', 'Which exam should I start with?', 'How are mocks scored?'],
  '/speaking': ['IELTS Part 2 example', 'How to improve fluency', 'How am I scored?'],
  '/progress': ['How do I earn XP fast?', 'What badges can I unlock?', 'How is my rank calculated?'],
  '/community': ['Which room should I join?', 'How do squads work?', 'Community rules'],
  '/live-rooms': ['How do live rooms work?', 'What is priority seating?', 'When do classes run?'],
  '/pricing': ['Which plan is best for IELTS?', 'Can I cancel any time?', 'Payment methods'],
  '/profile': ['How do I reset my password?', 'How do I upgrade?', 'Delete my account'],
  '/login': ['How do I register?', 'Is there a free plan?', 'What is guest mode?'],
};

function loadHistory() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map((m) => ({ ...m, streaming: false }));
    }
  } catch { /* ignore */ }
  return [WELCOME];
}

function saveHistory(msgs) {
  try {
    const clean = msgs.filter((m) => !m.streaming).slice(-MAX_STORED);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch { /* ignore */ }
}

export function useGiMi() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const [messages, setMessages] = useState(loadHistory);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const abortRef = useRef(null);
  const lastUserRef = useRef(null);
  const messagesRef = useRef(messages);   // always the latest list (avoids stale closures)
  const sendRef = useRef(null);
  messagesRef.current = messages;

  /* Persist history */
  useEffect(() => { saveHistory(messages); }, [messages]);

  /* Page-aware suggestions (server → fallback) */
  useEffect(() => {
    let cancelled = false;
    const fallback = FALLBACK_CHIPS[pathname] || FALLBACK_CHIPS['/'];
    const url = `${API_URL}/api/gimi/suggestions?page=${encodeURIComponent(pathname)}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.suggestions) ? data.suggestions : [];
        setSuggestions(list.length ? list : fallback);
      })
      .catch(() => { if (!cancelled) setSuggestions(fallback); });
    return () => { cancelled = true; };
  }, [pathname]);

  useEffect(() => () => abortRef.current?.abort(), []);

  /* ---------- Core send (SSE) ---------- */
  const send = useCallback(async (text) => {
    const content = String(text || '').trim();
    if (!content || sending) return;

    setError(null);
    lastUserRef.current = content;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', content, ts: Date.now() };
    const botId = `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const botMsg = { id: botId, role: 'assistant', content: '', ts: Date.now(), streaming: true };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setSending(true);

    // Only real, non-empty turns go to the server (empty or error bubbles would
    // fail validation / poison the context), and the list must start with a user turn.
    const history = [
      ...messagesRef.current.filter((m) => m.id !== 'welcome' && !m.error && !m.streaming && m.content),
      userMsg,
    ]
      .slice(-12)
      .map(({ role, content: c }) => ({ role, content: c }));
    while (history.length > 1 && history[0].role !== 'user') history.shift();

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

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          try {
            const json = JSON.parse(payload);
            if (json.delta) {
              acc += json.delta;
              setMessages((prev) =>
                prev.map((m) => (m.id === botId ? { ...m, content: acc, streaming: true } : m))
              );
            }
            if (json.error) throw new Error(json.error);
          } catch (err) {
            if (err instanceof SyntaxError) continue;
            throw err;
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? { ...m, content: acc || "I didn't catch that — could you try again?", streaming: false }
            : m
        )
      );
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setError(err?.message || 'GiMi hit a snag. Try again?');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? {
                ...m,
                content: "Sorry — I couldn't reach my brain just now. Try again in a moment.",
                streaming: false,
                error: true,
              }
            : m
        )
      );
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }, [pathname, user, sending]);
  sendRef.current = send;

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setSending(false);
    setMessages((prev) =>
      prev.filter((m) => !(m.streaming && !m.content)).map((m) => (m.streaming ? { ...m, streaming: false } : m))
    );
  }, []);

  const clear = useCallback(() => {
    setMessages([WELCOME]);
    setError(null);
  }, []);

  const regenerate = useCallback(() => {
    if (sending) return;
    const current = messagesRef.current;
    const lastUser =
      lastUserRef.current || [...current].reverse().find((m) => m.role === 'user')?.content;
    if (!lastUser) return;
    const trimmed = [...current];
    while (trimmed.length && trimmed[trimmed.length - 1].role === 'assistant') trimmed.pop();
    if (trimmed.length && trimmed[trimmed.length - 1].role === 'user') trimmed.pop();
    messagesRef.current = trimmed;
    setMessages(trimmed.length ? trimmed : [WELCOME]);
    setTimeout(() => sendRef.current?.(lastUser), 0);
  }, [sending]);

  return { messages, suggestions, sending, error, send, stop, clear, regenerate, page: pathname };
}