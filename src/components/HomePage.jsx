import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useSocket } from '../context/SocketContext'

function HomePage() {
  const [searchParams] = useSearchParams()
  const [roomId, setRoomId] = useState(() => searchParams.get('roomId') || '')
  const [username, setUsername] = useState(() => searchParams.get('username') || '')
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)
  const navigate = useNavigate()
  const { getSocket } = useSocket()

  const handleJoinRoom = () => {
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    if (!roomId.trim()) {
      setError('Room ID is required')
      return
    }
    setError('')
    setJoining(true)
    const socket = getSocket()
    socket.emit('join-room', roomId.trim(), username, (response) => {
      setJoining(false)
      if (response?.success) {
        const data = { roomId: roomId.trim(), username, isNewRoom: false, playerList: response.playerList || [] }
        sessionStorage.setItem('sync_code_room', JSON.stringify(data))
        navigate('/editor', { state: data })
      } else {
        setError(response?.error || 'Failed to join room')
      }
    })
  }

  const handleCreateRoom = () => {
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    setError('')
    setJoining(true)
    const finalRoomId = roomId.trim() || uuidv4()
    const socket = getSocket()
    socket.emit('join-room', finalRoomId, username, (response) => {
      setJoining(false)
      if (response?.success) {
        const data = { roomId: finalRoomId, username, isNewRoom: true, playerList: response.playerList || [] }
        sessionStorage.setItem('sync_code_room', JSON.stringify(data))
        navigate('/editor', { state: data })
      } else {
        setError(response?.error || 'Failed to create room')
      }
    })
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-12 py-10 shadow-xl w-1/4">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Sync Code</h1>
        <h2 className="text-lg text-slate-400 text-center mb-6">Real-Time Collaboration</h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username (required)"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setError('')
          }}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          placeholder="Join an existing room (Room ID)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 outline-none focus:border-emerald-500"
        />

        <button
          onClick={handleJoinRoom}
          disabled={joining}
          style={{ background: '#059669', color: 'white' }}
          className="w-full py-2 rounded-lg hover:opacity-90 font-medium mb-4 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {joining ? 'Joining...' : 'Join Room'}
        </button>

        <p className="text-slate-400 text-center my-4">or</p>

        <button
          type="button"
          onClick={handleCreateRoom}
          disabled={joining}
          className="w-full py-2 rounded-lg font-medium border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {joining ? 'Creating...' : 'Create new room'}
        </button>

        <p className="text-xs text-slate-500 text-center mt-6">
          Up to 4 users can join a room at a time.
        </p>
      </div>
    </div>
  )
}

export default HomePage