import React from 'react'
import { Tooltip } from './Tooltip'

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
}: ToolbarProps): React.JSX.Element {
  return (
    <div className="toolbar">
      <button title="Bold (wrap selection)" onClick={onBold}>
        <b>B</b>
        <Tooltip text="Bold (wrap selection)" keybind="Ctrl/Cmd+B" />
      </button>
      <button title="Italic (wrap selection)" onClick={onItalic}>
        <i>I</i>
        <Tooltip text="Italic (wrap selection)" keybind="Ctrl/Cmd+I" />
      </button>
      <button title="Inline code" onClick={onCode}>
        Code
        <Tooltip text="Inline code" keybind="Ctrl/Cmd+K" />
      </button>
      <button title="H1" onClick={onH1}>
        H1
        <Tooltip text="Heading 1" keybind="Ctrl/Cmd+Alt+1" />
      </button>
      <button title="H2" onClick={onH2}>
        H2
        <Tooltip text="Heading 2" keybind="Ctrl/Cmd+Alt+2" />
      </button>
      <button title="List" onClick={onList}>
        List
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
      <button className="primary" onClick={() => onExport(filename)}>
        Export
        <Tooltip text="Export current note" keybind="Ctrl/Cmd+S" />
      </button>
      <button title="Info" onClick={onInfoClick}>
        i
        <Tooltip text="Open settings" />
      </button>
    </div>
  )
}
