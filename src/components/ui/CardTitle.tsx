import React from 'react'

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`text-xl font-bold text-stone-900 dark:text-stone-100 ${className}`}>{children}</h2>
)

export default CardTitle
