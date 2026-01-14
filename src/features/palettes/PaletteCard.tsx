import { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Palette, AppMode } from '../../types/palette';
import { getNormalizedColors } from '../../lib/color/parseColor';

interface PaletteCardProps {
  palette: Palette;
  mode: AppMode;
  onClick: () => void;
  onDelete?: () => void;
}

export function PaletteCard({ palette, mode, onClick, onDelete }: PaletteCardProps) {
  const colors = getNormalizedColors(palette.colors);
  const visibleColors = colors.slice(0, 8);
  const swatchSlots = Array.from({ length: 8 }, (_, i) => visibleColors[i]);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  
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

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value.toUpperCase());
    } catch {
      // Clipboard might be unavailable (permissions); fail silently
    }
  };

  const handleClick = () => {
    if (mode === 'view') onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mode !== 'view') return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const updateTilt = (clientX: number, clientY: number) => {
    const el = tiltRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const dx = clamp01(px) - 0.5;
    const dy = clamp01(py) - 0.5;

    const maxDeg = 7; // subtle
    const rx = (-dy * maxDeg).toFixed(2);
    const ry = (dx * maxDeg).toFixed(2);

    el.style.setProperty('--rx', `${rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode !== 'view' || isDragging) return;
    if (!tiltRef.current) return;

    const x = e.clientX;
    const y = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updateTilt(x, y));
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--rx', `0deg`);
    el.style.setProperty('--ry', `0deg`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${mode === 'edit' ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'z-10' : ''}`}
      {...(mode === 'edit' ? { ...attributes, ...listeners } : {})}
    >
      <div
        ref={tiltRef}
        className={`
          cv-card ${mode === 'view' ? 'cv-tilt' : ''} relative overflow-hidden
          p-4 sm:p-5
          min-h-[280px]
          flex flex-col
          ${mode === 'view' ? 'cursor-pointer' : ''}
          ${isDragging ? 'opacity-80' : ''}
        `}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role={mode === 'view' ? 'button' : undefined}
        tabIndex={mode === 'view' ? 0 : -1}
        aria-label={mode === 'view' ? `Open preview for ${palette.name}` : undefined}
      >
        {/* Swatch grid (fixed 2 rows x 4 columns so card height never changes) */}
        <div className="grid grid-cols-4 grid-rows-2 gap-3">
          {swatchSlots.map((color, index) => {
            if (!color) {
              return (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${palette.id}-empty-${index}`}
                  className="aspect-square w-full opacity-0"
                  aria-hidden="true"
                />
              );
            }

            return (
              <button
                key={`${palette.id}-${color}-${index}`}
                type="button"
                className="cv-swatch aspect-square w-full relative"
                style={{ backgroundColor: color }}
                disabled={mode === 'edit'}
                onClick={(e) => {
                  e.stopPropagation();
                  void copyToClipboard(color);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                title={mode === 'edit' ? undefined : `Click to copy: ${color.toUpperCase()}`}
                aria-label={mode === 'edit' ? undefined : `Copy ${color.toUpperCase()}`}
              />
            );
          })}
        </div>

        {/* Divider + Footer (pushed lower) */}
        <div className="mt-auto pt-6" aria-hidden="true">
          <div
            className="h-px w-full"
            style={{ backgroundColor: 'var(--color-border-strong)', opacity: 0.35 }}
          />

          <div className={`pt-3 flex items-center ${mode === 'edit' ? 'justify-start' : 'justify-end'}`}>
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDelete}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-full transition-transform duration-150 hover:scale-105"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.10)',
                  border: '1px solid rgba(239, 68, 68, 0.22)',
                  color: '#ef4444',
                }}
                title="Delete palette"
                aria-label="Delete palette"
              >
                <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <div
              className={`text-sm font-semibold tracking-tight ${mode === 'edit' ? 'ml-2' : ''}`}
              style={{ color: '#000000' }}
            >
              {palette.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
