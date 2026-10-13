import { Router } from 'express';
import { optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

const CLASSES = ['SSC', 'HSC'];
const PAPERS = ['1st Paper', '2nd Paper'];

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** Read a short string query param; empty or non-string gives undefined. */
function str(v: unknown, max = 60): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined;
}

router.get('/tracks', optionalAuth, async (_req, res) => {
  res.json(CLASSES.map((c) => ({ id: c.toLowerCase(), name: c, papers: PAPERS })));
});

router.get('/topics', optionalAuth, async (req, res, next) => {
  try {
    const classLevel = (str(req.query.class) ?? 'SSC').toUpperCase();
    const paper = str(req.query.paper) ?? '1st Paper';
    if (!CLASSES.includes(classLevel)) return res.status(400).json({ error: 'class must be SSC or HSC' });
    if (!PAPERS.includes(paper)) return res.status(400).json({ error: 'paper must be "1st Paper" or "2nd Paper"' });

    const board = str(req.query.board);
    const limit = clampInt(req.query.limit, 1, 100, 40);
    const offset = clampInt(req.query.offset, 0, 10_000, 0);

    const rows = await prisma.curriculumContent.findMany({
      where: { classLevel, paper, ...(board ? { OR: [{ board }, { board: null }] } : {}) },
      orderBy: [{ tag: 'asc' }, { topic: 'asc' }],
      take: limit,
      skip: offset,
    });
    res.json(rows.map((r) => ({
      id: r.id, title: r.topic, tag: r.tag, type: r.type, classLevel: r.classLevel, paper: r.paper,
    })));
  } catch (e) {
    next(e);
  }
});

router.get('/writing', optionalAuth, async (req, res, next) => {
  try {
    const type = str(req.query.type, 30) ?? 'paragraph';
    const classLevel = str(req.query.class)?.toUpperCase();
    const limit = clampInt(req.query.limit, 1, 100, 30);

    const rows = await prisma.curriculumContent.findMany({
      where: { type, ...(classLevel && CLASSES.includes(classLevel) ? { classLevel } : {}) },
      orderBy: { topic: 'asc' },
      take: limit,
    });
    res.json(rows.map((r) => ({ id: r.id, title: r.topic })));
  } catch (e) {
    next(e);
  }
});

router.get('/translation', optionalAuth, async (req, res, next) => {
  try {
    const limit = clampInt(req.query.limit, 1, 50, 20);
    const rows = await prisma.curriculumContent.findMany({
      where: { type: 'translation' },
      orderBy: { topic: 'asc' },
      take: limit,
    });
    res.json(rows.map((r) => ({
      id: r.id, source: r.body, target: r.modelAnswer, direction: 'bn_to_en',
    })));
  } catch (e) {
    next(e);
  }
});

// Keep this LAST: it would swallow /tracks, /topics, /writing and /translation otherwise.
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const row = await prisma.curriculumContent.findUnique({ where: { id: req.params.id } });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) {
    next(e);
  }
});

export default router;
