import React, { useEffect, useMemo, useState } from 'react'
import { CalendarDaysIcon, HomeModernIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import EmptyStateCard from '../components/dashboard/EmptyStateCard'
import ToastMessage from '../components/ui/ToastMessage'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import CreateEventForm, { type CreateEventData } from '../components/events/CreateEventForm'
import { useSelectedHouseholdStorage } from '../hooks/useSelectedHouseholdStorage'
import { useHouseholdByIdQuery } from '../hooks/useHouseholdByIdQuery'
import { useCreateCleaningEventMutation } from '../hooks/useCreateCleaningEventMutation'
import { useCleaningEventsQuery } from '../hooks/useCleaningEventsQuery'

type LocalEvent = {
  id: string
  name: string
  eventDate: string
  notificationDate: string
}

type EventListItem = {
  id: string
  name: string
  eventDate: string
  status: string
  distributionMode?: string
  progress?: string | null
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

function formatEventDate(value?: string) {
  if (!value) return 'No date'
  const parsed = dayjs(value)
  if (!parsed.isValid()) return value
  return parsed.format('MMM D, YYYY')
}

function formatDistributionMode(value?: string) {
  if (!value) return 'N/A'
  const normalized = value.replace(/_/g, ' ').toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function formatBreakdownKey(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function isCompletedTaskStatus(status?: string) {
  return ['completed', 'done'].includes((status ?? '').toLowerCase())
}

function getDerivedEventStatus(event: {
  status?: string
  taskAssignments?: Array<{ status?: string }>
}) {
  const taskAssignments = event.taskAssignments ?? []
  if (taskAssignments.length === 0) {
    const normalized = (event.status ?? 'scheduled').replace(/_/g, ' ').toLowerCase()
    return normalized.charAt(0).toUpperCase() + normalized.slice(1)
  }

  const completedCount = taskAssignments.filter((task) => isCompletedTaskStatus(task.status)).length

  if (completedCount === 0) return 'Scheduled'
  if (completedCount === taskAssignments.length) return 'Completed'
  return 'In progress'
}

function getEventTaskProgress(event: {
  taskAssignments?: Array<{ status?: string }>
}) {
  const taskAssignments = event.taskAssignments ?? []
  if (taskAssignments.length === 0) return null

  const completedCount = taskAssignments.filter((task) => isCompletedTaskStatus(task.status)).length
  return `${completedCount}/${taskAssignments.length} tasks complete`
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
  const { data: fetchedCleaningEvents } = useCleaningEventsQuery(true)
  const fetchedEvents = fetchedCleaningEvents?.events ?? []
  const cleaningEvents = fetchedEvents.length > 0 ? fetchedEvents : (user?.cleaningEvents ?? [])
  const eventsInsights = fetchedCleaningEvents?.insights
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

  const allEvents = useMemo<EventListItem[]>(() => {
    const fromAccount = cleaningEvents
      .filter((event) => Boolean(event.id && (event.name || event.title)))
      .map((event) => ({
        id: event.id as string,
        name: (event.name ?? event.title) as string,
        eventDate: event.eventDate ?? '',
        status: getDerivedEventStatus(event),
        distributionMode: event.distributionMode,
        progress: getEventTaskProgress(event),
      }))

    const fromLocal = localEvents.map((event) => ({
      id: event.id,
      name: event.name,
      eventDate: event.eventDate,
      status: 'Scheduled',
      distributionMode: undefined,
      progress: null,
    }))

    return [...fromLocal, ...fromAccount]
  }, [cleaningEvents, localEvents])

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const today = dayjs().startOf('day')

    const upcoming: EventListItem[] = []
    const past: EventListItem[] = []

    allEvents.forEach((event) => {
      const eventDate = dayjs(event.eventDate)
      if (!eventDate.isValid()) {
        upcoming.push(event)
        return
      }

      if (eventDate.isBefore(today, 'day')) {
        past.push(event)
        return
      }

      upcoming.push(event)
    })

    upcoming.sort((a, b) => dayjs(a.eventDate).valueOf() - dayjs(b.eventDate).valueOf())
    past.sort((a, b) => dayjs(b.eventDate).valueOf() - dayjs(a.eventDate).valueOf())

    return {
      upcomingEvents: upcoming,
      pastEvents: past,
    }
  }, [allEvents])

  const analyticsCards = useMemo(() => {
    const totals = eventsInsights?.totals
    return [
      {
        label: 'Events',
        value: totals?.events ?? cleaningEvents.length,
      },
      {
        label: 'Participants',
        value: totals?.participants ?? 0,
      },
      {
        label: 'Assignments',
        value: totals?.taskAssignments ?? 0,
      },
      {
        label: 'Completion rate',
        value: `${(totals?.completionRate ?? 0).toFixed(2)}%`,
      },
      {
        label: 'Upcoming',
        value: totals?.upcomingEvents ?? upcomingEvents.length,
      },
      {
        label: 'Today',
        value: totals?.todayEvents ?? 0,
      },
    ]
  }, [cleaningEvents.length, eventsInsights?.totals, upcomingEvents.length])

  const statisticalBreakdowns = useMemo(() => {
    const asRows = (source?: Record<string, number>) => {
      if (!source) return []
      return Object.entries(source).map(([key, value]) => ({
        label: formatBreakdownKey(key),
        value,
      }))
    }

    return {
      status: asRows(eventsInsights?.statusBreakdown),
      distribution: asRows(eventsInsights?.distributionModeBreakdown),
      recurrence: asRows(eventsInsights?.recurrenceBreakdown),
    }
  }, [eventsInsights?.distributionModeBreakdown, eventsInsights?.recurrenceBreakdown, eventsInsights?.statusBreakdown])

  const dateRangeText = useMemo(() => {
    const range = eventsInsights?.dateRange
    if (!range?.firstEventDate || !range?.lastEventDate) return null
    return `${formatEventDate(range.firstEventDate)} to ${formatEventDate(range.lastEventDate)}`
  }, [eventsInsights?.dateRange])

  const householdStats = useMemo(() => {
    return eventsInsights?.householdBreakdown ?? []
  }, [eventsInsights?.householdBreakdown])

  return (
    <AuthenticatedLayout
      onLogout={handleLogout}
      householdOptions={householdOptions}
      selectedHouseholdId={selectedHouseholdIdForHeader}
      onSelectHousehold={handleSelectHousehold}
      isSwitchingHousehold={false}
      actionSlot={
        <div className="mb-6 flex items-center justify-between">
          <div>
            {currentHouseholdName ? (
              <div>
                <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 md:text-3xl">Events for {currentHouseholdName}</h1>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Create and track cleaning events for this household.</p>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 md:text-3xl">Events</h1>
            )}
          </div>
          <Button onClick={handlePrimaryAction}>
            {hasMemberships ? 'Create New Event' : 'Create Household'}
          </Button>
        </div>
      }
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
        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Analytics</h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Statistical summary from cleaning events insights.</p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {analyticsCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700 dark:bg-stone-800"
                >
                  <p className="text-xs text-stone-500 dark:text-stone-400">{item.label}</p>
                  <p className="text-base font-semibold text-stone-900 dark:text-stone-100">{item.value}</p>
                </div>
              ))}
            </div>

            {dateRangeText ? <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">Date range: {dateRangeText}</p> : null}

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Status breakdown</h3>
                {statisticalBreakdowns.status.length === 0 ? (
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">No data.</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {statisticalBreakdowns.status.map((row) => (
                      <li key={`status-${row.label}`} className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                        <span>{row.label}</span>
                        <span className="font-medium text-stone-800 dark:text-stone-100">{row.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Distribution mode</h3>
                {statisticalBreakdowns.distribution.length === 0 ? (
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">No data.</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {statisticalBreakdowns.distribution.map((row) => (
                      <li
                        key={`distribution-${row.label}`}
                        className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300"
                      >
                        <span>{row.label}</span>
                        <span className="font-medium text-stone-800 dark:text-stone-100">{row.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Recurrence</h3>
                {statisticalBreakdowns.recurrence.length === 0 ? (
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">No data.</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {statisticalBreakdowns.recurrence.map((row) => (
                      <li key={`recurrence-${row.label}`} className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                        <span>{row.label}</span>
                        <span className="font-medium text-stone-800 dark:text-stone-100">{row.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {householdStats.length > 0 ? (
              <div className="mt-4 border-t border-stone-200 pt-3 dark:border-stone-700">
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Household breakdown</h3>
                <ul className="mt-2 space-y-1">
                  {householdStats.map((entry, index) => (
                    <li
                      key={`household-breakdown-${index}`}
                      className="text-xs text-stone-600 dark:text-stone-300"
                    >
                      Household {index + 1}: {entry.events ?? 0} events, {entry.taskAssignments ?? 0} assignments,{' '}
                      {(entry.completionRate ?? 0).toFixed(2)}% completion
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Upcoming events</h2>
            {upcomingEvents.length === 0 ? (
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">No upcoming events.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {upcomingEvents.map((event) => (
                  <li
                    key={`upcoming-${event.id}`}
                    className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700 dark:bg-stone-800"
                  >
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">{event.name}</span>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{formatEventDate(event.eventDate)} | {event.status}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Distribution: {formatDistributionMode(event.distributionMode)}</p>
                    {event.progress ? <p className="text-xs text-stone-500 dark:text-stone-400">{event.progress}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Past events</h2>
            {pastEvents.length === 0 ? (
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">No past events.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {pastEvents.map((event) => (
                  <li
                    key={`past-${event.id}`}
                    className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700 dark:bg-stone-800"
                  >
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">{event.name}</span>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{formatEventDate(event.eventDate)} | {event.status}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Distribution: {formatDistributionMode(event.distributionMode)}</p>
                    {event.progress ? <p className="text-xs text-stone-500 dark:text-stone-400">{event.progress}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <p className="text-sm text-stone-500 dark:text-stone-400">
            {localEventSummary ?? `${cleaningEvents.length} event${cleaningEvents.length === 1 ? '' : 's'} from your account.`}
          </p>
        </div>
      )}
    </AuthenticatedLayout>
  )
}

export default Events
