export interface PatchNote {
  version: string
  title: string
  date: string
  defaultOpen?: boolean
  entries: PatchEntry[]
}

export interface PatchEntry {
  badge: 'major' | 'new' | 'improved' | 'reworked'
  title: string
  description: string
}

export const patchNotes: PatchNote[] = [
  {
    version: '1.4.0',
    title: 'The Accent Update',
    date: 'July 2026, Current',
    defaultOpen: true,
    entries: [
      {
        badge: 'major',
        title: 'Accent color:',
        description: 'added an appearance settings called accent color. It allows to choose secondary color for majority of app styles'
      },
      {
        badge: 'new',
        title: 'New Wrapping:',
        description: 'changed wrapping mode for some style buttons'
      },
      {
        badge: 'new',
        title: 'More icons:',
        description: 'added new icons for buttons, settings and info page categories for better visual distinction and aesthetics'
      },
      {
        badge: 'improved',
        title: 'Session Transition:',
        description: 'now file content are saved between sessions'
      },
      {
        badge: 'improved',
        title: 'Tweaks:',
        description: 'Slightly tweaked some styles and fixed some minor bugs for better user experience'
      }
    ]
  },
  {
    version: '1.3.0',
    title: 'The Key Update',
    date: 'June 2026',
    entries: [
      {
        badge: 'major',
        title: 'More hotkeys:',
        description: 'Added all major hotkeys for toolbar actions and export functionality. Details is shown in settings tab of this modal'
      },
      {
        badge: 'new',
        title: 'Toolbar tooltips:',
        description: 'Added tooltips for all toolbar buttons with hotkey hints for better discoverability of features and hotkeys'
      },
      {
        badge: 'reworked',
        title: 'Settings grouping:',
        description: 'Improved settings organization by grouping them into categories and adding descriptions for better usability'
      },
      {
        badge: 'reworked',
        title: 'New tips page:',
        description: 'Improved tips page: now it provides random tip for more comfortable app usage and better discoverability of features for new users'
      },
      {
        badge: 'improved',
        title: 'Tweaks:',
        description: 'Slightly tweaked some styles and fixed some minor bugs for better user experience'
      }
    ]
  },
  {
    version: '1.2.0',
    title: 'The Spotlight Update',
    date: 'May 2026',
    entries: [
      {
        badge: 'major',
        title: 'File info:',
        description: 'Added information about the file that are currently in editing: word count, character count, estimated reading time, current line and column number and estimated file size'
      },
      {
        badge: 'new',
        title: 'Vocabulary checking:',
        description: 'Added setting that enables vocabulary spell-checking in editor'
      },
      {
        badge: 'new',
        title: 'Line number column:',
        description: 'Added a settings that enable a line number column like it\'s a code editor'
      },
      {
        badge: 'improved',
        title: 'Mobile experience:',
        description: 'Greatly improved experience for mobile users with previously added settings'
      },
      {
        badge: 'improved',
        title: 'Code highlighting:',
        description: 'Added highlights in the code blocks depending upon the programming language for better readability and aesthetics'
      },
      {
        badge: 'improved',
        title: 'Tweaks:',
        description: 'Slightly tweaked some styles and fixed some minor bugs for better user experience'
      }
    ]
  },
  {
    version: '1.1.0',
    title: 'Keep Calm and Have a Fresh View',
    date: 'April 2026',
    entries: [
      {
        badge: 'major',
        title: 'Separate preview:',
        description: 'Added setting that changes preview to toggleable separate window for better accessibility and support for assistive technologies'
      },
      {
        badge: 'major',
        title: 'Disable live preview:',
        description: 'Added settings that disables real-time preview for performance improvements on slower devices'
      },
      {
        badge: 'improved',
        title: 'Default settings:',
        description: 'Added default settings for new users and keep saved ones on each user\'s session'
      },
      {
        badge: 'improved',
        title: 'System theme:',
        description: 'Added system theme that repeats device\'s theme preference and applies it on app load'
      },
      {
        badge: 'improved',
        title: 'Tweaks:',
        description: 'Slightly tweaked some styles and fixed some minor bugs for better user experience'
      }
    ]
  },
  {
    version: '1.0.0',
    title: 'The Accessibility Update',
    date: 'March 2026',
    entries: [
      {
        badge: 'major',
        title: 'The Great Modal Split:',
        description: 'Modal window has been split into four distinct tabs for better organization and easier navigation'
      },
      {
        badge: 'major',
        title: 'Settings:',
        description: 'Added settings that improves accessibility and performance, including a new light theme, high performance mode, and visual customization options'
      },
      {
        badge: 'new',
        title: 'Patch notes:',
        description: 'Added patch for better informing users about new features and improvements in each release. Info lies in the "What\'s New" tab of the info modal'
      },
      {
        badge: 'new',
        title: 'Visual Customization:',
        description: 'Toggle backdrop blur and shadow effects'
      },
      {
        badge: 'improved',
        title: 'Code Organization:',
        description: 'Software architecture split into focused module files for better maintenance'
      },
      {
        badge: 'improved',
        title: 'Style changes:',
        description: 'Some Markdown styles have been tweaked for better readability and aesthetics, including headings, code blocks, blockquotes, and tables'
      }
    ]
  },
  {
    version: '0.1.0',
    title: 'Initial Release',
    date: 'February 2026',
    entries: [
      {
        badge: 'new',
        title: 'Live Preview:',
        description: 'Real-time Markdown rendering'
      },
      {
        badge: 'new',
        title: 'Resizable Panes:',
        description: 'Drag separator to adjust editor/preview sizes'
      },
      {
        badge: 'new',
        title: 'Touch Support:',
        description: 'Mobile-friendly pane resizing'
      },
      {
        badge: 'new',
        title: 'Export Functionality:',
        description: 'Download notes as .md files'
      },
      {
        badge: 'new',
        title: 'Responsive Design:',
        description: 'Works on desktop and mobile devices'
      }
    ]
  }
]
