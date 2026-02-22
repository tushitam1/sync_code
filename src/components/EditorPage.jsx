import { useLocation, useNavigate } from 'react-router-dom'
import Header from './Header'
import EditorContainer from './EditorContainer'
import Footer from './Footer'
import { useSocket } from '../useSocket'

function EditorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { roomId, username } = location.state || {}
  const { socket, users, typingUsers, connected, disconnect } = useSocket(roomId, username)

  const handleLeave = () => {
    disconnect()
    navigate('/')
  }

  // Direct navigation or refresh: redirect to home
  if (!roomId || !username) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center text-white">
          <p className="mb-4">Please join a room from the home page.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header roomId={roomId} username={username} users={users} typingUsers={typingUsers} connected={connected} onLeave={handleLeave} />
      <EditorContainer socket={socket} roomId={roomId} />
      <Footer onLeave={handleLeave} />
    </div>
  )
}

export default EditorPage 