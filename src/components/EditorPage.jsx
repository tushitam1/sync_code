import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { useSocket } from '../context/SocketContext'
import { AwarenessProvider } from '../context/AwarenessContext'
import Header from './Header'
import EditorContainer from './EditorContainer'
import Footer from './Footer'

function EditorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { getSocket } = useSocket()
  const [players, setPlayers] = useState([])
  const [awareness, setAwareness] = useState(null)
  const state = location.state || (() => {
    try {
      const stored = sessionStorage.getItem('sync_code_room')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })()
  const { roomId, username, playerList: initialPlayerList } = state

  useEffect(() => {
    if (!roomId) {
      navigate('/', { replace: true })
      return
    }
    if (initialPlayerList?.length > 0) {
      setPlayers(initialPlayerList)
    }
    const socket = getSocket()
    const onPlayersUpdated = (list) => setPlayers(list || [])
    socket.on('players-updated', onPlayersUpdated)
    return () => socket.off('players-updated', onPlayersUpdated)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialPlayerList only needed once on mount
  }, [roomId, navigate, getSocket])

  const handleLeave = useCallback(() => {
    getSocket().emit('leave-room')
    sessionStorage.removeItem('sync_code_room')
    navigate('/', { replace: true })
  }, [getSocket, navigate])

  const socket = getSocket()
  const currentUserColor = players.find((p) => p.id === socket?.id)?.color || '#6b7280'

  if (!roomId) {
    return null
  }

  return (
    <AwarenessProvider awareness={awareness}>
      <div className="flex flex-col min-h-screen">
        <Header roomId={roomId} username={username} players={players} onLeave={handleLeave} />
        <EditorContainer
          roomId={roomId}
          username={username}
          userColor={currentUserColor}
          onAwarenessReady={setAwareness}
        />
        <Footer onLeave={handleLeave} />
      </div>
    </AwarenessProvider>
  )
}

export default EditorPage