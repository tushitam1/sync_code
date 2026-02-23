import { createContext, useContext, useRef } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const socketRef = useRef(null)

  const getSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3000', { autoConnect: true })
    }
    return socketRef.current
  }

  return (
    <SocketContext.Provider value={{ getSocket }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}