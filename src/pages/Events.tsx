import React, { useEffect, useMemo, useState } from 'react'
import { CalendarDaysIcon, HomeModernIcon } from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import EmptyStateCard from '../components/dashboard/EmptyStateCard'
import ToastMessage from '../components/ui/ToastMessage'
import Card from '../components/ui/Card'
import CreateEventForm, { type CreateEventData } from '../components/events/CreateEventForm'
import { useSelectedHouseholdStorage } from '../hooks/useSelectedHouseholdStorage'
import { useHouseholdByIdQuery } from '../hooks/useHouseholdByIdQuery'
import { useCreateCleaningEventMutation } from '../hooks/useCreateCleaningEventMutation'

type LocalEvent = {
  id: string
  name: string
  eventDate: string
  notificationDate: string
}

type ToastState = {
  open: boolean
  title: string
  description?: string
  variant: 'success' | 'error'
  actionLabel?: string
  actionEventId?: string
}

function formatMembershipRole(role?: string) {
  if (!role) return null
  const normalized = role
    .replace(/_/g, ' ')
    .toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const Events: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { value: selectedHouseholdFromStorage, setValue: setSelectedHouseholdInStorage } = useSelectedHouseholdStorage()
  const shouldOpenCreateFromRoute = useMemo(() => {
    return new URLSearchParams(location.search).get('create') === '1'
  }, [location.search])
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(shouldOpenCreateFromRoute)
  const [localEvents, setLocalEvents] = useState<LocalEvent[]>([])
  const createCleaningEventMutation = useCreateCleaningEventMutation()
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: '',
    variant: 'success',
  })

  const memberships = user?.memberships ?? []
  const cleaningEvents = user?.cleaningEvents ?? []
  const hasMemberships = memberships.length > 0
  const membershipRoles = Array.from(new Set(memberships.map((membership) => formatMembershipRole(membership.role)).filter(Boolean)))
  const membershipSummary = hasMemberships
    ? `You currently belong to ${memberships.length} household${memberships.length === 1 ? '' : 's'}${membershipRoles.length > 0 ? ` as ${membershipRoles.join(', ')}.` : '.'}`
    : 'You are not part of any household yet. Create one first so chores, assignments, and events have a place to live.'

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
  const { data: householdDetails } = useHouseholdByIdQuery(selectedHouseholdId ?? undefined)
  const householdMembers = householdDetails?.members ?? []
  const householdRooms = householdDetails?.rooms ?? []
  const hasAnyEvents = cleaningEvents.length > 0 || localEvents.length > 0

  const handlePrimaryAction = () => {
    if (!hasMemberships) {
      navigate('/households/new')
      return
    }

    setIsCreateFormOpen(true)
  }

  useEffect(() => {
    if (!shouldOpenCreateFromRoute) return

    setIsCreateFormOpen(true)
    navigate('/events', { replace: true })
  }, [navigate, shouldOpenCreateFromRoute])

  const handleSelectHousehold = (householdId: string) => {
    if (!householdId || householdId === selectedHouseholdId) return
    setSelectedHouseholdInStorage(householdId)
    navigate(`/households/${householdId}`)
  }

  const handleSubmitEvent = async ({
    name,
    eventDate,
    notificationDate,
    memberIds,
    roomIds,
    distributionMode,
    recurrenceRule,
    notifyParticipants,
  }: CreateEventData): Promise<void> => {
    if (!selectedHouseholdId) {
      throw new Error('No household selected.')
    }

    if (memberIds.length === 0) {
      throw new Error('Select at least one participant before creating the event.')
    }

    if (roomIds.length === 0) {
      throw new Error('Select at least one room before creating the event.')
    }

    const nextEvent: LocalEvent = {
      id: `${Date.now()}`,
      name,
      eventDate,
      notificationDate,
    }

    try {
      await createCleaningEventMutation.mutateAsync({
        householdId: selectedHouseholdId,
        name,
        eventDate,
        notificationDate,
        participantIds: memberIds,
        roomIds,
        distributionMode,
        recurrenceRule,
        notifyParticipants,
      })

      setLocalEvents((current) => [nextEvent, ...current])
      setToast({
        open: true,
        title: 'Event created',
        description: 'Cleaning event has been added.',
        variant: 'success',
        actionLabel: 'Undo',
        actionEventId: nextEvent.id,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create cleaning event'
      setToast({
        open: true,
        title: 'Unable to create event',
        description: message,
        variant: 'error',
        actionLabel: undefined,
        actionEventId: undefined,
      })
      throw error
    }
  }

  const handleUndoCreate = () => {
    if (!toast.actionEventId) return

    setLocalEvents((current) => current.filter((event) => event.id !== toast.actionEventId))
    setToast({ open: true, title: 'Creation undone', description: 'The event was removed.', variant: 'success' })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const localEventSummary = useMemo(() => {
    if (localEvents.length === 0) return null
    return `${localEvents.length} local event${localEvents.length === 1 ? '' : 's'} created in this session.`
  }, [localEvents.length])

  return (
    <AuthenticatedLayout
      onPrimaryAction={handlePrimaryAction}
      primaryActionLabel={hasMemberships ? 'Create New Event' : 'Create Household'}
      onLogout={handleLogout}
      householdOptions={householdOptions}
      selectedHouseholdId={selectedHouseholdIdForHeader}
      onSelectHousehold={handleSelectHousehold}
      isSwitchingHousehold={false}
    >
      <ToastMessage
        open={toast.open}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        actionLabel={toast.actionLabel}
        onAction={toast.actionLabel ? handleUndoCreate : undefined}
        onClose={() => setToast((current) => ({ ...current, open: false, actionLabel: undefined, actionEventId: undefined }))}
      />

      {currentHouseholdName ? (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 md:text-3xl">Events for {currentHouseholdName}</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Create and track cleaning events for this household.</p>
        </div>
      ) : null}

      <DashboardOverview title="Overview" description={membershipSummary} />

      {isCreateFormOpen ? (
        <CreateEventForm
          householdMembers={householdMembers}
          householdRooms={householdRooms}
          onSubmit={handleSubmitEvent}
          onCancel={() => setIsCreateFormOpen(false)}
        />
      ) : null}

      {!hasAnyEvents ? (
        <EmptyStateCard
          title={hasMemberships ? 'No cleaning events yet' : 'Create your first household'}
          description={
            hasMemberships
              ? 'There are no cleaning events yet. Use Create New Event to add your first one.'
              : 'Your account is active, but you are not connected to any household. Create a household before adding events.'
          }
          actionLabel={hasMemberships ? 'Create New Event' : 'Create Household'}
          Icon={hasMemberships ? CalendarDaysIcon : HomeModernIcon}
          onAction={handlePrimaryAction}
        />
      ) : (
        <Card>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Event activity</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {localEventSummary ?? `${cleaningEvents.length} event${cleaningEvents.length === 1 ? '' : 's'} from your account.`}
          </p>
        </Card>
      )}
    </AuthenticatedLayout>
  )
}

export default Events
