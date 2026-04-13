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
import ConfirmModal from '../components/ui/ConfirmModal'
import { useSelectedHouseholdStorage } from '../hooks/useSelectedHouseholdStorage'
import { useDeleteCleaningEventMutation } from '../hooks/useDeleteCleaningEventMutation'
import { useCompleteTaskAssignmentMutation } from '../hooks/useCompleteTaskAssignmentMutation'
import type { UserCleaningEvent, UserTaskAssignment } from '../types/auth'

function formatMembershipRole(role?: string) {
  if (!role) return null
  const normalized = role
    .replace(/_/g, ' ')
    .toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function isAdminRole(role?: string) {
  const normalizedRole = formatMembershipRole(role)
  return normalizedRole?.toLowerCase().includes('admin') ?? false
}

function formatEventDate(value?: string) {
  if (!value) return 'No date'

  const parsed = dayjs(value)
  if (!parsed.isValid()) return value

  return parsed.format('MMM D, YYYY')
}

function formatMonthYear(value?: string) {
  if (!value) return 'No date'

  const parsed = dayjs(value)
  if (!parsed.isValid()) return 'No date'

  return parsed.format('MMMM YYYY')
}

function formatTaskStatus(value?: string) {
  if (!value) return 'Assigned'
  const normalized = value.replace(/_/g, ' ').toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function formatShortId(value?: string) {
  if (!value) return 'Unknown'
  return value.slice(0, 8)
}

function getAssignmentTitle(task: UserTaskAssignment) {
  return task.choreTitle ?? task.chore?.title ?? (task.roomId ? `Room ${formatShortId(task.roomId)}` : 'Assigned task')
}

function getAssignmentRoom(task: UserTaskAssignment) {
  return task.roomName ?? task.room?.name ?? (task.roomId ? `Room ${formatShortId(task.roomId)}` : 'Unassigned room')
}

function getAssignmentEventName(task: UserTaskAssignment, eventName?: string) {
  return eventName ?? task.cleaningEventName ?? task.cleaningEvent?.name ?? task.cleaningEvent?.title ?? `Cleaning event ${formatShortId(task.eventId)}`
}

function getAssignmentEventDate(task: UserTaskAssignment, eventDate?: string) {
  return formatEventDate(eventDate ?? task.date ?? task.cleaningEvent?.eventDate)
}

function formatCompletedDate(value?: string | null) {
  if (!value) return null

  const parsed = dayjs(value)
  if (!parsed.isValid()) return value

  return parsed.format('MMM D, YYYY HH:mm')
}

function isCompletedOnTime(task: UserTaskAssignment) {
  if (!task.completedAt || !task.date) return false

  const completedAt = dayjs(task.completedAt)
  const dueDate = dayjs(task.date)

  if (!completedAt.isValid() || !dueDate.isValid()) return false

  return !completedAt.isAfter(dueDate, 'day')
}

function isCompletedTask(task: UserTaskAssignment) {
  return Boolean(task.completedAt) || ['completed', 'done'].includes((task.status ?? '').toLowerCase())
}

function isCompletedTaskStatus(status?: string) {
  return ['completed', 'done'].includes((status ?? '').toLowerCase())
}

function getDerivedEventStatus(event: UserCleaningEvent) {
  const taskAssignments = event.taskAssignments ?? []
  if (taskAssignments.length === 0) {
    return formatTaskStatus(event.status ?? 'scheduled')
  }

  const completedCount = taskAssignments.filter((task) => isCompletedTaskStatus(task.status)).length

  if (completedCount === 0) {
    return 'Scheduled'
  }

  if (completedCount === taskAssignments.length) {
    return 'Completed'
  }

  return 'In progress'
}

function getEventTaskProgress(event: UserCleaningEvent) {
  const taskAssignments = event.taskAssignments ?? []
  if (taskAssignments.length === 0) return null

  const completedCount = taskAssignments.filter((task) => isCompletedTaskStatus(task.status)).length
  return `${completedCount}/${taskAssignments.length} tasks complete`
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const deleteCleaningEventMutation = useDeleteCleaningEventMutation()
  const completeTaskAssignmentMutation = useCompleteTaskAssignmentMutation()
  const location = useLocation()
  const navigate = useNavigate()
  const { value: selectedHouseholdFromStorage, setValue: setSelectedHouseholdInStorage } = useSelectedHouseholdStorage()
  const initialWelcomeState = useMemo(() => {
    return Boolean((location.state as { showWelcomeBack?: boolean } | null)?.showWelcomeBack)
  }, [location.state])
  const [showWelcomeToast, setShowWelcomeToast] = useState(initialWelcomeState)
  const [toast, setToast] = useState<{
    open: boolean
    title: string
    description?: string
    variant: 'success' | 'info' | 'error'
  }>({
    open: false,
    title: '',
    variant: 'success',
  })
  const [pendingDeleteEvent, setPendingDeleteEvent] = useState<{ id: string; name: string } | null>(null)
  const memberships = user?.memberships ?? []
  const taskAssignments = user?.taskAssignments ?? []
  const cleaningEvents = user?.cleaningEvents ?? []
  const membershipByHouseholdId = new Map(memberships.map((membership) => [membership.householdId, membership]))
  const canDeleteAnyEvent = memberships.some((membership) => isAdminRole(membership.role))
  const hasMemberships = memberships.length > 0
  const visibleTaskAssignments = taskAssignments.filter((task) => Boolean(task.id || task.eventId || task.roomId || task.date))
  const hasTaskAssignments = visibleTaskAssignments.length > 0
  const visibleCleaningEvents = cleaningEvents.filter((event) => Boolean(event.id || event.name || event.title))
  const hasCleaningEvents = visibleCleaningEvents.length > 0
  const cleaningEventById = useMemo(() => {
    return new Map(visibleCleaningEvents.filter((event) => Boolean(event.id)).map((event) => [event.id as string, event]))
  }, [visibleCleaningEvents])
  const groupedTaskAssignments = useMemo(() => {
    const groups = new Map<
      string,
      {
        eventId: string
        eventName: string
        eventDate: string
        eventDateRaw?: string
        eventStatus: string
        eventProgress: string | null
        event: UserCleaningEvent | null
        tasks: UserTaskAssignment[]
      }
    >()

    visibleTaskAssignments.forEach((task) => {
      const eventId = task.eventId ?? task.cleaningEventId ?? 'unassigned'
      const matchedEvent = eventId !== 'unassigned' ? cleaningEventById.get(eventId) : undefined
      const eventName = getAssignmentEventName(task, matchedEvent?.name ?? matchedEvent?.title)
      const eventDate = getAssignmentEventDate(task, matchedEvent?.eventDate)
      const eventDateRaw = matchedEvent?.eventDate ?? task.date
      const eventStatus = matchedEvent ? getDerivedEventStatus(matchedEvent) : 'Scheduled'
      const eventProgress = matchedEvent ? getEventTaskProgress(matchedEvent) : null
      const existing = groups.get(eventId)

      if (existing) {
        existing.tasks.push(task)
        return
      }

      groups.set(eventId, {
        eventId,
        eventName,
        eventDate,
        eventDateRaw,
        eventStatus,
        eventProgress,
        event: matchedEvent ?? null,
        tasks: [task],
      })
    })

    return Array.from(groups.values())
  }, [cleaningEventById, visibleTaskAssignments])
  const groupedTaskAssignmentsByMonth = useMemo(() => {
    const monthGroups = new Map<string, { monthLabel: string; events: typeof groupedTaskAssignments }>()

    groupedTaskAssignments.forEach((eventGroup) => {
      const monthLabel = formatMonthYear(eventGroup.eventDateRaw)
      const existing = monthGroups.get(monthLabel)

      if (existing) {
        existing.events.push(eventGroup)
        return
      }

      monthGroups.set(monthLabel, {
        monthLabel,
        events: [eventGroup],
      })
    })

    return Array.from(monthGroups.values())
  }, [groupedTaskAssignments])
  const hasDashboardActivity = hasTaskAssignments
  const membershipRoles = Array.from(new Set(memberships.map((membership) => formatMembershipRole(membership.role)).filter(Boolean)))
  const membershipSummary = hasMemberships
    ? `You currently belong to ${memberships.length} household${memberships.length === 1 ? '' : 's'}${membershipRoles.length > 0 ? ` as ${membershipRoles.join(', ')}.` : '.'}`
    : 'You are not part of any household yet. Create one first so chores, assignments, and events have a place to live.'
  const emptyStateTitle = hasMemberships && !hasTaskAssignments ? 'No assignments yet' : 'Create your first household'
  const emptyStateDescription = hasMemberships && !hasTaskAssignments
    ? 'You do not have assigned tasks yet. Create a cleaning event and assign tasks to participants to see activity here.'
    : 'Your account is active, but you are not connected to any household. Create a household before you start organizing chores and events.'
  const primaryActionLabel = hasMemberships && !hasTaskAssignments ? 'Create New Event' : 'Create Household'
  const emptyStateIcon = hasMemberships && !hasTaskAssignments ? CalendarDaysIcon : HomeModernIcon
  const handlePrimaryAction = () => navigate(hasMemberships ? '/events?create=1' : '/households/new')
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
  const currentUserId = user?.id

  const canDeleteEvent = (event: { householdId?: string; createdByUserId?: string }) => {
    const isCreator = Boolean(currentUserId && event.createdByUserId && currentUserId === event.createdByUserId)
    if (isCreator) return true

    if (!canDeleteAnyEvent) return false
    if (!event.householdId) return true

    return isAdminRole(membershipByHouseholdId.get(event.householdId)?.role)
  }

  const handleSelectHousehold = (householdId: string) => {
    if (!householdId || householdId === selectedHouseholdId) return
    setSelectedHouseholdInStorage(householdId)
    navigate(`/households/${householdId}`)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleConfirmDeleteEvent = () => {
    if (!pendingDeleteEvent) return

    const { id, name } = pendingDeleteEvent
    setPendingDeleteEvent(null)

    deleteCleaningEventMutation.mutate(id, {
      onSuccess: () => {
        setToast({
          open: true,
          title: 'Event deleted',
          description: `"${name}" was removed successfully.`,
          variant: 'success',
        })
      },
      onError: (error) => {
        setToast({
          open: true,
          title: 'Delete failed',
          description: error instanceof Error ? error.message : 'Unable to delete event.',
          variant: 'error',
        })
      },
    })
  }

  const handleCompleteTask = (taskId: string) => {
    completeTaskAssignmentMutation.mutate(taskId, {
      onSuccess: () => {
        setToast({
          open: true,
          title: 'Task completed',
          description: 'Your assignment was marked as complete.',
          variant: 'success',
        })
      },
      onError: (error) => {
        setToast({
          open: true,
          title: 'Unable to complete task',
          description: error instanceof Error ? error.message : 'Failed to complete task assignment.',
          variant: 'error',
        })
      },
    })
  }

  useEffect(() => {
    if (!initialWelcomeState) return

    navigate(location.pathname, { replace: true, state: {} })
  }, [initialWelcomeState, location.pathname, navigate])

  return (
    <AuthenticatedLayout
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
      <ToastMessage
        open={toast.open}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />
      {currentHouseholdName ? (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 md:text-3xl">Welcome to {currentHouseholdName}</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {hasTaskAssignments ? 'Your assigned chores are ready below.' : hasCleaningEvents ? 'Your household activity is shown below.' : 'Create your first cleaning event to get started.'}
          </p>
        </div>
      ) : null}

      <DashboardOverview title="Overview" description={membershipSummary} />

      {hasTaskAssignments ? (
        <Card className="mb-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Your assignments</h2>
            <Button type="button" variant="secondary" size="sm" onClick={() => navigate('/events')}>
              See events
            </Button>
          </div>

          <ul className="mt-4 space-y-4">
            {groupedTaskAssignmentsByMonth.map((monthGroup) => (
              <li key={monthGroup.monthLabel}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">{monthGroup.monthLabel}</p>

                <ul className="space-y-3">
                  {monthGroup.events.map((group) => (
                    <li key={group.eventId}>
                      <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-700 dark:bg-stone-800">
                <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3 dark:border-stone-700">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {group.eventName}
                      <span className="ml-2 text-xs font-normal text-stone-500 dark:text-stone-400">• Status: {group.eventStatus}</span>
                      {group.eventProgress ? <span className="ml-2 text-xs font-normal text-stone-500 dark:text-stone-400">• {group.eventProgress}</span> : null}
                    </p>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Date: {group.eventDate}</p>
                  </div>

                  {group.event?.id && canDeleteEvent(group.event) ? (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      disabled={Boolean(deleteCleaningEventMutation.isPending && deleteCleaningEventMutation.variables === group.event.id)}
                      onClick={() => {
                        if (!group.event?.id) return
                        setPendingDeleteEvent({ id: group.event.id, name: group.eventName })
                      }}
                    >
                      {deleteCleaningEventMutation.isPending && deleteCleaningEventMutation.variables === group.event.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  ) : null}
                </div>

                <ul className="mt-3">
                  {group.tasks.map((task, index) => {
                    const taskTitle = getAssignmentTitle(task)
                    const taskRoom = getAssignmentRoom(task)
                    const taskDate = formatEventDate(task.date)
                    const isCompleted = isCompletedTask(task)
                    const isCompleting = completeTaskAssignmentMutation.isPending && completeTaskAssignmentMutation.variables === task.id
                    const completedDate = formatCompletedDate(task.completedAt)
                    const completedOnTime = isCompletedOnTime(task)

                    return (
                      <li
                        key={task.id ?? `${group.eventId}-${taskTitle}-${index}`}
                        className={`relative py-3 ${
                          isCompleted
                            ? 'border-b border-green-300/70 dark:border-green-800/50'
                            : 'border-b border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                            {taskTitle}
                            <span className="ml-2 text-xs font-normal text-stone-500 dark:text-stone-400">• {taskRoom}</span>
                            <span className="ml-2 text-xs font-normal text-stone-500 dark:text-stone-400">• Status: {formatTaskStatus(task.status)}</span>
                          </p>
                          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Due: {taskDate}</p>
                          {completedDate ? <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Completed: {completedDate}</p> : null}
                          {completedDate && completedOnTime ? (
                            <p className="mt-1 inline-flex items-center rounded-full bg-green-200 px-2 py-0.5 text-[11px] font-semibold text-green-900 dark:bg-green-900/50 dark:text-green-200">
                              On time ✓
                            </p>
                          ) : null}
                          </div>

                          <Button
                            type="button"
                            variant={isCompleted ? 'secondary' : 'primary'}
                            size="sm"
                            disabled={isCompleted || isCompleting || !task.id}
                            onClick={() => {
                              if (!task.id) return
                              handleCompleteTask(task.id)
                            }}
                          >
                            {isCompleted ? 'Completed' : isCompleting ? 'Completing...' : 'Complete'}
                          </Button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {!hasDashboardActivity ? (
        <EmptyStateCard
          title={emptyStateTitle}
          description={emptyStateDescription}
          actionLabel={primaryActionLabel}
          Icon={emptyStateIcon}
          onAction={handlePrimaryAction}
        />
      ) : null}

      <ConfirmModal
        open={Boolean(pendingDeleteEvent)}
        title="Delete event?"
        message={
          pendingDeleteEvent
            ? `Are you sure you want to delete "${pendingDeleteEvent.name}"? This action cannot be undone.`
            : 'Are you sure you want to delete this event?'
        }
        confirmLabel="Delete event"
        confirmVariant="danger"
        isConfirming={deleteCleaningEventMutation.isPending}
        onConfirm={handleConfirmDeleteEvent}
        onCancel={() => setPendingDeleteEvent(null)}
      />
    </AuthenticatedLayout>
  )
}

export default Dashboard
