import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Toolbar, Editor, Preview, StatusBar } from './components'

const InfoModal = lazy(() =>
  import('./components/InfoModal').then(({ InfoModal: Modal }) => ({ default: Modal }))
)
import { useSettings, useResponsiveLayout, useResizer, useTextEditor } from './hooks'
import {
  getVisibleToolbarButtons,
  limitToolbarButtons,
  PHONE_MAX_VISIBLE_BUTTONS,
  TABLET_MAX_VISIBLE_BUTTONS,
} from './utils/toolbarButtons'
import type { ToolbarStyleButtonId } from './utils/toolbarButtons'
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

function getActiveStyles(value: string, start: number, end: number): ToolbarStyleButtonId[] {
  const hasWrap = (before: string, after = before) =>
    start >= before.length && end + after.length <= value.length && (
      value.slice(start - before.length, start) === before &&
      value.slice(end, end + after.length) === after
    )

  const hasWrapAtCaret = (before: string, after = before) => {
    if (start !== end) return false

    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', start)
    const contentEnd = lineEnd === -1 ? value.length : lineEnd
    const line = value.slice(lineStart, contentEnd)
    const relativePosition = start - lineStart
    const opening = line.lastIndexOf(before, relativePosition - before.length)
    if (opening < 0) return false

    const closing = line.indexOf(after, relativePosition)
    return closing >= relativePosition && opening + before.length <= relativePosition
  }

  const hasStyle = (before: string, after = before) =>
    hasWrap(before, after) || hasWrapAtCaret(before, after)

    const markerRunLength = (position: number, direction: -1 | 1, marker: string) => {
    let length = 0
    while (
      direction === -1
        ? value.slice(position - length - 1, position - length) === marker
        : value.slice(position + length, position + length + 1) === marker
    ) {
      length += 1
    }
    return length
  }

  const isItalicAtCaret = () => {
    if (start !== end) return false
    const relativePosition = start - lineStart
    const italicPattern = /(\*+)([^*\n]+?)(\*+)/g
    let match: RegExpExecArray | null
    while ((match = italicPattern.exec(line)) !== null) {
      const openingLength = match[1].length
      const closingLength = match[3].length
      const openingEnd = match.index + openingLength
      const closingStart = openingEnd + match[2].length
      if (relativePosition >= openingEnd && relativePosition <= closingStart && openingLength === closingLength && (openingLength === 1 || openingLength >= 3)) {
        return true
      }
    }
    return false
  }

  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const lineEnd = value.indexOf('\n', start)
  const line = value.slice(lineStart, lineEnd === -1 ? value.length : lineEnd)
  const linePrefix = line.match(/^(#{1,6})\s/)?.[1]
  const lineStyle = linePrefix ? (`h${linePrefix.length}` as ToolbarStyleButtonId) : null

  const styles: ToolbarStyleButtonId[] = []
  if (hasStyle('**')) styles.push('bold')
  // Double stars are bold, while triple stars represent both styles.
  const leftStars = markerRunLength(start, -1, '*')
  const rightStars = markerRunLength(end, 1, '*')
  if ((start !== end && hasStyle('*') && leftStars === rightStars && (leftStars === 1 || leftStars >= 3)) || isItalicAtCaret()) {
    styles.push('italic')
  }
  if (hasStyle('`')) styles.push('inlineCode')
  if (hasStyle('||')) styles.push('spoiler')
  const linkPattern = /!?(?:\[[^\]\n]*\]\([^)]*\))/g
  let linkMatch: RegExpExecArray | null
  while ((linkMatch = linkPattern.exec(line)) !== null) {
    const matchStart = lineStart + linkMatch.index
    const matchEnd = matchStart + linkMatch[0].length
    if (start >= matchStart && start <= matchEnd && !linkMatch[0].startsWith('!')) styles.push('link')
    if (start >= matchStart && start <= matchEnd && linkMatch[0].startsWith('!')) styles.push('image')
  }
  if (lineStyle) styles.push(lineStyle)
  if (/^\s*(?:[-+*]|\d+[.)])\s/.test(line)) styles.push('list')
  if (/^\s*>\s/.test(line)) styles.push('blockquote')
  const beforeCaret = value.slice(0, start)
  const fenceCount = (beforeCaret.match(/^```/gm) ?? []).length
  if (line.trimStart().startsWith('```') || fenceCount % 2 === 1) styles.push('codeBlock')
  if (/^\s*\|.*\|\s*$/.test(line)) styles.push('table')
  return styles
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
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [wrapToggleFeedback, setWrapToggleFeedback] = useState<'bold' | 'italic' | 'code' | 'spoiler' | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { isColumnLayout, isPhoneLayout, isTabletLayout } = useResponsiveLayout()
  const { theme, highPerformance, showBackdrop, showShadow, realTimePreview, previewMode, splitDirection, showPreviewExportButton, previewExportButtonPosition, spellCheck, showLineNumbers, showStatusBar, swapToolbarAndStatusBar, swapToolbarLayout, accentColor, customAccentColor, toolbarButtonOrder, visibleToolbarButtons, setTheme, setHighPerformance, setShowBackdrop, setShowShadow, setRealTimePreview, setPreviewMode, setSplitDirection, setShowPreviewExportButton, setPreviewExportButtonPosition, setSpellCheck, setShowLineNumbers, setShowStatusBar, setSwapToolbarAndStatusBar, setSwapToolbarLayout, setAccentColor, setCustomAccentColor, setToolbarButtonOrder, setVisibleToolbarButtons, resetToDefaults, exportSettingsToFile, importSettingsFromFile } = useSettings()
  const { handleSeparatorMouseDown, handleSeparatorTouchStart } = useResizer(editorSize, setEditorSize, containerRef, splitDirection)
  const { applyWrap, toggleWrap, applySpoiler, toggleSpoiler, applyLinePrefix, applyLink, applyImage, applyCodeBlock, applyTable, exportMarkdown } = useTextEditor(value, setValue, textareaRef)
  const maxStyleButtons = useMemo(() => {
    if (isPhoneLayout) return PHONE_MAX_VISIBLE_BUTTONS
    if (isTabletLayout) return TABLET_MAX_VISIBLE_BUTTONS
    return Infinity
  }, [isPhoneLayout, isTabletLayout])

  const totalEnabledStyleButtons = useMemo(
    () => getVisibleToolbarButtons(toolbarButtonOrder, visibleToolbarButtons).length,
    [toolbarButtonOrder, visibleToolbarButtons]
  )

  const activeStyles = useMemo(
    () => getActiveStyles(value, selection.start, selection.end),
    [value, selection]
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
      onSpoiler: () => {
        const didRemove = toggleSpoiler()
        if (didRemove) setWrapToggleFeedback('spoiler')
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
    [toggleWrap, toggleSpoiler, applyLinePrefix, applyLink, applyImage, applyCodeBlock, applyTable]
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

        if (e.altKey && key === 's') {
          e.preventDefault()
          applySpoiler()
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
  }, [applyWrap, applySpoiler, applyLinePrefix, applyLink, applyImage, applyCodeBlock, applyTable, exportMarkdown, filename, spellCheck, setSpellCheck, showLineNumbers, setShowLineNumbers, previewMode, setShownPane, realTimePreview, setRealTimePreview])

  return (
    <div className="editor-app" data-swap-toolbar-status-bar={swapToolbarAndStatusBar ? 'enabled' : 'disabled'}>
      <Toolbar
        filename={filename}
        onFilenameChange={setFilename}
        onExport={exportMarkdown}
        showExportButton={!showPreviewExportButton}
        visibleButtons={finalVisibleToolbarButtons}
        totalStyleButtonsCount={totalEnabledStyleButtons}
        actions={toolbarActions}
        onInfoClick={() => setShowInfo(true)}
        wrapToggleFeedback={wrapToggleFeedback}
        activeStyles={activeStyles}
        swapLayout={swapToolbarLayout}
      />

            {previewMode === 'in-preview' ? (
        <div className="preview in-preview-editor">
          <Preview
            value={value}
            editorSize={100}
            isColumnLayout={isColumnLayout}
            isStandalone
            editable
            spellCheck={false}
            onChange={setValue}
            textareaRef={textareaRef}
            onCursorPositionChange={setCursorPosition}
            onSelectionChange={(start, end) => setSelection({ start, end })}
            activeStyles={activeStyles}
            activeStart={selection.start}
            activeEnd={selection.end}
            showExportButton={showPreviewExportButton}
            exportButtonPosition={previewExportButtonPosition}
            onExport={() => exportMarkdown(filename)}
          />
        </div>
      ) : previewMode === 'split' ? (
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
          onSelectionChange={(start, end) => setSelection({ start, end })}
        >
          <Preview value={realTimePreview ? value : previewValue} editorSize={editorSize} isColumnLayout={isColumnLayout} showExportButton={showPreviewExportButton} exportButtonPosition={previewExportButtonPosition} onExport={() => exportMarkdown(filename)} />
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
          onSelectionChange={(start, end) => setSelection({ start, end })}
        />
      ) : (

        <div className="preview central">
          <Preview value={realTimePreview ? value : previewValue} editorSize={editorSize} isColumnLayout={isColumnLayout} isStandalone showExportButton={showPreviewExportButton} exportButtonPosition={previewExportButtonPosition} onExport={() => exportMarkdown(filename)} />
                  </div>
      )}

            <Suspense fallback={null}>
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
        splitDirection={splitDirection}
        onSplitDirectionChange={setSplitDirection}
        showPreviewExportButton={showPreviewExportButton}
        onShowPreviewExportButtonChange={setShowPreviewExportButton}
        previewExportButtonPosition={previewExportButtonPosition}
        onPreviewExportButtonPositionChange={setPreviewExportButtonPosition}
        spellCheck={spellCheck}
        onSpellCheckChange={setSpellCheck}
                showLineNumbers={showLineNumbers}
        onShowLineNumbersChange={setShowLineNumbers}
                showStatusBar={showStatusBar}
        onShowStatusBarChange={setShowStatusBar}
                swapToolbarAndStatusBar={swapToolbarAndStatusBar}
        onSwapToolbarAndStatusBarChange={setSwapToolbarAndStatusBar}
        swapToolbarLayout={swapToolbarLayout}
        onSwapToolbarLayoutChange={setSwapToolbarLayout}
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
      </Suspense>

            {showStatusBar && <StatusBar
        text={value}
        filename={filename}
        spellCheck={spellCheck}
        cursorPosition={cursorPosition}
        onSpellCheckToggle={() => setSpellCheck(!spellCheck)}
        realTimePreview={realTimePreview}
        onManualPreviewUpdate={() => setPreviewValue(value)}
        previewMode={previewMode}
        isPreviewActive={previewMode === 'separate' && shownPane === 'preview'}
                onSwitchPreviewPanel={() => setShownPane((prev) => (prev === 'editor' ? 'preview' : 'editor'))}
      />}
    </div>
  )
}

export default App
