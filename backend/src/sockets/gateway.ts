import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { verifyAccessToken } from '../lib/jwt.js';
import { log } from '../lib/logger.js';
import { setIo, userRoom } from '../lib/realtime.js';
import { buildSummary } from '../lib/gamification.js';

interface SocketUser {
  id: string;
  name: string;
  tier?: string;
}

interface RoomState {
  participants: Map<string, { name: string; joinedAt: number }>;
  leaderboard: Map<string, number>;
  startedAt?: number;
}

const rooms = new Map<string, RoomState>();

// A malformed payload (e.g. emitting with no argument) must never crash the
// process: Socket.IO does not catch errors thrown inside listeners.
function safe<A extends unknown[]>(fn: (...args: A) => unknown) {
  return (...args: A): void => {
    try {
      const out = fn(...args);
      if (out instanceof Promise) out.catch((e) => log.error('socket handler failed', e));
    } catch (e) {
      log.error('socket handler failed', e);
    }
  };
}

export function attachSocketGateway(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: env.corsOrigin, credentials: true },
  });
  setIo(io); // lets REST routes push events (XP, badges, tier changes)

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Missing token'));
    try {
      socket.data.user = verifyAccessToken(token) as unknown as SocketUser;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user as SocketUser;
    log.info(`socket connected: ${user.id}`);

    // Personal room: every tab/device of this user receives their updates.
    socket.join(userRoom(user.id));

    // Client can pull fresh state after a reconnect.
    socket.on('gamification:sync', safe(async (_payload: unknown, ack?: (s: unknown) => void) => {
      try {
        ack?.(await buildSummary(user.id));
      } catch {
        ack?.(null);
      }
    }));

    socket.on('room:join', safe(({ roomId, name }: { roomId: string; name?: string }) => {
      socket.join(roomId);
      if (!rooms.has(roomId)) rooms.set(roomId, { participants: new Map(), leaderboard: new Map() });
      const room = rooms.get(roomId)!;
      room.participants.set(socket.id, { name: name ?? user.name, joinedAt: Date.now() });
      io.to(roomId).emit('room:participant_count', { joined: room.participants.size, max: 100 });
      io.to(roomId).emit('room:lobby_state', {
        names: [...room.participants.values()].map((p) => p.name),
        count: room.participants.size,
        countdownSeconds: 30,
      });
    }));

    socket.on('room:start', safe(({ roomId }: { roomId: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.startedAt = Date.now();
      io.to(roomId).emit('room:start', { startedAt: room.startedAt });
    }));

    socket.on('room:tab_switch', safe(({ roomId }: { roomId: string }) => {
      io.to(roomId).emit('room:tab_switch_alert', { socketId: socket.id });
    }));

    socket.on('room:submit', safe(({ roomId, score }: { roomId: string; score: number }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.leaderboard.set(socket.id, score);
      const sorted = [...room.leaderboard.entries()].sort((a, b) => b[1] - a[1]);
      io.to(roomId).emit(
        'room:leaderboard_update',
        sorted.map(([sid, sc], i) => ({
          rank: i + 1,
          name: room.participants.get(sid)?.name ?? 'Guest',
          score: sc,
        })),
      );
    }));

    socket.on('chat:message', safe(({ roomId, body }: { roomId: string; body: string }) => {
      io.to(roomId).emit('chat:message', { from: user.name, body, ts: Date.now() });
    }));

    socket.on('chat:typing', safe(({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit('chat:typing', { from: user.name });
    }));

    socket.on('disconnect', () => {
      for (const [roomId, room] of rooms) {
        if (room.participants.has(socket.id)) {
          room.participants.delete(socket.id);
          io.to(roomId).emit('room:participant_count', { joined: room.participants.size, max: 100 });
        }
      }
    });
  });

  return io;
}
