const asArray = (v) => (Array.isArray(v) ? v : v?.items || v?.data || []);

export function normalizeVocab(w) {
  return {
    id: w.id ?? w.word, word: w.word || '',
    meaning: w.meaning ?? w.meaningEn ?? '',
    meaningBn: w.meaningBn ?? '', example: w.example ?? '',
    pos: w.pos ?? 'noun', synonyms: w.synonyms ?? [],
    unit: w.textbookUnit ?? w.unit ?? null,
  };
}
export function normalizeDeck(rows) { return asArray(rows).map(normalizeVocab); }

export function normalizeTopic(t) {
  return {
    id: t.id ?? t.slug, slug: t.slug ?? t.id,
    title: t.name ?? t.title ?? '', name: t.name ?? t.title ?? '',
    category: t.category ?? '',
    questions: asArray(t.questions).map(normalizeQuestion),
    questionCount: t.questionCount ?? t.questions?.length ?? 0,
  };
}
export function normalizeQuestion(q) {
  return {
    id: q.id ?? q._id, prompt: q.prompt ?? '', options: asArray(q.options),
    answer: q.answer ?? q.correctAnswer ?? '',
    correctAnswer: q.answer ?? q.correctAnswer ?? '',
    explain: q.explain ?? q.explanation ?? '',
    explanation: q.explain ?? q.explanation ?? '',
    banglaExplain: q.banglaExplain ?? '',
  };
}
export function normalizeCurriculum(c) {
  return {
    id: c.id, title: c.title ?? c.topic ?? '', topic: c.topic ?? c.title ?? '',
    classLevel: c.classLevel ?? c.class ?? '', paper: c.paper ?? '',
    board: c.board ?? '', tag: c.tag ?? '', type: c.type ?? 'question_set',
    body: c.body ?? '', modelAnswer: c.modelAnswer ?? '',
  };
}
export function normalizeTrack(t) {
  return {
    id: t.id ?? t.slug, slug: t.slug ?? t.id, name: t.name ?? '',
    icon: t.icon ?? 'flag',
    sections: asArray(t.sets || t.sections).map(normalizeSet),
  };
}
export function normalizeSet(s) {
  const questionCount =
    s.questionCount ??
    s._count?.questions ??
    (Array.isArray(s.questions) ? s.questions.length : 0);
  const durationMinutes = s.durationMinutes ?? s.mins ?? s.duration ?? 60;

  return {
    id: s.id ?? s._id ?? Math.random().toString(36).slice(2),
    title: s.title ?? s.name ?? '',
    name: s.name ?? s.title ?? '',
    section: s.section ?? '',
    mins: durationMinutes,
    duration: durationMinutes,
    durationMinutes,
    questions: questionCount,
    questionCount,
    isPremium: !!(s.isPremium ?? s.premium),
    icon: s.icon ?? 'book',
  };
}
export function normalizeSpeakingPrompt(p) {
  return {
    id: p.id, trackSlug: p.trackSlug ?? 'ielts',
    category: p.category ?? 'part1',
    promptText: p.promptText ?? p.prompt ?? '',
    prepSeconds: p.prepSeconds ?? 0, responseSeconds: p.responseSeconds ?? 60,
  };
}
export function normalizeCommunityRoom(r) {
  return {
    id: r.id ?? r.slug, name: r.name ?? '', minRank: r.minRank ?? 'Bronze',
    locked: !!(r.isLocked ?? r.locked), live: r.liveCount ?? r.live ?? 0,
    topic: r.topic ?? '',
  };
}
export function normalizeThread(t) {
  return {
    id: t.id, title: t.title ?? '',
    author: t.author?.name ?? t.authorName ?? t.author ?? 'Unknown',
    email: t.author?.email ?? t.email ?? '',
    replies: t.replies ?? t.replyCount ?? 0, status: t.status ?? 'open',
  };
}
export function normalizeLiveRoom(r) {
  if (!r || typeof r !== 'object') return null;

  const maxSeats = Number(r.maxSeats ?? r.seats ?? 100) || 100;
  const participants = Number(r.participants ?? r.joined ?? 0) || 0;
  const durationMins = Number(r.durationMins ?? r.duration ?? 60) || 60;
  const rawStatus = r.status ?? (r.live ? 'live' : 'scheduled');
  const status = String(rawStatus).toLowerCase();
  const scheduledAt = r.scheduledAt ?? null;

  let startsIn = 'Soon';
  if (status === 'live') startsIn = 'Live now';
  else if (scheduledAt) startsIn = formatRelative(scheduledAt);

  return {
    id: String(r.id ?? r._id ?? r.slug ?? Math.random().toString(36).slice(2)),
    title: String(r.title ?? r.name ?? 'Live room'),
    level: String(r.level ?? 'General'),
    status,
    maxSeats, seats: maxSeats,
    participants, joined: participants,
    durationMins, duration: durationMins,
    scheduledAt,
    meetProvider: r.meetProvider ?? null,
    meetLink: r.meetLink ?? r.joinUrl ?? null,
    zoomMeetingId: r.zoomMeetingId ?? r.meetingNumber ?? null,
    live: status === 'live',
    startsIn,
  };
}
function formatRelative(iso) {
  const diff = new Date(iso) - Date.now();
  if (diff <= 0) return 'Starting now';
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.round(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}
export function normalizeProduct(p) {
  return {
    id: p.id ?? p.slug, slug: p.slug ?? p.id, name: p.name ?? '',
    tagline: p.tagline ?? '', type: p.type ?? 'one_time',
    price: p.price ?? p.priceBdt ?? 0, priceBdt: p.priceBdt ?? p.price ?? 0,
    currency: p.currency ?? '৳', period: p.period ?? 'one-time',
    strike: p.strike ?? p.strikeBdt ?? null, strikeBdt: p.strikeBdt ?? p.strike ?? null,
    features: asArray(p.features), icon: p.icon ?? 'flag', featured: !!p.featured,
  };
}
export function normalizeAnnouncement(a) {
  return {
    id: a.id, title: a.title ?? '', body: a.body ?? '',
    audienceTier: a.audienceTier ?? 'all', active: a.active ?? true,
    expiresAt: a.expiresAt ?? null, createdAt: a.createdAt ?? null,
  };
}
export function normalizeFlag(f) {
  return {
    id: f.id ?? f.key, key: f.key ?? '',
    enabled: !!f.enabled, tierScope: f.tierScope ?? 'all',
  };
}
