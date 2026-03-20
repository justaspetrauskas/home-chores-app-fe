import React, { useEffect } from 'react'

type ToastVariant = 'success' | 'info' | 'error'

type ToastMessageProps = {
  open: boolean
  title: string
  description?: string
  onClose?: () => void
  durationMs?: number
  variant?: ToastVariant
  className?: string
}

function getVariantClasses(variant: ToastVariant) {
  if (variant === 'error') {
    return {
      container: 'border-rose-200 bg-rose-50/95 shadow-rose-100/60',
      title: 'text-rose-800',
      description: 'text-rose-700',
    }
  }

  if (variant === 'info') {
    return {
      container: 'border-stone-200 bg-white/95 shadow-stone-100/60',
      title: 'text-stone-700',
      description: 'text-stone-600',
    }
  }

  return {
    container: 'border-amber-200 bg-amber-50/95 shadow-amber-100/60',
    title: 'text-amber-900',
    description: 'text-amber-700',
  }
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  open,
  title,
  description,
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
      <p className={`text-sm font-semibold ${variantClasses.title}`}>{title}</p>
      {description ? <p className={`mt-1 text-xs ${variantClasses.description}`}>{description}</p> : null}
    </div>
  )
}

export default ToastMessage
