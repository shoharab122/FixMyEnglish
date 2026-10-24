import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { setUserTier } from '../../lib/gamification.js';
import { uid } from '../../lib/req.js';
import { getPaymentProvider } from './providers.js';

const router = Router();

// Auto-marking purchases as paid is ONLY allowed in mock mode outside production.
const mockMode = (): boolean => env.paymentProvider === 'mock' && !env.isProd;

router.get('/packages', async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { priceBdt: 'asc' } });
    res.json(products.map((p) => ({
      id: p.slug, name: p.name, tagline: p.tagline,
      price: p.priceBdt, currency: '৳', period: p.period,
      strike: p.strikeBdt, features: p.features,
      icon: p.icon, featured: p.featured,
    })));
  } catch (e) {
    next(e);
  }
});

router.post('/checkout', requireAuth, async (req, res, next) => {
  try {
    const userId = uid(req);
    const { productType, method, coupon } = req.body ?? {};
    const product = await prisma.product.findUnique({ where: { slug: productType } });
    if (!product) return res.status(404).json({ error: 'Unknown product' });

    // Apply coupon (if provided) BEFORE creating the purchase.
    let finalAmount = product.priceBdt;
    let appliedCode: string | null = null;
    if (coupon) {
      const code = String(coupon).trim().toUpperCase();
      const c = await prisma.coupon.findUnique({ where: { code } });
      if (c && c.usedCount < c.maxUses && (!c.validTo || c.validTo > new Date())) {
        finalAmount = Math.round(product.priceBdt * (1 - c.discountPct / 100));
        appliedCode = c.code;
      }
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId, productId: product.id,
        amountBdt: finalAmount, method: method ?? 'bkash', status: 'pending',
      },
    });
    const provider = getPaymentProvider(method ?? 'bkash');
    const init = await provider.init({
      purchaseId: purchase.id,
      amountBdt: finalAmount,
      description: product.name,
    });
    await prisma.purchase.update({
      where: { id: purchase.id }, data: { gatewayTxnId: init.gatewayTxnId },
    });

    const paid = mockMode();
    if (paid) {
      await prisma.purchase.update({ where: { id: purchase.id }, data: { status: 'paid' } });
      if (product.type === 'subscription') await setUserTier(userId, 'premium');
      if (appliedCode) {
        await prisma.coupon.update({
          where: { code: appliedCode },
          data: { usedCount: { increment: 1 } },
        }).catch(() => { /* race: coupon already deleted */ });
      }
    }

    res.json({
      purchaseId: purchase.id,
      redirectUrl: init.redirectUrl,
      amountBdt: finalAmount,
      paid,
      ...(appliedCode ? { coupon: appliedCode } : {}),
    });
  } catch (e) {
    next(e);
  }
});

router.post('/mock-confirm', requireAuth, async (req, res, next) => {
  try {
    if (!mockMode()) return res.status(404).json({ error: 'Not found' });
    const userId = uid(req);
    const { purchaseId } = req.body ?? {};
    const p = await prisma.purchase.findUnique({ where: { id: purchaseId } });
    if (!p || p.userId !== userId) return res.status(404).json({ error: 'Not found' });
    await prisma.purchase.update({ where: { id: p.id }, data: { status: 'paid' } });
    const product = await prisma.product.findUnique({ where: { id: p.productId } });
    if (product?.type === 'subscription') await setUserTier(userId, 'premium');
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post('/bkash/callback', async (_req, res) => res.json({ ok: true }));
router.post('/nagad/callback', async (_req, res) => res.json({ ok: true }));
router.post('/sslcommerz/ipn', async (_req, res) => res.json({ ok: true }));

router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const rows = await prisma.purchase.findMany({
      where: { userId: uid(req) },
      include: { product: true },
      orderBy: { purchasedAt: 'desc' }, take: 30,
    });
    res.json(rows.map((p) => ({
      id: p.id, product: p.product.name, amount: p.amountBdt,
      method: p.method, status: p.status,
      date: p.purchasedAt.toISOString().slice(0, 10),
    })));
  } catch (e) {
    next(e);
  }
});

router.post('/coupon/apply', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body ?? {};
    const c = await prisma.coupon.findUnique({ where: { code: String(code).trim().toUpperCase() } });
    if (!c || c.usedCount >= c.maxUses) return res.status(400).json({ error: 'Invalid coupon' });
    res.json({ code: c.code, discountPct: c.discountPct });
  } catch (e) {
    next(e);
  }
});

export default router;
