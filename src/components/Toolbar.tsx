import React from 'react'
import { Tooltip } from './Tooltip'
import {
  BlockquoteIcon,
  BoldIcon,
  CodeBlockIcon,
  CodeIcon,
  ExportIcon,
  HeadingIcon,
  Heading2Icon,
  ImageIcon,
  InfoIcon,
    ItalicIcon,
  LinkIcon,
  ListIcon,
  SpoilerIcon,
  TableIcon,
} from './Icons'
import type { ToolbarStyleButtonId } from '../utils/toolbarButtons'

export interface ToolbarMarkdownActions {
  onBold: () => void
  onItalic: () => void
  onCode: () => void
  onSpoiler: () => void
  onH1: () => void
  onH2: () => void
  onList: () => void
  onLink: () => void
  onImage: () => void
  onBlockquote: () => void
  onCodeBlock: () => void
  onTable: () => void
}

interface ToolbarProps {
  filename: string
  onFilenameChange: (value: string) => void
  onExport: (filename: string) => void
  showExportButton?: boolean
  visibleButtons: ToolbarStyleButtonId[]
  totalStyleButtonsCount: number
  actions: ToolbarMarkdownActions
  onInfoClick: () => void
  wrapToggleFeedback: 'bold' | 'italic' | 'code' | 'spoiler' | null
  activeStyles?: ToolbarStyleButtonId[]
  swapLayout?: boolean
}

function renderStyleButton(
  id: ToolbarStyleButtonId,
  actions: ToolbarMarkdownActions,
    wrapToggleFeedback: 'bold' | 'italic' | 'code' | 'spoiler' | null,
  activeStyles: ToolbarStyleButtonId[]
): React.JSX.Element | null {
  switch (id) {
    case 'bold':
      return (
        <button
          key={id}
          type="button"
          title="Bold (wrap selection)"
          onClick={actions.onBold}
          aria-label="Bold"
          className={`${activeStyles.includes('bold') ? 'active ' : ''}${wrapToggleFeedback === 'bold' ? 'toggle-off' : ''}`}
        >
          <span className="toolbar-icon" aria-hidden="true">
            <BoldIcon />
          </span>
          <Tooltip text="Bold (wrap selection)" keybind="Ctrl/Cmd+B" />
        </button>
      )
    case 'italic':
      return (
        <button
          key={id}
          type="button"
          title="Italic (wrap selection)"
          onClick={actions.onItalic}
          aria-label="Italic"
          className={`${activeStyles.includes('italic') ? 'active ' : ''}${wrapToggleFeedback === 'italic' ? 'toggle-off' : ''}`}
        >
          <span className="toolbar-icon" aria-hidden="true">
            <ItalicIcon />
          </span>
          <Tooltip text="Italic (wrap selection)" keybind="Ctrl/Cmd+I" />
        </button>
      )
    case 'inlineCode':
      return (
        <button
          key={id}
          type="button"
          title="Inline code"
          onClick={actions.onCode}
          aria-label="Inline code"
          className={`${activeStyles.includes('inlineCode') ? 'active ' : ''}${wrapToggleFeedback === 'code' ? 'toggle-off' : ''}`}
        >
          <span className="toolbar-icon" aria-hidden="true">
            <CodeIcon />
          </span>
          <Tooltip text="Inline code" keybind="Ctrl/Cmd+K" />
        </button>
      )
        case 'spoiler':
      return (
        <button
          key={id}
          type="button"
          title="Spoiler (wrap selection)"
          onClick={actions.onSpoiler}
          aria-label="Spoiler"
          className={`${activeStyles.includes('spoiler') ? 'active ' : ''}${wrapToggleFeedback === 'spoiler' ? 'toggle-off' : ''}`}
        >
          <span className="toolbar-icon" aria-hidden="true">
            <SpoilerIcon />
          </span>
          <Tooltip text="Spoiler (wrap selection)" keybind="Ctrl/Cmd+Alt+S" />
        </button>
      )
    case 'link':
      return (
        <button key={id} type="button" title="Link" onClick={actions.onLink} aria-label="Link" className={activeStyles.includes('link') ? 'active' : ''}>
          <span className="toolbar-icon" aria-hidden="true">
            <LinkIcon />
          </span>
          <Tooltip text="Insert link" keybind="Ctrl/Cmd+Alt+U" />
        </button>
      )
    case 'image':
      return (
        <button key={id} type="button" title="Image" onClick={actions.onImage} aria-label="Image" className={activeStyles.includes('image') ? 'active' : ''}>
          <span className="toolbar-icon" aria-hidden="true">
            <ImageIcon />
          </span>
          <Tooltip text="Insert image" keybind="Ctrl/Cmd+Alt+G" />
        </button>
      )
    case 'h1':
      return (
        <button key={id} type="button" title="H1" onClick={actions.onH1} aria-label="Heading 1" className={activeStyles.includes('h1') ? 'active' : ''}>
          <span className="toolbar-icon" aria-hidden="true">
            <HeadingIcon />
          </span>
          <Tooltip text="Heading 1" keybind="Ctrl/Cmd+Alt+1" />
        </button>
      )
    case 'h2':
      return (
        <button key={id} type="button" title="H2" onClick={actions.onH2} aria-label="Heading 2" className={activeStyles.includes('h2') ? 'active' : ''}>
          <span className="toolbar-icon" aria-hidden="true">
            <Heading2Icon />
          </span>
          <Tooltip text="Heading 2" keybind="Ctrl/Cmd+Alt+2" />
        </button>
      )
    case 'list':
      return (
        <button key={id} type="button" title="List" onClick={actions.onList} aria-label="Bullet list" className={activeStyles.includes('list') ? 'active' : ''}>
          <span className="toolbar-icon" aria-hidden="true">
            <ListIcon />
          </span>
          <Tooltip text="List item" keybind="Ctrl/Cmd+Alt+L" />
        </button>
      )
    case 'blockquote':
      return (
        <button key={id} type="button" title="Blockquote" onClick={actions.onBlockquote} aria-label="Blockquote" className={activeStyles.includes('blockquote') ? 'active' : ''}>
          <span className="toolbar-icon" aria-hidden="true">
            <BlockquoteIcon />
          </span>
          <Tooltip text="Blockquote" keybind="Ctrl/Cmd+Alt+Q" />
        </button>
      )
    case 'codeBlock':
      return (
        <button key={id} type="button" title="Code block" onClick={actions.onCodeBlock} aria-label="Code block" className={activeStyles.includes('codeBlock') ? 'active' : ''}>
          <span className="toolbar-icon" aria-hidden="true">
            <CodeBlockIcon />
          </span>
          <Tooltip text="Fenced code block" keybind="Ctrl/Cmd+Alt+C" />
        </button>
      )
    case 'table':
      return (
        <button key={id} type="button" title="Table" onClick={actions.onTable} aria-label="Table" className={activeStyles.includes('table') ? 'active' : ''}>
          <span className="toolbar-icon" aria-hidden="true">
            <TableIcon />
          </span>
          <Tooltip text="Insert table" keybind="Ctrl/Cmd+Alt+T" />
        </button>
      )
    default:
      return null
  }
}

