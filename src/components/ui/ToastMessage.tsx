import React, { useEffect } from 'react'

type ToastVariant = 'success' | 'info' | 'error'

type ToastMessageProps = {
  open: boolean
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  onClose?: () => void
  durationMs?: number
  variant?: ToastVariant
  className?: string
}

function getVariantClasses(variant: ToastVariant) {
  if (variant === 'error') {
    return {
      container: 'border-rose-200 bg-rose-50/95 shadow-rose-100/60 dark:border-rose-700 dark:bg-rose-900/80',
      title: 'text-rose-800 dark:text-rose-200',
      description: 'text-rose-700 dark:text-rose-300',
    }
  }

  if (variant === 'info') {
    return {
      container: 'border-stone-200 bg-white/95 shadow-stone-100/60 dark:border-stone-600 dark:bg-stone-800/95',
      title: 'text-stone-700 dark:text-stone-200',
      description: 'text-stone-600 dark:text-stone-400',
    }
  }

  return {
    container: 'border-amber-200 bg-amber-50/95 shadow-amber-100/60 dark:border-amber-600 dark:bg-amber-900/70',
    title: 'text-amber-900 dark:text-amber-200',
    description: 'text-amber-700 dark:text-amber-300',
  }
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  open,
  title,
  description,
  actionLabel,
  onAction,
  onClose,
  durationMs = 3500,
  variant = 'success',
  className = '',
}) => {
  useEffect(() => {
    if (!open || !onClose || durationMs <= 0) return

    const timeout = window.setTimeout(() => {
      onClose()
    }, durationMs)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [open, onClose, durationMs])

  if (!open) return null

  const variantClasses = getVariantClasses(variant)

  return (
    <div
      className={`fixed right-4 top-24 z-50 rounded-xl border px-4 py-3 shadow-lg backdrop-blur md:right-6 ${variantClasses.container} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div>
          <p className={`text-sm font-semibold ${variantClasses.title}`}>{title}</p>
          {description ? <p className={`mt-1 text-xs ${variantClasses.description}`}>{description}</p> : null}
        </div>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-500 dark:bg-stone-700 dark:text-stone-200 dark:hover:bg-stone-600"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default ToastMessage
