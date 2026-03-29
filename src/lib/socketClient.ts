import { io, type Socket } from 'socket.io-client'

type ServerToClientEvents = Record<string, (...args: unknown[]) => void>
type ClientToServerEvents = Record<string, (...args: unknown[]) => void>

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

function getSocketBaseUrl() {
  const fromSocketEnv = import.meta.env.VITE_SOCKET_URL as string | undefined
  const fromApiEnv = import.meta.env.VITE_API_BASE_URL as string | undefined
  const raw = fromSocketEnv ?? fromApiEnv

  if (!raw) {
    throw new Error('Missing VITE_SOCKET_URL or VITE_API_BASE_URL in .env')
  }

  return raw.replace(/\/$/, '')
}

export function getSocketClient() {
  if (!socket) {
    socket = io(getSocketBaseUrl(), {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
    })
  }

  return socket
}

export function connectSocketClient() {
  const client = getSocketClient()

  if (!client.connected) {
    client.connect()
  }

  return client
}

export function disconnectSocketClient() {
  if (!socket) {
    return
  }

  socket.disconnect()
}
