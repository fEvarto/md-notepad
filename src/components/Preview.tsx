import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getPaneStyle } from '../utils'

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
      style={getPaneStyle(100 - editorSize, isColumnLayout)}
    >
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1].toLowerCase()}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  )
}
