import React from 'react'

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-stone-500 ${className}`}>{children}</p>
)

export default CardDescription
