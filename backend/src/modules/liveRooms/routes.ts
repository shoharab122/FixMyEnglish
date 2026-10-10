import { Router } from 'express';
import type { Request } from 'express';
import { createHmac } from 'node:crypto';
import { optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

/* ---------- helpers ---------- */

type AuthUser = { id?: string; name?: string | null; email?: string | null };
type RoomExtras = {
  meetLink?: string | null;
  meetProvider?: string | null;
  zoomMeetingNumber?: string | number | null;
  zoomPassword?: string | null;
};

const ENDED = new Set(['ended', 'completed', 'cancelled', 'canceled', 'finished']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getUser = (req: Request): AuthUser | undefined =>
  (req as unknown as { user?: AuthUser }).user;

const extras = (room: unknown): RoomExtras => room as RoomExtras;

const clean = (v: unknown, max = 120): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null;

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function formatStartsIn(status: string, scheduledAt: Date | null): string {
  if (status === 'live') return 'Live now';
  if (!scheduledAt) return '—';
  const mins = Math.round((scheduledAt.getTime() - Date.now()) / 60000);
  if (mins <= 0) return 'a moment';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  if (h < 24) return mins % 60 ? `${h}h ${mins % 60}m` : `${h}h`;
  const d = Math.floor(h / 24);
  return h % 24 ? `${d}d ${h % 24}h` : `${d}d`;
}

/** Zoom Meeting SDK signature (HS256 JWT) — no extra dependency needed. */
function zoomSignature(sdkKey: string, sdkSecret: string, meetingNumber: string, role: 0 | 1): string {
  const b64 = (v: string) => Buffer.from(v).toString('base64url');
  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64(JSON.stringify({ sdkKey, appKey: sdkKey, mn: meetingNumber, role, iat, exp, tokenExp: exp }));
  const data = `${header}.${payload}`;
  const sig = createHmac('sha256', sdkSecret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

/** Pull meeting number / passcode out of a zoom.us/j/<number>?pwd=... link. */
function parseZoomLink(link: string): { meetingNumber: string | null; password: string } {
  try {
    const u = new URL(link);
    const m = u.pathname.match(/\/j\/(\d{8,12})/);
    return { meetingNumber: m ? m[1] : null, password: u.searchParams.get('pwd') ?? '' };
  } catch {
    return { meetingNumber: null, password: '' };
  }
}

/* ---------- GET /  (rooms list) ---------- */

router.get('/', optionalAuth, async (_req, res, next) => {
  try {
    const all = await prisma.liveRoom.findMany({ orderBy: { scheduledAt: 'asc' }, take: 60 });
    const rooms = all.filter((r) => !ENDED.has(String(r.status))).slice(0, 30);

    const counts = rooms.length
      ? await prisma.liveRoomParticipant.groupBy({
          by: ['roomId'],
          where: { roomId: { in: rooms.map((r) => r.id) } },
          _count: { _all: true },
        })
      : [];
    const joinedByRoom = new Map<string, number>(counts.map((c) => [c.roomId, c._count._all]));

    res.json(
      rooms.map((r) => {
        const x = extras(r);
        return {
          id: r.id,
          title: r.title,
          seats: r.maxSeats,
          joined: joinedByRoom.get(r.id) ?? 0,
          startsIn: formatStartsIn(String(r.status), r.scheduledAt ?? null),
          level: r.level,
          duration: formatDuration(r.durationMins),
          live: r.status === 'live',
          meetLink: x.meetLink ?? null,
          meetProvider: x.meetProvider ?? null,
        };
      }),
    );
  } catch (e) {
    next(e);
  }
});

/* ---------- POST /:roomId/join ---------- */

router.post('/:roomId/join', optionalAuth, async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const room = await prisma.liveRoom.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (ENDED.has(String(room.status))) return res.status(409).json({ error: 'This room has ended' });

    const user = getUser(req);
    let guestName = clean(req.body?.name ?? req.body?.guestName);
    let guestEmail = clean(req.body?.email ?? req.body?.guestEmail, 200)?.toLowerCase() ?? null;

    if (user?.id) {
      guestName = guestName ?? clean(user.name) ?? null;
      guestEmail = guestEmail ?? clean(user.email, 200)?.toLowerCase() ?? null;
    } else if (!guestName || !guestEmail || !EMAIL_RE.test(guestEmail)) {
      return res.status(400).json({ error: 'Name and a valid email are required to join as a guest' });
    }

    // Idempotent: the same user/guest joining twice reuses their seat.
    const existing = await prisma.liveRoomParticipant.findFirst({
      where: user?.id ? { roomId: room.id, userId: user.id } : { roomId: room.id, guestEmail },
    });

    const participant =
      existing ??
      (await (async () => {
        const taken = await prisma.liveRoomParticipant.count({ where: { roomId: room.id } });
        if (taken >= room.maxSeats) return null;
        return prisma.liveRoomParticipant.create({
          data: {
            roomId: room.id,
            userId: user?.id ?? null,
            guestName,
            guestEmail,
            questionOrderSeed: Math.floor(Math.random() * 2 ** 31),
          },
        });
      })());

    if (!participant) return res.status(409).json({ error: 'Room is full' });

    res.json({
      participantId: participant.id,
      participantToken: participant.id,
      roomId: room.id,
      questionOrderSeed: participant.questionOrderSeed,
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- GET /:roomId/leaderboard ---------- */

router.get('/:roomId/leaderboard', optionalAuth, async (req, res, next) => {
  try {
    const rows = await prisma.liveRoomResult.findMany({
      where: { roomId: req.params.roomId },
      include: { participant: true },
      orderBy: { score: 'desc' },
      take: 20,
    });
    res.json(
      rows.map((r, i) => ({
        rank: i + 1,
        name: r.participant.guestName ?? 'Guest',
        score: r.score,
      })),
    );
  } catch (e) {
    next(e);
  }
});

/* ---------- GET /:roomId/zoom ---------- */

router.get('/:roomId/zoom', optionalAuth, async (req, res, next) => {
  try {
    const room = await prisma.liveRoom.findUnique({ where: { id: req.params.roomId } });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const x = extras(room);
    const user = getUser(req);
    const userName = clean(user?.name) ?? clean(req.query.name) ?? 'Guest';
    const userEmail = clean(user?.email, 200) ?? clean(req.query.email, 200) ?? 'guest@example.com';
    const joinUrl = x.meetLink ?? '';

    const parsed = joinUrl ? parseZoomLink(joinUrl) : { meetingNumber: null, password: '' };
    const meetingNumber =
      (x.zoomMeetingNumber != null ? String(x.zoomMeetingNumber).replace(/\s/g, '') : '') ||
      parsed.meetingNumber ||
      '';
    const password = x.zoomPassword ?? parsed.password;

    const sdkKey = process.env.ZOOM_SDK_KEY;
    const sdkSecret = process.env.ZOOM_SDK_SECRET;
    const isZoom = !x.meetProvider || x.meetProvider === 'zoom';

    // Full in-app embed (frontend needs signature + meetingNumber)
    if (isZoom && sdkKey && sdkSecret && meetingNumber) {
      return res.json({
        joinUrl,
        sdkKey,
        signature: zoomSignature(sdkKey, sdkSecret, meetingNumber, 0),
        meetingNumber,
        password,
        userName,
        userEmail,
        role: 0,
      });
    }

    // No SDK credentials: frontend opens the plain link in a new tab
    if (joinUrl) return res.json({ joinUrl });

    return res.status(503).json({ error: 'No Zoom meeting is configured for this room yet' });
  } catch (e) {
    next(e);
  }
});

export default router;
