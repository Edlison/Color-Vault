/** 
 * A single color entry - can be a simple string or an object with label
 */
export type ColorEntry = string | { value: string; label?: string };

/**
 * A color palette containing multiple colors
 */
export interface Palette {
  id: string;
  name: string;
  colors: ColorEntry[];
  tags?: string[];
  source: 'builtin' | 'user';
}

/**
 * The structure of palettes.json
 */
export interface PalettesData {
  version: number;
  palettes: Palette[];
}

/**
 * Application mode
 */
export type AppMode = 'view' | 'edit';

/**
 * Theme options
 */
export type Theme = 'light' | 'dark' | 'system';
