import React from 'react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  editorSize: number
  isColumnLayout: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onSeparatorMouseDown: (e: React.MouseEvent) => void
  onSeparatorTouchStart: (e: React.TouchEvent) => void
  containerRef: React.RefObject<HTMLDivElement | null>
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
  children,
}: EditorProps): React.JSX.Element {
  return (
    <div className="editor-main" ref={containerRef}>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
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
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        aria-label="Markdown editor"
      />
      <div
        className="separator"
        onMouseDown={onSeparatorMouseDown}
        onTouchStart={onSeparatorTouchStart}
        aria-label="Resize separator"
        role="separator"
      />
      {children}
    </div>
  )
}
