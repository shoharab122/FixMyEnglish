import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json({ results: [], query: q });
    const like = { contains: q, mode: 'insensitive' as const };
    const limit = 6;

    const [vocab, grammarTopics, curriculum, examTracks, liveRooms] = await Promise.all([
      prisma.vocabWord.findMany({ where: { OR: [{ word: like }, { meaningEn: like }] }, take: limit }).catch(() => []),
      prisma.grammarTopic.findMany({ where: { OR: [{ name: like }, { slug: like }] }, take: limit }).catch(() => []),
      prisma.curriculumContent.findMany({ where: { topic: like }, take: limit }).catch(() => []),
      prisma.examTrack.findMany({ where: { OR: [{ name: like }, { slug: like }] }, take: limit }).catch(() => []),
      prisma.liveRoom.findMany({ where: { title: like }, take: limit }).catch(() => []),
    ]);

    const results = [
      ...vocab.map((v: any) => ({ kind: 'vocabulary', id: v.id, title: v.word, subtitle: (v.meaningEn || '').slice(0, 80), to: '/vocabulary' })),
      ...grammarTopics.map((t: any) => ({ kind: 'grammar', id: t.id, title: t.name, subtitle: t.category || 'Grammar topic', to: '/grammar' })),
      ...curriculum.map((c: any) => ({ kind: 'curriculum', id: c.id, title: c.topic || c.title, subtitle: `${c.classLevel || ''} ${c.paper || ''}`.trim(), to: '/curriculum' })),
      ...examTracks.map((t: any) => ({ kind: 'exam', id: t.id, title: t.name, subtitle: 'Exam track', to: '/exams' })),
      ...liveRooms.map((r: any) => ({ kind: 'live', id: r.id, title: r.title, subtitle: r.status === 'live' ? '🔴 Live now' : 'Scheduled', to: '/live-rooms' })),
    ];

    res.json({ results, query: q });
  } catch (err) { next(err); }
});

export default router;
