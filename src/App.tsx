import React, { useEffect, useRef, useState } from 'react'
import { Toolbar, Editor, Preview, InfoModal } from './components'
import { useSettings, useResponsiveLayout, useResizer, useTextEditor } from './hooks'
import './styles/index.css'

function App(): React.JSX.Element {
  const [value, setValue] = useState<string>('# Welcome to MD-Notepad\n\nStart typing *your* **markdown** ***here***...\n\n`console.log("Hello World")`')
  const [filename, setFilename] = useState<string>('note.md')
  const [editorSize, setEditorSize] = useState<number>(60)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'settings' | 'tips' | 'info' | 'whatsnew'>('info')

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { isColumnLayout } = useResponsiveLayout()
  const { theme, highPerformance, showBackdrop, showShadow, setTheme, setHighPerformance, setShowBackdrop, setShowShadow } = useSettings()
  const { handleSeparatorMouseDown, handleSeparatorTouchStart } = useResizer(editorSize, setEditorSize, containerRef)
  const { applyWrap, applyLinePrefix, exportMarkdown } = useTextEditor(value, setValue, textareaRef)

  // Handle keyboard shortcut for export
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        exportMarkdown(filename)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [exportMarkdown, filename])

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

      <Editor
        value={value}
        onChange={setValue}
        editorSize={editorSize}
        isColumnLayout={isColumnLayout}
        textareaRef={textareaRef}
        onSeparatorMouseDown={handleSeparatorMouseDown}
        onSeparatorTouchStart={handleSeparatorTouchStart}
        containerRef={containerRef}
      >
        <Preview value={value} editorSize={editorSize} isColumnLayout={isColumnLayout} />
      </Editor>

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
      />
    </div>
  )
}

export default App
