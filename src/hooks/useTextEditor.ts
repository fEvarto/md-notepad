import { useCallback } from 'react'

export function useTextEditor(
  value: string,
  setValue: (value: string) => void,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
): {
  applyWrap: (before: string, after?: string) => void
  toggleWrap: (before: string, after?: string) => boolean
  applySpoiler: () => void
  toggleSpoiler: () => boolean
  applyLinePrefix: (prefix: string) => void
  applyLink: () => void
  applyImage: () => void
  applyCodeBlock: () => void
  applyTable: () => void
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

  const toggleWrap = useCallback((before: string, after?: string) => {
    const ta = textareaRef.current
    if (!ta) return false

    const start = ta.selectionStart
    const end = ta.selectionEnd
    if (start === end) {
      applyWrap(before, after)
      return false
    }

    const selected = value.slice(start, end)
    const close = after ?? before
    const hasMatchingWrap = start >= before.length && end + close.length <= value.length && value.slice(start - before.length, start) === before && value.slice(end, end + close.length) === close

    if (hasMatchingWrap) {
      const newText = value.slice(0, start - before.length) + selected + value.slice(end + close.length)
      setValue(newText)

      requestAnimationFrame(() => {
        if (!ta) return
        const newStart = start - before.length
        const newEnd = newStart + selected.length
        ta.focus()
        ta.setSelectionRange(newStart, newEnd)
      })

      return true
    }

    applyWrap(before, after)
    return false
  }, [value, setValue, textareaRef, applyWrap])

  const applySpoiler = useCallback(() => applyWrap('||'), [applyWrap])

  const toggleSpoiler = useCallback(() => toggleWrap('||'), [toggleWrap])

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

  const applyLink = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)
    const linkText = selected || 'link text'
    const urlPlaceholder = 'url'
    const insertion = `[${linkText}](${urlPlaceholder})`
    const newText = value.slice(0, start) + insertion + value.slice(end)
    setValue(newText)
    requestAnimationFrame(() => {
      if (!ta) return
      ta.focus()
      if (selected) {
        const urlStart = start + 1 + linkText.length + 2
        ta.setSelectionRange(urlStart, urlStart + urlPlaceholder.length)
      } else {
        const textStart = start + 1
        ta.setSelectionRange(textStart, textStart + linkText.length)
      }
    })
  }, [value, setValue, textareaRef])

  const applyImage = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)
    const altText = selected || 'alt text'
    const urlPlaceholder = 'url'
    const insertion = `![${altText}](${urlPlaceholder})`
    const newText = value.slice(0, start) + insertion + value.slice(end)
    setValue(newText)
    requestAnimationFrame(() => {
      if (!ta) return
      ta.focus()
      if (selected) {
        const urlStart = start + 2 + altText.length + 2
        ta.setSelectionRange(urlStart, urlStart + urlPlaceholder.length)
      } else {
        const altStart = start + 2
        ta.setSelectionRange(altStart, altStart + altText.length)
      }
    })
  }, [value, setValue, textareaRef])

  const applyCodeBlock = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)
    const fence = '```'
    const insertion = selected
      ? `${fence}\n${selected}\n${fence}`
      : `${fence}\n\n${fence}`
    const newText = value.slice(0, start) + insertion + value.slice(end)
    setValue(newText)
    requestAnimationFrame(() => {
      if (!ta) return
      ta.focus()
      if (selected) {
        const innerStart = start + fence.length + 1
        ta.setSelectionRange(innerStart, innerStart + selected.length)
      } else {
        const cursor = start + fence.length + 1
        ta.setSelectionRange(cursor, cursor)
      }
    })
  }, [value, setValue, textareaRef])

  const applyTable = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const table =
      '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |'
    const needsLeadingNewline = start > 0 && value[start - 1] !== '\n'
    const needsTrailingNewline = end < value.length && value[end] !== '\n'
    const insertion =
      (needsLeadingNewline ? '\n' : '') +
      table +
      (needsTrailingNewline ? '\n' : '')
    const newText = value.slice(0, start) + insertion + value.slice(end)
    setValue(newText)
    requestAnimationFrame(() => {
      if (!ta) return
      ta.focus()
      const headerStart =
        start + (needsLeadingNewline ? 1 : 0) + 2
      ta.setSelectionRange(headerStart, headerStart + 'Header 1'.length)
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
    toggleWrap,
    applySpoiler,
    toggleSpoiler,
    applyLinePrefix,
    applyLink,
    applyImage,
    applyCodeBlock,
    applyTable,
    exportMarkdown,
  }
}
