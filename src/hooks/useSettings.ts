import { useState, useEffect } from 'react'

interface Settings {
  theme: 'system' | 'light' | 'dark'
  highPerformance: boolean
  showBackdrop: boolean
  showShadow: boolean
  realTimePreview: boolean
  previewMode: 'split' | 'separate'
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  highPerformance: false,
  showBackdrop: true,
  showShadow: true,
  realTimePreview: true,
  previewMode: 'split'
}

const SETTINGS_KEY = 'md-notepad-settings'

export function useSettings(): Settings & {
  setTheme: (theme: 'system' | 'light' | 'dark') => void
  setHighPerformance: (value: boolean) => void
  setShowBackdrop: (value: boolean) => void
  setShowShadow: (value: boolean) => void
  setRealTimePreview: (value: boolean) => void
  setPreviewMode: (mode: 'split' | 'separate') => void
  resetToDefaults: () => void
} {
  const [theme, setThemeState] = useState<'system' | 'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Settings
        return parsed.theme || DEFAULT_SETTINGS.theme
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.theme
  })

  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('dark')

  const [highPerformance, setHighPerformanceState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Settings
        return parsed.highPerformance ?? DEFAULT_SETTINGS.highPerformance
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.highPerformance
  })

  const [showBackdrop, setShowBackdropState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Settings
        return parsed.showBackdrop ?? DEFAULT_SETTINGS.showBackdrop
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.showBackdrop
  })

  const [showShadow, setShowShadowState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Settings
        return parsed.showShadow ?? DEFAULT_SETTINGS.showShadow
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.showShadow
  })

  const [realTimePreview, setRealTimePreviewState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Settings
        return parsed.realTimePreview ?? DEFAULT_SETTINGS.realTimePreview
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.realTimePreview
  })

  const [previewMode, setPreviewModeState] = useState<'split' | 'separate'>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Settings
        return parsed.previewMode || DEFAULT_SETTINGS.previewMode
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.previewMode
  })

  // Helper function to save all settings to localStorage
  const saveSettings = (updatedSettings: Partial<Settings>) => {
    try {
      const current = localStorage.getItem(SETTINGS_KEY)
      const parsed = current ? JSON.parse(current) : {}
      const merged = { ...DEFAULT_SETTINGS, ...parsed, ...updatedSettings }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  // Helper function to apply settings to DOM
  const applySettingsToDOM = (settings: Settings, effectiveTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', effectiveTheme)
    if (settings.highPerformance) {
      document.documentElement.setAttribute('data-performance', 'high')
    } else {
      document.documentElement.removeAttribute('data-performance')
    }
    if (settings.showBackdrop) {
      document.documentElement.removeAttribute('data-show-backdrop')
    } else {
      document.documentElement.setAttribute('data-show-backdrop', 'false')
    }
    if (settings.showShadow) {
      document.documentElement.removeAttribute('data-show-shadow')
    } else {
      document.documentElement.setAttribute('data-show-shadow', 'false')
    }
    document.documentElement.setAttribute('data-preview-sync', settings.realTimePreview ? 'realtime' : 'manual')
    document.documentElement.setAttribute('data-preview-mode', settings.previewMode)
  }

  // Detect system theme preference and listen for changes
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent | { matches: boolean }) => {
      setSystemPreference(e.matches ? 'dark' : 'light')
    }
    // Set initial preference via callback style
    handleChange(darkModeQuery)
    // Listen for changes
    darkModeQuery.addEventListener('change', handleChange)
    return () => darkModeQuery.removeEventListener('change', handleChange)
  }, [])

  // Persist theme to localStorage and compute effective theme for DOM
  useEffect(() => {
    saveSettings({ theme })
    const effectiveTheme = theme === 'system' ? systemPreference : theme
    applySettingsToDOM(
      { theme, highPerformance, showBackdrop, showShadow, realTimePreview, previewMode },
      effectiveTheme
    )
  }, [theme, systemPreference, highPerformance, showBackdrop, showShadow, realTimePreview, previewMode])

  const resetToDefaults = () => {
    setThemeState(DEFAULT_SETTINGS.theme)
    setHighPerformanceState(DEFAULT_SETTINGS.highPerformance)
    setShowBackdropState(DEFAULT_SETTINGS.showBackdrop)
    setShowShadowState(DEFAULT_SETTINGS.showShadow)
    setRealTimePreviewState(DEFAULT_SETTINGS.realTimePreview)
    setPreviewModeState(DEFAULT_SETTINGS.previewMode)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS))
  }

  return {
    theme,
    highPerformance,
    showBackdrop,
    showShadow,
    realTimePreview,
    previewMode,
    setTheme: (newTheme: 'system' | 'light' | 'dark') => {
      setThemeState(newTheme)
      saveSettings({ theme: newTheme })
    },
    setHighPerformance: (value: boolean) => {
      setHighPerformanceState(value)
      saveSettings({ highPerformance: value })
    },
    setShowBackdrop: (value: boolean) => {
      setShowBackdropState(value)
      saveSettings({ showBackdrop: value })
    },
    setShowShadow: (value: boolean) => {
      setShowShadowState(value)
      saveSettings({ showShadow: value })
    },
    setRealTimePreview: (value: boolean) => {
      setRealTimePreviewState(value)
      saveSettings({ realTimePreview: value })
    },
    setPreviewMode: (mode: 'split' | 'separate') => {
      setPreviewModeState(mode)
      saveSettings({ previewMode: mode })
    },
    resetToDefaults
  }
}
