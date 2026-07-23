import type React from 'react'

// Column layout stacks panes vertically (mobile); below this width it activates.
export const MOBILE_MEDIA_QUERY = '(max-width: 768px)'

export function matchesMobileLayout(): boolean {
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

// Sizing for a resizable editor/preview pane. In column layout the pane is sized
// by height, otherwise by width; a fixed flex-basis keeps the split stable.
export function getPaneStyle(sizePercent: number, isColumnLayout: boolean): React.CSSProperties {
  const dimension = isColumnLayout ? 'height' : 'width'
  return {
    [dimension]: `${sizePercent}%`,
    flex: `0 0 ${sizePercent}%`,
  }
}
