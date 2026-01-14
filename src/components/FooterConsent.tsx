interface FooterConsentProps {
  hasConsent: boolean;
  onAccept: () => void;
}

export function FooterConsent({ hasConsent, onAccept }: FooterConsentProps) {
  if (hasConsent) {
    return null;
  }

  return (
    <footer className="fixed bottom-4 left-0 right-0 z-50 px-4 animate-slide-up">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div className="cv-island w-full max-w-[920px] px-3 py-2.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--color-surface)' }}
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: 'var(--color-text)' }}
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
                className="text-sm leading-snug truncate"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                We use local storage to save your custom palettes. Accept to enable saving.
              </p>
            </div>

            <button
              onClick={onAccept}
              className="h-10 px-4 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
              style={{
                backgroundColor: 'var(--glass-bg)',
                color: 'var(--color-text)',
                border: '1px solid var(--glass-border)',
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
