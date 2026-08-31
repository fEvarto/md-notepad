export const TOOLBAR_STYLE_BUTTON_IDS = [
  'bold',
  'italic',
  'inlineCode',
  'spoiler',
  'link',
  'image',
  'h1',
  'h2',
  'list',
  'blockquote',
  'codeBlock',
  'table',
] as const

export type ToolbarStyleButtonId = (typeof TOOLBAR_STYLE_BUTTON_IDS)[number]

export const DEFAULT_TOOLBAR_BUTTON_ORDER: ToolbarStyleButtonId[] = [...TOOLBAR_STYLE_BUTTON_IDS]

export const DEFAULT_VISIBLE_TOOLBAR_BUTTONS: ToolbarStyleButtonId[] = [...TOOLBAR_STYLE_BUTTON_IDS]

export const TOOLBAR_BUTTON_LABELS: Record<ToolbarStyleButtonId, string> = {
  bold: 'Bold',
  italic: 'Italic',
  inlineCode: 'Inline code',
  spoiler: 'Spoiler',
  link: 'Link',
  image: 'Image',
  h1: 'Heading 1',
  h2: 'Heading 2',
  list: 'List',
  blockquote: 'Blockquote',
  codeBlock: 'Code block',
  table: 'Table',
}

export function isToolbarStyleButtonId(value: string): value is ToolbarStyleButtonId {
  return (TOOLBAR_STYLE_BUTTON_IDS as readonly string[]).includes(value)
}

export function parseToolbarButtonOrder(value: unknown): ToolbarStyleButtonId[] {
  const order: ToolbarStyleButtonId[] = []
  const seen = new Set<ToolbarStyleButtonId>()

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === 'string' && isToolbarStyleButtonId(item) && !seen.has(item)) {
        order.push(item)
        seen.add(item)
      }
    }
  }

  for (const id of TOOLBAR_STYLE_BUTTON_IDS) {
    if (!seen.has(id)) {
      order.push(id)
    }
  }

  return order
}

export function parseToolbarVisibleButtons(value: unknown): ToolbarStyleButtonId[] {
  const visible: ToolbarStyleButtonId[] = []
  const seen = new Set<ToolbarStyleButtonId>()

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === 'string' && isToolbarStyleButtonId(item) && !seen.has(item)) {
        visible.push(item)
        seen.add(item)
      }
    }
  }

  // If nothing valid was parsed, return all buttons by default
  if (visible.length === 0) {
    return [...DEFAULT_VISIBLE_TOOLBAR_BUTTONS]
  }

  return visible
}

export function getVisibleToolbarButtons(
  order: ToolbarStyleButtonId[],
  visibleButtons: ToolbarStyleButtonId[]
): ToolbarStyleButtonId[] {
  const visibleSet = new Set(visibleButtons)
  return order.filter((id) => visibleSet.has(id))
}

// ── Responsive limits on visible style buttons ──
// On phones (≤480px), show at most 6 buttons.
// On tablets (481–768px), show at most 8 buttons.
// On desktop (>768px), show all the user has enabled.
export const PHONE_MAX_VISIBLE_BUTTONS = 5
export const TABLET_MAX_VISIBLE_BUTTONS = 8

/**
 * Limits the array of visible toolbar buttons to a given maximum count,
 * respecting the user's priority order (first items are most important).
 */
export function limitToolbarButtons(
  visibleButtons: ToolbarStyleButtonId[],
  maxCount: number
): ToolbarStyleButtonId[] {
  return visibleButtons.slice(0, maxCount)
}

export function reorderToolbarButtons(
  order: ToolbarStyleButtonId[],
  fromIndex: number,
  toIndex: number
): ToolbarStyleButtonId[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= order.length ||
    toIndex >= order.length ||
    fromIndex === toIndex
  ) {
    return order
  }
  const next = [...order]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function toggleToolbarButton(
  visibleButtons: ToolbarStyleButtonId[],
  id: ToolbarStyleButtonId
): ToolbarStyleButtonId[] {
  const set = new Set(visibleButtons)
  if (set.has(id)) {
    set.delete(id)
  } else {
    set.add(id)
  }
  // Preserve order from the full button IDs list
  return TOOLBAR_STYLE_BUTTON_IDS.filter((btnId) => set.has(btnId))
}

export function areAllButtonsVisible(visibleButtons: ToolbarStyleButtonId[]): boolean {
  return visibleButtons.length === TOOLBAR_STYLE_BUTTON_IDS.length
}
