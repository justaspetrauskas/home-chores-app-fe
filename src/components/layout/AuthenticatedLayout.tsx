import React from 'react'
import DashboardHeader from '../dashboard/DashboardHeader'

type AuthenticatedLayoutProps = {
  children: React.ReactNode
  onPrimaryAction?: () => void
  primaryActionLabel?: string
  onLogout: () => void
  showPrimaryAction?: boolean
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  onPrimaryAction,
  primaryActionLabel,
  onLogout,
  showPrimaryAction = true,
}) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <DashboardHeader
        onPrimaryAction={showPrimaryAction ? onPrimaryAction : undefined}
        primaryActionLabel={showPrimaryAction ? primaryActionLabel : undefined}
        onLogout={onLogout}
      />

      <main className="w-full px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  )
}

export default AuthenticatedLayout
