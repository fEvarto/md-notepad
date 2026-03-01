import React, { useEffect, useRef } from 'react'
import { CollapsibleSection } from './CollapsibleSection'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  activeTab: 'settings' | 'tips' | 'info' | 'whatsnew'
  onTabChange: (tab: 'settings' | 'tips' | 'info' | 'whatsnew') => void
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
  highPerformance: boolean
  onHighPerformanceChange: (value: boolean) => void
  showBackdrop: boolean
  onShowBackdropChange: (value: boolean) => void
  showShadow: boolean
  onShowShadowChange: (value: boolean) => void
}

export function InfoModal({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  theme,
  onThemeChange,
  highPerformance,
  onHighPerformanceChange,
  showBackdrop,
  onShowBackdropChange,
  showShadow,
  onShowShadowChange,
}: InfoModalProps): React.JSX.Element | null {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const prevFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    prevFocusedRef.current = document.activeElement as HTMLElement | null
    const modal = modalRef.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    setTimeout(() => modal?.focus(), 0)
    return () => {
      window.removeEventListener('keydown', onKey)
      prevFocusedRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-title"
        ref={modalRef}
        tabIndex={-1}
      >
        <h2 id="info-title">MD-Notepad</h2>

        <div className="modal-tabs">
          <button
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => onTabChange('settings')}
            aria-selected={activeTab === 'settings'}
            role="tab"
          >
            Settings
          </button>
          <button
            className={`tab-button ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={() => onTabChange('tips')}
            aria-selected={activeTab === 'tips'}
            role="tab"
          >
            Tips
          </button>
          <button
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => onTabChange('info')}
            aria-selected={activeTab === 'info'}
            role="tab"
          >
            Info
          </button>
          <button
            className={`tab-button ${activeTab === 'whatsnew' ? 'active' : ''}`}
            onClick={() => onTabChange('whatsnew')}
            aria-selected={activeTab === 'whatsnew'}
            role="tab"
          >
            What's New
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'whatsnew' && (
            <div className="tab-pane">
              <CollapsibleSection title="March 2026 - The Accessibility Update (Current)" defaultOpen={true}>
                <ul className="tips-list">
                  <li>
                    <span className="badge badge-major">Major</span>
                    <strong>The Great Modal Split:</strong> Modal window has been split into four distinct tabs for better organization and easier navigation
                  </li>
                  <li>
                    <span className="badge badge-major">Major</span>
                    <strong>Settings:</strong> Added settings that improves accessibility and performance, including a new light theme, high performance mode, and visual customization options
                  </li>
                  <li>
                    <span className="badge badge-new">New</span>
                    <strong>Patch notes:</strong> Added patch for better informing users about new features and improvements in each release. Info lies in the "What's New" tab of the info modal
                  </li>
                  <li>
                    <span className="badge badge-new">New</span>
                    <strong>Visual Customization:</strong> Toggle backdrop blur and shadow effects
                  </li>
                  <li>
                    <span className="badge badge-improved">Improved</span>
                    <strong>Code Organization:</strong> Software architecture split into focused module files for better maintenance
                  </li>
                  <li>
                    <span className="badge badge-improved">Improved</span>
                    <strong>Style changes:</strong> Some Markdown styles have been tweaked for better readability and aesthetics, including headings, code blocks, blockquotes, and tables
                  </li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="February 2026 - Initial Release">
                <ul className="tips-list">
                  <li>
                    <span className="badge badge-new">New</span>
                    <strong>Live Preview:</strong> Real-time Markdown rendering
                  </li>
                  <li>
                    <span className="badge badge-new">New</span>
                    <strong>Resizable Panes:</strong> Drag separator to adjust editor/preview sizes
                  </li>
                  <li>
                    <span className="badge badge-new">New</span>
                    <strong>Touch Support:</strong> Mobile-friendly pane resizing
                  </li>
                  <li>
                    <span className="badge badge-new">New</span>
                    <strong>Export Functionality:</strong> Download notes as .md files
                  </li>
                  <li>
                    <span className="badge badge-new">New</span>
                    <strong>Responsive Design:</strong> Works on desktop and mobile devices
                  </li>
                </ul>
              </CollapsibleSection>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="tab-pane">
              <h3>Appearance</h3>
              <div className="settings-group">
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={theme === 'light'}
                    onChange={(e) => onThemeChange(e.target.checked ? 'light' : 'dark')}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Light Theme</span>
                </label>
              </div>

              <h3>Performance</h3>
              <div className="settings-group">
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={highPerformance}
                    onChange={(e) => onHighPerformanceChange(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">High Performance Mode</span>
                </label>
                <small>Reduces animations and visual effects for better performance on slower devices</small>
              </div>

              <h3>Visual Styles</h3>
              <div className="settings-group">
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={showBackdrop}
                    onChange={(e) => onShowBackdropChange(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Show Backdrop Blur</span>
                </label>
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={showShadow}
                    onChange={(e) => onShowShadowChange(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">Show Shadow Effects</span>
                </label>
              </div>

              <h3>Keyboard Shortcuts</h3>
              <ul className="shortcuts-list">
                <li>
                  <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>S</kbd> — Export as .md file
                </li>
                <li>
                  <kbd>Esc</kbd> — Close this dialog
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="tab-pane">
              <h3>Formatting Tips</h3>
              <ul className="tips-list">
                <li>
                  <strong>Bold:</strong> Use <kbd>**text**</kbd>
                </li>
                <li>
                  <strong>Italic:</strong> Use <kbd>*text*</kbd>
                </li>
                <li>
                  <strong>Headings:</strong> Use <kbd>#</kbd>, <kbd>##</kbd>, <kbd>###</kbd> etc.
                </li>
                <li>
                  <strong>Code:</strong> Wrap with backticks <kbd>`code`</kbd> or use code block button
                </li>
                <li>
                  <strong>Lists:</strong> Start lines with <kbd>-</kbd> for bullet points
                </li>
              </ul>
              <h3>Toolbar Buttons</h3>
              <p>The toolbar provides quick access to common formatting options:</p>
              <ul className="tips-list">
                <li>
                  <strong>B:</strong> Make selected text bold
                </li>
                <li>
                  <strong>I:</strong> Make selected text italic
                </li>
                <li>
                  <strong>Code:</strong> Wrap text in backticks
                </li>
                <li>
                  <strong>H1-H2:</strong> Add heading styles
                </li>
                <li>
                  <strong>List:</strong> Create bullet points
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="tab-pane">
              <p>MD-Notepad is a minimal, fast Markdown editor with live preview, touch-friendly resizing, and responsive design.</p>
              <h3>Features</h3>
              <ul className="tips-list">
                <li>
                  <strong>Live Preview:</strong> See your Markdown rendered in real-time
                </li>
                <li>
                  <strong>Touch-Friendly:</strong> Resize panes with your finger on mobile devices
                </li>
                <li>
                  <strong>Responsive Design:</strong> Works perfectly on desktop and mobile
                </li>
                <li>
                  <strong>Export:</strong> Download your notes as .md files
                </li>
                <li>
                  <strong>Minimal UI:</strong> Focus on your content
                </li>
              </ul>
              <h3>Resources</h3>
              <ul className="resources-list">
                <li>
                  <a href="https://commonmark.org/help/" target="_blank" rel="noopener noreferrer">
                    Markdown Guide →
                  </a>
                </li>
                <li>
                  <a href="https://github.com/fEvarto/md-notepad" target="_blank" rel="noopener noreferrer">
                    GitHub Repository →
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            onClick={() => {
              onClose()
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
