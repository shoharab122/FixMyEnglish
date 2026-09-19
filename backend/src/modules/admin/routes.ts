import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { requireAdmin, requireSuperAdmin } from '../../middleware/admin.js';
import { prisma } from '../../lib/prisma.js';
import { BadRequest, NotFound } from '../../lib/errors.js';

const router = Router();
router.use(requireAuth, requireAdmin);

/* ---------- Audit log helper ---------- */
async function log(actor: any, action: string, targetType?: string, targetId?: string, meta?: any) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actor?.id ?? null,
        actorName: actor?.name ?? null,
        action, targetType, targetId,
        metaJson: meta ?? undefined,
      },
    });
  } catch { /* swallow */ }
}

/* ══════════════════════════════════════════════════════
   DASHBOARD & ANALYTICS
   ══════════════════════════════════════════════════════ */
router.get('/stats', async (_req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [totalUsers, premiumUsers, guestUsers, totalVocab, totalGrammarQ, totalLiveRooms,
      totalPurchases, revenueAgg, xpToday, activeToday, recentUsers, recentPurchases] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { tier: 'premium' } }),
      prisma.user.count({ where: { tier: 'guest' } }),
      prisma.vocabWord.count(),
      prisma.grammarQuestion.count(),
      prisma.liveRoom.count(),
      prisma.purchase.count({ where: { status: 'paid' } }),
      prisma.purchase.aggregate({ where: { status: 'paid' }, _sum: { amountBdt: true } }),
      prisma.userStatsDaily.aggregate({ where: { date: today }, _sum: { xpEarned: true } }),
      prisma.userStatsDaily.count({ where: { date: today } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 8, select: { id: true, name: true, email: true, tier: true, role: true, createdAt: true } }),
      prisma.purchase.findMany({ where: { status: 'paid' }, orderBy: { purchasedAt: 'desc' }, take: 8, include: { product: true, user: { select: { name: true, email: true } } } }),
    ]);
    res.json({
      users: { total: totalUsers, premium: premiumUsers, guest: guestUsers, activeToday },
      content: { vocab: totalVocab, grammarQuestions: totalGrammarQ },
      liveRooms: { total: totalLiveRooms },
      payments: { paidPurchases: totalPurchases, revenueBdt: revenueAgg._sum.amountBdt ?? 0 },
      xpToday: xpToday._sum.xpEarned ?? 0,
      recentUsers, recentPurchases,
    });
  } catch (e) { next(e); }
});

router.get('/analytics', async (_req, res, next) => {
  try {
    const days = 14;
    const series: any[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const [xp, answered, revenue] = await Promise.all([
        prisma.userStatsDaily.aggregate({ where: { date: d }, _sum: { xpEarned: true } }),
        prisma.userStatsDaily.aggregate({ where: { date: d }, _sum: { questionsAnswered: true } }),
        prisma.purchase.aggregate({ where: { purchasedAt: { gte: d, lt: new Date(d.getTime() + 86400000) }, status: 'paid' }, _sum: { amountBdt: true } }),
      ]);
      series.push({
        date: d.toISOString().slice(0, 10),
        xp: xp._sum.xpEarned ?? 0,
        questionsAnswered: answered._sum.questionsAnswered ?? 0,
        revenueBdt: revenue._sum.amountBdt ?? 0,
      });
    }
    res.json({ series });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   USERS
   ══════════════════════════════════════════════════════ */
router.get('/users', async (req, res, next) => {
  try {
    const q = String(req.query.q ?? '').trim();
    const tier = req.query.tier ? String(req.query.tier) : undefined;
    const role = req.query.role ? String(req.query.role) : undefined;
    const take = Math.min(200, Number(req.query.take) || 50);
    const where: any = {};
    if (q) where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
    if (tier) where.tier = tier;
    if (role) where.role = role;
    const users = await prisma.user.findMany({
      where, orderBy: { createdAt: 'desc' }, take,
      select: { id: true, name: true, email: true, tier: true, role: true, xp: true, isGuest: true, createdAt: true },
    });
    res.json(users);
  } catch (e) { next(e); }
});

router.patch('/users/:id', async (req, res, next) => {
  try {
    const { tier, role, name } = req.body ?? {};
    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) throw NotFound('User not found');
    if (role && req.user!.role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can change roles' });
    }
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { ...(tier ? { tier } : {}), ...(role ? { role } : {}), ...(name ? { name } : {}) },
    });
    await log(req.user, 'user.update', 'User', updated.id, { tier, role, name });
    res.json({ id: updated.id, name: updated.name, tier: updated.tier, role: updated.role });
  } catch (e) { next(e); }
});

