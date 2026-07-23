import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSettings, DEFAULT_SETTINGS } from './useSettings'

const SETTINGS_KEY = 'md-notepad-settings'

interface ColorSchemeMock {
  emit: (matches: boolean) => void
  listenerCount: () => number
}

function installColorSchemeMedia(initialDark: boolean): ColorSchemeMock {
  const listeners = new Set<(e: MediaQueryListEvent) => void>()
  const mql = {
    matches: initialDark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_type: string, listener: (e: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_type: string, listener: (e: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mql)
  )
  return {
    emit: (matches: boolean) => {
      mql.matches = matches
      listeners.forEach((l) => l({ matches } as MediaQueryListEvent))
    },
    listenerCount: () => listeners.size,
  }
}

function readStored() {
  const raw = localStorage.getItem(SETTINGS_KEY)
  return raw ? JSON.parse(raw) : null
}

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    installColorSchemeMedia(true)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    document.documentElement.removeAttribute('data-theme')
  })

  describe('initial state', () => {
    it('falls back to defaults with an empty store', () => {
      const { result } = renderHook(() => useSettings())
      expect(result.current.theme).toBe(DEFAULT_SETTINGS.theme)
      expect(result.current.accentColor).toBe(DEFAULT_SETTINGS.accentColor)
      expect(result.current.showBackdrop).toBe(DEFAULT_SETTINGS.showBackdrop)
      expect(result.current.previewMode).toBe(DEFAULT_SETTINGS.previewMode)
    })

    it('hydrates from a saved settings object', () => {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          ...DEFAULT_SETTINGS,
          theme: 'dark',
          accentColor: 'green',
          highPerformance: true,
          showLineNumbers: true,
          previewMode: 'separate',
        })
      )
      const { result } = renderHook(() => useSettings())
      expect(result.current.theme).toBe('dark')
      expect(result.current.accentColor).toBe('green')
      expect(result.current.highPerformance).toBe(true)
      expect(result.current.showLineNumbers).toBe(true)
      expect(result.current.previewMode).toBe('separate')
    })

    it('falls back to defaults when stored JSON is corrupt', () => {
      localStorage.setItem(SETTINGS_KEY, '{not valid json')
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { result } = renderHook(() => useSettings())
      expect(result.current.theme).toBe(DEFAULT_SETTINGS.theme)
      expect(result.current.accentColor).toBe(DEFAULT_SETTINGS.accentColor)
      expect(errorSpy).toHaveBeenCalled()
    })
  })

  describe('setters persist and update state', () => {
    it('setTheme updates state and localStorage', () => {
      const { result } = renderHook(() => useSettings())
      act(() => result.current.setTheme('light'))
      expect(result.current.theme).toBe('light')
      expect(readStored().theme).toBe('light')
    })

    it('setAccentColor updates state and localStorage', () => {
      const { result } = renderHook(() => useSettings())
      act(() => result.current.setAccentColor('purple'))
      expect(result.current.accentColor).toBe('purple')
      expect(readStored().accentColor).toBe('purple')
    })

    it('boolean setters toggle and persist', () => {
      const { result } = renderHook(() => useSettings())
      act(() => {
        result.current.setHighPerformance(true)
        result.current.setShowBackdrop(false)
        result.current.setShowShadow(false)
        result.current.setRealTimePreview(false)
        result.current.setSpellCheck(true)
        result.current.setShowLineNumbers(true)
      })
      expect(result.current.highPerformance).toBe(true)
      expect(result.current.showBackdrop).toBe(false)
      expect(result.current.showShadow).toBe(false)
      expect(result.current.realTimePreview).toBe(false)
      expect(result.current.spellCheck).toBe(true)
      expect(result.current.showLineNumbers).toBe(true)
      const stored = readStored()
      expect(stored.highPerformance).toBe(true)
      expect(stored.spellCheck).toBe(true)
    })

    it('setPreviewMode persists the mode', () => {
      const { result } = renderHook(() => useSettings())
      act(() => result.current.setPreviewMode('separate'))
      expect(result.current.previewMode).toBe('separate')
      expect(readStored().previewMode).toBe('separate')
    })
  })

  describe('resetToDefaults', () => {
    it('restores every value and overwrites storage', () => {
      const { result } = renderHook(() => useSettings())
      act(() => {
        result.current.setTheme('dark')
        result.current.setAccentColor('orange')
        result.current.setHighPerformance(true)
      })
      act(() => result.current.resetToDefaults())
      expect(result.current.theme).toBe(DEFAULT_SETTINGS.theme)
      expect(result.current.accentColor).toBe(DEFAULT_SETTINGS.accentColor)
      expect(result.current.highPerformance).toBe(DEFAULT_SETTINGS.highPerformance)
      expect(readStored()).toEqual(DEFAULT_SETTINGS)
    })
  })

  describe('applies settings to the DOM', () => {
    it('reflects the accent color and preview mode as data attributes', () => {
      const { result } = renderHook(() => useSettings())
      act(() => {
        result.current.setAccentColor('red')
        result.current.setPreviewMode('separate')
      })
      const root = document.documentElement
      expect(root.getAttribute('data-accent-color')).toBe('red')
      expect(root.getAttribute('data-preview-mode')).toBe('separate')
      expect(root.getAttribute('data-preview-sync')).toBe('realtime')
    })

    it('toggles high-performance and backdrop attributes', () => {
      const { result } = renderHook(() => useSettings())
      const root = document.documentElement
      expect(root.hasAttribute('data-performance')).toBe(false)
      act(() => {
        result.current.setHighPerformance(true)
        result.current.setShowBackdrop(false)
      })
      expect(root.getAttribute('data-performance')).toBe('high')
      expect(root.getAttribute('data-show-backdrop')).toBe('false')
    })

    it('uses the system preference when theme is "system"', () => {
      installColorSchemeMedia(false) // system prefers light
      const { result } = renderHook(() => useSettings())
      expect(result.current.theme).toBe(DEFAULT_SETTINGS.theme)
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    it('applies the explicit theme regardless of system preference', () => {
      const { result } = renderHook(() => useSettings())
      act(() => result.current.setTheme('light'))
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })
  })

  describe('system theme listener', () => {
    it('recomputes the effective theme when the OS preference changes', () => {
      const media = installColorSchemeMedia(true)
      renderHook(() => useSettings())
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      act(() => media.emit(false))
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    it('removes the listener on unmount', () => {
      const media = installColorSchemeMedia(true)
      const { unmount } = renderHook(() => useSettings())
      expect(media.listenerCount()).toBe(1)
      unmount()
      expect(media.listenerCount()).toBe(0)
    })
  })
})
