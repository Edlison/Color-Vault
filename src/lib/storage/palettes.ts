import type { Palette, PalettesData } from '../../types/palette';
import { hasConsent } from './consent';

const PALETTES_STORAGE_KEY = 'cv_palettes_v1';

/**
 * Fetch the builtin palettes from public/palettes.json
 */
export async function fetchBuiltinPalettes(): Promise<Palette[]> {
  try {
    // Force a fresh read (avoid stale cached palettes after rebuild/deploy).
    const response = await fetch('/palettes.json', { cache: 'no-store' });
    if (!response.ok) {
      console.warn('Failed to fetch palettes.json:', response.status);
      return [];
    }
    const data: PalettesData = await response.json();
    return data.palettes || [];
  } catch (error) {
    console.error('Error loading builtin palettes:', error);
    return [];
  }
}

/**
 * Load user palettes from localStorage
 * Returns null if no data exists
 */
export function loadUserPalettes(): Palette[] | null {
  try {
    const stored = localStorage.getItem(PALETTES_STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    if (Array.isArray(data)) {
      return data as Palette[];
    }
    return null;
  } catch (error) {
    console.error('Error loading user palettes:', error);
    return null;
  }
}

/**
 * Save palettes to localStorage
 * Only works if user has given consent
 * Returns true if save was successful
 */
export function saveUserPalettes(palettes: Palette[]): boolean {
  if (!hasConsent()) {
    console.warn('Cannot save palettes: consent not given');
    return false;
  }
  
  try {
    localStorage.setItem(PALETTES_STORAGE_KEY, JSON.stringify(palettes));
    return true;
  } catch (error) {
    console.error('Error saving palettes:', error);
    return false;
  }
}

/**
 * Clear user palettes from localStorage
 */
export function clearUserPalettes(): void {
  try {
    localStorage.removeItem(PALETTES_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing palettes:', error);
  }
}

/**
 * Merge builtin and user palettes
 * If user has saved data, use it entirely (it's a full snapshot)
 * Otherwise, use builtin palettes
 */
export function mergePalettes(builtin: Palette[], user: Palette[] | null): Palette[] {
  if (user && user.length > 0) {
    return user;
  }
  return builtin;
}
