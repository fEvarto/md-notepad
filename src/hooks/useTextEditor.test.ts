import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTextEditor } from './useTextEditor'

function setupTextarea(value: string, selectionStart: number, selectionEnd: number) {
  const textarea = document.createElement('textarea')
  textarea.value = value
  document.body.appendChild(textarea)
  textarea.setSelectionRange(selectionStart, selectionEnd)
  const ref = { current: textarea } as React.RefObject<HTMLTextAreaElement | null>
  return { textarea, ref }
}

function renderEditor(initialValue: string, selectionStart: number, selectionEnd: number) {
  const { textarea, ref } = setupTextarea(initialValue, selectionStart, selectionEnd)
  const state = { value: initialValue }
  const setValue = vi.fn((next: string) => {
    state.value = next
    textarea.value = next
  })
  const { result, rerender } = renderHook(
    ({ value }: { value: string }) => useTextEditor(value, setValue, ref),
    { initialProps: { value: initialValue } }
  )
  return { result, rerender, setValue, textarea, ref, state }
}

describe('useTextEditor', () => {
  beforeEach(() => {
    // Run requestAnimationFrame callbacks synchronously so selection logic runs.
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 0
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  describe('applyWrap', () => {
    it('wraps the selected text with symmetric markers', () => {
      const { result, setValue } = renderEditor('hello world', 6, 11)
      act(() => result.current.applyWrap('**'))
      expect(setValue).toHaveBeenCalledWith('hello **world**')
    })

    it('inserts empty markers when nothing is selected', () => {
      const { result, setValue } = renderEditor('ab', 1, 1)
      act(() => result.current.applyWrap('`'))
      expect(setValue).toHaveBeenCalledWith('a``b')
    })

    it('uses a distinct closing marker when provided', () => {
      const { result, setValue } = renderEditor('link', 0, 4)
      act(() => result.current.applyWrap('[', '](url)'))
      expect(setValue).toHaveBeenCalledWith('[link](url)')
    })

    it('repositions the selection to cover the original text', () => {
      const { result, textarea } = renderEditor('hello world', 6, 11)
      act(() => result.current.applyWrap('**'))
      expect(textarea.selectionStart).toBe(8)
      expect(textarea.selectionEnd).toBe(13)
    })

    it('does nothing when the textarea ref is empty', () => {
      const ref = { current: null } as React.RefObject<HTMLTextAreaElement | null>
      const setValue = vi.fn()
      const { result } = renderHook(() => useTextEditor('x', setValue, ref))
      act(() => result.current.applyWrap('**'))
      expect(setValue).not.toHaveBeenCalled()
    })
  })

  describe('toggleWrap', () => {
    it('adds markers and returns false when text is unwrapped', () => {
      const { result, setValue } = renderEditor('hello world', 6, 11)
      let removed: boolean | undefined
      act(() => {
        removed = result.current.toggleWrap('**')
      })
      expect(removed).toBe(false)
      expect(setValue).toHaveBeenCalledWith('hello **world**')
    })

    it('removes surrounding markers and returns true when already wrapped', () => {
      // Selection is just "world", markers "**" sit immediately outside it.
      const { result, setValue } = renderEditor('hello **world**', 8, 13)
      let removed: boolean | undefined
      act(() => {
        removed = result.current.toggleWrap('**')
      })
      expect(removed).toBe(true)
      expect(setValue).toHaveBeenCalledWith('hello world')
    })

    it('falls back to applyWrap (returns false) when there is no selection', () => {
      const { result, setValue } = renderEditor('hello', 2, 2)
      let removed: boolean | undefined
      act(() => {
        removed = result.current.toggleWrap('**')
      })
      expect(removed).toBe(false)
      expect(setValue).toHaveBeenCalledWith('he****llo')
    })

    it('returns false when ref is empty', () => {
      const ref = { current: null } as React.RefObject<HTMLTextAreaElement | null>
      const setValue = vi.fn()
      const { result } = renderHook(() => useTextEditor('x', setValue, ref))
      let removed: boolean | undefined
      act(() => {
        removed = result.current.toggleWrap('**')
      })
      expect(removed).toBe(false)
      expect(setValue).not.toHaveBeenCalled()
    })

    it('handles asymmetric markers when unwrapping', () => {
      const { result, setValue } = renderEditor('[link](url)', 1, 5)
      let removed: boolean | undefined
      act(() => {
        removed = result.current.toggleWrap('[', '](url)')
      })
      expect(removed).toBe(true)
      expect(setValue).toHaveBeenCalledWith('link')
    })
  })

  describe('applyLinePrefix', () => {
    it('prefixes a single selected line', () => {
      const { result, setValue } = renderEditor('title', 0, 5)
      act(() => result.current.applyLinePrefix('# '))
      expect(setValue).toHaveBeenCalledWith('# title')
    })

    it('prefixes every line in a multi-line selection', () => {
      const value = 'one\ntwo\nthree'
      const { result, setValue } = renderEditor(value, 0, value.length)
      act(() => result.current.applyLinePrefix('- '))
      expect(setValue).toHaveBeenCalledWith('- one\n- two\n- three')
    })

    it('still adds the prefix on an empty line', () => {
      const { result, setValue } = renderEditor('', 0, 0)
      act(() => result.current.applyLinePrefix('> '))
      expect(setValue).toHaveBeenCalledWith('> ')
    })

    it('only affects the selected region', () => {
      const value = 'keep\nchange'
      const { result, setValue } = renderEditor(value, 5, value.length)
      act(() => result.current.applyLinePrefix('# '))
      expect(setValue).toHaveBeenCalledWith('keep\n# change')
    })

    it('does nothing when ref is empty', () => {
      const ref = { current: null } as React.RefObject<HTMLTextAreaElement | null>
      const setValue = vi.fn()
      const { result } = renderHook(() => useTextEditor('x', setValue, ref))
      act(() => result.current.applyLinePrefix('# '))
      expect(setValue).not.toHaveBeenCalled()
    })
  })

  describe('exportMarkdown', () => {
    let clickSpy: ReturnType<typeof vi.fn>
    let createObjectURL: ReturnType<typeof vi.fn>
    let revokeObjectURL: ReturnType<typeof vi.fn>

    beforeEach(() => {
      clickSpy = vi.fn()
      createObjectURL = vi.fn(() => 'blob:mock-url')
      revokeObjectURL = vi.fn()
      vi.stubGlobal('URL', {
        ...URL,
        createObjectURL,
        revokeObjectURL,
      })
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(clickSpy)
    })

    it('creates a download link with the default filename', () => {
      const { result } = renderEditor('content', 0, 0)
      let anchorDownload = ''
      const appendSpy = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(<T extends Node>(node: T): T => {
          if (node instanceof HTMLAnchorElement) anchorDownload = node.download
          return node
        })
      act(() => result.current.exportMarkdown())
      expect(createObjectURL).toHaveBeenCalledTimes(1)
      expect(anchorDownload).toBe('note.md')
      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
      appendSpy.mockRestore()
    })

    it('uses a custom filename when provided', () => {
      const { result } = renderEditor('content', 0, 0)
      let anchorDownload = ''
      const appendSpy = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(<T extends Node>(node: T): T => {
          if (node instanceof HTMLAnchorElement) anchorDownload = node.download
          return node
        })
      act(() => result.current.exportMarkdown('custom.md'))
      expect(anchorDownload).toBe('custom.md')
      appendSpy.mockRestore()
    })

    it('removes the temporary anchor from the DOM', () => {
      const { result } = renderEditor('content', 0, 0)
      act(() => result.current.exportMarkdown())
      expect(document.querySelector('a')).toBeNull()
    })
  })
})
