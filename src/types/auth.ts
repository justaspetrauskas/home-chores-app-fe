export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  id?: string
  name?: string
  email?: string
  message?: string
}

export type SignupPayload = {
  name: string
  email: string
  password: string
}

export type SignupResponse = {
  id?: string
  name?: string
  email?: string
  token?: string
  message?: string
}

export type LogoutResponse = {
  message?: string
}

export type HouseholdMembershipRole = 'admin' | 'member' | 'admin manager' | 'admin_manager'

export type HouseholdSummary = {
  id?: string
  name?: string
}

export type HouseholdMembership = {
  id?: string
  role?: HouseholdMembershipRole | string
  householdId?: string
  householdName?: string
  household?: HouseholdSummary | null
}

export type UserCleaningEvent = {
  id?: string
  householdId?: string
  createdByUserId?: string
  title?: string
  name?: string
  eventDate?: string
  distributionMode?: string
  status?: string
  createdAt?: string
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
  }>
}

export type UserTaskAssignment = {
  id?: string
  eventId?: string
  assignedToId?: string
  date?: string
  status?: string
  completedAt?: string | null
  cleaningEventId?: string
  cleaningEventName?: string
  cleaningEvent?: {
    id?: string
    title?: string
    name?: string
    eventDate?: string
    status?: string
  } | null
  roomId?: string
  roomName?: string
  room?: {
    id?: string
    name?: string
  } | null
  choreId?: string
  choreTitle?: string
  chore?: {
    id?: string
    title?: string
    points?: number
  } | null
}

export type MeResponse = {
  id?: string
  name?: string
  email?: string
  username?: string
  defaultHousehold?: HouseholdSummary | null
  memberships?: HouseholdMembership[]
  taskAssignments?: UserTaskAssignment[]
  choresCreated?: unknown[]
  cleaningEvents?: UserCleaningEvent[]
}

export type MeEnvelopeResponse = {
  status?: string
  data?: {
    user?: MeResponse
  }
}

export type AuthUser = {
  username: string
  id?: string
  email?: string
  defaultHousehold?: HouseholdSummary | null
  memberships: HouseholdMembership[]
  taskAssignments: UserTaskAssignment[]
  cleaningEvents: UserCleaningEvent[]
}
