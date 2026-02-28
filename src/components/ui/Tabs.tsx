import React from 'react'

type TabsProps = { children: React.ReactNode }
const Tabs: React.FC<TabsProps> = ({ children }) => <div>{children}</div>

const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

const TabsTrigger: React.FC<{
  value: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
}> = ({ children, onClick, className = '' }) => (
  <button type="button" onClick={onClick} className={className}>
    {children}
  </button>
)

const TabsContent: React.FC<{ value: string; children: React.ReactNode }> = ({ children }) => <div>{children}</div>

export { Tabs, TabsList, TabsTrigger, TabsContent }
