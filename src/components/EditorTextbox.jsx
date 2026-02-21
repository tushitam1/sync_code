import { useState } from 'react'

function EditorTextbox() {
  const [content, setContent] = useState('')
  
  const lineCount = Math.max(1, content.split('\n').length)
  const fontSizePx = 14
  const lineHeightPx = fontSizePx

  const editorFont = {
    fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", "Consolas", "Liberation Mono", "Courier New", monospace',
    fontSize: fontSizePx,
    lineHeight: lineHeightPx,
  }

  const notebookLines = {
    backgroundImage: `repeating-linear-gradient(
      to bottom,
      transparent,
      transparent ${lineHeightPx - 1}px,
      rgba(71, 85, 105, 0.4) ${lineHeightPx - 1}px,
      rgba(71, 85, 105, 0.4) ${lineHeightPx}px
    )`,
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900 border-r border-slate-700 overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-auto">
        {/* Line numbers with ruled lines */}
        <div
          className="shrink-0 py-4 pl-4 pr-3 text-right select-none text-slate-500 border-r border-slate-700"
          style={{ ...editorFont, ...notebookLines }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{ height: lineHeightPx, lineHeight: lineHeightPx }}>{i + 1}</div>
          ))}
        </div>
        {/* Editor area with ruled lines */}
        <div className="flex-1 relative min-w-0">
          <div
            className="absolute inset-0 py-4 px-4 pointer-events-none"
            style={notebookLines}
            aria-hidden="true"
          />
          <textarea
            className="relative w-full h-full py-4 px-4 bg-transparent text-slate-300 resize-none outline-none placeholder-slate-500"
            style={editorFont}
            placeholder="// Start typing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}

export default EditorTextbox