import { getAccessToken } from './client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function streamGiMiChat({ messages, page, userName, tier, onDelta, signal }) {
  const token = getAccessToken();

  const res = await fetch(`${API_URL}/api/gimi/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages, page, userName, tier }),
    signal,
  });

  if (!res.ok || !res.body) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `GiMi is unavailable (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

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
        if (payload.error) throw new Error(payload.error);
        if (payload.delta) {
          fullText += payload.delta;
          onDelta?.(payload.delta);
        }
      } catch (err) {
        if (err instanceof SyntaxError) continue;
        throw err;
      }
    }
  }
  return fullText;
}

export async function getGiMiSuggestions(page = '/') {
  try {
    const res = await fetch(
      `${API_URL}/api/gimi/suggestions?page=${encodeURIComponent(page)}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.suggestions) ? data.suggestions : [];
  } catch {
    return [];
  }
}
