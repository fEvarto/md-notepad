import React, { lazy, Suspense, useDeferredValue, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import { ExportIcon } from './Icons'
import type { ToolbarStyleButtonId } from '../utils/toolbarButtons'

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
  activeStyles?: ToolbarStyleButtonId[]
  activeStart?: number
  activeEnd?: number
}

interface SpoilerNode {
  type: string
  value?: string
  children?: SpoilerNode[]
  position?: {
    start?: { offset?: number }
    end?: { offset?: number }
  }
  [key: string]: unknown
}

interface PositionedNode {
  position?: {
    start?: { offset?: number }
    end?: { offset?: number }
  }
}

function isNodeUnderPointer(node: PositionedNode | undefined, start?: number, end?: number): boolean {
  const nodeStart = node?.position?.start?.offset
  const nodeEnd = node?.position?.end?.offset
  if (start === undefined || end === undefined || nodeStart === undefined || nodeEnd === undefined) return false
  return nodeStart <= end && nodeEnd >= start
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
        const childStart = child.position?.start?.offset
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
            position: childStart === undefined
              ? undefined
              : {
                  start: { offset: childStart + match.index },
                  end: { offset: childStart + match.index + match[0].length },
                },
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

function remarkBlankLines(value: string) {
  return (tree: SpoilerNode) => {
    if (!tree.children) return

    const children: SpoilerNode[] = []
    tree.children.forEach((child, index) => {
      if (index > 0) {
        const previous = tree.children?.[index - 1] as SpoilerNode & {
          position?: { end?: { offset?: number } }
        }
        const next = child as SpoilerNode & {
          position?: { start?: { offset?: number } }
        }
        const previousEnd = previous.position?.end?.offset
        const nextStart = next.position?.start?.offset
        if (previousEnd !== undefined && nextStart !== undefined) {
          const gap = value.slice(previousEnd, nextStart)
          const blankLines = Math.max(0, (gap.match(/\n/g)?.length ?? 0) - 1)
          for (let blankLine = 0; blankLine < blankLines; blankLine += 1) {
            children.push({ type: 'html', value: '<span class="markdown-blank-line" aria-hidden="true"></span>' })
          }
        }
      }
      children.push(child)
    })
    tree.children = children
  }
}

function Spoiler({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element {
  const [revealed, setRevealed] = useState(false)
  const className = props.className ?? ''

  return (
    <span
      {...props}
      className={`${className} spoiler${revealed ? ' spoiler--revealed' : ''}`.trim()}
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

  return <a href={href} className="markdown-syntax-link" {...props}>{children}</a>
}

const MarkdownContent = React.memo(function MarkdownContent({
  value,
  activeStart,
  activeEnd,
  editable,
}: {
  value: string
  activeStart?: number
  activeEnd?: number
  editable?: boolean
}): React.JSX.Element {
  const active = (node: PositionedNode | undefined) =>
    isNodeUnderPointer(node, activeStart, activeEnd) ? ' markdown-syntax-active' : ''

  return <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks, remarkSpoilers, () => remarkBlankLines(value)]} rehypePlugins={[rehypeRaw]} components={{
    pre: ({ children, node, ...props }) => {
      const start = node?.position?.start?.offset
      const end = node?.position?.end?.offset
      const source = start !== undefined && end !== undefined ? value.slice(start, end) : ''
      if (editable && isNodeUnderPointer(node, activeStart, activeEnd) && source) {
        return <pre className="markdown-syntax-code-source">{source}</pre>
      }
      const sourceLines = source.split('\n')
      const isFenced = sourceLines[0]?.trimStart().startsWith('```') && sourceLines.length > 1
      if (editable && isFenced) {
        return (
          <pre
            {...props}
            className="markdown-syntax-fenced"
            data-opening-fence={sourceLines[0]}
            data-closing-fence={sourceLines[sourceLines.length - 1]}
          >
            {children}
          </pre>
        )
      }
      return <pre {...props}>{children}</pre>
    },
    a: ({ children, node, ...props }) => <PreviewLink {...props} className={`markdown-syntax-link${active(node)}`}>{children}</PreviewLink>,
    h1: ({ children, node, ...props }) => <h1 className={`markdown-syntax-heading markdown-syntax-heading--1${active(node)}`} {...props}>{children}</h1>,
    h2: ({ children, node, ...props }) => <h2 className={`markdown-syntax-heading markdown-syntax-heading--2${active(node)}`} {...props}>{children}</h2>,
    h3: ({ children, node, ...props }) => <h3 className={`markdown-syntax-heading markdown-syntax-heading--3${active(node)}`} {...props}>{children}</h3>,
    h4: ({ children, node, ...props }) => <h4 className={`markdown-syntax-heading markdown-syntax-heading--4${active(node)}`} {...props}>{children}</h4>,
    h5: ({ children, node, ...props }) => <h5 className={`markdown-syntax-heading markdown-syntax-heading--5${active(node)}`} {...props}>{children}</h5>,
    h6: ({ children, node, ...props }) => <h6 className={`markdown-syntax-heading markdown-syntax-heading--6${active(node)}`} {...props}>{children}</h6>,
    strong: ({ children, node, ...props }) => <strong className={`markdown-syntax-strong${active(node)}`} {...props}>{children}</strong>,
    em: ({ children, node, ...props }) => <em className={`markdown-syntax-em${active(node)}`} {...props}>{children}</em>,
    del: ({ children, node, ...props }) => <del className={`markdown-syntax-del${active(node)}`} {...props}>{children}</del>,
    blockquote: ({ children, node, ...props }) => <blockquote className={`markdown-syntax-blockquote${active(node)}`} {...props}>{children}</blockquote>,
    ul: ({ children, node, ...props }) => <ul className={`markdown-syntax-list${active(node)}`} {...props}>{children}</ul>,
    ol: ({ children, node, ...props }) => <ol className={`markdown-syntax-list markdown-syntax-list--ordered${active(node)}`} {...props}>{children}</ol>,
    li: ({ children, node, ...props }) => <li className={`markdown-syntax-list-item${active(node)}`} {...props}>{children}</li>,
    table: ({ children, node, ...props }) => {
      const start = node?.position?.start?.offset
      const end = node?.position?.end?.offset
      if (editable && isNodeUnderPointer(node, activeStart, activeEnd) && start !== undefined && end !== undefined) {
        return <pre className="markdown-syntax-table-source">{value.slice(start, end)}</pre>
      }
      const tableChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'thead') {
          return [
            child,
            <tbody className="markdown-syntax-table-separator" aria-hidden="true" key="source-separator">
              <tr><td colSpan={100} /></tr>
            </tbody>,
          ]
        }
        return child
      })
      return <table className={`markdown-syntax-table${active(node)}`} {...props}>{tableChildren}</table>
    },
    th: ({ children, node, ...props }) => <th className={`markdown-syntax-table-cell${active(node)}`} {...props}><span className="markdown-syntax-table-cell-content">{children}</span></th>,
    td: ({ children, node, ...props }) => <td className={`markdown-syntax-table-cell${active(node)}`} {...props}><span className="markdown-syntax-table-cell-content">{children}</span></td>,
    img: ({ alt, src, node, ...props }) => {
      const isActive = isNodeUnderPointer(node, activeStart, activeEnd)
      const start = node?.position?.start?.offset
      const end = node?.position?.end?.offset
      if (editable && isActive && start !== undefined && end !== undefined) {
        return <span className="markdown-syntax-image-source">{value.slice(start, end)}</span>
      }
      return <img className="markdown-syntax-image" alt={alt} src={src} {...props} />
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code({ inline, className, children, node, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      if (!inline && match) {
        const code = String(children).replace(/\n$/, '')
        return (
          <div className={`markdown-syntax-code-block${active(node)}`}>
            <Suspense fallback={<pre>{code}</pre>}>
              <DeferredSyntaxHighlighter language={match[1].toLowerCase()} PreTag="div" {...props}>
                {code}
              </DeferredSyntaxHighlighter>
            </Suspense>
          </div>
        )
      }

      return <code className={`markdown-syntax-code${active(node)} ${className || ''}`} {...props}>{children}</code>
    },
    }}>{value}</ReactMarkdown>
})

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
  activeStyles = [],
  activeStart,
  activeEnd,
}: PreviewProps): React.JSX.Element {
    // Keep typing and cursor updates urgent while scheduling the comparatively
  // expensive Markdown parse at a lower priority. The editable overlay must
  // use the current value so its selection and formatting remain aligned.
  const deferredValue = useDeferredValue(value)
  const renderedValue = editable ? value : deferredValue
  return (
    <div
      className={`preview preview--${exportButtonPosition}${editable ? ' preview--editable' : ''} ${activeStyles.map((style) => `preview--active-${style}`).join(' ')}`}
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
            <MarkdownContent value={renderedValue} activeStart={activeStart} activeEnd={activeEnd} editable={editable} />
          </div>
          <textarea
            ref={textareaRef}
            className="preview-editor-source"
            value={value}
            wrap="soft"
            onChange={(event) => {
              const nextValue = event.target.value
              const nextIndex = event.target.selectionStart
              onChange?.(nextValue)
              onCursorPositionChange?.(nextIndex)
              onSelectionChange?.(event.target.selectionStart, event.target.selectionEnd)
            }}
            onSelect={(event) => {
              const nextIndex = event.currentTarget.selectionStart
              onCursorPositionChange?.(nextIndex)
              onSelectionChange?.(event.currentTarget.selectionStart, event.currentTarget.selectionEnd)
            }}
            onKeyUp={(event) => {
              const nextIndex = event.currentTarget.selectionStart
              onCursorPositionChange?.(nextIndex)
              onSelectionChange?.(event.currentTarget.selectionStart, event.currentTarget.selectionEnd)
            }}
                        onMouseUp={(event) => {
              const nextIndex = event.currentTarget.selectionStart
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
