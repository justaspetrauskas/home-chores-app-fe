import React from 'react'

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = '', ...rest }) => (
  <label className={`text-xs font-semibold uppercase tracking-wider text-stone-600 ${className}`} {...rest}>
    {children}
  </label>
)

export default Label
