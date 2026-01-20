import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (token?: string) => {
  if (!socket) {
    if (!token) {
      throw new Error('Socket token required on first connection');
    }

    socket = io(import.meta.env.VITE_SOCKET_BASE_URL, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket'],
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
