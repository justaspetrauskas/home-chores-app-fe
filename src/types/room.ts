export type CreateRoomPayload = {
  name?: string
  roomTypeId: string
}

export type CreateRoomBulkItem = {
  roomTypeId?: string
  name?: string
}

export type CreateRoomsBulkPayload = {
  rooms: CreateRoomBulkItem[]
}

export type CreateRoomResponse = {
  id?: string
  name?: string
  householdId?: string
  message?: string
}

export type CreateRoomsBulkResponse = {
  message?: string
  createdCount?: number
}

export type HouseholdRoomRecord = {
  id: string
  name: string
  createdAt?: string
  createdById?: string
}
