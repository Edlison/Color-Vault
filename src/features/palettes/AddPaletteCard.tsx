interface AddPaletteCardProps {
  onClick: () => void;
}

export function AddPaletteCard({ onClick }: AddPaletteCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        glass-strong rounded-2xl overflow-hidden
        transition-all duration-300 ease-out
        cursor-pointer hover:-translate-y-1 hover:shadow-xl
        flex flex-col items-center justify-center
        min-h-[180px]
        border-2 border-dashed
      "
      style={{ 
        borderColor: 'var(--color-border-strong)'
      }}
    >
      <div 
        className="p-4 rounded-full mb-3"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <svg 
          className="w-8 h-8" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          style={{ color: 'var(--color-accent)' }}
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
