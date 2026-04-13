export type CreateCleaningEventPayload = {
  householdId: string
  name: string
  eventDate: string
  notificationDate: string
  participantIds: string[]
  roomIds: string[]
  distributionMode?: 'random' | 'balanced'
  recurrenceRule: 'none' | 'weekly' | 'biweekly' | 'monthly'
  notifyParticipants: boolean
  status?: string
}

export type CleaningEventTotalsInsights = {
  events?: number
  participants?: number
  taskAssignments?: number
  completedTaskAssignments?: number
  scheduledTaskAssignments?: number
  postDueTaskAssignments?: number
  upcomingEvents?: number
  todayEvents?: number
  completionRate?: number
}

export type CleaningEventInsights = {
  totals?: CleaningEventTotalsInsights
  statusBreakdown?: Record<string, number>
  distributionModeBreakdown?: Record<string, number>
  recurrenceBreakdown?: Record<string, number>
  dateRange?: {
    firstEventDate?: string
    lastEventDate?: string
  }
  householdBreakdown?: Array<{
    householdId?: string
    events?: number
    participants?: number
    taskAssignments?: number
    completedTaskAssignments?: number
    completionRate?: number
  }>
}

export type CleaningEventsQueryResult = {
  events: CleaningEventRecord[]
  insights?: CleaningEventInsights
}

export type CleaningEventRecord = {
  id?: string
  householdId?: string
  title?: string
  name?: string
  eventDate?: string
  notificationDate?: string
  distributionMode?: string
  recurrenceRule?: string
  notifyParticipants?: boolean
  status?: string
  createdByUserId?: string
  createdAt?: string
  updatedAt?: string
  participants?: string[]
  taskAssignments?: Array<{
    id?: string
    assignedToUserId?: string
    roomId?: string
    room?: {
      id?: string
      name?: string
    } | null
    date?: string
    status?: string
    completedAt?: string | null
  }>
  insights?: {
    participantsCount?: number
    taskAssignmentsCount?: number
    completedTaskAssignments?: number
    scheduledTaskAssignments?: number
    postDueTaskAssignments?: number
    uniqueAssignedUsersCount?: number
    completionRate?: number
  }
}

export type CreateCleaningEventResponse = {
  status?: string
  data?: {
    event?: CleaningEventRecord
  }
}
