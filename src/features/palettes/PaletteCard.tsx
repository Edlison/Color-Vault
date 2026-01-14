import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Palette, AppMode } from '../../types/palette';
import { getNormalizedColors, shouldUseLightText } from '../../lib/color/parseColor';

interface PaletteCardProps {
  palette: Palette;
  mode: AppMode;
  onClick: () => void;
  onDelete?: () => void;
}

export function PaletteCard({ palette, mode, onClick, onDelete }: PaletteCardProps) {
  const colors = getNormalizedColors(palette.colors);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: palette.id,
    disabled: mode !== 'edit'
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    if (mode === 'view') {
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        glass-strong rounded-2xl overflow-hidden
        transition-all duration-300 ease-out
        ${mode === 'view' 
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' 
          : 'cursor-grab active:cursor-grabbing'
        }
        ${isDragging ? 'shadow-2xl z-10' : ''}
      `}
      onClick={handleClick}
      {...(mode === 'edit' ? { ...attributes, ...listeners } : {})}
    >
      {/* Color Preview Strip */}
      <div className="h-20 flex">
        {colors.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className="flex-1 relative group"
            style={{ backgroundColor: color }}
          >
            {/* Color code tooltip on hover */}
            <div 
              className={`
                absolute inset-x-0 bottom-0 py-1 text-center text-xs font-mono
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                ${shouldUseLightText(color) ? 'text-white/90' : 'text-black/70'}
              `}
              style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            >
              {color.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 
              className="font-medium text-base"
              style={{ color: 'var(--color-text)' }}
            >
              {palette.name}
            </h3>
            <p 
              className="text-sm mt-0.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {colors.length} colors • {palette.source === 'builtin' ? 'Built-in' : 'Custom'}
            </p>
          </div>

          {mode === 'edit' && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444'
              }}
              title="Delete palette"
              aria-label="Delete palette"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Tags */}
        {palette.tags && palette.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {palette.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
