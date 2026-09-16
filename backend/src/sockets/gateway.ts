import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { verifyAccessToken } from '../lib/jwt.js';
import { log } from '../lib/logger.js';

interface RoomState {
  participants: Map<string, { name: string; joinedAt: number }>;
  startedAt?: number;
  leaderboard: Map<string, number>;
}

const rooms = new Map<string, RoomState>();

export function attachSocketGateway(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.corsOrigin, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Missing token'));
    try {
      (socket as any).user = verifyAccessToken(token);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    log.info(`socket connected: ${user.id}`);

    socket.on('room:join', ({ roomId, name }: { roomId: string; name?: string }) => {
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
    });

    socket.on('room:start', ({ roomId }: { roomId: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.startedAt = Date.now();
      io.to(roomId).emit('room:start', { startedAt: room.startedAt });
    });

    socket.on('room:tab_switch', ({ roomId }: { roomId: string }) => {
      io.to(roomId).emit('room:tab_switch_alert', { socketId: socket.id });
    });

    socket.on('room:submit', ({ roomId, score }: { roomId: string; score: number }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.leaderboard.set(socket.id, score);
      const sorted = [...room.leaderboard.entries()].sort((a, b) => b[1] - a[1]);
      io.to(roomId).emit('room:leaderboard_update', sorted.map(([sid, sc], i) => ({
        rank: i + 1,
        name: room.participants.get(sid)?.name ?? 'Guest',
        score: sc,
      })));
    });

    socket.on('chat:message', ({ roomId, body }: { roomId: string; body: string }) => {
      io.to(roomId).emit('chat:message', { from: user.name, body, ts: Date.now() });
    });

    socket.on('chat:typing', ({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit('chat:typing', { from: user.name });
    });

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