export function Toolbar({
  filename,
  onFilenameChange,
  onExport,
  showExportButton = true,
  visibleButtons,
  totalStyleButtonsCount,
  actions,
  onInfoClick,
    wrapToggleFeedback,
  activeStyles = [],
  swapLayout = false,
}: ToolbarProps): React.JSX.Element {
  const hiddenCount = totalStyleButtonsCount - visibleButtons.length

  return (
        <div className={`toolbar${swapLayout ? ' toolbar-swapped' : ''}`}>
      <div className="toolbar-style-buttons">
        {visibleButtons.map((id) => renderStyleButton(id, actions, wrapToggleFeedback, activeStyles))}
        {hiddenCount > 0 && (
          <button
            type="button"
            className="toolbar-overflow-indicator"
            title={`${hiddenCount} more button${hiddenCount === 1 ? '' : 's'} available — open settings to customize`}
            aria-label={`${hiddenCount} more toolbar buttons hidden`}
            onClick={onInfoClick}
          >
            <span className="toolbar-icon toolbar-overflow-icon" aria-hidden="true">+{hiddenCount}</span>
            <Tooltip text={`${hiddenCount} more — open settings`} />
          </button>
        )}
      </div>
      <div className="spacer" />
      <div className="toolbar-meta">
        <input
          className="filename-input"
          value={filename}
          onChange={(e) => onFilenameChange(e.target.value)}
          aria-label="Filename for export"
          placeholder="note.md"
        />
        {showExportButton && (
          <button type="button" className="primary" onClick={() => onExport(filename)} aria-label="Export note">
            <span className="toolbar-icon toolbar-icon-primary" aria-hidden="true">
              <ExportIcon />
            </span>
            <Tooltip text="Export current note" keybind="Ctrl/Cmd+S" />
          </button>
        )}
        <button type="button" title="Info" onClick={onInfoClick} aria-label="Open info and settings">
          <span className="toolbar-icon" aria-hidden="true">
            <InfoIcon />
          </span>
          <Tooltip text="Open settings" />
        </button>
      </div>
    </div>
  )
}
