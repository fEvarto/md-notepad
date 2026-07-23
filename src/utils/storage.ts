// Safe localStorage helpers that never throw (private mode, quota, etc.)

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Silently fail if localStorage is unavailable (quota exceeded, etc.)
  }
}

export function readJSON<T>(key: string, onError?: (error: unknown) => void): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch (error) {
    onError?.(error)
  }
  return null
}

export function writeJSON(key: string, value: unknown, onError?: (error: unknown) => void): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    onError?.(error)
  }
}
