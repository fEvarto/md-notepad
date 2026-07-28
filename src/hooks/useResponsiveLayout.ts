import { useState, useEffect } from 'react'

export function useResponsiveLayout(): {
  isColumnLayout: boolean
  isPhoneLayout: boolean
  isTabletLayout: boolean
} {
  const [isColumnLayout, setIsColumnLayout] = useState<boolean>(false)
  const [isPhoneLayout, setIsPhoneLayout] = useState<boolean>(false)

  useEffect(() => {
    const columnQuery = window.matchMedia('(max-width: 768px)')
    const phoneQuery = window.matchMedia('(max-width: 480px)')

    const handleChange = () => {
      setIsColumnLayout(columnQuery.matches)
      setIsPhoneLayout(phoneQuery.matches)
    }

    handleChange()
    columnQuery.addEventListener('change', handleChange)
    phoneQuery.addEventListener('change', handleChange)
    return () => {
      columnQuery.removeEventListener('change', handleChange)
      phoneQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return {
    isColumnLayout,
    isPhoneLayout,
    isTabletLayout: isColumnLayout && !isPhoneLayout,
  }
}
