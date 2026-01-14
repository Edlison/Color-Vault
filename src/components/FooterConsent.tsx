interface FooterConsentProps {
  hasConsent: boolean;
  onAccept: () => void;
}

export function FooterConsent({ hasConsent, onAccept }: FooterConsentProps) {
  if (hasConsent) {
    return null;
  }

  return (
    <footer className="glass fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                style={{ color: 'var(--color-accent)' }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              We use local storage to save your custom color palettes. 
              Accept to enable the save feature.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onAccept}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: 'var(--color-accent)',
                color: 'white'
              }}
            >
              Accept & Enable Save
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
