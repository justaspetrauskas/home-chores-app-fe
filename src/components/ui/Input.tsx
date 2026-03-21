import React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder:text-stone-400 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/20 ${className}`}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export default Input
