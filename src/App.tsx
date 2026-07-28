import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Toolbar, Editor, Preview, InfoModal, StatusBar } from './components'
import { useSettings, useResponsiveLayout, useResizer, useTextEditor } from './hooks'
import {
  getVisibleToolbarButtons,
  limitToolbarButtons,
  PHONE_MAX_VISIBLE_BUTTONS,
  TABLET_MAX_VISIBLE_BUTTONS,
} from './utils/toolbarButtons'
import './styles/index.css'

// Load editor content from localStorage or return default
function getInitialEditorContent(): string {
  try {
    const saved = localStorage.getItem('md-notepad-content')
    return saved || '# Welcome to MD-Notepad\n\nStart typing *your* **markdown** ***here***...\n\n`console.log("Hello World")`'
  } catch {
    return '# Welcome to MD-Notepad\n\nStart typing *your* **markdown** ***here***...\n\n`console.log("Hello World")`'
  }
}

function App(): React.JSX.Element {
  const [value, setValue] = useState<string>(getInitialEditorContent())
  const [filename, setFilename] = useState<string>('note.md')
  const [editorSize, setEditorSize] = useState<number>(60)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'settings' | 'tips' | 'info' | 'whatsnew'>('info')
  const [previewValue, setPreviewValue] = useState<string>(value)
  const [shownPane, setShownPane] = useState<'editor' | 'preview'>('editor')
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const [wrapToggleFeedback, setWrapToggleFeedback] = useState<'bold' | 'italic' | 'code' | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { isColumnLayout, isPhoneLayout, isTabletLayout } = useResponsiveLayout()
  const { theme, highPerformance, showBackdrop, showShadow, realTimePreview, previewMode, spellCheck, showLineNumbers, accentColor, customAccentColor, toolbarButtonOrder, visibleToolbarButtons, setTheme, setHighPerformance, setShowBackdrop, setShowShadow, setRealTimePreview, setPreviewMode, setSpellCheck, setShowLineNumbers, setAccentColor, setCustomAccentColor, setToolbarButtonOrder, setVisibleToolbarButtons, resetToDefaults, exportSettingsToFile, importSettingsFromFile } = useSettings()
  const { handleSeparatorMouseDown, handleSeparatorTouchStart } = useResizer(editorSize, setEditorSize, containerRef)
  const { applyWrap, toggleWrap, applyLinePrefix, applyLink, applyImage, applyCodeBlock, applyTable, exportMarkdown } = useTextEditor(value, setValue, textareaRef)
  const maxStyleButtons = useMemo(() => {
    if (isPhoneLayout) return PHONE_MAX_VISIBLE_BUTTONS
    if (isTabletLayout) return TABLET_MAX_VISIBLE_BUTTONS
    return Infinity
  }, [isPhoneLayout, isTabletLayout])

  const totalEnabledStyleButtons = useMemo(
    () => getVisibleToolbarButtons(toolbarButtonOrder, visibleToolbarButtons).length,
    [toolbarButtonOrder, visibleToolbarButtons]
  )

  const finalVisibleToolbarButtons = useMemo(
    () =>
      limitToolbarButtons(
        getVisibleToolbarButtons(toolbarButtonOrder, visibleToolbarButtons),
        maxStyleButtons
      ),
    [toolbarButtonOrder, visibleToolbarButtons, maxStyleButtons]
  )
  const toolbarActions = useMemo(
    () => ({
      onBold: () => {
        const didRemove = toggleWrap('**')
        if (didRemove) setWrapToggleFeedback('bold')
      },
      onItalic: () => {
        const didRemove = toggleWrap('*')
        if (didRemove) setWrapToggleFeedback('italic')
      },
      onCode: () => {
        const didRemove = toggleWrap('`')
        if (didRemove) setWrapToggleFeedback('code')
      },
      onH1: () => applyLinePrefix('# '),
      onH2: () => applyLinePrefix('## '),
      onList: () => applyLinePrefix('- '),
      onLink: applyLink,
      onImage: applyImage,
      onBlockquote: () => applyLinePrefix('> '),
      onCodeBlock: applyCodeBlock,
      onTable: applyTable,
    }),
    [toggleWrap, applyLinePrefix, applyLink, applyImage, applyCodeBlock, applyTable]
  )

  // Save editor content to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('md-notepad-content', value)
    } catch {
      // Silently fail if localStorage is unavailable (quota exceeded, etc.)
    }
  }, [value])

  useEffect(() => {
    if (!wrapToggleFeedback) return
    const timeout = window.setTimeout(() => setWrapToggleFeedback(null), 280)
    return () => window.clearTimeout(timeout)
  }, [wrapToggleFeedback])

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

        if (e.altKey && key === 'u') {
          e.preventDefault()
          applyLink()
          return
        }

        if (e.altKey && key === 'g') {
          e.preventDefault()
          applyImage()
          return
        }

        if (e.altKey && key === 'q') {
          e.preventDefault()
          applyLinePrefix('> ')
          return
        }

        if (e.altKey && key === 'c') {
          e.preventDefault()
          applyCodeBlock()
          return
        }

        if (e.altKey && key === 't') {
          e.preventDefault()
          applyTable()
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
  }, [applyWrap, applyLinePrefix, applyLink, applyImage, applyCodeBlock, applyTable, exportMarkdown, filename, spellCheck, setSpellCheck, showLineNumbers, setShowLineNumbers, previewMode, setShownPane, realTimePreview, setRealTimePreview])

  return (
    <div className="editor-app">
      <Toolbar
        filename={filename}
        onFilenameChange={setFilename}
        onExport={exportMarkdown}
        visibleButtons={finalVisibleToolbarButtons}
        totalStyleButtonsCount={totalEnabledStyleButtons}
        actions={toolbarActions}
        onInfoClick={() => setShowInfo(true)}
        wrapToggleFeedback={wrapToggleFeedback}
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
        accentColor={accentColor}
        customAccentColor={customAccentColor}
        onAccentColorChange={setAccentColor}
        onCustomAccentColorChange={setCustomAccentColor}
        toolbarButtonOrder={toolbarButtonOrder}
        visibleToolbarButtons={visibleToolbarButtons}
        onToolbarButtonOrderChange={setToolbarButtonOrder}
        onVisibleToolbarButtonsChange={setVisibleToolbarButtons}
        onResetToDefaults={resetToDefaults}
        onExportSettings={exportSettingsToFile}
        onImportSettings={importSettingsFromFile}
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
