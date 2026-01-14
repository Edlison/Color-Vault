import { useState, useEffect, useCallback } from 'react';
import type { Palette, AppMode, Theme } from './types/palette';
import { Header } from './components/Header';
import { SiteFooter } from './components/SiteFooter';
import { FooterConsent } from './components/FooterConsent';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { PaletteGrid } from './features/palettes/PaletteGrid';
import { EditPaletteModal } from './features/palettes/EditPaletteModal';
import { PalettePreviewModal } from './features/preview/PalettePreviewModal';
import { UI_CONFIG } from './config/ui';
import { 
  fetchBuiltinPalettes, 
  loadUserPalettes, 
  saveUserPalettes,
  mergePalettes 
} from './lib/storage/palettes';
import { 
  hasConsent as checkConsent, 
  setConsent as acceptConsent 
} from './lib/storage/consent';
import { 
  getStoredTheme, 
  saveTheme, 
  applyTheme 
} from './lib/storage/theme';

function App() {
  console.log('Color-Vault: App component rendering');
  
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    if (!UI_CONFIG.features.themeToggleEnabled) return UI_CONFIG.theme.defaultTheme;
    return getStoredTheme();
  });
  
  // App mode state
  const [mode, setMode] = useState<AppMode>('view');
  
  // Consent state
  const [consentAccepted, setConsentAccepted] = useState<boolean>(() => checkConsent());
  
  // Palettes state
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [draftPalettes, setDraftPalettes] = useState<Palette[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Delete confirmation state
  const [paletteToDelete, setPaletteToDelete] = useState<Palette | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const themeToApply = UI_CONFIG.features.themeToggleEnabled ? theme : UI_CONFIG.theme.defaultTheme;
    applyTheme(themeToApply);
    if (UI_CONFIG.features.themeToggleEnabled) {
      saveTheme(themeToApply);
    }
  }, [theme]);

  // Apply page title + favicon (config-driven)
  useEffect(() => {
    document.title = UI_CONFIG.site.pageTitle;

    const { href, type } = UI_CONFIG.site.favicon;
    if (!href) return;
    const head = document.head;
    const existing = head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const link = existing ?? document.createElement('link');
    link.rel = 'icon';
    link.href = href;
    if (type) link.type = type;
    if (!existing) head.appendChild(link);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!UI_CONFIG.features.themeToggleEnabled) return;
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme(theme);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Load palettes on mount
  useEffect(() => {
    async function loadPalettes() {
      setIsLoading(true);
      try {
        const builtin = await fetchBuiltinPalettes();
        const user = loadUserPalettes();
        const merged = mergePalettes(builtin, user);
        setPalettes(merged);
      } catch (error) {
        console.error('Failed to load palettes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPalettes();
  }, []);

  // Handle theme change
  const handleThemeChange = useCallback((newTheme: Theme) => {
    if (!UI_CONFIG.features.themeToggleEnabled) return;
    setTheme(newTheme);
  }, []);

  // Handle mode toggle
  const handleModeToggle = useCallback(() => {
    if (mode === 'view') {
      // Enter edit mode - clone palettes to draft
      setDraftPalettes([...palettes]);
      setMode('edit');
    } else {
      // Exit edit mode - save changes
      if (consentAccepted) {
        setPalettes(draftPalettes);
        saveUserPalettes(draftPalettes);
      } else {
        // Show consent required message - still update UI but warn
        setPalettes(draftPalettes);
        alert('Please accept the storage policy to persist your changes. Your changes are visible but will be lost on refresh.');
      }
      setMode('view');
    }
  }, [mode, palettes, draftPalettes, consentAccepted]);

  // Handle consent acceptance
  const handleAcceptConsent = useCallback(() => {
    acceptConsent();
    setConsentAccepted(true);
    // Save current palettes now that consent is given
    saveUserPalettes(palettes);
  }, [palettes]);

  // Handle palette click (preview)
  const handlePaletteClick = useCallback((palette: Palette) => {
    setSelectedPalette(palette);
    setIsPreviewOpen(true);
  }, []);

  // Handle palette delete request (show confirmation)
  const handlePaletteDeleteRequest = useCallback((id: string) => {
    const palette = draftPalettes.find(p => p.id === id);
    if (palette) {
      setPaletteToDelete(palette);
      setIsDeleteDialogOpen(true);
    }
  }, [draftPalettes]);

  // Handle confirmed delete
  const handleConfirmDelete = useCallback(() => {
    if (paletteToDelete) {
      setDraftPalettes(prev => prev.filter(p => p.id !== paletteToDelete.id));
      setPaletteToDelete(null);
    }
  }, [paletteToDelete]);

  // Handle palettes reorder
  const handlePalettesReorder = useCallback((newPalettes: Palette[]) => {
    setDraftPalettes(newPalettes);
  }, []);

  // Handle add palette click
  const handleAddClick = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  // Handle save new palette
  const handleSavePalette = useCallback((palette: Palette) => {
    setDraftPalettes(prev => [...prev, palette]);
  }, []);

  // Get the current palettes to display based on mode
  const displayPalettes = mode === 'edit' ? draftPalettes : palettes;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        // Drive CSS variables from config
        ['--radius-card' as never]: `${UI_CONFIG.radii.card}px`,
        ['--radius-swatch' as never]: `${UI_CONFIG.radii.swatch}px`,
        ['--cv-hover-lift' as never]: `${UI_CONFIG.hover.liftPx}px`,
        ['--cv-card-min-h' as never]: `${UI_CONFIG.layout.cardMinHeightPx}px`,
        ['--cv-card-min-w' as never]: `${UI_CONFIG.layout.cardMinWidthPx}px`,
        ['--cv-swatch-aspect' as never]: `${UI_CONFIG.swatches.aspectRatio}`,
        ['--cv-legend-pill-w' as never]: `${Math.min(UI_CONFIG.legend.pillWidthPercent, 12.5)}%`,
      }}
    >
      <Header 
        theme={theme}
        onThemeChange={handleThemeChange}
        mode={mode}
        onModeToggle={handleModeToggle}
      />
      
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Mode indicator banner */}
          {mode === 'edit' && (
            <div 
              className="cv-island rounded-full px-4 py-2.5 mb-6 flex items-center gap-3 animate-slide-up"
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--color-text)' }}
              />
              <p 
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <strong style={{ color: 'var(--color-text)' }}>Edit Mode</strong> — Drag cards to reorder, click delete to remove, or add new palettes. Click the checkmark to save.
              </p>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div 
                className="w-8 h-8 border-2 rounded-full animate-spin"
                style={{ 
                  borderColor: 'var(--color-border-strong)',
                  borderTopColor: 'var(--color-accent)'
                }}
              />
            </div>
          ) : displayPalettes.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                No palettes found. Click the settings button to add some!
              </p>
            </div>
          ) : (
            <PaletteGrid
              palettes={displayPalettes}
              mode={mode}
              onPaletteClick={handlePaletteClick}
              onPaletteDelete={handlePaletteDeleteRequest}
              onPalettesReorder={handlePalettesReorder}
              onAddClick={handleAddClick}
            />
          )}
        </div>
      </main>

      <SiteFooter />

      {/* Consent Footer */}
      <FooterConsent 
        hasConsent={consentAccepted}
        onAccept={handleAcceptConsent}
      />

      {/* Preview Modal */}
      <PalettePreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        palette={selectedPalette}
      />

      {/* Edit/Add Palette Modal */}
      <EditPaletteModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSavePalette}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        paletteName={paletteToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
      />

      {/* Bottom padding when consent banner is visible */}
      {!consentAccepted && <div className="h-20" />}
    </div>
  );
}

export default App;
