import { env } from '../../config/env.js';
import { log } from '../../lib/logger.js';
import {
  SYSTEM_PROMPT,
  ALL_ENTRIES,
  searchKnowledge,
  suggestForPage,
} from './knowledge.js';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  messages: ChatMessage[];
  page?: string;
  userName?: string;
  tier?: string;
  signal?: AbortSignal;
}

function pickProvider(): 'openai' | 'anthropic' | 'mock' {
  const p = (env as any).aiProvider;
  const oa = (env as any).openaiApiKey;
  const an = (env as any).anthropicApiKey;
  if (p === 'openai' && oa) return 'openai';
  if (p === 'anthropic' && an) return 'anthropic';
  if (oa) return 'openai';
  if (an) return 'anthropic';
  return 'mock';
}

function buildContext(opts: ChatOptions): string {
  const lastUser = [...opts.messages].reverse().find((m) => m.role === 'user');
  const lastText = lastUser?.content ?? '';
  const relevant = lastText ? searchKnowledge(lastText, 3) : [];
  const page = opts.page || '/';
  const suggestions = suggestForPage(page);

  const contextBlock = relevant.length
    ? relevant.map((e) => `### ${e.topic}\n${e.answer}`).join('\n\n')
    : '*(no specific KB match — rely on general knowledge)*';

  return [
    `USER CONTEXT:`,
    `- Name: ${opts.userName || 'Guest'}`,
    `- Tier: ${opts.tier || 'guest'}`,
    `- Current page: ${page}`,
    `- Suggested follow-ups: ${suggestions.join(' | ')}`,
    ``,
    `RELEVANT KNOWLEDGE BASE:`,
    contextBlock,
  ].join('\n');
}

function trimHistory(messages: ChatMessage[], maxTurns = 8): ChatMessage[] {
  const convo = messages.filter((m) => m.role !== 'system');
  return convo.slice(-maxTurns * 2);
}

async function streamOpenAI(opts: ChatOptions): Promise<ReadableStream<Uint8Array>> {
  const apiKey = (env as any).openaiApiKey;
  const base = (env as any).openaiBaseUrl || 'https://api.openai.com/v1';
  const model = (env as any).aiModel || 'gpt-4o-mini';

  const body = {
    model,
    stream: true,
    temperature: 0.6,
    max_tokens: 800,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT + '\n\n' + buildContext(opts) },
      ...trimHistory(opts.messages),
    ],
  };

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: opts.signal,
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => '');
    throw new Error(`OpenAI error ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.body;
}

async function streamAnthropic(opts: ChatOptions): Promise<ReadableStream<Uint8Array>> {
  const apiKey = (env as any).anthropicApiKey;
  const base = (env as any).anthropicBaseUrl || 'https://api.anthropic.com/v1';
  const model = (env as any).aiModel || 'claude-3-5-haiku-latest';

  const body = {
    model,
    stream: true,
    max_tokens: 800,
    system: SYSTEM_PROMPT + '\n\n' + buildContext(opts),
    messages: trimHistory(opts.messages)
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content })),
  };

  const res = await fetch(`${base}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
    signal: opts.signal,
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Anthropic error ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.body;
}

function streamMock(opts: ChatOptions): ReadableStream<Uint8Array> {
  const lastUser = [...opts.messages].reverse().find((m) => m.role === 'user');
  const text = lastUser?.content ?? '';
  const hits = searchKnowledge(text, 2);

  let answer: string;
  if (hits.length) {
    const [first, second] = hits;
    answer = first.answer;
    if (second) answer += `\n\n---\n\n**Also relevant — ${second.topic}:**\n${second.answer}`;
  } else {
    const sug = suggestForPage(opts.page);
    answer =
      `I'm not 100% sure about that one yet 😅 — but here's what I *can* help with:\n\n` +
      sug.map((s) => `- ${s}`).join('\n') +
      `\n\nTry rephrasing, or ask me about any of the pages in FixMyEnglish.`;
  }

  const tokens = answer.split(/(\s+)/);
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for (const t of tokens) {
        if (opts.signal?.aborted) break;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: t })}\n\n`));
        await new Promise((r) => setTimeout(r, 18));
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
      controller.close();
    },
  });
}

function normalizeStream(
  raw: ReadableStream<Uint8Array>,
  provider: 'openai' | 'anthropic'
): ReadableStream<Uint8Array> {
  const reader = raw.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload);

            if (provider === 'openai') {
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
              }
            } else {
              if (parsed.type === 'content_block_delta') {
                const delta = parsed.delta?.text;
                if (delta) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
                }
              }
            }
          } catch {
            /* skip */
          }
        }
      } catch (err: any) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: String(err?.message || err) })}\n\n`)
        );
        controller.close();
      }
    },
  });
}

export async function streamChat(opts: ChatOptions): Promise<ReadableStream<Uint8Array>> {
  const provider = pickProvider();
  log.info(`[GiMi] provider=${provider} page=${opts.page} tier=${opts.tier}`);

  try {
    if (provider === 'openai') return normalizeStream(await streamOpenAI(opts), 'openai');
    if (provider === 'anthropic') return normalizeStream(await streamAnthropic(opts), 'anthropic');
    return streamMock(opts);
  } catch (err) {
    log.error('[GiMi] provider error, falling back to mock:', err);
    return streamMock(opts);
  }
}

export async function askOnce(opts: ChatOptions): Promise<string> {
  const stream = await streamChat(opts);
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const t = line.trim();
      if (!t.startsWith('data:')) continue;
      try {
        const p = JSON.parse(t.slice(5).trim());
        if (p.delta) out += p.delta;
      } catch {}
    }
  }
  return out.trim();
}

export { ALL_ENTRIES, suggestForPage };