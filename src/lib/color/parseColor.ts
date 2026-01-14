import { parse, formatHex, formatRgb } from 'culori';
import type { ColorEntry } from '../../types/palette';

/**
 * Extract the raw color string from a ColorEntry
 */
export function getColorValue(entry: ColorEntry): string {
  return typeof entry === 'string' ? entry : entry.value;
}

/**
 * Get the label from a ColorEntry (if any)
 */
export function getColorLabel(entry: ColorEntry): string | undefined {
  return typeof entry === 'string' ? undefined : entry.label;
}

/**
 * Parse and validate a color string
 * Returns the parsed color object or null if invalid
 */
export function parseColor(colorStr: string): ReturnType<typeof parse> {
  try {
    return parse(colorStr);
  } catch {
    return undefined;
  }
}

/**
 * Check if a color string is valid
 */
export function isValidColor(colorStr: string): boolean {
  const parsed = parseColor(colorStr);
  return parsed !== undefined;
}

/**
 * Convert any valid color to hex format
 * Returns null if the color is invalid
 */
export function toHex(colorStr: string): string | null {
  const parsed = parseColor(colorStr);
  if (!parsed) return null;
  return formatHex(parsed);
}

/**
 * Convert any valid color to RGB format
 * Returns null if the color is invalid
 */
export function toRgb(colorStr: string): string | null {
  const parsed = parseColor(colorStr);
  if (!parsed) return null;
  return formatRgb(parsed);
}

/**
 * Normalize a ColorEntry to hex for consistent usage
 */
export function normalizeColor(entry: ColorEntry): string {
  const value = getColorValue(entry);
  return toHex(value) || value;
}

/**
 * Get an array of normalized hex colors from a palette's colors
 */
export function getNormalizedColors(colors: ColorEntry[]): string[] {
  return colors.map(normalizeColor);
}

/**
 * Calculate relative luminance of a color (for contrast calculations)
 */
export function getLuminance(colorStr: string): number {
  const parsed = parseColor(colorStr);
  if (!parsed) return 0;
  
  // Convert to sRGB values
  const r = 'r' in parsed ? (parsed.r ?? 0) : 0;
  const g = 'g' in parsed ? (parsed.g ?? 0) : 0;
  const b = 'b' in parsed ? (parsed.b ?? 0) : 0;
  
  // Apply gamma correction
  const toLinear = (c: number) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Determine if text on this color should be light or dark
 */
export function shouldUseLightText(colorStr: string): boolean {
  return getLuminance(colorStr) < 0.5;
}
