export interface Tip {
  category: string
  title: string
  content: string
}

export const TIPS: Tip[] = [
  // Formatting Tips
  {
    category: 'Formatting',
    title: 'Bold Text',
    content: 'Wrap text in double asterisks **like this** to make it bold. Works great for headings and important phrases!',
  },
  {
    category: 'Formatting',
    title: 'Italic Text',
    content: 'Use single asterisks *like this* for italic text. Perfect for emphasizing words and adding nuance to your writing.',
  },
  {
    category: 'Formatting',
    title: 'Bold and Italic',
    content: 'Combine them with ***triple asterisks*** to get bold and italic at the same time!',
  },
  {
    category: 'Formatting',
    title: 'Strikethrough',
    content: 'Use two tildes ~~like this~~ to strike through text. Great for marking completed tasks or showing changes.',
  },
  {
    category: 'Formatting',
    title: 'Inline Code',
    content: 'Wrap code snippets in single backticks `like this` to highlight them inline without creating a code block.',
  },
  {
    category: 'Formatting',
    title: 'Code Blocks',
    content: 'Use triple backticks ```language on separate lines to create syntax-highlighted code blocks. Language name is optional!',
  },
  {
    category: 'Formatting',
    title: 'Links',
    content: 'Create links with [text](url) syntax. For example: [Google](https://google.com)',
  },
  {
    category: 'Formatting',
    title: 'Headings',
    content: 'Use # for H1, ## for H2, ### for H3, and so on. Headings help organize your content and improve readability.',
  },
  {
    category: 'Formatting',
    title: 'Lists',
    content: 'Start lines with - (dash) or * (asterisk) to create bullet lists. Indent with spaces for nested items!',
  },
  {
    category: 'Formatting',
    title: 'Numbered Lists',
    content: 'Start lines with numbers like 1., 2., 3. to create ordered lists. Great for step-by-step instructions!',
  },
  {
    category: 'Formatting',
    title: 'Blockquotes',
    content: 'Start a line with > to create a blockquote. Perfect for highlighting important information or citations.',
  },
  {
    category: 'Formatting',
    title: 'Horizontal Lines',
    content: 'Use --- or *** on their own line to create a horizontal divider. Useful for separating sections!',
  },

  // Productivity Tips
  {
    category: 'Productivity',
    title: 'Keyboard Shortcuts',
    content: 'Master keyboard shortcuts like Ctrl/Cmd+S to export, Ctrl/Cmd+B for bold, and Ctrl/Cmd+I for italic to work faster!',
  },
  {
    category: 'Productivity',
    title: 'Real-Time Preview',
    content: 'Enable real-time preview in settings to see your formatted markdown as you type. Super helpful for checking formatting!',
  },
  {
    category: 'Productivity',
    title: 'Split View',
    content: 'Use split view mode to see your editor on the left and live preview on the right. Great for long documents!',
  },
  {
    category: 'Productivity',
    title: 'Separate Preview',
    content: 'Try separate preview mode to swap between editor and preview with a button. Useful when you need more screen space.',
  },
  {
    category: 'Productivity',
    title: 'Line Numbers',
    content: 'Enable line numbers in settings for easy reference when discussing code or coordinating edits with others.',
  },
  {
    category: 'Productivity',
    title: 'Spell Checking',
    content: 'Toggle spell checking in settings (Ctrl/Cmd+Alt+S) to catch typos and improve the quality of your writing.',
  },
  {
    category: 'Productivity',
    title: 'Export Your Notes',
    content: 'Use the Export button or press Ctrl/Cmd+S to download your notes as .md files. Perfect for sharing or backing up!',
  },
  {
    category: 'Productivity',
    title: 'Manual Preview Refresh',
    content: 'Disable real-time preview in settings for better performance, then use the refresh button to update manually when needed.',
  },
  {
    category: 'Productivity',
    title: 'Minimize Distractions',
    content: 'Use high performance mode in settings to reduce animations and visual effects. Great for older devices or focused work!',
  },
  {
    category: 'Productivity',
    title: 'Theme Customization',
    content: 'Try different themes (Light, Dark, System) in settings to find what works best for your eyes and environment.',
  },

  // Writing Tips
  {
    category: 'Writing',
    title: 'Structure Your Notes',
    content: 'Start with a main heading, then use subheadings to organize sections. Good structure makes notes easier to read later!',
  },
  {
    category: 'Writing',
    title: 'Use Lists Wisely',
    content: 'Break down complex ideas into bullet points. Lists are easier to scan and remember than long paragraphs.',
  },
  {
    category: 'Writing',
    title: 'Add Context',
    content: 'Include examples, code snippets, or links in your notes. Future you will appreciate the extra context!',
  },
  {
    category: 'Writing',
    title: 'Keep it Simple',
    content: 'Markdown is about simplicity. Focus on content, not formatting. The beauty is in clarity, not decoration.',
  },
  {
    category: 'Writing',
    title: 'Document Decisions',
    content: 'Use your notes to document why decisions were made, not just what was decided. This helps when revisiting later.',
  },
  {
    category: 'Writing',
    title: 'Use Consistent Formatting',
    content: 'Decide on your formatting style and stick to it. Consistency makes your notes look professional and polished.',
  },
  {
    category: 'Writing',
    title: 'Add Timestamps',
    content: 'Include dates or times in your notes, especially for project updates or learning logs. Helps track progress over time!',
  },
  {
    category: 'Writing',
    title: 'Link Related Notes',
    content: 'Reference other notes or external resources with links. Creates a web of knowledge you can navigate easily.',
  },

  // Editor Features
  {
    category: 'Features',
    title: 'Resizable Panes',
    content: 'Drag the separator between editor and preview to resize. Works on desktop and mobile devices!',
  },
  {
    category: 'Features',
    title: 'Word Count',
    content: 'Check the status bar for word count, character count, reading time, and file size. Useful for meeting targets!',
  },
  {
    category: 'Features',
    title: 'Current Position',
    content: 'The status bar shows your cursor position (line:column). Helpful for navigating large documents!',
  },
  {
    category: 'Features',
    title: 'Syntax Highlighting',
    content: 'Code blocks are syntax-highlighted based on the language you specify. Makes code much more readable!',
  },
  {
    category: 'Features',
    title: 'Touch Support',
    content: 'MD-Notepad works great on touchscreen devices. Resize panes with your finger for mobile editing!',
  },
  {
    category: 'Features',
    title: 'Responsive Design',
    content: 'The interface adapts to your screen size. Works beautifully on phones, tablets, and desktops.',
  },
  {
    category: 'Features',
    title: 'Minimal Interface',
    content: 'MD-Notepad has no distracting toolbars or sidebars. Just you and your content. Perfect for focused writing!',
  },
  {
    category: 'Features',
    title: 'Local Storage',
    content: 'Your settings are saved locally in your browser. They persist even after closing and reopening the app!',
  },

  // Pro Tips
  {
    category: 'Pro Tips',
    title: 'Markdown Tables',
    content: 'Create tables with pipes (|) and dashes (-). Example: | Header | Header |\n|--------|--------|\n| Cell | Cell |',
  },
  {
    category: 'Pro Tips',
    title: 'Escape Special Characters',
    content: 'Use backslash (\\) before special characters like \\*, \\#, \\[, etc. to display them literally.',
  },
  {
    category: 'Pro Tips',
    title: 'HTML in Markdown',
    content: 'Most markdown renderers support inline HTML. You can use <mark>tags</mark> for highlighting if needed!',
  },
  {
    category: 'Pro Tips',
    title: 'Task Lists',
    content: 'Create checkboxes with - [ ] or - [x]. Some renderers support interactive task lists!',
  },
  {
    category: 'Pro Tips',
    title: 'Footnotes',
    content: 'Use [^1] in text and [^1]: Note text at the bottom for footnotes. Creates automatic references!',
  },
  {
    category: 'Pro Tips',
    title: 'Definition Lists',
    content: 'Some markdown flavors support definition lists: Term\n: Definition\nGreat for glossaries!',
  },
  {
    category: 'Pro Tips',
    title: 'CommonMark Standard',
    content: 'MD-Notepad follows CommonMark, the standardized markdown specification. This ensures compatibility everywhere!',
  },
  {
    category: 'Pro Tips',
    title: 'Quick Exports',
    content: 'Export multiple notes and use a folder structure for organization. Build your personal knowledge base!',
  },

  // General Tips
  {
    category: 'General',
    title: 'Daily Notes',
    content: 'Start a daily note-taking habit. Even 5 minutes of reflection can improve your memory and productivity!',
  },
  {
    category: 'General',
    title: 'Code Snippets',
    content: 'Save useful code snippets as markdown notes. No need for a separate snippet manager!',
  },
  {
    category: 'General',
    title: 'Learning Log',
    content: 'Create a learning log to document what you learn. Helps reinforce knowledge and track growth!',
  },
  {
    category: 'General',
    title: 'Meeting Notes',
    content: 'Use MD-Notepad for meeting notes. Export and share as .md files with your team!',
  },
  {
    category: 'General',
    title: 'Project Planning',
    content: 'Plan projects with markdown. Use lists for tasks, code blocks for examples, and links for resources.',
  },
  {
    category: 'General',
    title: 'Documentation',
    content: 'Write project documentation in markdown. It renders on GitHub, GitLab, and most documentation platforms!',
  },
  {
    category: 'General',
    title: 'Blog Writing',
    content: 'Write blog posts in MD-Notepad. Export as .md and import to popular blogging platforms.',
  },
  {
    category: 'General',
    title: 'Personal Wiki',
    content: 'Build a personal wiki by linking related markdown notes. Great for knowledge management!',
  },
]

export function getRandomTip(): Tip {
  return TIPS[Math.floor(Math.random() * TIPS.length)]
}

export function getRandomTipExcluding(excludedTip: Tip): Tip {
  const available = TIPS.filter(t => t !== excludedTip)
  return available[Math.floor(Math.random() * available.length)]
}
