import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

function HomePage() {
  const [searchParams] = useSearchParams()
  const [roomId, setRoomId] = useState(() => searchParams.get('roomId') || '')
  const [username, setUsername] = useState(() => searchParams.get('username') || '')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleJoinRoom = () => {
    if (!username) {
      setError('Username is required')
      return
    }
    if (!roomId) {
      setError('Room ID is required')
      return
    }
    setError('')
    navigate('/editor', { state: { roomId, username } })
  }

  const handleCreateRoom = (e) => {
    e.preventDefault()
    if (!username) {
      setError('Username is required')
      return
    }
    setError('')
    const finalRoomId = roomId || uuidv4()
    navigate('/editor', { state: { roomId: finalRoomId, username, isNewRoom: true } })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-12 py-10 shadow-xl min-w-[320px]">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Sync Code</h1>
        <h2 className="text-lg text-slate-400 text-center mb-6">Real-Time Collaboration</h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <input
          type="text"
          placeholder="Join an Existing Room (Room ID)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 outline-none focus:border-emerald-500"
        />
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

        <button
          onClick={handleJoinRoom}
          style={{ background: '#059669', color: 'white' }}
          className="px-8 py-2 rounded-lg hover:opacity-90 font-medium mb-3 mx-auto block transition-opacity"
        >
          Join Room
        </button>

        <div className="text-center text-slate-400 text-sm">
          <button
            type="button"
            onClick={handleCreateRoom}
            className="text-emerald-400 hover:text-emerald-300 hover:underline bg-transparent border-none cursor-pointer"
          >
            Create new room
          </button>
          <p className="text-xs text-slate-500 mt-2">
            Upto 4 users can join a room at a time.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage