import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { getPaymentProvider } from './providers.js';

const router = Router();

router.get('/packages', async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { priceBdt: 'asc' } });
    res.json(products.map((p) => ({
      id: p.slug, name: p.name, tagline: p.tagline,
      price: p.priceBdt, currency: '৳', period: p.period,
      strike: p.strikeBdt, features: p.features,
      icon: p.icon, featured: p.featured,
    })));
  } catch (e) { next(e); }
});

router.post('/checkout', requireAuth, async (req, res, next) => {
  try {
    const { productType, method } = req.body ?? {};
    const product = await prisma.product.findUnique({ where: { slug: productType } });
    if (!product) return res.status(404).json({ error: 'Unknown product' });

    const purchase = await prisma.purchase.create({
      data: {
        userId: req.user!.id, productId: product.id,
        amountBdt: product.priceBdt, method: method ?? 'bkash', status: 'pending',
      },
    });

    const provider = getPaymentProvider(method ?? 'bkash');
    const init = await provider.init({
      purchaseId: purchase.id,
      amountBdt: product.priceBdt,
      description: product.name,
    });

    await prisma.purchase.update({
      where: { id: purchase.id }, data: { gatewayTxnId: init.gatewayTxnId },
    });

    // In mock mode, mark paid immediately so the frontend gets a happy path.
    await prisma.purchase.update({ where: { id: purchase.id }, data: { status: 'paid' } });
    if (product.type === 'subscription') {
      await prisma.user.update({ where: { id: req.user!.id }, data: { tier: 'premium' } });
    }

    res.json({ purchaseId: purchase.id, redirectUrl: init.redirectUrl, amountBdt: product.priceBdt, paid: true });
  } catch (e) { next(e); }
});

router.post('/mock-confirm', requireAuth, async (req, res, next) => {
  try {
    const { purchaseId } = req.body ?? {};
    const p = await prisma.purchase.findUnique({ where: { id: purchaseId } });
    if (!p || p.userId !== req.user!.id) return res.status(404).json({ error: 'Not found' });
    await prisma.purchase.update({ where: { id: p.id }, data: { status: 'paid' } });
    const product = await prisma.product.findUnique({ where: { id: p.productId } });
    if (product?.type === 'subscription') {
      await prisma.user.update({ where: { id: req.user!.id }, data: { tier: 'premium' } });
    }
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.post('/bkash/callback', async (_req, res) => res.json({ ok: true }));
router.post('/nagad/callback', async (_req, res) => res.json({ ok: true }));
router.post('/sslcommerz/ipn', async (_req, res) => res.json({ ok: true }));

router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const rows = await prisma.purchase.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
      orderBy: { purchasedAt: 'desc' }, take: 30,
    });
    res.json(rows.map((p) => ({
      id: p.id, product: p.product.name, amount: p.amountBdt,
      method: p.method, status: p.status,
      date: p.purchasedAt.toISOString().slice(0, 10),
    })));
  } catch (e) { next(e); }
});

router.post('/coupon/apply', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body ?? {};
    const c = await prisma.coupon.findUnique({ where: { code } });
    if (!c || c.usedCount >= c.maxUses) return res.status(400).json({ error: 'Invalid coupon' });
    res.json({ code: c.code, discountPct: c.discountPct });
  } catch (e) { next(e); }
});

export default router;
