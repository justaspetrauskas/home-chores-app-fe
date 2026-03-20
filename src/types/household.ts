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
