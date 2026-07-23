import { useCallback } from 'react'
import { matchesMobileLayout } from '../utils'

const MIN_SIZE = 20
const MAX_SIZE = 80

function clampSize(size: number): number {
  return Math.max(MIN_SIZE, Math.min(MAX_SIZE, size))
}

export function useResizer(
  editorSize: number,
  setEditorSize: (size: number) => void,
  containerRef: React.RefObject<HTMLDivElement | null>
): {
  handleSeparatorMouseDown: (e: React.MouseEvent) => void
  handleSeparatorTouchStart: (e: React.TouchEvent) => void
} {
  // Capture the drag origin and return an updater that maps a pointer position
  // to the new editor size. Returns null when there is no container to size.
  const startResize = useCallback(
    (startX: number, startY: number) => {
      const container = containerRef.current
      if (!container) return null
      const startSize = editorSize
      const isColumn = matchesMobileLayout()
      const extent = isColumn ? container.offsetHeight : container.offsetWidth

      return (currentX: number, currentY: number) => {
        const delta = isColumn ? currentY - startY : currentX - startX
        setEditorSize(clampSize(startSize + (delta / extent) * 100))
      }
    },
    [editorSize, setEditorSize, containerRef]
  )

  const handleSeparatorMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const update = startResize(e.clientX, e.clientY)
      if (!update) return

      const handleMouseMove = (moveEvent: MouseEvent) => {
        update(moveEvent.clientX, moveEvent.clientY)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [startResize]
  )

  const handleSeparatorTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return
      const touch = e.touches[0]
      const update = startResize(touch.clientX, touch.clientY)
      if (!update) return

      const handleTouchMove = (moveEvent: TouchEvent) => {
        moveEvent.preventDefault()
        if (!moveEvent.touches || moveEvent.touches.length === 0) return
        const t = moveEvent.touches[0]
        update(t.clientX, t.clientY)
      }

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }

      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    },
    [startResize]
  )

  return {
    handleSeparatorMouseDown,
    handleSeparatorTouchStart,
  }
}
