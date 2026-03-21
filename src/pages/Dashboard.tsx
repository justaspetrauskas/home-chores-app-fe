import React, { useEffect, useMemo, useState } from 'react'
import { CalendarDaysIcon, HomeModernIcon } from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import EmptyStateCard from '../components/dashboard/EmptyStateCard'
import ToastMessage from '../components/ui/ToastMessage'
import { useSelectedHouseholdStorage } from '../hooks/useSelectedHouseholdStorage'

function formatMembershipRole(role?: string) {
  if (!role) return null
  const normalized = role
    .replace(/_/g, ' ')
    .toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { value: selectedHouseholdFromStorage, setValue: setSelectedHouseholdInStorage } = useSelectedHouseholdStorage()
  const initialWelcomeState = useMemo(() => {
    return Boolean((location.state as { showWelcomeBack?: boolean } | null)?.showWelcomeBack)
  }, [location.state])
  const [showWelcomeToast, setShowWelcomeToast] = useState(initialWelcomeState)
  const memberships = user?.memberships ?? []
  const cleaningEvents = user?.cleaningEvents ?? []
  const hasMemberships = memberships.length > 0
  const hasCleaningEvents = cleaningEvents.length > 0
  const membershipRoles = Array.from(new Set(memberships.map((membership) => formatMembershipRole(membership.role)).filter(Boolean)))
  const membershipSummary = hasMemberships
    ? `You currently belong to ${memberships.length} household${memberships.length === 1 ? '' : 's'}${membershipRoles.length > 0 ? ` as ${membershipRoles.join(', ')}.` : '.'}`
    : 'You are not part of any household yet. Create one first so chores, assignments, and events have a place to live.'
  const emptyStateTitle = hasMemberships && !hasCleaningEvents ? 'No cleaning events yet' : 'Create your first household'
  const emptyStateDescription = hasMemberships && !hasCleaningEvents
    ? 'This dashboard is ready, but there is no event data to display yet. Create your first event to start tracking chores and activity here.'
    : 'Your account is active, but you are not connected to any household. Create a household before you start organizing chores and events.'
  const primaryActionLabel = hasMemberships && !hasCleaningEvents ? 'Create New Event' : 'Create Household'
  const emptyStateIcon = hasMemberships && !hasCleaningEvents ? CalendarDaysIcon : HomeModernIcon
  const handlePrimaryAction = () => navigate(hasMemberships ? '/events/new' : '/households/new')
  const householdOptions = memberships
    .filter((membership) => membership.householdId && (membership.household?.name || membership.householdName))
    .map((membership) => ({
      id: membership.householdId as string,
      name: (membership.household?.name ?? membership.householdName) as string,
      membershipStatus: formatMembershipRole(membership.role) ?? 'Member',
    }))
  const hasStoredHouseholdInMemberships = Boolean(
    selectedHouseholdFromStorage && householdOptions.some((option) => option.id === selectedHouseholdFromStorage),
  )
  const selectedHouseholdId = hasStoredHouseholdInMemberships
    ? selectedHouseholdFromStorage
    : user?.defaultHousehold?.id ?? householdOptions[0]?.id
  const selectedHouseholdIdForHeader = selectedHouseholdId ?? undefined
  const selectedHousehold = householdOptions.find((option) => option.id === selectedHouseholdId)
  const currentHouseholdName = selectedHousehold?.name ?? user?.defaultHousehold?.name ?? memberships[0]?.household?.name ?? memberships[0]?.householdName ?? null

  const handleSelectHousehold = (householdId: string) => {
    if (!householdId || householdId === selectedHouseholdId) return
    setSelectedHouseholdInStorage(householdId)
    navigate(`/households/${householdId}`)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    if (!initialWelcomeState) return

    navigate(location.pathname, { replace: true, state: {} })
  }, [initialWelcomeState, location.pathname, navigate])

  return (
    <AuthenticatedLayout
      onPrimaryAction={handlePrimaryAction}
      primaryActionLabel={primaryActionLabel}
      onLogout={handleLogout}
      householdOptions={householdOptions}
      selectedHouseholdId={selectedHouseholdIdForHeader}
      onSelectHousehold={handleSelectHousehold}
      isSwitchingHousehold={false}
    >
      <ToastMessage
        open={showWelcomeToast}
        title="Welcome back"
        onClose={() => setShowWelcomeToast(false)}
        variant="success"
        durationMs={3500}
      />
      {currentHouseholdName ? (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 md:text-3xl">Welcome to {currentHouseholdName}</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {hasCleaningEvents ? 'Your household activity is shown below.' : 'Create your first cleaning event to get started.'}
          </p>
        </div>
      ) : null}

      <DashboardOverview title="Overview" description={membershipSummary} />

      <EmptyStateCard
        title={emptyStateTitle}
        description={emptyStateDescription}
        actionLabel={primaryActionLabel}
        Icon={emptyStateIcon}
        onAction={handlePrimaryAction}
      />
    </AuthenticatedLayout>
  )
}

export default Dashboard
