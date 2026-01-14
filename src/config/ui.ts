import type { Theme } from '../types/palette';

export const UI_CONFIG = {
  /**
   * Feature flags
   */
  features: {
    // User request: keep theme control in config and currently disable it.
    themeToggleEnabled: false,
  },

  /**
   * Theme behavior (only relevant if themeToggleEnabled = true)
   */
  theme: {
    defaultTheme: 'light' as Theme,
  },

  /**
   * Radii (in px)
   * Note: "角度更尖一些" -> use smaller radius for swatches.
   */
  radii: {
    card: 20,
    swatch: 12,
  },

  /**
   * Hover / elevation
   */
  hover: {
    // Smaller lift than before (was ~6px)
    liftPx: 4,
  },
} as const;

