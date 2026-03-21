import React from 'react'
import DashboardHeader, { type HouseholdSwitcherOption } from '../dashboard/DashboardHeader'

type AuthenticatedLayoutProps = {
  children: React.ReactNode
  onPrimaryAction?: () => void
  primaryActionLabel?: string
  onLogout: () => void
  showPrimaryAction?: boolean
  householdOptions?: HouseholdSwitcherOption[]
  selectedHouseholdId?: string
  onSelectHousehold?: (householdId: string) => void
  isSwitchingHousehold?: boolean
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  onPrimaryAction,
  primaryActionLabel,
  onLogout,
  showPrimaryAction = true,
  householdOptions,
  selectedHouseholdId,
  onSelectHousehold,
  isSwitchingHousehold = false,
}) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <DashboardHeader
        onPrimaryAction={showPrimaryAction ? onPrimaryAction : undefined}
        primaryActionLabel={showPrimaryAction ? primaryActionLabel : undefined}
        onLogout={onLogout}
        householdOptions={householdOptions}
        selectedHouseholdId={selectedHouseholdId}
        onSelectHousehold={onSelectHousehold}
        isSwitchingHousehold={isSwitchingHousehold}
      />

      <main className="w-full px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  )
}

export default AuthenticatedLayout
