import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

let socket = null;

// Call once after login/guest-join, before entering a live room or chat.
export function connectSocket(accessToken) {
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL, {
    auth: { token: accessToken },
    transports: ['websocket'],
  });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
