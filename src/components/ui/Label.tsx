import React from 'react'

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = '', ...rest }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...rest}>
    {children}
  </label>
)

export default Label
