import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Palette } from '../../types/palette';
import { isValidColor, toHex } from '../../lib/color/parseColor';

interface EditPaletteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (palette: Palette) => void;
  existingPalette?: Palette;
}

export function EditPaletteModal({ 
  open, 
  onOpenChange, 
  onSave, 
  existingPalette 
}: EditPaletteModalProps) {
  const [name, setName] = useState('');
  const [colors, setColors] = useState<string[]>(['']);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (existingPalette) {
        setName(existingPalette.name);
        setColors(existingPalette.colors.map(c => 
          typeof c === 'string' ? c : c.value
        ));
      } else {
        setName('');
        setColors(['#E69F00', '#56B4E9', '#009E73']);
      }
      setError(null);
    }
  }, [open, existingPalette]);

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const addColor = () => {
    setColors([...colors, '']);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    // Validate name
    if (!name.trim()) {
      setError('Please enter a palette name');
      return;
    }

    // Validate and normalize colors
    const validColors = colors.filter(c => c.trim() !== '');
    if (validColors.length === 0) {
      setError('Please add at least one color');
      return;
    }

    const invalidColor = validColors.find(c => !isValidColor(c));
    if (invalidColor) {
      setError(`Invalid color: "${invalidColor}". Please use hex, rgb(), or hsl() format.`);
      return;
    }

    const normalizedColors = validColors.map(c => toHex(c) || c);

    const palette: Palette = {
      id: existingPalette?.id || uuidv4(),
      name: name.trim(),
      colors: normalizedColors,
      tags: [],
      source: 'user',
    };

    onSave(palette);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in z-50" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-full max-w-md max-h-[85vh] overflow-auto
                     glass-strong rounded-2xl p-6 animate-scale-in z-50"
        >
          <Dialog.Title 
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            {existingPalette ? 'Edit Palette' : 'Add New Palette'}
          </Dialog.Title>

          <div className="space-y-4">
            {/* Palette Name */}
            <div>
              <label 
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Palette Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Custom Palette"
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--glass-border)'
                }}
              />
            </div>

            {/* Colors */}
            <div>
              <label 
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Colors
              </label>
              <div className="space-y-2">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {/* Color preview */}
                    <div 
                      className="w-10 h-10 rounded-lg border flex-shrink-0"
                      style={{ 
                        backgroundColor: isValidColor(color) ? color : 'transparent',
                        borderColor: 'var(--glass-border)'
                      }}
                    />
                    {/* Color input */}
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      placeholder="#RRGGBB or rgb() or hsl()"
                      className="flex-1 px-3 py-2 rounded-xl text-sm font-mono"
                      style={{ 
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        border: `1px solid ${isValidColor(color) || color === '' ? 'var(--glass-border)' : '#ef4444'}`
                      }}
                    />
                    {/* Remove button */}
                    <button
                      onClick={() => removeColor(index)}
                      disabled={colors.length <= 1}
                      className="p-2 rounded-lg transition-opacity disabled:opacity-30"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addColor}
                className="mt-2 px-3 py-1.5 text-sm rounded-lg transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-accent)'
                }}
              >
                + Add Color
              </button>
            </div>

            {/* Preview Strip */}
            {colors.some(c => isValidColor(c)) && (
              <div>
                <label 
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Preview
                </label>
                <div className="h-12 rounded-xl overflow-hidden flex">
                  {colors.filter(isValidColor).map((color, index) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: 'var(--color-accent)',
                color: 'white'
              }}
            >
              {existingPalette ? 'Save Changes' : 'Add Palette'}
            </button>
          </div>

          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
