import React, { lazy, Suspense, useDeferredValue, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ExportIcon } from './Icons'

// Syntax highlighting is only needed for fenced code blocks. Keep its large
// language/style bundle out of the critical startup path until it is actually
// rendered.
const DeferredSyntaxHighlighter = lazy(async () => {
  const [{ Prism }, { oneDark }] = await Promise.all([
    import('react-syntax-highlighter'),
    import('react-syntax-highlighter/dist/esm/styles/prism'),
  ])

  return {
    default: (props: React.ComponentProps<typeof Prism>) => (
      <Prism style={oneDark} {...props} />
    ),
  }
})

interface PreviewProps {
  value: string
  editorSize: number
  isColumnLayout: boolean
  isStandalone?: boolean
  showExportButton?: boolean
  exportButtonPosition?: 'top-right' | 'bottom-right'
  onExport?: () => void
  editable?: boolean
  onChange?: (value: string) => void
  spellCheck?: boolean
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
  onCursorPositionChange?: (position: number) => void
  onSelectionChange?: (start: number, end: number) => void
}

interface SpoilerNode {
  type: string
  value?: string
  children?: SpoilerNode[]
  [key: string]: unknown
}

function remarkSpoilers() {
  return (tree: SpoilerNode) => {
    const visit = (node: SpoilerNode) => {
      if (node.type === 'code' || !node.children) return

      const children: SpoilerNode[] = []
      for (const child of node.children) {
        if (child.type !== 'text' || !child.value) {
          children.push(child)
          continue
        }

        let lastIndex = 0
        const spoilerPattern = /\|\|([\s\S]+?)\|\|/g
        let match: RegExpExecArray | null
        while ((match = spoilerPattern.exec(child.value)) !== null) {
          if (match.index > lastIndex) {
            children.push({ type: 'text', value: child.value.slice(lastIndex, match.index) })
          }
          children.push({
            type: 'link',
            title: null,
            url: '#spoiler',
            children: [{ type: 'text', value: match[1] }],
          })
          lastIndex = match.index + match[0].length
        }

        if (lastIndex === 0) {
          children.push(child)
        } else if (lastIndex < child.value.length) {
          children.push({ type: 'text', value: child.value.slice(lastIndex) })
        }
      }
      node.children = children
      node.children.forEach(visit)
    }

    visit(tree)
  }
}

