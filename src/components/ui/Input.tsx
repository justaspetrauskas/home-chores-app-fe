import React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder:text-stone-400 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 ${className}`}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export default Input
