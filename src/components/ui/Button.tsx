import React from 'react'

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => {
  return (
    <button {...rest} className={`rounded bg-blue-600 py-2 px-3 text-white ${className}`}>
      {children}
    </button>
  )
}

export default Button
