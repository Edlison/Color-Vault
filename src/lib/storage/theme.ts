import type { Theme } from '../../types/palette';

const THEME_STORAGE_KEY = 'cv_theme';

/**
 * Get the stored theme preference
 */
export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage might not be available
  }
  return 'system';
}

/**
 * Save theme preference to localStorage
 */
export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage might not be available
  }
}

/**
 * Get the resolved theme (considering system preference)
 */
export function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

/**
 * Apply theme to the document
 */
export function applyTheme(theme: Theme): void {
  const resolved = getResolvedTheme(theme);
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(resolved);
}
