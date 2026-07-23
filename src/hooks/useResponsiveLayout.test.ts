import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResponsiveLayout } from './useResponsiveLayout'

interface MockMediaQueryList {
  matches: boolean
  media: string
  addListener: (listener: (e: MediaQueryListEvent) => void) => void
  removeListener: (listener: (e: MediaQueryListEvent) => void) => void
}

function installMatchMedia(initialMatches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>()
  const mql: MockMediaQueryList = {
    matches: initialMatches,
    media: '(max-width: 768px)',
    addListener: (listener) => {
      listeners.add(listener)
    },
    removeListener: (listener) => {
      listeners.delete(listener)
    },
  }
  const matchMedia = vi.fn(() => mql)
  vi.stubGlobal('matchMedia', matchMedia)

  const emit = (matches: boolean) => {
    mql.matches = matches
    listeners.forEach((l) => l({ matches } as MediaQueryListEvent))
  }

  return { mql, matchMedia, listeners, emit }
}

describe('useResponsiveLayout', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false when the viewport is wider than the breakpoint', () => {
    installMatchMedia(false)
    const { result } = renderHook(() => useResponsiveLayout())
    expect(result.current.isColumnLayout).toBe(false)
  })

  it('returns true when the media query matches on mount', () => {
    installMatchMedia(true)
    const { result } = renderHook(() => useResponsiveLayout())
    expect(result.current.isColumnLayout).toBe(true)
  })

  it('updates when the media query change event fires', () => {
    const { emit } = installMatchMedia(false)
    const { result } = renderHook(() => useResponsiveLayout())
    expect(result.current.isColumnLayout).toBe(false)

    act(() => emit(true))
    expect(result.current.isColumnLayout).toBe(true)

    act(() => emit(false))
    expect(result.current.isColumnLayout).toBe(false)
  })

  it('subscribes on mount and unsubscribes on unmount', () => {
    const { listeners } = installMatchMedia(false)
    const { unmount } = renderHook(() => useResponsiveLayout())
    expect(listeners.size).toBe(1)

    unmount()
    expect(listeners.size).toBe(0)
  })
})
