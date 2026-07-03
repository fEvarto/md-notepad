import React from 'react'
import { Tooltip } from './Tooltip'
import { BoldIcon, CodeIcon, ExportIcon, HeadingIcon, Heading2Icon, InfoIcon, ItalicIcon, ListIcon } from './Icons'

interface ToolbarProps {
  filename: string
  onFilenameChange: (value: string) => void
  onExport: (filename: string) => void
  onBold: () => void
  onItalic: () => void
  onCode: () => void
  onH1: () => void
  onH2: () => void
  onList: () => void
  onInfoClick: () => void
  wrapToggleFeedback: 'bold' | 'italic' | 'code' | null
}

export function Toolbar({
  filename,
  onFilenameChange,
  onExport,
  onBold,
  onItalic,
  onCode,
  onH1,
  onH2,
  onList,
  onInfoClick,
  wrapToggleFeedback,
}: ToolbarProps): React.JSX.Element {
  return (
    <div className="toolbar">
      <button title="Bold (wrap selection)" onClick={onBold} aria-label="Bold" className={wrapToggleFeedback === 'bold' ? 'toggle-off' : ''}>
        <span className="toolbar-icon" aria-hidden="true">
          <BoldIcon />
        </span>
        <Tooltip text="Bold (wrap selection)" keybind="Ctrl/Cmd+B" />
      </button>
      <button title="Italic (wrap selection)" onClick={onItalic} aria-label="Italic" className={wrapToggleFeedback === 'italic' ? 'toggle-off' : ''}>
        <span className="toolbar-icon" aria-hidden="true">
          <ItalicIcon />
        </span>
        <Tooltip text="Italic (wrap selection)" keybind="Ctrl/Cmd+I" />
      </button>
      <button title="Inline code" onClick={onCode} aria-label="Inline code" className={wrapToggleFeedback === 'code' ? 'toggle-off' : ''}>
        <span className="toolbar-icon" aria-hidden="true">
          <CodeIcon />
        </span>
        <Tooltip text="Inline code" keybind="Ctrl/Cmd+K" />
      </button>
      <button title="H1" onClick={onH1} aria-label="Heading 1">
        <span className="toolbar-icon" aria-hidden="true">
          <HeadingIcon />
        </span>
        <Tooltip text="Heading 1" keybind="Ctrl/Cmd+Alt+1" />
      </button>
      <button title="H2" onClick={onH2} aria-label="Heading 2">
        <span className="toolbar-icon" aria-hidden="true">
          <Heading2Icon />
        </span>
        <Tooltip text="Heading 2" keybind="Ctrl/Cmd+Alt+2" />
      </button>
      <button title="List" onClick={onList} aria-label="Bullet list">
        <span className="toolbar-icon" aria-hidden="true">
          <ListIcon />
        </span>
        <Tooltip text="List item" keybind="Ctrl/Cmd+Alt+L" />
      </button>
      <div className="spacer" />
      <input
        className="filename-input"
        value={filename}
        onChange={(e) => onFilenameChange(e.target.value)}
        aria-label="Filename for export"
        placeholder="note.md"
      />
      <button className="primary" onClick={() => onExport(filename)} aria-label="Export note">
        <span className="toolbar-icon toolbar-icon-primary" aria-hidden="true">
          <ExportIcon />
        </span>
        <Tooltip text="Export current note" keybind="Ctrl/Cmd+S" />
      </button>
      <button title="Info" onClick={onInfoClick} aria-label="Open info and settings">
        <span className="toolbar-icon" aria-hidden="true">
          <InfoIcon />
        </span>
        <Tooltip text="Open settings" />
      </button>
    </div>
  )
}
