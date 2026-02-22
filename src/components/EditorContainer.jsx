import EditorTextbox from './EditorTextbox'
import OutputBox from './OutputBox'

function EditorContainer({ socket, roomId }) {
  return (
    <main className="flex-1 flex w-full bg-slate-800 overflow-hidden min-h-0">
      <EditorTextbox socket={socket} roomId={roomId || ''} />
      <OutputBox />
    </main>
  )
}

export default EditorContainer