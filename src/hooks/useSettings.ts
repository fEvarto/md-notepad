import { useState, useEffect } from 'react'
import {
  type AccentColor,
  DEFAULT_CUSTOM_ACCENT,
  darkenHexColor,
  normalizeHexColor,
  parseAccentColor,
  parseCustomAccentColor
} from '../utils/accentColor'
import {
  DEFAULT_TOOLBAR_BUTTON_ORDER,
  DEFAULT_VISIBLE_TOOLBAR_BUTTONS,
  type ToolbarStyleButtonId,
  parseToolbarButtonOrder,
  parseToolbarVisibleButtons
} from '../utils/toolbarButtons'

export type { AccentColor } from '../utils/accentColor'
export type { ToolbarStyleButtonId } from '../utils/toolbarButtons'

export interface Settings {

  theme: 'system' | 'light' | 'dark'
  highPerformance: boolean
  showBackdrop: boolean
  showShadow: boolean
  realTimePreview: boolean
  previewMode: 'split' | 'separate' | 'in-preview'
  showPreviewExportButton: boolean
  previewExportButtonPosition: 'top-right' | 'bottom-right'
  spellCheck: boolean
  showLineNumbers: boolean
  accentColor: AccentColor
  customAccentColor: string
  toolbarButtonOrder: ToolbarStyleButtonId[]
  visibleToolbarButtons: ToolbarStyleButtonId[]
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  highPerformance: false,
  showBackdrop: true,
  showShadow: true,
  realTimePreview: true,
  previewMode: 'split',
  showPreviewExportButton: false,
  previewExportButtonPosition: 'top-right',
  spellCheck: false,
  showLineNumbers: false,
  accentColor: 'blue',
  customAccentColor: DEFAULT_CUSTOM_ACCENT,
  toolbarButtonOrder: DEFAULT_TOOLBAR_BUTTON_ORDER,
  visibleToolbarButtons: DEFAULT_VISIBLE_TOOLBAR_BUTTONS
}

const SETTINGS_KEY = 'md-notepad-settings'

function isTheme(value: unknown): value is Settings['theme'] {
  return value === 'system' || value === 'light' || value === 'dark'
}

function isPreviewMode(value: unknown): value is Settings['previewMode'] {
  return value === 'split' || value === 'separate' || value === 'in-preview'
}

function isPreviewExportButtonPosition(value: unknown): value is Settings['previewExportButtonPosition'] {
  return value === 'top-right' || value === 'bottom-right'
}

/**
 * Keep imported data limited to the settings currently supported by the UI.
 * This also makes older exports forward-compatible as new defaults are added.
 */
function sanitizeSettings(input: Partial<Settings>): Partial<Settings> {
  const sanitized: Partial<Settings> = {}

  if (isTheme(input.theme)) sanitized.theme = input.theme
  if (typeof input.highPerformance === 'boolean') sanitized.highPerformance = input.highPerformance
  if (typeof input.showBackdrop === 'boolean') sanitized.showBackdrop = input.showBackdrop
  if (typeof input.showShadow === 'boolean') sanitized.showShadow = input.showShadow
  if (typeof input.realTimePreview === 'boolean') sanitized.realTimePreview = input.realTimePreview
  if (isPreviewMode(input.previewMode)) sanitized.previewMode = input.previewMode
  if (typeof input.showPreviewExportButton === 'boolean') {
    sanitized.showPreviewExportButton = input.showPreviewExportButton
  }
  if (isPreviewExportButtonPosition(input.previewExportButtonPosition)) {
    sanitized.previewExportButtonPosition = input.previewExportButtonPosition
  }
  if (typeof input.spellCheck === 'boolean') sanitized.spellCheck = input.spellCheck
  if (typeof input.showLineNumbers === 'boolean') sanitized.showLineNumbers = input.showLineNumbers
  if (typeof input.accentColor === 'string') sanitized.accentColor = parseAccentColor(input.accentColor)
  if (typeof input.customAccentColor === 'string') {
    sanitized.customAccentColor = parseCustomAccentColor(input.customAccentColor)
  }
  if (input.toolbarButtonOrder !== undefined) {
    sanitized.toolbarButtonOrder = parseToolbarButtonOrder(input.toolbarButtonOrder)
  }
  if (input.visibleToolbarButtons !== undefined) {
    sanitized.visibleToolbarButtons = parseToolbarVisibleButtons(input.visibleToolbarButtons)
  }

  return sanitized
}

