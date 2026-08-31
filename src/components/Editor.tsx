import React, { useEffect, useRef } from 'react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  editorSize: number
  isColumnLayout: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onSeparatorMouseDown: (e: React.MouseEvent) => void
  onSeparatorTouchStart: (e: React.TouchEvent) => void
  containerRef: React.RefObject<HTMLDivElement | null>
  showSeparator?: boolean
  spellCheck?: boolean
  showLineNumbers?: boolean
  onCursorPositionChange?: (position: number) => void
  onSelectionChange?: (start: number, end: number) => void
  children?: React.ReactNode
}

export function Editor({
  value,
  onChange,
  editorSize,
  isColumnLayout,
  textareaRef,
  onSeparatorMouseDown,
  onSeparatorTouchStart,
  containerRef,
  showSeparator = true,
  spellCheck = false,
  showLineNumbers = false,
  onCursorPositionChange,
  onSelectionChange,
  children,
}: EditorProps): React.JSX.Element {
  const lineCount = value.split('\n').length
  const lineNumbersRef = useRef<HTMLDivElement | null>(null)
  
  // Calculate line numbers column width based on digit count
  const digitCount = Math.max(2, Math.floor(Math.log10(Math.max(lineCount, 10))) + 1)
  const lineNumberWidth = digitCount * 0.6 + 1.5 // Approximate width in rem

    // Sync scrolling between textarea and line numbers. The immediate sync is
  // important when the gutter is mounted after the editor has already scrolled.
  useEffect(() => {
    const textarea = textareaRef.current
    const lineNumbers = lineNumbersRef.current

    if (!textarea || !lineNumbers || !showLineNumbers) return

    const syncScroll = () => {
      lineNumbers.scrollTop = textarea.scrollTop
    }

    syncScroll()
    textarea.addEventListener('scroll', syncScroll, { passive: true })
    return () => textarea.removeEventListener('scroll', syncScroll)
  }, [textareaRef, showLineNumbers, lineCount, editorSize, isColumnLayout])

    const lineNumbersOffset = showLineNumbers
    ? `${lineNumberWidth + 1.5}rem + 1px`
    : '0px'

  return (
    <div
      className="editor-main"
      ref={containerRef}
      style={{ '--line-numbers-width': lineNumbersOffset } as React.CSSProperties}
    >
      {showLineNumbers && (
                <div
          className="editor-line-numbers"
          ref={lineNumbersRef}
          style={{
            width: `${lineNumberWidth}rem`,
            ...(isColumnLayout ? { height: `${editorSize}%` } : {}),
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="line-number">
              {i + 1}
            </div>
          ))}
        </div>
      )}
      <textarea
        key={spellCheck ? 'spellcheck-on' : 'spellcheck-off'}
        ref={textareaRef}
        className="editor-textarea"
        lang="en-US"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect={spellCheck ? 'on' : 'off'}
        style={
          isColumnLayout
            ? {
              height: `${editorSize}%`,
              flex: `0 0 ${editorSize}%`,
              width: '100%',
            }
            : {
                width: `calc(${editorSize}% - var(--line-numbers-width))`,
                flex: `0 0 calc(${editorSize}% - var(--line-numbers-width))`,
              }
        }
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          onCursorPositionChange?.(e.target.selectionStart)
          onSelectionChange?.(e.target.selectionStart, e.target.selectionEnd)
        }}
        onSelect={(e) => {
          onCursorPositionChange?.(e.currentTarget.selectionStart)
          onSelectionChange?.(e.currentTarget.selectionStart, e.currentTarget.selectionEnd)
        }}
        onKeyUp={(e) => {
          onCursorPositionChange?.(e.currentTarget.selectionStart)
          onSelectionChange?.(e.currentTarget.selectionStart, e.currentTarget.selectionEnd)
        }}
        onMouseUp={(e) => {
          onCursorPositionChange?.(e.currentTarget.selectionStart)
          onSelectionChange?.(e.currentTarget.selectionStart, e.currentTarget.selectionEnd)
        }}
        spellCheck={spellCheck}
        aria-label="Markdown editor"
      />
      {showSeparator && (
        <div
          className="separator"
          onMouseDown={onSeparatorMouseDown}
          onTouchStart={onSeparatorTouchStart}
          aria-label="Resize separator"
          role="separator"
        />
      )}
      {children}
    </div>
  )
}
