import { type Theme, type AppMode } from '../types/palette';
import { UI_CONFIG } from '../config/ui';

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
    <header className="sticky top-3 z-50 px-4">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div className="cv-island w-full max-w-[920px] px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* Logo & Site Name */}
            <div className="flex items-center gap-3 select-none">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-text)' }}
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: 'var(--color-bg)' }}
                >
                  <rect x="4" y="6" width="4" height="12" rx="1" />
                  <rect x="10" y="9" width="4" height="9" rx="1" />
                  <rect x="16" y="7" width="4" height="11" rx="1" />
                </svg>
              </div>
              <h1
                className="text-base sm:text-lg font-semibold tracking-tight"
                style={{ color: 'var(--color-text)' }}
              >
                Color-Vault
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Settings/Edit Toggle Button */}
              <button
                onClick={onModeToggle}
                className={`
                  relative h-10 px-3 rounded-full transition-all duration-200
                  ${mode === 'view' ? 'hover:scale-[1.02]' : 'hover:scale-[1.02]'}
                `}
                style={{
                  backgroundColor: mode === 'edit' ? 'var(--color-text)' : 'var(--glass-bg)',
                  color: mode === 'edit' ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                  border: '1px solid var(--glass-border)',
                }}
                title={mode === 'edit' ? 'Save & Exit Edit Mode' : 'Enter Edit Mode'}
                aria-label={mode === 'edit' ? 'Save and exit edit mode' : 'Enter edit mode'}
              >
                <span className="flex items-center gap-2">
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
                  <span className="hidden sm:inline text-sm font-medium">
                    {mode === 'edit' ? 'Done' : 'Edit'}
                  </span>
                </span>
              </button>

              {/* Theme Toggle Button (config-controlled, currently disabled) */}
              {UI_CONFIG.features.themeToggleEnabled && (
                <button
                  onClick={toggleTheme}
                  className="h-10 w-10 rounded-full transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--glass-bg)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--glass-border)',
                  }}
                  title={`Theme: ${theme}`}
                  aria-label={`Current theme: ${theme}. Click to change.`}
                >
                  <span className="flex items-center justify-center">{getThemeIcon()}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