function copySettings(settings: Settings): Settings {
  return {
    ...settings,
    toolbarButtonOrder: [...settings.toolbarButtonOrder],
    visibleToolbarButtons: [...settings.visibleToolbarButtons],
  }
}


export function useSettings(): Settings & {
  setTheme: (theme: 'system' | 'light' | 'dark') => void
  setHighPerformance: (value: boolean) => void
  setShowBackdrop: (value: boolean) => void
  setShowShadow: (value: boolean) => void
  setRealTimePreview: (value: boolean) => void
  setPreviewMode: (mode: 'split' | 'separate' | 'in-preview') => void
  setShowPreviewExportButton: (value: boolean) => void
  setPreviewExportButtonPosition: (position: 'top-right' | 'bottom-right') => void
  setSpellCheck: (value: boolean) => void
  setShowLineNumbers: (value: boolean) => void
  setAccentColor: (color: AccentColor) => void
  setCustomAccentColor: (hex: string) => void
  setToolbarButtonOrder: (order: ToolbarStyleButtonId[]) => void
  setVisibleToolbarButtons: (buttons: ToolbarStyleButtonId[]) => void
  resetToDefaults: () => void
    exportSettingsToFile: () => void
        importSettingsFromFile: () => Promise<void>
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

  const [previewMode, setPreviewModeState] = useState<'split' | 'separate' | 'in-preview'>(() => {
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

  const [showPreviewExportButton, setShowPreviewExportButtonState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) return (JSON.parse(saved) as Partial<Settings>).showPreviewExportButton ?? DEFAULT_SETTINGS.showPreviewExportButton
    } catch (e) { console.error('Failed to load settings:', e) }
    return DEFAULT_SETTINGS.showPreviewExportButton
  })

  const [previewExportButtonPosition, setPreviewExportButtonPositionState] = useState<'top-right' | 'bottom-right'>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const position = (JSON.parse(saved) as Partial<Settings>).previewExportButtonPosition
        if (position === 'top-right' || position === 'bottom-right') return position
      }
    } catch (e) { console.error('Failed to load settings:', e) }
    return DEFAULT_SETTINGS.previewExportButtonPosition
  })

  const [spellCheck, setSpellCheckState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Settings
        return parsed.spellCheck ?? DEFAULT_SETTINGS.spellCheck
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.spellCheck
  })

  const [showLineNumbers, setShowLineNumbersState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Settings
        return parsed.showLineNumbers ?? DEFAULT_SETTINGS.showLineNumbers
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.showLineNumbers
  })

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Settings>
        return parseAccentColor(parsed.accentColor)
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.accentColor
  })

  const [customAccentColor, setCustomAccentColorState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Settings>
        return parseCustomAccentColor(parsed.customAccentColor)
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.customAccentColor
  })

  const [toolbarButtonOrder, setToolbarButtonOrderState] = useState<ToolbarStyleButtonId[]>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Settings>
        return parseToolbarButtonOrder(parsed.toolbarButtonOrder)
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS.toolbarButtonOrder
  })

  const [visibleToolbarButtons, setVisibleToolbarButtonsState] = useState<ToolbarStyleButtonId[]>(() => {
      try {
        const saved = localStorage.getItem(SETTINGS_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<Settings>
          return parseToolbarVisibleButtons(parsed.visibleToolbarButtons)
        }
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
      return DEFAULT_SETTINGS.visibleToolbarButtons
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
    document.documentElement.setAttribute('data-spell-check', settings.spellCheck ? 'enabled' : 'disabled')
    document.documentElement.setAttribute('data-line-numbers', settings.showLineNumbers ? 'enabled' : 'disabled')
    document.documentElement.setAttribute('data-accent-color', settings.accentColor)
    if (settings.accentColor === 'custom') {
      const primary =
        normalizeHexColor(settings.customAccentColor) ?? DEFAULT_CUSTOM_ACCENT
      document.documentElement.style.setProperty('--accent-primary', primary)
      document.documentElement.style.setProperty('--accent-dark', darkenHexColor(primary))
    } else {
      document.documentElement.style.removeProperty('--accent-primary')
      document.documentElement.style.removeProperty('--accent-dark')
    }
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
      {
        theme,
        highPerformance,
        showBackdrop,
        showShadow,
        realTimePreview,
        previewMode,
        showPreviewExportButton,
        previewExportButtonPosition,
        spellCheck,
        showLineNumbers,
        accentColor,
        customAccentColor,
        toolbarButtonOrder,
                visibleToolbarButtons
              },
              effectiveTheme
            )
          }, [
            theme,
            systemPreference,
            highPerformance,
            showBackdrop,
            showShadow,
            realTimePreview,
            previewMode,
            showPreviewExportButton,
            previewExportButtonPosition,
            spellCheck,
            showLineNumbers,
            accentColor,
            customAccentColor,
            toolbarButtonOrder,
            visibleToolbarButtons
          ])

  const exportSettingsToFile = () => {
        // Export the complete, current settings set. Keep this list in sync with
    // DEFAULT_SETTINGS so every customizable option survives a transfer.
    const settings = copySettings({
      ...DEFAULT_SETTINGS,
      theme,
      highPerformance,
      showBackdrop,
      showShadow,
      realTimePreview,
      previewMode,
      showPreviewExportButton,
      previewExportButtonPosition,
      spellCheck,
      showLineNumbers,
      accentColor,
      customAccentColor,
      toolbarButtonOrder,
      visibleToolbarButtons,
    })

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'md-notepad-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importSettingsFromFile = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json,application/json'
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) {
          reject(new Error('No file selected'))
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string
                        const parsed = sanitizeSettings(JSON.parse(text) as Partial<Settings>)

            // Apply only supported and validated settings.
            if (parsed.theme) setThemeState(parsed.theme)

            if (parsed.highPerformance !== undefined) setHighPerformanceState(parsed.highPerformance)
            if (parsed.showBackdrop !== undefined) setShowBackdropState(parsed.showBackdrop)
            if (parsed.showShadow !== undefined) setShowShadowState(parsed.showShadow)
            if (parsed.realTimePreview !== undefined) setRealTimePreviewState(parsed.realTimePreview)
            if (parsed.previewMode) setPreviewModeState(parsed.previewMode)
                if (parsed.showPreviewExportButton !== undefined) setShowPreviewExportButtonState(parsed.showPreviewExportButton)
                if (parsed.previewExportButtonPosition === 'top-right' || parsed.previewExportButtonPosition === 'bottom-right') setPreviewExportButtonPositionState(parsed.previewExportButtonPosition)
                if (parsed.spellCheck !== undefined) setSpellCheckState(parsed.spellCheck)
            if (parsed.showLineNumbers !== undefined) setShowLineNumbersState(parsed.showLineNumbers)
            if (parsed.accentColor) setAccentColorState(parseAccentColor(parsed.accentColor))
            if (parsed.customAccentColor) setCustomAccentColorState(parseCustomAccentColor(parsed.customAccentColor))
            if (parsed.toolbarButtonOrder) setToolbarButtonOrderState(parseToolbarButtonOrder(parsed.toolbarButtonOrder))
            if (parsed.visibleToolbarButtons) setVisibleToolbarButtonsState(parseToolbarVisibleButtons(parsed.visibleToolbarButtons))

            // Save merged settings to localStorage
            try {
              const current = localStorage.getItem(SETTINGS_KEY)
              const existing = current ? JSON.parse(current) : {}
                            const merged = {
                ...DEFAULT_SETTINGS,
                ...sanitizeSettings(existing as Partial<Settings>),
                ...parsed,
              }
              localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))

            } catch (e) {
              console.error('Failed to save imported settings:', e)
            }

            resolve()
                    } catch {
            reject(new Error('Invalid settings file'))
          }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
      }
      input.click()
    })
  }

  const resetToDefaults = () => {
    setThemeState(DEFAULT_SETTINGS.theme)
    setHighPerformanceState(DEFAULT_SETTINGS.highPerformance)
    setShowBackdropState(DEFAULT_SETTINGS.showBackdrop)
    setShowShadowState(DEFAULT_SETTINGS.showShadow)
    setRealTimePreviewState(DEFAULT_SETTINGS.realTimePreview)
    setPreviewModeState(DEFAULT_SETTINGS.previewMode)
    setShowPreviewExportButtonState(DEFAULT_SETTINGS.showPreviewExportButton)
    setPreviewExportButtonPositionState(DEFAULT_SETTINGS.previewExportButtonPosition)
    setSpellCheckState(DEFAULT_SETTINGS.spellCheck)
    setShowLineNumbersState(DEFAULT_SETTINGS.showLineNumbers)
    setAccentColorState(DEFAULT_SETTINGS.accentColor)
    setCustomAccentColorState(DEFAULT_SETTINGS.customAccentColor)
        setToolbarButtonOrderState(DEFAULT_SETTINGS.toolbarButtonOrder)
    setVisibleToolbarButtonsState(DEFAULT_SETTINGS.visibleToolbarButtons)
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(copySettings(DEFAULT_SETTINGS)))

  }

  return {
    theme,
    highPerformance,
    showBackdrop,
    showShadow,
    realTimePreview,
    previewMode,
    showPreviewExportButton,
    previewExportButtonPosition,
    spellCheck,
    showLineNumbers,
    accentColor,
    customAccentColor,
        toolbarButtonOrder,
    visibleToolbarButtons,
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
    setPreviewMode: (mode: 'split' | 'separate' | 'in-preview') => {
            setPreviewModeState(mode)
      saveSettings({ previewMode: mode })
    },
    setShowPreviewExportButton: (value: boolean) => {
      setShowPreviewExportButtonState(value)
      saveSettings({ showPreviewExportButton: value })
    },
    setPreviewExportButtonPosition: (position: 'top-right' | 'bottom-right') => {
      setPreviewExportButtonPositionState(position)
      saveSettings({ previewExportButtonPosition: position })
    },
    setSpellCheck: (value: boolean) => {
      setSpellCheckState(value)
      saveSettings({ spellCheck: value })
    },
    setShowLineNumbers: (value: boolean) => {
      setShowLineNumbersState(value)
      saveSettings({ showLineNumbers: value })
    },
    setAccentColor: (color: AccentColor) => {
      setAccentColorState(color)
      saveSettings({ accentColor: color })
    },
    setCustomAccentColor: (hex: string) => {
      const normalized = normalizeHexColor(hex) ?? DEFAULT_CUSTOM_ACCENT
      setCustomAccentColorState(normalized)
      setAccentColorState('custom')
      saveSettings({ customAccentColor: normalized, accentColor: 'custom' })
    },
    setToolbarButtonOrder: (order: ToolbarStyleButtonId[]) => {
      const normalized = parseToolbarButtonOrder(order)
      setToolbarButtonOrderState(normalized)
      saveSettings({ toolbarButtonOrder: normalized })
    },
    setVisibleToolbarButtons: (buttons: ToolbarStyleButtonId[]) => {
      const normalized = parseToolbarVisibleButtons(buttons)
      setVisibleToolbarButtonsState(normalized)
      saveSettings({ visibleToolbarButtons: normalized })
    },
    resetToDefaults,
        exportSettingsToFile,
        importSettingsFromFile,
      }
}
