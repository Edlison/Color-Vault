import { type Theme, type AppMode } from '../types/palette';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  mode: AppMode;
  onModeToggle: () => void;
}

export function Header({ theme, onThemeChange, mode, onModeToggle }: HeaderProps) {
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    onThemeChange(nextTheme);
  };

  const getThemeIcon = () => {
    if (theme === 'light') {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    if (theme === 'dark') {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <header className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Site Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="6" width="4" height="12" rx="1" />
              <rect x="10" y="9" width="4" height="9" rx="1" />
              <rect x="16" y="7" width="4" height="11" rx="1" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Color-Vault
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Settings/Edit Toggle Button */}
          <button
            onClick={onModeToggle}
            className={`
              relative p-2.5 rounded-xl transition-all duration-300 ease-out
              ${mode === 'edit' 
                ? 'bg-[var(--color-accent)] text-white shadow-lg animate-pulse-glow' 
                : 'hover:bg-[var(--color-surface-hover)]'
              }
            `}
            style={{ 
              color: mode === 'edit' ? 'white' : 'var(--color-text-secondary)',
              backgroundColor: mode === 'view' ? 'var(--color-surface)' : undefined
            }}
            title={mode === 'edit' ? 'Save & Exit Edit Mode' : 'Enter Edit Mode'}
            aria-label={mode === 'edit' ? 'Save and exit edit mode' : 'Enter edit mode'}
          >
            {mode === 'edit' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            {mode === 'edit' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)'
            }}
            title={`Theme: ${theme}`}
            aria-label={`Current theme: ${theme}. Click to change.`}
          >
            {getThemeIcon()}
          </button>
        </div>
      </div>
    </header>
  );
}
