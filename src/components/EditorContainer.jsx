import EditorTextbox from './EditorTextbox'
import OutputBox from './OutputBox'

function EditorContainer() {
  return (
    <main className="flex-1 flex w-full bg-slate-800 overflow-hidden">
      <EditorTextbox />
      <OutputBox />
    </main>
  )
}

export default EditorContainer