router.delete('/users/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    await log(req.user, 'user.delete', 'User', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   VOCABULARY
   ══════════════════════════════════════════════════════ */
router.get('/vocab', async (req, res, next) => {
  try {
    const q = String(req.query.q ?? '').trim();
    const take = Math.min(300, Number(req.query.take) || 100);
    const where = q ? { word: { contains: q, mode: 'insensitive' as const } } : {};
    res.json(await prisma.vocabWord.findMany({ where, orderBy: { word: 'asc' }, take }));
  } catch (e) { next(e); }
});
router.post('/vocab', async (req, res, next) => {
  try {
    const { word, meaningEn, meaningBn, example, pos, synonyms, textbookUnit } = req.body ?? {};
    if (!word || !meaningEn) throw BadRequest('word and meaningEn required');
    const created = await prisma.vocabWord.create({ data: { word, meaningEn, meaningBn, example, pos, synonyms: synonyms ?? [], textbookUnit } });
    await log(req.user, 'vocab.create', 'VocabWord', created.id, { word });
    res.json(created);
  } catch (e) { next(e); }
});
router.patch('/vocab/:id', async (req, res, next) => {
  try {
    const updated = await prisma.vocabWord.update({ where: { id: req.params.id }, data: req.body ?? {} });
    await log(req.user, 'vocab.update', 'VocabWord', updated.id);
    res.json(updated);
  } catch (e) { next(e); }
});
router.delete('/vocab/:id', async (req, res, next) => {
  try {
    await prisma.vocabWord.delete({ where: { id: req.params.id } });
    await log(req.user, 'vocab.delete', 'VocabWord', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   GRAMMAR
   ══════════════════════════════════════════════════════ */
router.get('/grammar/topics', async (_req, res, next) => {
  try {
    const topics = await prisma.grammarTopic.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { questions: true } } } });
    res.json(topics.map((t) => ({ id: t.id, slug: t.slug, name: t.name, category: t.category, questionCount: t._count.questions })));
  } catch (e) { next(e); }
});
router.post('/grammar/topics', async (req, res, next) => {
  try {
    const { slug, name, category } = req.body ?? {};
    if (!slug || !name) throw BadRequest('slug and name required');
    const created = await prisma.grammarTopic.create({ data: { slug, name, category: category ?? 'general' } });
    await log(req.user, 'grammar.topic.create', 'GrammarTopic', created.id, { name });
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/grammar/topics/:id', async (req, res, next) => {
  try {
    await prisma.grammarTopic.delete({ where: { id: req.params.id } });
    await log(req.user, 'grammar.topic.delete', 'GrammarTopic', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
router.get('/grammar/questions', async (req, res, next) => {
  try {
    const topicId = req.query.topicId ? String(req.query.topicId) : undefined;
    res.json(await prisma.grammarQuestion.findMany({ where: topicId ? { topicId } : {}, take: 300 }));
  } catch (e) { next(e); }
});
router.post('/grammar/questions', async (req, res, next) => {
  try {
    const { topicId, prompt, options, correctAnswer, explanation, banglaExplain } = req.body ?? {};
    if (!topicId || !prompt || !correctAnswer) throw BadRequest('topicId, prompt, correctAnswer required');
    const created = await prisma.grammarQuestion.create({ data: { topicId, prompt, options: options ?? [], correctAnswer, explanation, banglaExplain } });
    await log(req.user, 'grammar.question.create', 'GrammarQuestion', created.id, { prompt });
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/grammar/questions/:id', async (req, res, next) => {
  try {
    await prisma.grammarQuestion.delete({ where: { id: req.params.id } });
    await log(req.user, 'grammar.question.delete', 'GrammarQuestion', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   CURRICULUM
   ══════════════════════════════════════════════════════ */
router.get('/curriculum', async (req, res, next) => {
  try {
    const cls = req.query.class ? String(req.query.class) : undefined;
    const type = req.query.type ? String(req.query.type) : undefined;
    const rows = await prisma.curriculumContent.findMany({
      where: { ...(cls ? { classLevel: cls } : {}), ...(type ? { type } : {}) },
      orderBy: { topic: 'asc' }, take: 300,
    });
    res.json(rows);
  } catch (e) { next(e); }
});
router.post('/curriculum', async (req, res, next) => {
  try {
    const { classLevel, paper, board, topic, tag, type, body, modelAnswer, banglaExplain } = req.body ?? {};
    if (!classLevel || !topic) throw BadRequest('classLevel and topic required');
    const created = await prisma.curriculumContent.create({ data: { classLevel, paper: paper ?? '1st Paper', board, topic, tag: tag ?? 'General', type: type ?? 'question_set', body, modelAnswer, banglaExplain } });
    await log(req.user, 'curriculum.create', 'CurriculumContent', created.id, { topic });
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/curriculum/:id', async (req, res, next) => {
  try {
    await prisma.curriculumContent.delete({ where: { id: req.params.id } });
    await log(req.user, 'curriculum.delete', 'CurriculumContent', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   EXAMS
   ══════════════════════════════════════════════════════ */
router.get('/exams/tracks', async (_req, res, next) => {
  try {
    const tracks = await prisma.examTrack.findMany({ include: { sets: { include: { _count: { select: { questions: true } } } } } });
    res.json(tracks.map((t) => ({
      id: t.id, slug: t.slug, name: t.name, icon: t.icon,
      sets: t.sets.map((s) => ({ id: s.id, section: s.section, title: s.title, durationMinutes: s.durationMinutes, isPremium: s.isPremium, questionCount: s._count.questions })),
    })));
  } catch (e) { next(e); }
});
router.post('/exams/tracks', async (req, res, next) => {
  try {
    const { slug, name, icon } = req.body ?? {};
    if (!slug || !name) throw BadRequest('slug and name required');
    const created = await prisma.examTrack.create({ data: { slug, name, icon: icon ?? 'flag' } });
    await log(req.user, 'exam.track.create', 'ExamTrack', created.id, { name });
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/exams/tracks/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    await prisma.examTrack.delete({ where: { id: req.params.id } });
    await log(req.user, 'exam.track.delete', 'ExamTrack', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
router.get('/exams/sets/:id/questions', async (req, res, next) => {
  try {
    res.json(await prisma.examQuestion.findMany({ where: { examSetId: req.params.id }, orderBy: { orderIndex: 'asc' } }));
  } catch (e) { next(e); }
});
router.post('/exams/sets', async (req, res, next) => {
  try {
    const { trackId, title, section, durationMinutes, isPremium } = req.body ?? {};
    if (!trackId || !title || !section) throw BadRequest('trackId, title, section required');
    const created = await prisma.examSet.create({ data: { trackId, title, section, durationMinutes: durationMinutes ?? 60, isPremium: !!isPremium } });
    await log(req.user, 'exam.set.create', 'ExamSet', created.id, { title });
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/exams/sets/:id', async (req, res, next) => {
  try {
    await prisma.examSet.delete({ where: { id: req.params.id } });
    await log(req.user, 'exam.set.delete', 'ExamSet', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
router.post('/exams/questions', async (req, res, next) => {
  try {
    const { examSetId, orderIndex, prompt, options, correctAnswer, points } = req.body ?? {};
    if (!examSetId || !prompt || !correctAnswer) throw BadRequest('examSetId, prompt, correctAnswer required');
    const created = await prisma.examQuestion.create({ data: { examSetId, orderIndex: orderIndex ?? 0, prompt, options: options ?? [], correctAnswer, points: points ?? 1 } });
    await log(req.user, 'exam.question.create', 'ExamQuestion', created.id, { prompt });
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/exams/questions/:id', async (req, res, next) => {
  try {
    await prisma.examQuestion.delete({ where: { id: req.params.id } });
    await log(req.user, 'exam.question.delete', 'ExamQuestion', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   SPEAKING PROMPTS
   ══════════════════════════════════════════════════════ */
router.get('/speaking/prompts', async (_req, res, next) => {
  try {
    res.json(await prisma.speakingPrompt.findMany({ take: 300 }));
  } catch (e) { next(e); }
});
router.post('/speaking/prompts', async (req, res, next) => {
  try {
    const { trackSlug, category, promptText, prepSeconds, responseSeconds } = req.body ?? {};
    if (!promptText) throw BadRequest('promptText required');
    const created = await prisma.speakingPrompt.create({ data: { trackSlug: trackSlug ?? 'general', category: category ?? 'general', promptText, prepSeconds: prepSeconds ?? 0, responseSeconds: responseSeconds ?? 60 } });
    await log(req.user, 'speaking.prompt.create', 'SpeakingPrompt', created.id);
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/speaking/prompts/:id', async (req, res, next) => {
  try {
    await prisma.speakingPrompt.delete({ where: { id: req.params.id } });
    await log(req.user, 'speaking.prompt.delete', 'SpeakingPrompt', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   COMMUNITY
   ══════════════════════════════════════════════════════ */
router.get('/community/threads', async (_req, res, next) => {
  try {
    const threads = await prisma.peerThread.findMany({
      include: { user: { select: { name: true, email: true } }, _count: { select: { replies: true } } },
      orderBy: { createdAt: 'desc' }, take: 200,
    });
    res.json(threads.map((t) => ({
      id: t.id, title: t.title, body: t.body, status: t.status,
      author: t.user?.name, email: t.user?.email, replies: t._count.replies, createdAt: t.createdAt,
    })));
  } catch (e) { next(e); }
});
router.patch('/community/threads/:id', async (req, res, next) => {
  try {
    const { status } = req.body ?? {};
    const t = await prisma.peerThread.update({ where: { id: req.params.id }, data: { status } });
    await log(req.user, 'community.thread.update', 'PeerThread', t.id, { status });
    res.json(t);
  } catch (e) { next(e); }
});
router.delete('/community/threads/:id', async (req, res, next) => {
  try {
    await prisma.peerThread.delete({ where: { id: req.params.id } });
    await log(req.user, 'community.thread.delete', 'PeerThread', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
router.get('/community/rooms', async (_req, res, next) => {
  try { res.json(await prisma.chatRoom.findMany()); } catch (e) { next(e); }
});
router.patch('/community/rooms/:id', async (req, res, next) => {
  try {
    const updated = await prisma.chatRoom.update({ where: { id: req.params.id }, data: req.body ?? {} });
    await log(req.user, 'community.room.update', 'ChatRoom', updated.id);
    res.json(updated);
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   LIVE ROOMS
   ══════════════════════════════════════════════════════ */
router.get('/live-rooms', async (_req, res, next) => {
  try {
    const rooms = await prisma.liveRoom.findMany({ orderBy: { scheduledAt: 'desc' }, include: { _count: { select: { participants: true } } } });
    res.json(rooms.map((r) => ({
      id: r.id, title: r.title, status: r.status, level: r.level, scheduledAt: r.scheduledAt,
      durationMins: r.durationMins, maxSeats: r.maxSeats, participants: r._count.participants,
    })));
  } catch (e) { next(e); }
});
router.post('/live-rooms', async (req, res, next) => {
  try {
    const { title, level, durationMins, maxSeats, scheduledAt } = req.body ?? {};
    if (!title) throw BadRequest('title required');
    const created = await prisma.liveRoom.create({
      data: { title, level: level ?? 'General', durationMins: durationMins ?? 60, maxSeats: maxSeats ?? 100, scheduledAt: scheduledAt ? new Date(scheduledAt) : null, status: 'scheduled' },
    });
    await log(req.user, 'liveRoom.create', 'LiveRoom', created.id, { title });
    res.json(created);
  } catch (e) { next(e); }
});
router.patch('/live-rooms/:id', async (req, res, next) => {
  try {
    const updated = await prisma.liveRoom.update({ where: { id: req.params.id }, data: req.body ?? {} });
    await log(req.user, 'liveRoom.update', 'LiveRoom', updated.id);
    res.json(updated);
  } catch (e) { next(e); }
});
router.delete('/live-rooms/:id', async (req, res, next) => {
  try {
    await prisma.liveRoom.delete({ where: { id: req.params.id } });
    await log(req.user, 'liveRoom.delete', 'LiveRoom', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   PRODUCTS (superadmin for writes)
   ══════════════════════════════════════════════════════ */
router.get('/products', async (_req, res, next) => {
  try { res.json(await prisma.product.findMany({ orderBy: { priceBdt: 'asc' } })); } catch (e) { next(e); }
});
router.post('/products', requireSuperAdmin, async (req, res, next) => {
  try {
    const { slug, name, tagline, type, priceBdt, period, strikeBdt, features, icon, featured } = req.body ?? {};
    if (!slug || !name || !priceBdt) throw BadRequest('slug, name, priceBdt required');
    const created = await prisma.product.create({
      data: { slug, name, tagline, type: type ?? 'one_time', priceBdt: Number(priceBdt), period: period ?? 'one-time', strikeBdt: strikeBdt ? Number(strikeBdt) : null, features: features ?? [], icon: icon ?? 'flag', featured: !!featured },
    });
    await log(req.user, 'product.create', 'Product', created.id, { name });
    res.json(created);
  } catch (e) { next(e); }
});
router.patch('/products/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    const updated = await prisma.product.update({ where: { id: req.params.id }, data: req.body ?? {} });
    await log(req.user, 'product.update', 'Product', updated.id);
    res.json(updated);
  } catch (e) { next(e); }
});
router.delete('/products/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    await log(req.user, 'product.delete', 'Product', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   COUPONS (superadmin)
   ══════════════════════════════════════════════════════ */
router.get('/coupons', requireSuperAdmin, async (_req, res, next) => {
  try { res.json(await prisma.coupon.findMany({ orderBy: { validFrom: 'desc' } })); } catch (e) { next(e); }
});
router.post('/coupons', requireSuperAdmin, async (req, res, next) => {
  try {
    const { code, discountPct, validTo, maxUses } = req.body ?? {};
    if (!code || !discountPct) throw BadRequest('code, discountPct required');
    const created = await prisma.coupon.create({ data: { code: String(code).toUpperCase(), discountPct: Number(discountPct), validTo: validTo ? new Date(validTo) : null, maxUses: maxUses ?? 100 } });
    await log(req.user, 'coupon.create', 'Coupon', created.id, { code });
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/coupons/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } });
    await log(req.user, 'coupon.delete', 'Coupon', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   PURCHASES (superadmin)
   ══════════════════════════════════════════════════════ */
router.get('/purchases', requireSuperAdmin, async (req, res, next) => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const purchases = await prisma.purchase.findMany({
      where: status ? { status } : {},
      include: { user: { select: { name: true, email: true } }, product: true },
      orderBy: { purchasedAt: 'desc' }, take: 200,
    });
    res.json(purchases.map((p) => ({
      id: p.id, user: p.user, product: p.product.name, productId: p.productId,
      amountBdt: p.amountBdt, method: p.method, status: p.status,
      gatewayTxnId: p.gatewayTxnId, purchasedAt: p.purchasedAt, expiresAt: p.expiresAt,
    })));
  } catch (e) { next(e); }
});
router.patch('/purchases/:id/refund', requireSuperAdmin, async (req, res, next) => {
  try {
    const p = await prisma.purchase.update({ where: { id: req.params.id }, data: { status: 'refunded' } });
    const prod = await prisma.product.findUnique({ where: { id: p.productId } });
    if (prod?.type === 'subscription') {
      await prisma.user.update({ where: { id: p.userId }, data: { tier: 'free' } });
    }
    await log(req.user, 'purchase.refund', 'Purchase', p.id, { amount: p.amountBdt });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   ANNOUNCEMENTS (superadmin)
   ══════════════════════════════════════════════════════ */
router.get('/announcements', requireSuperAdmin, async (_req, res, next) => {
  try { res.json(await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })); } catch (e) { next(e); }
});
router.post('/announcements', requireSuperAdmin, async (req, res, next) => {
  try {
    const { title, body, audienceTier, expiresAt } = req.body ?? {};
    if (!title || !body) throw BadRequest('title and body required');
    const created = await prisma.announcement.create({ data: { title, body, audienceTier: audienceTier ?? 'all', expiresAt: expiresAt ? new Date(expiresAt) : null } });
    await log(req.user, 'announcement.create', 'Announcement', created.id, { title });
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/announcements/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    await log(req.user, 'announcement.delete', 'Announcement', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   FEATURE FLAGS (superadmin)
   ══════════════════════════════════════════════════════ */
router.get('/feature-flags', requireSuperAdmin, async (_req, res, next) => {
  try { res.json(await prisma.featureFlag.findMany({ orderBy: { key: 'asc' } })); } catch (e) { next(e); }
});
router.post('/feature-flags', requireSuperAdmin, async (req, res, next) => {
  try {
    const { key, enabled, tierScope } = req.body ?? {};
    if (!key) throw BadRequest('key required');
    const created = await prisma.featureFlag.upsert({
      where: { key },
      create: { key, enabled: !!enabled, tierScope: tierScope ?? 'all' },
      update: { enabled: !!enabled, tierScope: tierScope ?? 'all' },
    });
    await log(req.user, 'featureFlag.upsert', 'FeatureFlag', created.id, { key, enabled });
    res.json(created);
  } catch (e) { next(e); }
});
router.delete('/feature-flags/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    await prisma.featureFlag.delete({ where: { id: req.params.id } });
    await log(req.user, 'featureFlag.delete', 'FeatureFlag', req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════════════════
   AUDIT LOG (superadmin)
   ══════════════════════════════════════════════════════ */
router.get('/audit-log', requireSuperAdmin, async (req, res, next) => {
  try {
    const take = Math.min(500, Number(req.query.take) || 200);
    res.json(await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take }));
  } catch (e) { next(e); }
});

export default router;
