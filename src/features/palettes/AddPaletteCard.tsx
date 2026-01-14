interface AddPaletteCardProps {
  onClick: () => void;
}

export function AddPaletteCard({ onClick }: AddPaletteCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        cv-card cv-tilt overflow-hidden
        transition-all duration-200
        cursor-pointer
        flex flex-col
        min-h-[var(--cv-card-min-h)]
        p-4 sm:p-5
        border-2 border-dashed
      "
      style={{
        borderColor: 'var(--color-border-strong)',
        backgroundColor: 'var(--glass-bg)',
      }}
    >
      {/* Center content area (keeps background size consistent with normal cards) */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-3" style={{ backgroundColor: 'var(--color-text)' }}>
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: 'var(--color-bg)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Divider + footer label (matches normal card structure) */}
      <div className="pt-5" aria-hidden="true">
        <div className="h-px w-full" style={{ backgroundColor: 'var(--color-border-strong)', opacity: 0.35 }} />
        <div className="pt-3 flex items-center justify-end">
          <div className="text-sm font-semibold tracking-tight" style={{ color: '#000000' }}>
            Add New Palette
          </div>
        </div>
      </div>
    </button>
  );
}
