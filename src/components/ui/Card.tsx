import React from 'react'

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-stone-200 bg-white shadow-sm p-6 ${className}`}>{children}</div>
)

export default Card
