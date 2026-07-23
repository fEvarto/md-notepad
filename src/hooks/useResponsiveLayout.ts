import { useState, useEffect } from 'react'
import { MOBILE_MEDIA_QUERY } from '../utils'

export function useResponsiveLayout(): {
  isColumnLayout: boolean
} {
  const [isColumnLayout, setIsColumnLayout] = useState<boolean>(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY)
    const handleChange = (e: MediaQueryListEvent) => {
      setIsColumnLayout(e.matches)
    }
    handleChange(mediaQuery as unknown as MediaQueryListEvent)
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return { isColumnLayout }
}
