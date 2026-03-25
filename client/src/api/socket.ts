import { io, Socket } from 'socket.io-client'

declare global {
  interface Window {
    __WIRE_WORK_CONFIG__?: { BACKEND_URL?: string }
  }
}

function getBackendUrl(): string {
  return (
    window.__WIRE_WORK_CONFIG__?.BACKEND_URL ??
    (import.meta as { env?: { VITE_BACKEND_URL?: string } }).env?.VITE_BACKEND_URL ??
    'http://localhost:3001'
  )
}

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket() first.')
  }
  return socket
}

export function initSocket(token: string): Socket {
  if (socket) {
    socket.disconnect()
  }
  socket = io(getBackendUrl(), {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
  })
  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

export { getBackendUrl }
