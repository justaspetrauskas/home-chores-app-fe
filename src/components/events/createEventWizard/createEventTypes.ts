import type { DistributionMode, RecurrenceRule } from './types'

export type CreateEventData = {
  name: string
  eventDate: string
  notificationDate: string
  memberIds: string[]
  roomIds: string[]
  chores: Array<{ name: string; roomId: string; roomName: string }>
  distributionMode: DistributionMode
  recurrenceRule: RecurrenceRule
  notifyParticipants: boolean
}

export type CreateEventDraft = {
  participants: string[]
  rooms: string[]
  date: string | null
  notificationDate: string | null
  distributionType: DistributionMode
  eventName: string
  recurrenceRule: RecurrenceRule
  notifyParticipants: boolean
  currentStep: number
}
