import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'] // emerald, blue, amber, violet
const MAX_USERS_PER_ROOM = 4
const rooms = new Map()
const roomCode = new Map() // roomId -> code (persists for new joiners)

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, username }) => {
    try {
      if (!roomId || !username) return

      const normalizedRoomId = String(roomId).trim()
      let room = rooms.get(normalizedRoomId) || []

      // Dedupe: remove this socket if already in room (double join)
      room = room.filter((u) => u.id !== socket.id)
      rooms.set(normalizedRoomId, room)

      if (room.length >= MAX_USERS_PER_ROOM) {
        socket.emit('room-full', { roomId: normalizedRoomId })
        return
      }

      const colorIndex = room.length % COLORS.length
      const user = { id: socket.id, username, colorIndex, color: COLORS[colorIndex] }
      room.push(user)
      rooms.set(normalizedRoomId, room)

      socket.join(normalizedRoomId)
      socket.roomId = normalizedRoomId
      socket.username = username
      socket.colorIndex = colorIndex
      socket.color = COLORS[colorIndex]

      io.to(normalizedRoomId).emit('users-updated', room)

      const existingCode = roomCode.get(normalizedRoomId)
      if (existingCode != null && existingCode !== '') {
        socket.emit('room-code', { code: existingCode })
      }
    } catch (err) {
      console.error('join-room error:', err)
    }
  })

  socket.on('code-change', ({ roomId, code, cursorPos }) => {
    try {
      if (!roomId) return
      roomCode.set(roomId, code ?? '')
      socket.to(roomId).emit('code-updated', {
        code,
        userId: socket.id,
        username: socket.username ?? 'User',
        cursorPos: cursorPos ?? 0,
        color: socket.color || COLORS[0],
      })
    } catch (err) {
      console.error('code-change error:', err)
    }
  })

  socket.on('cursor-move', ({ roomId, cursorPos }) => {
    try {
      if (!roomId) return
      socket.to(roomId).emit('cursor-updated', {
        userId: socket.id,
        username: socket.username ?? 'User',
        cursorPos: cursorPos ?? 0,
        color: socket.color || COLORS[0],
      })
    } catch (err) {
      console.error('cursor-move error:', err)
    }
  })

  socket.on('typing', ({ roomId }) => {
    try {
      if (!roomId) return
      socket.to(roomId).emit('user-typing', {
        userId: socket.id,
        username: socket.username ?? 'User',
      })
    } catch (err) {
      console.error('typing error:', err)
    }
  })

  socket.on('stopped-typing', ({ roomId }) => {
    try {
      if (!roomId) return
      socket.to(roomId).emit('user-stopped-typing', { userId: socket.id })
    } catch (err) {
      console.error('stopped-typing error:', err)
    }
  })

  socket.on('disconnect', () => {
    try {
      if (socket.roomId) {
        const room = rooms.get(socket.roomId) || []
        const updated = room.filter((u) => u.id !== socket.id)
        rooms.set(socket.roomId, updated)
        if (updated.length === 0) {
          rooms.delete(socket.roomId)
          roomCode.delete(socket.roomId)
        }
        io.to(socket.roomId).emit('users-updated', updated)
        io.to(socket.roomId).emit('cursor-left', { userId: socket.id })
        io.to(socket.roomId).emit('user-stopped-typing', { userId: socket.id })
      }
    } catch (err) {
      console.error('disconnect cleanup error:', err)
    }
  })
})

const PORT = 3001
httpServer.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`)
})