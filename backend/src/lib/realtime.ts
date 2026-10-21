import type { Server } from 'socket.io';

// Holds the Socket.IO server so REST routes and services can push events
// without importing the gateway (avoids circular imports).
let io: Server | null = null;

export function setIo(instance: Server): void {
  io = instance;
}

export const userRoom = (userId: string): string => `user:${userId}`;

/** Send an event to every socket of one user (all their tabs/devices). */
export function emitToUser(userId: string, event: string, payload: unknown): void {
  io?.to(userRoom(userId)).emit(event, payload);
}

/** Send an event to every connected socket. */
export function emitAll(event: string, payload: unknown): void {
  io?.emit(event, payload);
}
