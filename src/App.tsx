import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

function App(): React.JSX.Element {
  const [value, setValue] = useState<string>('# Welcome to MD-Notepad\n\nStart typing your markdown here...')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [filename, setFilename] = useState<string>('note.md')
  const [editorSize, setEditorSize] = useState<number>(60) // percentage (width in row, height in column)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const prevFocusedRef = useRef<HTMLElement | null>(null)
  const [isColumnLayout, setIsColumnLayout] = useState<boolean>(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsColumnLayout(e.matches)
    }
    handleChange(mediaQuery as unknown as MediaQueryListEvent)
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  const handleSeparatorMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startY = e.clientY
    const startSize = editorSize
    const container = containerRef.current
    if (!container) return
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight
    const isColumn = window.matchMedia('(max-width: 768px)').matches

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isColumn) {
        const delta = moveEvent.clientY - startY
        const deltaPercent = (delta / containerHeight) * 100
        const newSize = Math.max(20, Math.min(80, startSize + deltaPercent))
        setEditorSize(newSize)
      } else {
        const delta = moveEvent.clientX - startX
        const deltaPercent = (delta / containerWidth) * 100
        const newSize = Math.max(20, Math.min(80, startSize + deltaPercent))
        setEditorSize(newSize)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleSeparatorTouchStart = (e: React.TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return
    const touch = e.touches[0]
    const startX = touch.clientX
    const startY = touch.clientY
    const startSize = editorSize
    const container = containerRef.current
    if (!container) return
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight
    const isColumn = window.matchMedia('(max-width: 768px)').matches

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault()
      if (!moveEvent.touches || moveEvent.touches.length === 0) return
      const t = moveEvent.touches[0]
      if (isColumn) {
        const delta = t.clientY - startY
        const deltaPercent = (delta / containerHeight) * 100
        const newSize = Math.max(20, Math.min(80, startSize + deltaPercent))
        setEditorSize(newSize)
      } else {
        const delta = t.clientX - startX
        const deltaPercent = (delta / containerWidth) * 100
        const newSize = Math.max(20, Math.min(80, startSize + deltaPercent))
        setEditorSize(newSize)
      }
    }

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  const applyWrap = (before: string, after?: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)
    const close = after ?? before
    const newText = value.slice(0, start) + before + selected + close + value.slice(end)
    setValue(newText)
    requestAnimationFrame(() => {
      if (!ta) return
      const newStart = start + before.length
      const newEnd = newStart + selected.length
      ta.focus()
      ta.setSelectionRange(newStart, newEnd)
    })
  }

  const applyLinePrefix = (prefix: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const before = value.slice(0, start)
    const selection = value.slice(start, end)
    const lines = selection.split('\n').map((ln) => (ln.length ? prefix + ln : prefix))
    const joined = lines.join('\n')
    const newText = before + joined + value.slice(end)
    setValue(newText)
    requestAnimationFrame(() => {
      if (!ta) return
      ta.focus()
      ta.setSelectionRange(start + prefix.length, start + prefix.length + joined.length - prefix.length)
    })
  }

  const exportMarkdown = (filename = 'note.md') => {
    const blob = new Blob([value], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        exportMarkdown(filename)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [value, filename])

  useEffect(() => {
    if (!showInfo) return
    prevFocusedRef.current = document.activeElement as HTMLElement | null
    const modal = modalRef.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowInfo(false)
    }
    window.addEventListener('keydown', onKey)
    // focus modal for accessibility
    setTimeout(() => modal?.focus(), 0)
    return () => {
      window.removeEventListener('keydown', onKey)
      // restore focus
      prevFocusedRef.current?.focus()
    }
  }, [showInfo])

  return (
    <div className="editor-app">
      <div className="toolbar">
        <button title="Bold (wrap selection)" onClick={() => applyWrap('**')}><b>B</b></button>
        <button title="Italic (wrap selection)" onClick={() => applyWrap('*')}><i>I</i></button>
        <button title="Inline code" onClick={() => applyWrap('`')}>Code</button>
        <button title="H1" onClick={() => applyLinePrefix('# ')}>H1</button>
        <button title="H2" onClick={() => applyLinePrefix('## ')}>H2</button>
        <button title="List" onClick={() => applyLinePrefix('- ')}>List</button>
        <div className="spacer" />
        <input
          className="filename-input"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          aria-label="Filename for export"
          placeholder="note.md"
        />
        <button className="primary" onClick={() => exportMarkdown(filename)}>Export</button>
        <button title="Info" onClick={() => setShowInfo(true)}>i</button>
      </div>
      {showInfo && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInfo(false)
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-title"
            ref={modalRef}
            tabIndex={-1}
          >
            <h2 id="info-title">About MD-Notepad</h2>
            <p>
              MD-Notepad is a minimal, fast Markdown editor with live preview, touch-friendly resizing, and responsive design.
            </p>
            
            <h3>Keyboard Shortcuts</h3>
            <ul className="shortcuts-list">
              <li><kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>S</kbd> — Export as .md file</li>
              <li><kbd>Esc</kbd> — Close this dialog</li>
            </ul>

            <h3>Formatting Tips</h3>
            <ul className="tips-list">
              <li><strong>Bold:</strong> Use <kbd>**text**</kbd></li>
              <li><strong>Italic:</strong> Use <kbd>*text*</kbd></li>
              <li><strong>Headings:</strong> Use <kbd>#</kbd>, <kbd>##</kbd>, <kbd>###</kbd> etc.</li>
              <li><strong>Code:</strong> Wrap with backticks <kbd>`code`</kbd> or use code block button</li>
              <li><strong>Lists:</strong> Start lines with <kbd>-</kbd> for bullet points</li>
            </ul>

            <h3>Resources</h3>
            <ul className="resources-list">
              <li>
                <a href="https://commonmark.org/help/" target="_blank" rel="noopener noreferrer">Markdown Guide →</a>
              </li>
              <li>
                <a href="https://github.com/fEvarto/md-notepad" target="_blank" rel="noopener noreferrer">GitHub Repository →</a>
              </li>
            </ul>

            <div className="modal-actions">
              <button onClick={() => setShowInfo(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="editor-main" ref={containerRef}>
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          style={isColumnLayout ? { 
            height: `${editorSize}%`,
            flex: `0 0 ${editorSize}%`
          } : {
            width: `${editorSize}%`,
            flex: `0 0 ${editorSize}%`
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          aria-label="Markdown editor"
        />
        <div
          className="separator"
          onMouseDown={handleSeparatorMouseDown}
          onTouchStart={handleSeparatorTouchStart}
          aria-label="Resize separator"
          role="separator"
        />
        <div 
          className="preview" 
          aria-hidden
          style={isColumnLayout ? {
            height: `${100 - editorSize}%`,
            flex: `0 0 ${100 - editorSize}%`
          } : {
            width: `${100 - editorSize}%`,
            flex: `0 0 ${100 - editorSize}%`
          }}
        >
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default App
