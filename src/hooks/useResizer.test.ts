import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResizer } from './useResizer'

function makeContainer(width: number, height: number) {
  const container = document.createElement('div')
  Object.defineProperty(container, 'offsetWidth', { value: width, configurable: true })
  Object.defineProperty(container, 'offsetHeight', { value: height, configurable: true })
  return { current: container } as React.RefObject<HTMLDivElement | null>
}

function setMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, media: '(max-width: 768px)' }))
  )
}

function renderResizer(initialSize: number, containerRef: React.RefObject<HTMLDivElement | null>) {
  const setEditorSize = vi.fn()
  const { result, rerender } = renderHook(
    ({ size }: { size: number }) => useResizer(size, setEditorSize, containerRef),
    { initialProps: { size: initialSize } }
  )
  return { result, rerender, setEditorSize }
}

describe('useResizer', () => {
  beforeEach(() => {
    setMatchMedia(false)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe('handleSeparatorMouseDown', () => {
    it('registers move and up listeners on the document', () => {
      const addSpy = vi.spyOn(document, 'addEventListener')
      const ref = makeContainer(1000, 600)
      const { result } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorMouseDown({ clientX: 500, clientY: 300 } as React.MouseEvent)
      })
      const events = addSpy.mock.calls.map((c) => c[0])
      expect(events).toContain('mousemove')
      expect(events).toContain('mouseup')
    })

    it('updates size horizontally based on x delta and container width', () => {
      const ref = makeContainer(1000, 600)
      const { result, setEditorSize } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorMouseDown({ clientX: 500, clientY: 300 } as React.MouseEvent)
      })
      // Move right by 100px on a 1000px container => +10%.
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 600, clientY: 300 }))
      expect(setEditorSize).toHaveBeenCalledWith(60)
    })

    it('uses vertical delta in column layout', () => {
      setMatchMedia(true)
      const ref = makeContainer(1000, 600)
      const { result, setEditorSize } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorMouseDown({ clientX: 500, clientY: 300 } as React.MouseEvent)
      })
      // Move down by 60px on a 600px container => +10%.
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 360 }))
      expect(setEditorSize).toHaveBeenCalledWith(60)
    })

    it('clamps the size to a minimum of 20', () => {
      const ref = makeContainer(1000, 600)
      const { result, setEditorSize } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorMouseDown({ clientX: 500, clientY: 300 } as React.MouseEvent)
      })
      // Move far left, would go well below 20%.
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 300 }))
      expect(setEditorSize).toHaveBeenCalledWith(20)
    })

    it('clamps the size to a maximum of 80', () => {
      const ref = makeContainer(1000, 600)
      const { result, setEditorSize } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorMouseDown({ clientX: 500, clientY: 300 } as React.MouseEvent)
      })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 1000, clientY: 300 }))
      expect(setEditorSize).toHaveBeenCalledWith(80)
    })

    it('removes listeners on mouseup so later moves are ignored', () => {
      const ref = makeContainer(1000, 600)
      const { result, setEditorSize } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorMouseDown({ clientX: 500, clientY: 300 } as React.MouseEvent)
      })
      document.dispatchEvent(new MouseEvent('mouseup'))
      setEditorSize.mockClear()
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 700, clientY: 300 }))
      expect(setEditorSize).not.toHaveBeenCalled()
    })

    it('does nothing when the container ref is empty', () => {
      const addSpy = vi.spyOn(document, 'addEventListener')
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>
      const { result } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorMouseDown({ clientX: 500, clientY: 300 } as React.MouseEvent)
      })
      expect(addSpy).not.toHaveBeenCalledWith('mousemove', expect.anything())
    })
  })

  describe('handleSeparatorTouchStart', () => {
    function touchEvent(clientX: number, clientY: number) {
      return { touches: [{ clientX, clientY }] } as unknown as React.TouchEvent
    }

    it('updates size horizontally based on touch x delta', () => {
      const ref = makeContainer(1000, 600)
      const { result, setEditorSize } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorTouchStart(touchEvent(500, 300))
      })
      const move = new Event('touchmove') as TouchEvent
      Object.defineProperty(move, 'touches', { value: [{ clientX: 600, clientY: 300 }] })
      document.dispatchEvent(move)
      expect(setEditorSize).toHaveBeenCalledWith(60)
    })

    it('uses vertical touch delta in column layout', () => {
      setMatchMedia(true)
      const ref = makeContainer(1000, 600)
      const { result, setEditorSize } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorTouchStart(touchEvent(500, 300))
      })
      const move = new Event('touchmove') as TouchEvent
      Object.defineProperty(move, 'touches', { value: [{ clientX: 500, clientY: 240 }] })
      document.dispatchEvent(move)
      expect(setEditorSize).toHaveBeenCalledWith(40)
    })

    it('does nothing when the touch start has no touches', () => {
      const addSpy = vi.spyOn(document, 'addEventListener')
      const ref = makeContainer(1000, 600)
      const { result } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorTouchStart({ touches: [] } as unknown as React.TouchEvent)
      })
      expect(addSpy).not.toHaveBeenCalledWith('touchmove', expect.anything(), expect.anything())
    })

    it('does nothing when the container ref is empty', () => {
      const addSpy = vi.spyOn(document, 'addEventListener')
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>
      const { result } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorTouchStart(touchEvent(500, 300))
      })
      expect(addSpy).not.toHaveBeenCalledWith('touchmove', expect.anything(), expect.anything())
    })

    it('stops responding after touchend', () => {
      const ref = makeContainer(1000, 600)
      const { result, setEditorSize } = renderResizer(50, ref)
      act(() => {
        result.current.handleSeparatorTouchStart(touchEvent(500, 300))
      })
      document.dispatchEvent(new Event('touchend'))
      setEditorSize.mockClear()
      const move = new Event('touchmove') as TouchEvent
      Object.defineProperty(move, 'touches', { value: [{ clientX: 700, clientY: 300 }] })
      document.dispatchEvent(move)
      expect(setEditorSize).not.toHaveBeenCalled()
    })
  })
})
