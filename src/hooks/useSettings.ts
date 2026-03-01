import { useState, useEffect } from 'react'

interface Settings {
  theme: 'light' | 'dark'
  highPerformance: boolean
  showBackdrop: boolean
  showShadow: boolean
}

export function useSettings(): Settings & {
  setTheme: (theme: 'light' | 'dark') => void
  setHighPerformance: (value: boolean) => void
  setShowBackdrop: (value: boolean) => void
  setShowShadow: (value: boolean) => void
} {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('md-notepad-theme')
    return (saved as 'light' | 'dark') || 'dark'
  })

  const [highPerformance, setHighPerformanceState] = useState<boolean>(() => {
    const saved = localStorage.getItem('md-notepad-high-performance')
    return saved ? JSON.parse(saved) : false
  })

  const [showBackdrop, setShowBackdropState] = useState<boolean>(() => {
    const saved = localStorage.getItem('md-notepad-show-backdrop')
    return saved ? JSON.parse(saved) : true
  })

  const [showShadow, setShowShadowState] = useState<boolean>(() => {
    const saved = localStorage.getItem('md-notepad-show-shadow')
    return saved ? JSON.parse(saved) : true
  })

  // Persist theme to localStorage and DOM
  useEffect(() => {
    localStorage.setItem('md-notepad-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Persist high performance to localStorage and DOM
  useEffect(() => {
    localStorage.setItem('md-notepad-high-performance', JSON.stringify(highPerformance))
    if (highPerformance) {
      document.documentElement.setAttribute('data-performance', 'high')
    } else {
      document.documentElement.removeAttribute('data-performance')
    }
  }, [highPerformance])

  // Persist backdrop setting to localStorage and DOM
  useEffect(() => {
    localStorage.setItem('md-notepad-show-backdrop', JSON.stringify(showBackdrop))
    if (showBackdrop) {
      document.documentElement.removeAttribute('data-show-backdrop')
    } else {
      document.documentElement.setAttribute('data-show-backdrop', 'false')
    }
  }, [showBackdrop])

  // Persist shadow setting to localStorage and DOM
  useEffect(() => {
    localStorage.setItem('md-notepad-show-shadow', JSON.stringify(showShadow))
    if (showShadow) {
      document.documentElement.removeAttribute('data-show-shadow')
    } else {
      document.documentElement.setAttribute('data-show-shadow', 'false')
    }
  }, [showShadow])

  return {
    theme,
    highPerformance,
    showBackdrop,
    showShadow,
    setTheme: setThemeState,
    setHighPerformance: setHighPerformanceState,
    setShowBackdrop: setShowBackdropState,
    setShowShadow: setShowShadowState,
  }
}
