import { useState } from 'react'

function EditorTextbox() {
  const [content, setContent] = useState('')
  
  const lines = content.split('\n')
  const lineCount = Math.max(1, lines.length)
  const fontSizePx = 14
  const lineHeightPx = 18

  const editorFont = {
    fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", "Consolas", "Liberation Mono", "Courier New", monospace',
    fontSize: fontSizePx,
    lineHeight: `${lineHeightPx}px`,
  }

  const notebookLines = {
    backgroundImage: `repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent ${lineHeightPx - 1}px,
      rgba(71, 85, 105, 0.5) ${lineHeightPx - 1}px,
      rgba(71, 85, 105, 0.5) ${lineHeightPx}px
    )`,
  }

  const contentHeight = lineCount * lineHeightPx

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900 border-r border-slate-700 overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-auto">
        {/* Line numbers - same row height as editor lines */}
        <div
          className="shrink-0 pl-4 pr-3 text-right select-none text-slate-500 border-r border-slate-700"
          style={{
            ...editorFont,
            minHeight: contentHeight,
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent ${lineHeightPx - 1}px,
              rgba(71, 85, 105, 0.5) ${lineHeightPx - 1}px,
              rgba(71, 85, 105, 0.5) ${lineHeightPx}px
            )`,
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              style={{
                height: lineHeightPx,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        {/* Editor area */}
        <div className="flex-1 relative min-w-0 overflow-auto">
          <div
            className="absolute inset-0 pl-4 pointer-events-none"
            style={notebookLines}
            aria-hidden="true"
          />
          <textarea
            className="relative w-full block bg-transparent text-slate-300 resize-none outline-none placeholder-slate-500 px-4"
            style={{
              ...editorFont,
              minHeight: contentHeight,
              overflow: 'hidden',
              margin: 0,
              paddingTop: 0,
              paddingBottom: 0,
              border: 'none',
              boxSizing: 'border-box',
            }}
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