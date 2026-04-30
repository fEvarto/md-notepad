import React, { useState, useEffect } from 'react'

interface StatusBarProps {
  text: string
  filename: string
  spellCheck: boolean
  cursorPosition: number
  realTimePreview: boolean
  previewMode: 'split' | 'separate'
  isPreviewActive: boolean
  onSpellCheckToggle: () => void
  onManualPreviewUpdate: () => void
  onSwitchPreviewPanel: () => void
}

interface FileStats {
  wordCount: number
  charCount: number
  readingTime: string
  line: number
  column: number
  fileSize: string
}

function getFileStats(text: string, cursorPosition: number): FileStats {
  // Word count (split by whitespace and filter empty strings)
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  // Character count
  const charCount = text.length

  // Estimated reading time (200 words per minute average)
  const readingTimeMinutes = Math.ceil(wordCount / 200)
  const readingTime = readingTimeMinutes < 1 ? '< 1 min' : `${readingTimeMinutes} min`

  // Line and column number
  const textBeforeCursor = text.substring(0, cursorPosition)
  const lines = textBeforeCursor.split('\n')
  const line = lines.length
  const column = lines[lines.length - 1].length + 1

  // File size in appropriate unit
  const bytes = new TextEncoder().encode(text).length
  let fileSize: string
  if (bytes < 1024) {
    fileSize = `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    fileSize = `${(bytes / 1024).toFixed(1)} KB`
  } else {
    fileSize = `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return {
    wordCount,
    charCount,
    readingTime,
    line,
    column,
    fileSize,
  }
}

export function StatusBar({
  text,
  filename,
  spellCheck,
  cursorPosition,
  realTimePreview,
  previewMode,
  isPreviewActive,
  onSpellCheckToggle,
  onManualPreviewUpdate,
  onSwitchPreviewPanel,
}: StatusBarProps): React.JSX.Element {
  const [stats, setStats] = useState<FileStats>(getFileStats(text, cursorPosition))

  useEffect(() => {
    setStats(getFileStats(text, cursorPosition))
  }, [text, cursorPosition])

  return (
    <div className="status-bar">
      <div className="status-left-group">
        <div className="status-item">
          <span className="status-label">Words:</span>
          <span className="status-value">{stats.wordCount}</span>
        </div>

        <div className="status-item">
          <span className="status-label">Chars:</span>
          <span className="status-value">{stats.charCount}</span>
        </div>

        <div className="status-item">
          <span className="status-label">Reading Time:</span>
          <span className="status-value">{stats.readingTime}</span>
        </div>

        <div className="status-item">
          <span className="status-label">Position:</span>
          <span className="status-value">
            {stats.line}:{stats.column}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">Size:</span>
          <span className="status-value">{stats.fileSize}</span>
        </div>
      </div>

      <div className="status-right-group">
        {!realTimePreview && (
          <button className="status-button secondary" onClick={onManualPreviewUpdate} title="Update preview manually" aria-label="Update preview manually">
            <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4v6h6"></path>
              <path d="M20 20v-6h-6"></path>
              <path d="M5 19a9 9 0 1 1 0-14"></path>
            </svg>
          </button>
        )}

        {previewMode === 'separate' && (
          <button
            className="status-button secondary"
            onClick={onSwitchPreviewPanel}
            title={isPreviewActive ? 'Switch to Editor' : 'Switch to Preview'}
            aria-label={isPreviewActive ? 'Switch to Editor' : 'Switch to Preview'}
          >
            {isPreviewActive ? (
              <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16"></path>
                <path d="M4 12h16"></path>
                <path d="M4 17h16"></path>
              </svg>
            ) : (
              <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        )}

        <button
          className={`status-button ${spellCheck ? 'active' : ''}`}
          onClick={onSpellCheckToggle}
          title={spellCheck ? 'Disable spell checking' : 'Enable spell checking'}
          aria-label={spellCheck ? 'Disable spell checking' : 'Enable spell checking'}
        >
          <svg
            className="status-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h16"></path>
            <path d="M4 12h10"></path>
            <path d="M4 17h16"></path>
            <path d="M18 17l2 3 3-6"></path>
          </svg>
        </button>

        <div className="status-item status-filename">
          <span className="status-value">{filename}</span>
        </div>
      </div>
    </div>
  )
}
