import { useState, useEffect } from 'react'
import { readJSON, writeJSON } from '../utils'

export type AccentColor = 'red' | 'blue' | 'green' | 'purple' | 'orange'

interface Settings {
  theme: 'system' | 'light' | 'dark'
  highPerformance: boolean
  showBackdrop: boolean
  showShadow: boolean
  realTimePreview: boolean
  previewMode: 'split' | 'separate'
  spellCheck: boolean
  showLineNumbers: boolean
  accentColor: AccentColor
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  highPerformance: false,
  showBackdrop: true,
  showShadow: true,
  realTimePreview: true,
  previewMode: 'split',
  spellCheck: false,
  showLineNumbers: false,
  accentColor: 'blue'
}

const SETTINGS_KEY = 'md-notepad-settings'

// Read the persisted settings once; individual initializers pick their field.
function loadStoredSettings(): Partial<Settings> {
  return readJSON<Settings>(SETTINGS_KEY, (e) => console.error('Failed to load settings:', e)) ?? {}
}

export function useSettings(): Settings & {
  setTheme: (theme: 'system' | 'light' | 'dark') => void
  setHighPerformance: (value: boolean) => void
  setShowBackdrop: (value: boolean) => void
  setShowShadow: (value: boolean) => void
  setRealTimePreview: (value: boolean) => void
  setPreviewMode: (mode: 'split' | 'separate') => void
  setSpellCheck: (value: boolean) => void
  setShowLineNumbers: (value: boolean) => void
  setAccentColor: (color: AccentColor) => void
  resetToDefaults: () => void
} {
  const [theme, setThemeState] = useState<'system' | 'light' | 'dark'>(
    () => loadStoredSettings().theme || DEFAULT_SETTINGS.theme
  )

  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('dark')

  const [highPerformance, setHighPerformanceState] = useState<boolean>(
    () => loadStoredSettings().highPerformance ?? DEFAULT_SETTINGS.highPerformance
  )

  const [showBackdrop, setShowBackdropState] = useState<boolean>(
    () => loadStoredSettings().showBackdrop ?? DEFAULT_SETTINGS.showBackdrop
  )

  const [showShadow, setShowShadowState] = useState<boolean>(
    () => loadStoredSettings().showShadow ?? DEFAULT_SETTINGS.showShadow
  )

  const [realTimePreview, setRealTimePreviewState] = useState<boolean>(
    () => loadStoredSettings().realTimePreview ?? DEFAULT_SETTINGS.realTimePreview
  )

  const [previewMode, setPreviewModeState] = useState<'split' | 'separate'>(
    () => loadStoredSettings().previewMode || DEFAULT_SETTINGS.previewMode
  )

  const [spellCheck, setSpellCheckState] = useState<boolean>(
    () => loadStoredSettings().spellCheck ?? DEFAULT_SETTINGS.spellCheck
  )

  const [showLineNumbers, setShowLineNumbersState] = useState<boolean>(
    () => loadStoredSettings().showLineNumbers ?? DEFAULT_SETTINGS.showLineNumbers
  )

  const [accentColor, setAccentColorState] = useState<AccentColor>(
    () => loadStoredSettings().accentColor || DEFAULT_SETTINGS.accentColor
  )

  // Merge a partial update into the persisted settings object.
  const saveSettings = (updatedSettings: Partial<Settings>) => {
    const parsed = readJSON<Partial<Settings>>(SETTINGS_KEY) ?? {}
    const merged = { ...DEFAULT_SETTINGS, ...parsed, ...updatedSettings }
    writeJSON(SETTINGS_KEY, merged, (e) => console.error('Failed to save settings:', e))
  }

  // Build a setter that updates local state and persists the change.
  const createSetter = <K extends keyof Settings>(
    setState: (value: Settings[K]) => void,
    key: K
  ) => (value: Settings[K]) => {
    setState(value)
    saveSettings({ [key]: value } as Partial<Settings>)
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
    document.documentElement.setAttribute('data-spell-check', settings.spellCheck ? 'enabled' : 'disabled')
    document.documentElement.setAttribute('data-line-numbers', settings.showLineNumbers ? 'enabled' : 'disabled')
    document.documentElement.setAttribute('data-accent-color', settings.accentColor)
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
      { theme, highPerformance, showBackdrop, showShadow, realTimePreview, previewMode, spellCheck, showLineNumbers, accentColor },
      effectiveTheme
    )
  }, [theme, systemPreference, highPerformance, showBackdrop, showShadow, realTimePreview, previewMode, spellCheck, showLineNumbers, accentColor])

  const resetToDefaults = () => {
    setThemeState(DEFAULT_SETTINGS.theme)
    setHighPerformanceState(DEFAULT_SETTINGS.highPerformance)
    setShowBackdropState(DEFAULT_SETTINGS.showBackdrop)
    setShowShadowState(DEFAULT_SETTINGS.showShadow)
    setRealTimePreviewState(DEFAULT_SETTINGS.realTimePreview)
    setPreviewModeState(DEFAULT_SETTINGS.previewMode)
    setSpellCheckState(DEFAULT_SETTINGS.spellCheck)
    setShowLineNumbersState(DEFAULT_SETTINGS.showLineNumbers)
    setAccentColorState(DEFAULT_SETTINGS.accentColor)
    writeJSON(SETTINGS_KEY, DEFAULT_SETTINGS)
  }

  return {
    theme,
    highPerformance,
    showBackdrop,
    showShadow,
    realTimePreview,
    previewMode,
    spellCheck,
    showLineNumbers,
    accentColor,
    setTheme: createSetter(setThemeState, 'theme'),
    setHighPerformance: createSetter(setHighPerformanceState, 'highPerformance'),
    setShowBackdrop: createSetter(setShowBackdropState, 'showBackdrop'),
    setShowShadow: createSetter(setShowShadowState, 'showShadow'),
    setRealTimePreview: createSetter(setRealTimePreviewState, 'realTimePreview'),
    setPreviewMode: createSetter(setPreviewModeState, 'previewMode'),
    setSpellCheck: createSetter(setSpellCheckState, 'spellCheck'),
    setShowLineNumbers: createSetter(setShowLineNumbersState, 'showLineNumbers'),
    setAccentColor: createSetter(setAccentColorState, 'accentColor'),
    resetToDefaults
  }
}
