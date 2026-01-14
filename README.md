# Color-Vault

A minimal, elegant color palette manager designed for scientific plotting and data visualization.

![Color-Vault](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss)

## Features

- **Glassmorphism UI** — Modern glass-effect cards with blur and transparency
- **Scientific Palettes** — Pre-loaded with popular palettes (Okabe-Ito, Viridis, ColorBrewer, Nature, Science journals)
- **Chart Preview** — See how your palette looks in Line, Bar, and Radar charts (ECharts)
- **Multi-format Colors** — Supports HEX, RGB, HSL, and CSS named colors
- **Drag & Drop Reordering** — Easily organize your palettes
- **Dark/Light Theme** — System-aware theme switching
- **Local Persistence** — Save custom palettes to localStorage (with consent)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`.

## Usage

### Browsing Palettes
- Click any palette card to preview it with sample charts
- Click on individual colors in the preview to copy the hex code

### Editing Palettes
1. Click the **Settings** button (gear icon) in the header
2. **Drag** cards to reorder them
3. Click the **trash** icon to delete a palette
4. Click **"+ Add New Palette"** to create a custom palette
5. Click the **checkmark** to save and exit edit mode

### Adding Colors
When adding a new palette, you can use any of these formats:
- `#RGB` or `#RRGGBB` or `#RRGGBBAA`
- `rgb(R, G, B)` or `rgba(R, G, B, A)`
- `hsl(H, S%, L%)` or `hsla(H, S%, L%, A)`
- CSS named colors (e.g., `coral`, `steelblue`)

## Data Format

Color palettes are stored in `public/palettes.json`:

```json
{
  "version": 1,
  "palettes": [
    {
      "id": "unique_id",
      "name": "Palette Name",
      "colors": [
        "#E69F00",
        "rgb(86, 180, 233)",
        { "value": "hsl(0 0% 20%)", "label": "Dark" }
      ],
      "tags": ["paper", "colorblind"],
      "source": "builtin"
    }
  ]
}
```

### Color Entry Types
- **String**: Simple color value (`"#E69F00"`)
- **Object**: Color with optional label (`{ "value": "#E69F00", "label": "Orange" }`)

### Palette Fields
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `colors` | array | Array of color entries |
| `tags` | string[] | Optional categorization tags |
| `source` | `"builtin"` \| `"user"` | Origin of the palette |

## Storage

- **Cookie** (`cv_consent`): Stores consent status
- **localStorage** (`cv_palettes_v1`): User's saved palettes (only after consent)
- **localStorage** (`cv_theme`): Theme preference (light/dark/system)

## Tech Stack

- [Vite](https://vitejs.dev/) — Build tool
- [React 18](https://react.dev/) — UI framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [Radix UI](https://www.radix-ui.com/) — Accessible dialog/tabs components
- [dnd-kit](https://dndkit.com/) — Drag and drop
- [ECharts](https://echarts.apache.org/) — Chart visualization
- [culori](https://culorijs.org/) — Color parsing and manipulation

## License

MIT
