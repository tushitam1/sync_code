import { useEffect, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:3001'

export function useSocket(roomId, username) {
  const [socket, setSocket] = useState(null)
  const [users, setUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([]) // { userId, username }
  const [connected, setConnected] = useState(false)

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setConnected(false)
    }
  }, [socket])

  useEffect(() => {
    if (!roomId || !username) return

    const s = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    s.on('connect', () => {
      setConnected(true)
      setTypingUsers([])
      s.emit('join-room', { roomId: String(roomId).trim(), username })
    })

    s.on('disconnect', () => {
      setConnected(false)
      setTypingUsers([])
    })

    s.on('connect_error', () => {
      setConnected(false)
    })

    s.on('users-updated', (roomUsers) => {
      setUsers(roomUsers || [])
    })

    s.on('room-full', () => {
      console.warn('Room is full')
    })

    s.on('user-typing', ({ userId, username }) => {
      setTypingUsers((prev) => {
        const exists = prev.some((u) => u.userId === userId)
        if (exists) return prev
        return [...prev, { userId, username }]
      })
    })

    s.on('user-stopped-typing', ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId))
    })

    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [roomId, username])

  return { socket, users, typingUsers, connected, disconnect }
}