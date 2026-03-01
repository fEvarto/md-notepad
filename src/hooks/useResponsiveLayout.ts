import { useState, useEffect } from 'react'

export function useResponsiveLayout(): {
  isColumnLayout: boolean
} {
  const [isColumnLayout, setIsColumnLayout] = useState<boolean>(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsColumnLayout(e.matches)
    }
    handleChange(mediaQuery as unknown as MediaQueryListEvent)
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return { isColumnLayout }
}
