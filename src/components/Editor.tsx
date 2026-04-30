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
  children,
}: EditorProps): React.JSX.Element {
  const lineCount = value.split('\n').length
  const lineNumbersRef = useRef<HTMLDivElement | null>(null)
  
  // Calculate line numbers column width based on digit count
  const digitCount = Math.max(2, Math.floor(Math.log10(Math.max(lineCount, 10))) + 1)
  const lineNumberWidth = digitCount * 0.6 + 1.5 // Approximate width in rem

  // Sync scrolling between textarea and line numbers
  useEffect(() => {
    const textarea = textareaRef.current
    const lineNumbers = lineNumbersRef.current

    if (!textarea || !lineNumbers) return

    const handleScroll = () => {
      lineNumbers.scrollTop = textarea.scrollTop
    }

    textarea.addEventListener('scroll', handleScroll)
    return () => textarea.removeEventListener('scroll', handleScroll)
  }, [textareaRef])

  return (
    <div className="editor-main" ref={containerRef}>
      {showLineNumbers && (
        <div
          className="editor-line-numbers"
          ref={lineNumbersRef}
          style={{ width: `${lineNumberWidth}rem` }}
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
              }
            : {
                width: `${editorSize}%`,
                flex: `0 0 ${editorSize}%`,
              }
        }
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          onCursorPositionChange?.(e.target.selectionStart)
        }}
        onSelect={(e) => onCursorPositionChange?.(e.currentTarget.selectionStart)}
        onKeyUp={(e) => onCursorPositionChange?.(e.currentTarget.selectionStart)}
        onMouseUp={(e) => onCursorPositionChange?.(e.currentTarget.selectionStart)}
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
