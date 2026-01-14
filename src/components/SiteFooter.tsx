import { UI_CONFIG } from '../config/ui';

export function SiteFooter() {
  return (
    <footer className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="text-xs sm:text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {UI_CONFIG.footer.copyright}
        </div>
      </div>
    </footer>
  );
}

