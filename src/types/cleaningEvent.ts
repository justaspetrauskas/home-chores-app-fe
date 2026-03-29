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

export type CleaningEventRecord = {
  id?: string
  householdId?: string
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
}

export type CreateCleaningEventResponse = {
  status?: string
  data?: {
    event?: CleaningEventRecord
  }
}
