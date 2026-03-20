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
  household?: HouseholdSummary | null
}

export type UserCleaningEvent = {
  id?: string
  title?: string
  name?: string
  status?: string
}

export type MeResponse = {
  id?: string
  name?: string
  email?: string
  username?: string
  defaultHousehold?: HouseholdSummary | null
  memberships?: HouseholdMembership[]
  taskAssignments?: unknown[]
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
  cleaningEvents: UserCleaningEvent[]
}
