import { useCallback } from 'react'

export function useResizer(
    editorSize: number,
  setEditorSize: (size: number) => void,
  containerRef: React.RefObject<HTMLDivElement | null>,
  splitDirection: 'horizontal' | 'vertical'

): {
  handleSeparatorMouseDown: (e: React.MouseEvent) => void
  handleSeparatorTouchStart: (e: React.TouchEvent) => void
} {
  const handleSeparatorMouseDown = useCallback((e: React.MouseEvent) => {
    const startX = e.clientX
    const startY = e.clientY
    const startSize = editorSize
    const container = containerRef.current
    if (!container) return
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight
        const isColumn = window.matchMedia('(max-width: 768px)').matches
    const isSwapped = splitDirection === 'vertical'

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isColumn) {
        const delta = moveEvent.clientY - startY
        const deltaPercent = (delta / containerHeight) * 100
                const newSize = Math.max(20, Math.min(80, startSize + (isSwapped ? -deltaPercent : deltaPercent)))
        setEditorSize(newSize)
      } else {
        const delta = moveEvent.clientX - startX
        const deltaPercent = (delta / containerWidth) * 100
        const newSize = Math.max(20, Math.min(80, startSize + (isSwapped ? -deltaPercent : deltaPercent)))
        setEditorSize(newSize)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [editorSize, setEditorSize, containerRef, splitDirection])

  const handleSeparatorTouchStart = useCallback((e: React.TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return
    const touch = e.touches[0]
    const startX = touch.clientX
    const startY = touch.clientY
    const startSize = editorSize
    const container = containerRef.current
    if (!container) return
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight
        const isColumn = window.matchMedia('(max-width: 768px)').matches
    const isSwapped = splitDirection === 'vertical'

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault()
      if (!moveEvent.touches || moveEvent.touches.length === 0) return
      const t = moveEvent.touches[0]
      if (isColumn) {
        const delta = t.clientY - startY
        const deltaPercent = (delta / containerHeight) * 100
                const newSize = Math.max(20, Math.min(80, startSize + (isSwapped ? -deltaPercent : deltaPercent)))
        setEditorSize(newSize)
      } else {
        const delta = t.clientX - startX
        const deltaPercent = (delta / containerWidth) * 100
        const newSize = Math.max(20, Math.min(80, startSize + (isSwapped ? -deltaPercent : deltaPercent)))
        setEditorSize(newSize)
      }
    }

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }, [editorSize, setEditorSize, containerRef, splitDirection])

  return {
    handleSeparatorMouseDown,
    handleSeparatorTouchStart,
  }
}
