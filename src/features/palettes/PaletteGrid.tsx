import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import type { Palette, AppMode } from '../../types/palette';
import { PaletteCard } from './PaletteCard';
import { AddPaletteCard } from './AddPaletteCard';

interface PaletteGridProps {
  palettes: Palette[];
  mode: AppMode;
  onPaletteClick: (palette: Palette) => void;
  onPaletteDelete: (id: string) => void;
  onPalettesReorder: (palettes: Palette[]) => void;
  onAddClick: () => void;
}

export function PaletteGrid({
  palettes,
  mode,
  onPaletteClick,
  onPaletteDelete,
  onPalettesReorder,
  onAddClick,
}: PaletteGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = palettes.findIndex((p) => p.id === active.id);
      const newIndex = palettes.findIndex((p) => p.id === over.id);
      const newPalettes = arrayMove(palettes, oldIndex, newIndex);
      onPalettesReorder(newPalettes);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={palettes.map((p) => p.id)} strategy={rectSortingStrategy}>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(var(--cv-card-min-w), 1fr))',
          }}
        >
          {palettes.map((palette, index) => (
            <div 
              key={palette.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PaletteCard
                palette={palette}
                mode={mode}
                onClick={() => onPaletteClick(palette)}
                onDelete={() => onPaletteDelete(palette.id)}
              />
            </div>
          ))}
          
          {mode === 'edit' && (
            <div 
              className="animate-slide-up"
              style={{ animationDelay: `${palettes.length * 50}ms` }}
            >
              <AddPaletteCard onClick={onAddClick} />
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