function Spoiler({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element {
  const [revealed, setRevealed] = useState(false)

  return (
    <span
      {...props}
      className={`spoiler${revealed ? ' spoiler--revealed' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={revealed ? 'Hide spoiler' : 'Reveal spoiler'}
      onClick={() => setRevealed((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setRevealed((current) => !current)
        }
      }}
    >
      {children}
    </span>
  )
}

function PreviewLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>): React.JSX.Element {
  if (href === '#spoiler') {
    return <Spoiler {...props}>{children}</Spoiler>
  }

  return <a href={href} {...props}>{children}</a>
}

const MarkdownContent = React.memo(function MarkdownContent({ value }: { value: string }): React.JSX.Element {
  return <ReactMarkdown remarkPlugins={[remarkGfm, remarkSpoilers]} components={{
    a: PreviewLink,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      if (!inline && match) {
        const code = String(children).replace(/\n$/, '')
        return (
          <Suspense fallback={<pre>{code}</pre>}>
            <DeferredSyntaxHighlighter language={match[1].toLowerCase()} PreTag="div" {...props}>
              {code}
            </DeferredSyntaxHighlighter>
          </Suspense>
        )
      }

      return <code className={className} {...props}>{children}</code>
    },
    }}>{value}</ReactMarkdown>
})

function getMarkdownLineStyle(line: string): { fontSize: string; fontWeight: number; lineHeight: string; fontStyle?: 'italic' } {
  const trimmed = line.trimStart()

  if (trimmed.startsWith('# ')) return { fontSize: '2em', fontWeight: 600, lineHeight: '1.2' }
  if (trimmed.startsWith('## ')) return { fontSize: '1.5em', fontWeight: 600, lineHeight: '1.3' }
  if (trimmed.startsWith('### ')) return { fontSize: '1.25em', fontWeight: 600, lineHeight: '1.4' }
  if (trimmed.startsWith('>')) return { fontSize: '1em', fontWeight: 400, lineHeight: '1.6', fontStyle: 'italic' }
  if (/^[-*+]\s+/.test(trimmed)) return { fontSize: '1em', fontWeight: 400, lineHeight: '1.6' }
  if (/^\s*\d+\.\s+/.test(trimmed)) return { fontSize: '1em', fontWeight: 400, lineHeight: '1.6' }

  return { fontSize: '1em', fontWeight: 400, lineHeight: '1.6' }
}

export function Preview({
  value,
  editorSize,
  isColumnLayout,
  isStandalone = false,
  showExportButton = false,
  exportButtonPosition = 'top-right',
  onExport,
  editable = false,
  onChange,
  spellCheck = false,
  textareaRef,
  onCursorPositionChange,
  onSelectionChange,
}: PreviewProps): React.JSX.Element {
    // Keep typing and cursor updates urgent while scheduling the comparatively
  // expensive Markdown parse at a lower priority. The editable overlay must
  // use the current value so its selection and formatting remain aligned.
  const deferredValue = useDeferredValue(value)
  const renderedValue = editable ? value : deferredValue
  const [activeLineStyle, setActiveLineStyle] = useState<{ fontSize: string; fontWeight: number; lineHeight: string; fontStyle?: 'italic' }>(() => {
    const firstLine = value.split('\n')[0] ?? ''
    return getMarkdownLineStyle(firstLine)
  })

  const syncActiveLineStyle = (nextValue: string, cursorIndex: number) => {
    const beforeCursor = nextValue.slice(0, cursorIndex)
    const lineStart = beforeCursor.lastIndexOf('\n') + 1
    const lineEnd = nextValue.indexOf('\n', lineStart)
    const currentLine = nextValue.slice(lineStart, lineEnd === -1 ? nextValue.length : lineEnd)
    const nextStyle = getMarkdownLineStyle(currentLine)

    setActiveLineStyle((prev) => {
      if (
        prev.fontSize === nextStyle.fontSize &&
        prev.fontWeight === nextStyle.fontWeight &&
        prev.lineHeight === nextStyle.lineHeight &&
        prev.fontStyle === nextStyle.fontStyle
      ) {
        return prev
      }

      return nextStyle
    })
  }

  return (
    <div
      className={`preview preview--${exportButtonPosition}${editable ? ' preview--editable' : ''}`}
      style={
        isStandalone
          ? undefined
          : isColumnLayout
            ? {
                height: `${100 - editorSize}%`,
                flex: `0 0 ${100 - editorSize}%`,
              }
            : {
                width: `calc(${100 - editorSize}% - 1px)`,
                flex: `0 0 calc(${100 - editorSize}% - 1px)`,
              }
      }
    >
      {showExportButton && onExport && (
        <button
          type="button"
          className="preview-export-button"
          onClick={onExport}
          aria-label="Export note"
          title="Export current note"
        >
          <span className="preview-export-icon" aria-hidden="true">
            <ExportIcon />
          </span>
        </button>
      )}
      {editable ? (
        <div className="preview-editor-surface">
          <div className="preview-editor-rendered" aria-hidden="true">
            <MarkdownContent value={renderedValue} />
                      </div>
          <textarea
            ref={textareaRef}
            className="preview-editor-source"
            value={value}
            wrap="soft"
            style={{
              fontSize: activeLineStyle.fontSize,
              fontWeight: activeLineStyle.fontWeight,
              lineHeight: activeLineStyle.lineHeight,
              fontStyle: activeLineStyle.fontStyle,
            }}
            onChange={(event) => {
              const nextValue = event.target.value
              const nextIndex = event.target.selectionStart
              onChange?.(nextValue)
              syncActiveLineStyle(nextValue, nextIndex)
                            onCursorPositionChange?.(nextIndex)
              onSelectionChange?.(event.target.selectionStart, event.target.selectionEnd)
            }}
            onSelect={(event) => {
              const nextValue = event.currentTarget.value
              const nextIndex = event.currentTarget.selectionStart
              syncActiveLineStyle(nextValue, nextIndex)
                            onCursorPositionChange?.(nextIndex)
              onSelectionChange?.(event.currentTarget.selectionStart, event.currentTarget.selectionEnd)
            }}
            onKeyUp={(event) => {
              const nextValue = event.currentTarget.value
              const nextIndex = event.currentTarget.selectionStart
              syncActiveLineStyle(nextValue, nextIndex)
                            onCursorPositionChange?.(nextIndex)
              onSelectionChange?.(event.currentTarget.selectionStart, event.currentTarget.selectionEnd)
            }}
            onMouseUp={(event) => {
              const nextValue = event.currentTarget.value
              const nextIndex = event.currentTarget.selectionStart
              syncActiveLineStyle(nextValue, nextIndex)
                            onCursorPositionChange?.(nextIndex)
              onSelectionChange?.(event.currentTarget.selectionStart, event.currentTarget.selectionEnd)
            }}
            spellCheck={spellCheck}
            aria-label="Formatted Markdown editor"
          />
        </div>
      ) : (
                <MarkdownContent value={renderedValue} />
      )}
    </div>
  )
}
