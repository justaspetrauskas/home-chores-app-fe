import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-amber-500 text-stone-900 font-semibold border border-amber-400/60 hover:bg-amber-400 disabled:opacity-50',
  secondary: 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 disabled:opacity-50',
  danger: 'bg-rose-600 text-white font-semibold border border-rose-700 hover:bg-rose-700 disabled:opacity-50',
  ghost: 'bg-transparent text-stone-600 border border-stone-200 hover:bg-stone-100 disabled:opacity-50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', size = 'md', ...rest }) => {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
