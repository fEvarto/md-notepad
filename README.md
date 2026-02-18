# MD-Notepad

MD-Notepad is a lightweight, desktop-friendly Markdown editor built with React + Vite + TypeScript. It provides a focused writing experience with a full-window editor, formatting toolbar, live preview, touch-friendly resizing, and quick export to Markdown files.

## Features

- Full-window Markdown editor with monospace input and a glassmorphic UI.
- Simple formatting toolbar: Bold, Italic, Headings, Lists, Inline/Block code.
- Live preview rendered with `react-markdown`.
- Export current note as a `.md` file (also bound to `Ctrl/Cmd+S`).
- Resizable editor/preview split — mouse and touch dragging supported; mobile layout stacks editor and preview vertically.
- Accessible Info modal with keyboard shortcuts and quick tips.

## Usage

- Type Markdown in the left editor pane (or full window on mobile).
- Use the toolbar buttons to apply common formatting to the selected text.
- The right pane shows a live preview. On narrow screens the preview appears below the editor.
- Drag the separator to resize the editor and preview. Touch-dragging is supported on mobile/tablets.
- Click `Export` or press `Ctrl/Cmd+S` to download the current contents as an `.md` file. Specify the filename in the input next to Export.
- Open the Info dialog (toolbar `i`) for shortcuts, tips, and links.

## Accessibility & Cross-browser

- Keyboard navigation: toolbar buttons are focusable, modal supports `Esc` to close, and `Ctrl/Cmd+S` exports the file.
- The UI uses `backdrop-filter` for the glass effect — modern browsers support it; fallbacks are non-blurred semi-transparent backgrounds.
- The layout is responsive and includes mobile-friendly touch interactions. Tables, images, and long content inside the preview are constrained to avoid layout shifts.

## Resources

- Markdown reference: https://commonmark.org/help/

## Contributing

Feel free to open issues or PRs. Suggested improvements:

## License

MIT 2026 fevarto

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
