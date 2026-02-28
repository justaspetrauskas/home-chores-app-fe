import React from 'react'

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-lg bg-white shadow p-6 ${className}`}>{children}</div>
)

export default Card
