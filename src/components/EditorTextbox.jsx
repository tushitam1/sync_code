import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { EditorView } from '@codemirror/view'

const lineHeightPx = 24

const notebookLinesTheme = EditorView.theme({
  '& .cm-content': {
    backgroundImage: `repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent ${lineHeightPx - 1}px,
      rgba(71, 85, 105, 0.4) ${lineHeightPx - 1}px,
      rgba(71, 85, 105, 0.4) ${lineHeightPx}px
    )`,
  },
  '& .cm-line': {
    lineHeight: `${lineHeightPx}px`,
    padding: 0,
  },
})

function EditorTextbox() {
  const [content, setContent] = useState('// Start typing...\n')

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900 border-r border-slate-700 overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto">
        <CodeMirror
          value={content}
          height="100%"
          extensions={[javascript({ jsx: true }), notebookLinesTheme]}
          onChange={(value) => setContent(value)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
          theme="dark"
          className="h-full text-sm"
          style={{
            fontSize: '14px',
          }}
        />
      </div>
    </div>
  )
}

export default EditorTextbox