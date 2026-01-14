import * as Dialog from '@radix-ui/react-dialog';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paletteName: string;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  paletteName, 
  onConfirm 
}: DeleteConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in z-[60]" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-full max-w-sm glass-strong rounded-2xl p-6 animate-scale-in z-[60]"
        >
          <div className="flex flex-col items-center text-center">
            {/* Warning Icon */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="#ef4444"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
            </div>

            <Dialog.Title 
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              Delete Palette
            </Dialog.Title>
            
            <Dialog.Description 
              className="text-sm mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Are you sure you want to delete "<strong>{paletteName}</strong>"? This action cannot be undone.
            </Dialog.Description>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <Dialog.Close asChild>
                <button
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: '#ef4444',
                  color: 'white'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
