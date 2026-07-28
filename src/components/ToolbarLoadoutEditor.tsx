import React, { useState } from 'react'
import {
  BlockquoteIcon,
  BoldIcon,
  CodeBlockIcon,
  CodeIcon,
  HeadingIcon,
  Heading2Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  TableIcon,
} from './Icons'
import {
  TOOLBAR_BUTTON_LABELS,
  type ToolbarStyleButtonId,
  reorderToolbarButtons,
  toggleToolbarButton,
} from '../utils/toolbarButtons'

const TOOLBAR_BUTTON_SHORTCUTS: Record<ToolbarStyleButtonId, string> = {
  bold: 'Ctrl/Cmd + B',
  italic: 'Ctrl/Cmd + I',
  inlineCode: 'Ctrl/Cmd + K',
  link: 'Ctrl/Cmd + Alt + U',
  image: 'Ctrl/Cmd + Alt + G',
  h1: 'Ctrl/Cmd + Alt + 1',
  h2: 'Ctrl/Cmd + Alt + 2',
  list: 'Ctrl/Cmd + Alt + L',
  blockquote: 'Ctrl/Cmd + Alt + Q',
  codeBlock: 'Ctrl/Cmd + Alt + C',
  table: 'Ctrl/Cmd + Alt + T',
}

interface ToolbarLoadoutEditorProps {
  buttonOrder: ToolbarStyleButtonId[]
  visibleButtons: ToolbarStyleButtonId[]
  onButtonOrderChange: (order: ToolbarStyleButtonId[]) => void
  onVisibleButtonsChange: (buttons: ToolbarStyleButtonId[]) => void
}

function ToolbarButtonIcon({ id }: { id: ToolbarStyleButtonId }): React.JSX.Element {
  switch (id) {
    case 'bold':
      return <BoldIcon />
    case 'italic':
      return <ItalicIcon />
    case 'inlineCode':
      return <CodeIcon />
    case 'link':
      return <LinkIcon />
    case 'image':
      return <ImageIcon />
    case 'h1':
      return <HeadingIcon />
    case 'h2':
      return <Heading2Icon />
    case 'list':
      return <ListIcon />
    case 'blockquote':
      return <BlockquoteIcon />
    case 'codeBlock':
      return <CodeBlockIcon />
    case 'table':
      return <TableIcon />
    default:
      return <BoldIcon />
  }
}

export function ToolbarLoadoutEditor({
  buttonOrder,
  visibleButtons,
  onButtonOrderChange,
  onVisibleButtonsChange,
}: ToolbarLoadoutEditorProps): React.JSX.Element {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const visibleSet = new Set(visibleButtons)

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null) return
    onButtonOrderChange(reorderToolbarButtons(buttonOrder, dragIndex, targetIndex))
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleToggle = (id: ToolbarStyleButtonId) => {
    onVisibleButtonsChange(toggleToolbarButton(visibleButtons, id))
  }

  return (
    <div className="toolbar-loadout-editor">
      <p className="toolbar-loadout-label">Style buttons shown in toolbar</p>

      <p className="toolbar-loadout-hint">
        Toggle buttons on/off to choose which appear in the toolbar.
        Drag to reorder them. Export and settings buttons are always shown. Amount of buttons shown in toolbar is limited by window width, so some buttons may be hidden if there are too many.
      </p>

      <ul className="toolbar-loadout-list" aria-label="Toolbar style button order">
        {buttonOrder.map((id, index) => {
          const isVisible = visibleSet.has(id)
          return (
            <li
              key={id}
              className={[
                'toolbar-loadout-item',
                isVisible ? 'toolbar-loadout-item--active' : '',
                dragOverIndex === index ? 'toolbar-loadout-item--drag-over' : '',
                dragIndex === index ? 'toolbar-loadout-item--dragging' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => {
                setDragIndex(null)
                setDragOverIndex(null)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverIndex(index)
              }}
              onDragLeave={() => {
                if (dragOverIndex === index) setDragOverIndex(null)
              }}
              onDrop={(e) => {
                e.preventDefault()
                handleDrop(index)
              }}
            >
              <span className="toolbar-loadout-drag-handle" aria-hidden="true">
                ⋮⋮
              </span>
              <span className="toolbar-loadout-item-icon" aria-hidden="true">
                <ToolbarButtonIcon id={id} />
              </span>
              <span className="toolbar-loadout-item-label">{TOOLBAR_BUTTON_LABELS[id]}</span>
                            <span className="toolbar-loadout-item-shortcut">{TOOLBAR_BUTTON_SHORTCUTS[id]}</span>
                            <button
                type="button"
                className={[
                  'toolbar-loadout-toggle',
                  isVisible ? 'toolbar-loadout-toggle--on' : 'toolbar-loadout-toggle--off',
                ].join(' ')}
                onClick={() => handleToggle(id)}
                aria-label={`${isVisible ? 'Hide' : 'Show'} ${TOOLBAR_BUTTON_LABELS[id]}`}
                aria-pressed={isVisible}
              >
                {isVisible ? 'On' : 'Off'}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
