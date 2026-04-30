import React from 'react'

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
      </button>
      <button title="Italic (wrap selection)" onClick={onItalic}>
        <i>I</i>
      </button>
      <button title="Inline code" onClick={onCode}>
        Code
      </button>
      <button title="H1" onClick={onH1}>
        H1
      </button>
      <button title="H2" onClick={onH2}>
        H2
      </button>
      <button title="List" onClick={onList}>
        List
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
      </button>
      <button title="Info" onClick={onInfoClick}>
        i
      </button>
    </div>
  )
}
