import EditorTextbox from './EditorTextbox'
import OutputBox from './OutputBox'

function EditorContainer({ roomId, username, userColor, onAwarenessReady }) {
  return (
    <main className="flex-1 flex w-full bg-slate-800 overflow-hidden">
      <EditorTextbox
        roomId={roomId}
        username={username}
        userColor={userColor}
        onAwarenessReady={onAwarenessReady}
      />
      <OutputBox />
    </main>
  )
}

export default EditorContainer