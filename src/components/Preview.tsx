import React from 'react'
import ReactMarkdown from 'react-markdown'

interface PreviewProps {
  value: string
  editorSize: number
  isColumnLayout: boolean
}

export function Preview({
  value,
  editorSize,
  isColumnLayout,
}: PreviewProps): React.JSX.Element {
  return (
    <div
      className="preview"
      aria-hidden
      style={
        isColumnLayout
          ? {
              height: `${100 - editorSize}%`,
              flex: `0 0 ${100 - editorSize}%`,
            }
          : {
              width: `${100 - editorSize}%`,
              flex: `0 0 ${100 - editorSize}%`,
            }
      }
    >
      <ReactMarkdown>{value}</ReactMarkdown>
    </div>
  )
}
