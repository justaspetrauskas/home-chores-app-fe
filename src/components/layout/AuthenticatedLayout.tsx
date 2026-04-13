import React from 'react'
import DashboardHeader, { type HouseholdSwitcherOption } from '../dashboard/DashboardHeader'

type AuthenticatedLayoutProps = {
  children: React.ReactNode
  onLogout: () => void
  householdOptions?: HouseholdSwitcherOption[]
  selectedHouseholdId?: string
  onSelectHousehold?: (householdId: string) => void
  isSwitchingHousehold?: boolean
  actionSlot?: React.ReactNode
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  onLogout,
  householdOptions,
  selectedHouseholdId,
  onSelectHousehold,
  isSwitchingHousehold = false,
  actionSlot,
}) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <DashboardHeader
        onLogout={onLogout}
        householdOptions={householdOptions}
        selectedHouseholdId={selectedHouseholdId}
        onSelectHousehold={onSelectHousehold}
        isSwitchingHousehold={isSwitchingHousehold}
      />

      <main className="w-full px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto w-full max-w-5xl">
          {actionSlot ? (
            <div className="mb-6 flex items-center justify-between">
              <div className="flex-1">{actionSlot}</div>
            </div>
          ) : null}
          {children}
        </div>
      </main>
    </div>
  )
}

export default AuthenticatedLayout
