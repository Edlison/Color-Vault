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
   * Brand / meta
   */
  site: {
    // Document title shown in browser tab
    pageTitle: 'Color Vault | Academic Color Palettes',
    // Favicon link in <head>
    favicon: {
      // Keep this in sync with header logo for best branding consistency.
      // To disable, set href to an empty string.
      href: '/logo.svg',
      type: 'image/svg+xml',
    },
  },

  header: {
    title: 'Color Vault',
    logo: {
      // Use the same SVG file as favicon by default.
      kind: 'image' as 'mark' | 'image',
      // When kind === 'image'
      imageSrc: '/logo.svg',
      imageAlt: 'Logo',
    },
  },

  footer: {
    copyright: '© 2026 Color Vault. All rights reserved.',
  },

  /**
   * Radii (in px)
   * Note: "shaper" -> use smaller radius for swatches.
   */
  radii: {
    card: 20,
    swatch: 12,
  },

  swatches: {
    /**
     * Width / height ratio.
     * 1 = square, >1 = wider (appears "longer"), <1 = taller.
     */
    aspectRatio: 1,
  },

  legend: {
    /**
     * Legend pill width as percent of the legend container.
     * 12.5% == exactly 1/8 width. Keep <= 12.5 to avoid overlap when showing 8.
     */
    pillWidthPercent: 8,
  },

  layout: {
    // Slightly taller cards (requested)
    cardMinHeightPx: 300,
    cardMinWidthPx: 320,
  },

  /**
   * Hover / elevation
   */
  hover: {
    // Smaller lift than before (was ~6px)
    liftPx: 1,

    // Card tilt intensity on hover (degrees)
    tiltMaxDeg: 4,
  },
} as const;

