import React, { useEffect } from 'react'
import Button from './Button'

type ConfirmModalProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'default' | 'danger'
  isConfirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  isConfirming = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isConfirming) onCancel()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, isConfirming, onCancel])

  if (!open) return null

  const confirmButtonClassName =
    confirmVariant === 'danger'
      ? 'rounded-lg'
      : 'rounded-lg'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm" onClick={!isConfirming ? onCancel : undefined}>
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-700 dark:bg-stone-800" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{message}</p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={isConfirming}
            className={confirmButtonClassName}
          >
            {isConfirming ? 'Working...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal