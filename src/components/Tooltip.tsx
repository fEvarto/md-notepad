import React, { useRef, useEffect, useState } from 'react'

interface TooltipProps {
  text: string
  keybind?: string
}

export function Tooltip({ text, keybind }: TooltipProps): React.JSX.Element {
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const calculatePosition = () => {
    const tooltip = tooltipRef.current
    const button = tooltip?.parentElement
    if (!tooltip || !button) return

    const buttonRect = button.getBoundingClientRect()
    const gap = 8
    
    // Determine vertical positioning: use top for upper half, bottom for lower half
    const isUpperHalf = buttonRect.top < window.innerHeight / 2
    
    // Determine horizontal positioning: use left for left half, right for right half
    const isLeftHalf = buttonRect.left < window.innerWidth / 2
    
    const newStyle: React.CSSProperties = {
      position: 'fixed',
      visibility: 'visible',
      opacity: 1,
      pointerEvents: 'none',
    }
    
    // Vertical positioning
    if (isUpperHalf) {
      // Button in upper half: position tooltip below
      newStyle.top = `${Math.round(buttonRect.bottom + gap)}px`
      newStyle.bottom = 'auto'
    } else {
      // Button in lower half: position tooltip above (use bottom property)
      // bottom = viewport height - (button top - gap)
      newStyle.bottom = `${Math.round(window.innerHeight - buttonRect.top + gap)}px`
      newStyle.top = 'auto'
    }
    
    // Horizontal positioning
    if (isLeftHalf) {
      // Button on left: use left property
      newStyle.left = `${8}px`
      newStyle.right = 'auto'
    } else {
      // Button on right: use right property
      newStyle.right = `${8}px`
      newStyle.left = 'auto'
    }
    
    setStyle(newStyle)
  }

  useEffect(() => {
    const tooltip = tooltipRef.current
    const button = tooltip?.parentElement
    if (!button) return

    let isTooltipVisible = false

    const handleMouseEnter = () => {
      isTooltipVisible = true
      calculatePosition()
    }

    const handleMouseLeave = () => {
      isTooltipVisible = false
      setStyle(prev => ({
        ...prev,
        visibility: 'hidden',
        opacity: 0,
      }))
    }

    const handleFocus = () => {
      isTooltipVisible = true
      calculatePosition()
    }

    const handleBlur = () => {
      isTooltipVisible = false
      setStyle(prev => ({
        ...prev,
        visibility: 'hidden',
        opacity: 0,
      }))
    }

    const handleResize = () => {
      if (isTooltipVisible) {
        calculatePosition()
      }
    }

    const handleScroll = () => {
      if (isTooltipVisible) {
        calculatePosition()
      }
    }

    const handleMouseMove = () => {
      if (isTooltipVisible) {
        calculatePosition()
      }
    }

    const handleClick = () => {
      // Hide tooltip immediately on click
      isTooltipVisible = false
      setStyle(prev => ({
        ...prev,
        visibility: 'hidden',
        opacity: 0,
      }))
    }

    button.addEventListener('mouseenter', handleMouseEnter)
    button.addEventListener('mouseleave', handleMouseLeave)
    button.addEventListener('focus', handleFocus)
    button.addEventListener('blur', handleBlur)
    button.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter)
      button.removeEventListener('mouseleave', handleMouseLeave)
      button.removeEventListener('focus', handleFocus)
      button.removeEventListener('blur', handleBlur)
      button.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <span
      ref={tooltipRef}
      className="tooltip"
      aria-hidden
      style={style}
    >
      {text}
      {keybind && <kbd>{keybind}</kbd>}
    </span>
  )
}
