import { useCallback } from 'react'

export function useTextEditor(
  value: string,
  setValue: (value: string) => void,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
): {
  applyWrap: (before: string, after?: string) => void
  applyLinePrefix: (prefix: string) => void
  exportMarkdown: (filename?: string) => void
} {
  const applyWrap = useCallback((before: string, after?: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)
    const close = after ?? before
    const newText = value.slice(0, start) + before + selected + close + value.slice(end)
    setValue(newText)
    requestAnimationFrame(() => {
      if (!ta) return
      const newStart = start + before.length
      const newEnd = newStart + selected.length
      ta.focus()
      ta.setSelectionRange(newStart, newEnd)
    })
  }, [value, setValue, textareaRef])

  const applyLinePrefix = useCallback((prefix: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const before = value.slice(0, start)
    const selection = value.slice(start, end)
    const lines = selection.split('\n').map((ln) => (ln.length ? prefix + ln : prefix))
    const joined = lines.join('\n')
    const newText = before + joined + value.slice(end)
    setValue(newText)
    requestAnimationFrame(() => {
      if (!ta) return
      ta.focus()
      ta.setSelectionRange(start + prefix.length, start + prefix.length + joined.length - prefix.length)
    })
  }, [value, setValue, textareaRef])

  const exportMarkdown = useCallback((filename = 'note.md') => {
    const blob = new Blob([value], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [value])

  return {
    applyWrap,
    applyLinePrefix,
    exportMarkdown,
  }
}
