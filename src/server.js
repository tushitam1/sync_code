/* eslint-env node */

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { YSocketIO } from 'y-socket.io/dist/server'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// YSocketIO for Yjs code syncing
const ysocketio = new YSocketIO(io)
ysocketio.initialize()

// activeRooms: Map<roomId, Map<socketId, { username, color }>>
const activeRooms = new Map()

const PLAYER_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ec4899'] // blue, green, amber, pink

function getPlayerList(roomId) {
  const room = activeRooms.get(roomId)
  if (!room) return []
  return Array.from(room.entries()).map(([id, data]) => ({
    id,
    username: data.username,
    color: data.color,
  }))
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', (roomId, username, callback) => {
    let room = activeRooms.get(roomId)

    if (!room) {
      room = new Map()
      activeRooms.set(roomId, room)
    }

    if (room.size >= 4) {
      callback?.({ success: false, error: 'Room is full (max 4 players)' })
      return
    }

    const colorIndex = room.size % PLAYER_COLORS.length
    room.set(socket.id, { username, color: PLAYER_COLORS[colorIndex] })
    socket.data.roomId = roomId
    socket.data.username = username

    socket.join(roomId)

    const playerList = getPlayerList(roomId)
    callback?.({ success: true, playerList })

    io.to(roomId).emit('players-updated', playerList)
    console.log(`${username} joined room ${roomId} (${room.size}/4)`)
  })

  socket.on('send-changes', (roomId, changes) => {
    socket.to(roomId).emit('receive-changes', changes)
  })

  socket.on('leave-room', () => {
    const roomId = socket.data.roomId
    if (roomId) {
      const room = activeRooms.get(roomId)
      if (room) {
        room.delete(socket.id)
        if (room.size === 0) {
          activeRooms.delete(roomId)
        } else {
          const playerList = getPlayerList(roomId)
          io.to(roomId).emit('players-updated', playerList)
        }
      }
      socket.data.roomId = null
      socket.data.username = null
      socket.leave(roomId)
    }
  })

  socket.on('disconnect', () => {
    const roomId = socket.data.roomId
    const username = socket.data.username

    if (roomId) {
      const room = activeRooms.get(roomId)
      if (room) {
        room.delete(socket.id)
        if (room.size === 0) {
          activeRooms.delete(roomId)
        } else {
          const playerList = getPlayerList(roomId)
          io.to(roomId).emit('players-updated', playerList)
        }
      }
    }

    console.log(`User disconnected: ${socket.id} (${username || 'unknown'})`)
  })
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})