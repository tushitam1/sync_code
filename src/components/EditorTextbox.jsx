import { useRef, useCallback, useEffect, useState } from "react"
import ErrorBoundary from "./ErrorBoundary"
import Editor from "@monaco-editor/react"
import * as Y from "yjs"
import { MonacoBinding } from "y-monaco"
import { SocketIOProvider } from "y-socket.io"

const DEFAULT_CODE = "// Start typing...\n"
const SOCKET_URL = "http://localhost:3000"

function EditorTextbox({ roomId, username, userColor, onAwarenessReady }) {
  const bindingRef = useRef(null)
  const providerRef = useRef(null)
  const ydocRef = useRef(null)
  const [error, setError] = useState(null)

  const [awareness, setAwareness] = useState(null)

  const typingTimeoutRef = useRef(null)
  const typingDisposeRef = useRef(null)

  const handleEditorMount = useCallback((editor) => {
    if (!roomId) return
    setError(null)

    try {
      const model = editor.getModel()
      if (!model) {
        setError("Editor model not ready")
        return
      }

      const ydoc = new Y.Doc()
      ydocRef.current = ydoc

      const provider = new SocketIOProvider(SOCKET_URL, roomId, ydoc, { autoConnect: true })
      providerRef.current = provider

      if (username && userColor) {
        provider.awareness.setLocalState({ user: { name: username, color: userColor } })
      }
      setAwareness(provider.awareness)
      onAwarenessReady?.(provider.awareness)

      const yText = ydoc.getText("monaco")
      if (yText.length === 0) {
        yText.insert(0, DEFAULT_CODE)
      }

      const binding = new MonacoBinding(
        yText,
        model,
        new Set([editor]),
        provider.awareness
      )
      bindingRef.current = binding

      const setTyping = (typing) => {
        provider.awareness.setLocalStateField('typing', typing)
      }
      const scheduleTypingOff = () => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        setTyping(true)
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false)
          typingTimeoutRef.current = null
        }, 2000)
      }
      typingDisposeRef.current = model.onDidChangeContent(scheduleTypingOff)
    } catch (err) {
      console.error("Editor sync error:", err)
      setError(err?.message || "Failed to initialize collaborative editor")
    }
  }, [roomId, username, userColor, onAwarenessReady])

  useEffect(() => {
    if (!awareness) return
    const updateCursorStyles = () => {
      const states = awareness.getStates()
      let css = ''
      states.forEach((state, clientID) => {
        const color = state.user?.color || '#6b7280'
        const hexToRgba = (hex, alpha) => {
          const r = parseInt(hex.slice(1, 3), 16)
          const g = parseInt(hex.slice(3, 5), 16)
          const b = parseInt(hex.slice(5, 7), 16)
          return `rgba(${r},${g},${b},${alpha})`
        }
        css += `.yRemoteSelection-${clientID}{background-color:${hexToRgba(color, 0.3)} !important}.yRemoteSelectionHead-${clientID}{border-left:2px solid ${color} !important;margin-left:-1px}`
      })
      let styleEl = document.getElementById('yjs-cursor-styles')
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = 'yjs-cursor-styles'
        document.head.appendChild(styleEl)
      }
      styleEl.textContent = css
    }
    updateCursorStyles()
    awareness.on('change', updateCursorStyles)
    return () => awareness.off('change', updateCursorStyles)
  }, [awareness])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingDisposeRef.current?.dispose()
      bindingRef.current?.destroy()
      providerRef.current?.destroy()
      ydocRef.current?.destroy()
      setAwareness(null)
    }
  }, [])

  if (!roomId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 text-slate-400">
        No room connected
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-red-400 gap-2 p-4">
        <p>{error}</p>
        <p className="text-sm text-slate-500">Ensure the server is running on port 3000</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-slate-900">
      <div className="flex-1 min-h-[300px] min-w-0 w-full">
      <ErrorBoundary>
      <Editor
        key={roomId}
        height="100%"
        className="h-full min-h-[300px]"
        defaultLanguage="javascript"
        loading={<div className="flex items-center justify-center h-full min-h-[300px] text-slate-400">Loading editor...</div>}
        defaultValue={DEFAULT_CODE}
        theme="vs-dark"
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
      </ErrorBoundary>
    </div>
    </div>
  )
}

export default EditorTextbox