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
        flex flex-col items-center justify-center
        min-h-[280px]
        p-4 sm:p-5
        border-2 border-dashed
      "
      style={{
        borderColor: 'var(--color-border-strong)',
        backgroundColor: 'var(--glass-bg)',
      }}
    >
      <div 
        className="p-4 rounded-full mb-3"
        style={{ backgroundColor: 'var(--color-text)' }}
      >
        <svg 
          className="w-8 h-8" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          style={{ color: 'var(--color-bg)' }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </div>
      <span 
        className="text-sm font-medium"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Add New Palette
      </span>
    </button>
  );
}
