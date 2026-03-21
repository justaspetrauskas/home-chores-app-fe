export type CreateHouseholdPayload = {
  name: string
}

export type CreateHouseholdResponse = {
  id?: string
  name?: string
  message?: string
}

export type Household = {
  id: string
  name: string
}

export type HouseholdMemberUser = {
  id?: string
  name?: string
  email?: string
}

export type HouseholdMember = {
  id?: string
  userId?: string
  householdId?: string
  role?: string
  user?: HouseholdMemberUser
}

export type HouseholdRoom = {
  id?: string
  name?: string
}

export type HouseholdEvent = {
  id?: string
  title?: string
  name?: string
  status?: string
}

export type HouseholdDetails = {
  id: string
  name: string
  ownerId?: string
  createdAt?: string
  updatedAt?: string
  members?: HouseholdMember[]
  rooms?: HouseholdRoom[]
  events?: HouseholdEvent[]
  [key: string]: unknown
}
