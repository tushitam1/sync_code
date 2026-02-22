import { useState, useEffect, useRef, useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { remoteCursorsField, setRemoteCursors } from '../RemoteCursor'

const DEFAULT_CODE = '// Start typing...\n'

function EditorTextbox({ socket, roomId }) {
  const [content, setContent] = useState(DEFAULT_CODE)
  const emitTimeoutRef = useRef(null)
  const cursorEmitTimeoutRef = useRef(null)
  const typingStoppedTimeoutRef = useRef(null)
  const viewRef = useRef(null)
  const remoteCursorsRef = useRef(new Map()) // userId -> { pos, color, username }

  const dispatchCursors = useCallback(() => {
    const view = viewRef.current
    if (!view) return
    const list = [...remoteCursorsRef.current.values()]
    view.dispatch({ effects: [setRemoteCursors.of(list)] })
  }, [])

  useEffect(() => {
    if (!socket || !roomId) return

    const onRoomCode = ({ code }) => {
      if (code != null && code !== '') setContent(code)
    }

    const onCodeUpdated = ({ code }) => {
      setContent(code ?? '')
    }

    const onCursorUpdated = ({ userId, username, cursorPos, color }) => {
      remoteCursorsRef.current.set(userId, {
        pos: cursorPos ?? 0,
        color: color || '#10b981',
        username: username || 'User',
      })
      dispatchCursors()
    }

    const onCursorLeft = ({ userId }) => {
      remoteCursorsRef.current.delete(userId)
      dispatchCursors()
    }

    socket.on('room-code', onRoomCode)
    socket.on('code-updated', onCodeUpdated)
    socket.on('cursor-updated', onCursorUpdated)
    socket.on('cursor-left', onCursorLeft)

    return () => {
      socket.off('room-code', onRoomCode)
      socket.off('code-updated', onCodeUpdated)
      socket.off('cursor-updated', onCursorUpdated)
      socket.off('cursor-left', onCursorLeft)
    }
  }, [socket, roomId, dispatchCursors])

  const handleChange = (value) => {
    setContent(value)
    if (!socket?.connected || !roomId) return

    socket.emit('typing', { roomId })
    if (typingStoppedTimeoutRef.current) clearTimeout(typingStoppedTimeoutRef.current)
    typingStoppedTimeoutRef.current = setTimeout(() => {
      socket.emit('stopped-typing', { roomId })
      typingStoppedTimeoutRef.current = null
    }, 1500)

    if (emitTimeoutRef.current) clearTimeout(emitTimeoutRef.current)
    emitTimeoutRef.current = setTimeout(() => {
      socket.emit('code-change', {
        roomId,
        code: value,
        cursorPos: 0,
      })
      emitTimeoutRef.current = null
    }, 150)
  }

  const handleUpdate = (vu) => {
    const view = vu.view
    viewRef.current = view
    if (!socket?.connected || !roomId) return
    if (vu.selectionSet || vu.docChanged) {
      if (cursorEmitTimeoutRef.current) clearTimeout(cursorEmitTimeoutRef.current)
      cursorEmitTimeoutRef.current = setTimeout(() => {
        const currentView = viewRef.current
        if (currentView) {
          const pos = currentView.state.selection.main.head
          socket.emit('cursor-move', { roomId, cursorPos: pos })
        }
        cursorEmitTimeoutRef.current = null
      }, 80)
    }
  }

  const handleCreateEditor = (view) => {
    viewRef.current = view
    dispatchCursors()
  }

  const extensions = [
    javascript(),
    remoteCursorsField,
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900 p-4">
      <p className="text-white text-sm mb-2">Editor (Room: {roomId})</p>
      <div className="flex-1 min-h-0 overflow-hidden rounded">
        <CodeMirror
          value={content}
          height="100%"
          theme="dark"
          extensions={extensions}
          onChange={handleChange}
          onUpdate={handleUpdate}
          onCreateEditor={handleCreateEditor}
          basicSetup
        />
      </div>
    </div>
  )
}

export default EditorTextbox
