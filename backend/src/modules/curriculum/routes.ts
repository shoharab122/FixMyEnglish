import { Router } from 'express';
import { optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.get('/tracks', optionalAuth, async (_req, res) => {
  res.json([
    { id: 'ssc', name: 'SSC', papers: ['1st Paper', '2nd Paper'] },
    { id: 'hsc', name: 'HSC', papers: ['1st Paper', '2nd Paper'] },
  ]);
});

router.get('/topics', optionalAuth, async (req, res, next) => {
  try {
    const classLevel = String(req.query.class ?? 'SSC');
    const paper      = String(req.query.paper ?? '1st Paper');
    const board      = req.query.board ? String(req.query.board) : undefined;
    const rows = await prisma.curriculumContent.findMany({
      where: { classLevel, paper, ...(board ? { OR: [{ board }, { board: null }] } : {}) },
      take: 40,
    });
    res.json(rows.map((r) => ({ id: r.id, title: r.topic, tag: r.tag })));
  } catch (e) { next(e); }
});

router.get('/writing', optionalAuth, async (req, res, next) => {
  try {
    const type = String(req.query.type ?? 'paragraph');
    const rows = await prisma.curriculumContent.findMany({ where: { type }, take: 30 });
    res.json(rows.map((r) => ({ id: r.id, title: r.topic })));
  } catch (e) { next(e); }
});

router.get('/translation', optionalAuth, async (_req, res, next) => {
  try {
    const rows = await prisma.curriculumContent.findMany({ where: { type: 'translation' }, take: 20 });
    res.json(rows.map((r) => ({ id: r.id, source: r.body, target: r.modelAnswer, direction: 'bn_to_en' })));
  } catch (e) { next(e); }
});

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const row = await prisma.curriculumContent.findUnique({ where: { id: req.params.id } });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) { next(e); }
});

export default router;
