export const PRESET_ACCENT_COLORS = ['red', 'blue', 'green', 'purple', 'orange'] as const

export type PresetAccentColor = (typeof PRESET_ACCENT_COLORS)[number]

export type AccentColor = PresetAccentColor | 'custom'

export const DEFAULT_CUSTOM_ACCENT = '#4a9eff'

export function isPresetAccentColor(value: string): value is PresetAccentColor {
  return (PRESET_ACCENT_COLORS as readonly string[]).includes(value)
}

export function normalizeHexColor(input: string): string | null {
  const trimmed = input.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase()
  }
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1]
    const g = trimmed[2]
    const b = trimmed[3]
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  return null
}

export function darkenHexColor(hex: string, amount = 0.3): string {
  const normalized = normalizeHexColor(hex) ?? DEFAULT_CUSTOM_ACCENT
  const r = parseInt(normalized.slice(1, 3), 16)
  const g = parseInt(normalized.slice(3, 5), 16)
  const b = parseInt(normalized.slice(5, 7), 16)
  const factor = 1 - amount
  const channel = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n * factor)))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

export function parseAccentColor(value: unknown): AccentColor {
  if (typeof value === 'string' && (isPresetAccentColor(value) || value === 'custom')) {
    return value
  }
  return 'blue'
}

export function parseCustomAccentColor(value: unknown): string {
  if (typeof value === 'string') {
    return normalizeHexColor(value) ?? DEFAULT_CUSTOM_ACCENT
  }
  return DEFAULT_CUSTOM_ACCENT
}
