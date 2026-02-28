import React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return <input ref={ref} className={`w-full rounded border border-gray-200 px-3 py-2 ${className}`} {...props} />
  },
)

Input.displayName = 'Input'

export default Input
