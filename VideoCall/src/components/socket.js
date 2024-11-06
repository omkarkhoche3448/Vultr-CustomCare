// socket.js
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export const initSocket = () => {
  const socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling']
  });

  // Add connection monitoring
  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('[Socket] Error:', error);
  });

  return socket;
};