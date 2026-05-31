import React, { useEffect, useRef, useState } from 'react'
import { Toolbar, Editor, Preview, InfoModal, StatusBar } from './components'
import { useSettings, useResponsiveLayout, useResizer, useTextEditor } from './hooks'
import './styles/index.css'

function App(): React.JSX.Element {
  const [value, setValue] = useState<string>('# Welcome to MD-Notepad\n\nStart typing *your* **markdown** ***here***...\n\n`console.log("Hello World")`')
  const [filename, setFilename] = useState<string>('note.md')
  const [editorSize, setEditorSize] = useState<number>(60)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'settings' | 'tips' | 'info' | 'whatsnew'>('info')
  const [previewValue, setPreviewValue] = useState<string>(value)
  const [shownPane, setShownPane] = useState<'editor' | 'preview'>('editor')
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { isColumnLayout } = useResponsiveLayout()
  const { theme, highPerformance, showBackdrop, showShadow, realTimePreview, previewMode, spellCheck, showLineNumbers, setTheme, setHighPerformance, setShowBackdrop, setShowShadow, setRealTimePreview, setPreviewMode, setSpellCheck, setShowLineNumbers, resetToDefaults } = useSettings()
  const { handleSeparatorMouseDown, handleSeparatorTouchStart } = useResizer(editorSize, setEditorSize, containerRef)
  const { applyWrap, applyLinePrefix, exportMarkdown } = useTextEditor(value, setValue, textareaRef)

  // Handle keyboard shortcuts for markdown actions and app commands
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return

      const key = e.key.toLowerCase()
      const isEditorFocused = document.activeElement === textareaRef.current

      // Keep native undo/redo behavior in the textarea
      if (key === 'z' || key === 'y') {
        return
      }

      if (key === 's' && !e.altKey) {
        e.preventDefault()
        exportMarkdown(filename)
        return
      }

      if (isEditorFocused) {
        if (key === 'b' && !e.altKey) {
          e.preventDefault()
          applyWrap('**')
          return
        }

        if (key === 'i' && !e.altKey) {
          e.preventDefault()
          applyWrap('*')
          return
        }

        if (key === 'k' && !e.altKey) {
          e.preventDefault()
          applyWrap('`')
          return
        }

        if (e.altKey && key === '1') {
          e.preventDefault()
          applyLinePrefix('# ')
          return
        }

        if (e.altKey && key === '2') {
          e.preventDefault()
          applyLinePrefix('## ')
          return
        }

        if (e.altKey && key === 'l') {
          e.preventDefault()
          applyLinePrefix('- ')
          return
        }
      }

      if (e.altKey) {
        if (key === 's') {
          e.preventDefault()
          setSpellCheck(!spellCheck)
          return
        }

        if (key === 'n') {
          e.preventDefault()
          setShowLineNumbers(!showLineNumbers)
          return
        }

        if (key === 'p' && previewMode === 'separate') {
          e.preventDefault()
          setShownPane((prev) => (prev === 'editor' ? 'preview' : 'editor'))
          return
        }

        if (key === 'r') {
          e.preventDefault()
          setRealTimePreview(!realTimePreview)
          return
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [applyWrap, applyLinePrefix, exportMarkdown, filename, spellCheck, setSpellCheck, showLineNumbers, setShowLineNumbers, previewMode, setShownPane, realTimePreview, setRealTimePreview])

  return (
    <div className="editor-app">
      <Toolbar
        filename={filename}
        onFilenameChange={setFilename}
        onExport={exportMarkdown}
        onBold={() => applyWrap('**')}
        onItalic={() => applyWrap('*')}
        onCode={() => applyWrap('`')}
        onH1={() => applyLinePrefix('# ')}
        onH2={() => applyLinePrefix('## ')}
        onList={() => applyLinePrefix('- ')}
        onInfoClick={() => setShowInfo(true)}
      />

      {previewMode === 'split' ? (
        <Editor
          value={value}
          onChange={setValue}
          editorSize={editorSize}
          isColumnLayout={isColumnLayout}
          textareaRef={textareaRef}
          onSeparatorMouseDown={handleSeparatorMouseDown}
          onSeparatorTouchStart={handleSeparatorTouchStart}
          containerRef={containerRef}
          showSeparator={true}
          spellCheck={spellCheck}
          showLineNumbers={showLineNumbers}
          onCursorPositionChange={setCursorPosition}
        >
          <Preview value={realTimePreview ? value : previewValue} editorSize={editorSize} isColumnLayout={isColumnLayout} />
        </Editor>
      ) : shownPane === 'editor' ? (
        <Editor
          value={value}
          onChange={setValue}
          editorSize={editorSize}
          isColumnLayout={isColumnLayout}
          textareaRef={textareaRef}
          onSeparatorMouseDown={handleSeparatorMouseDown}
          onSeparatorTouchStart={handleSeparatorTouchStart}
          containerRef={containerRef}
          showSeparator={false}
          spellCheck={spellCheck}
          showLineNumbers={showLineNumbers}
          onCursorPositionChange={setCursorPosition}
        />
      ) : (

        <div className="preview central">
          <Preview value={realTimePreview ? value : previewValue} editorSize={editorSize} isColumnLayout={isColumnLayout} />
        </div>
      )}

      <InfoModal
        isOpen={showInfo}
        onClose={() => {
          setShowInfo(false)
          setActiveTab('info')
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onThemeChange={setTheme}
        highPerformance={highPerformance}
        onHighPerformanceChange={setHighPerformance}
        showBackdrop={showBackdrop}
        onShowBackdropChange={setShowBackdrop}
        showShadow={showShadow}
        onShowShadowChange={setShowShadow}
        realTimePreview={realTimePreview}
        onRealTimePreviewChange={setRealTimePreview}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        spellCheck={spellCheck}
        onSpellCheckChange={setSpellCheck}
        showLineNumbers={showLineNumbers}
        onShowLineNumbersChange={setShowLineNumbers}
        onResetToDefaults={resetToDefaults}
      />

      <StatusBar
        text={value}
        filename={filename}
        spellCheck={spellCheck}
        cursorPosition={cursorPosition}
        onSpellCheckToggle={() => setSpellCheck(!spellCheck)}
        realTimePreview={realTimePreview}
        onManualPreviewUpdate={() => setPreviewValue(value)}
        previewMode={previewMode}
        isPreviewActive={shownPane === 'preview'}
        onSwitchPreviewPanel={() => setShownPane((prev) => (prev === 'editor' ? 'preview' : 'editor'))}
      />
    </div>
  )
}

export default App
