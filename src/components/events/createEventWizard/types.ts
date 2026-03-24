export type RoomDisplay = {
  id: string
  name: string
}

export type MemberDisplay = {
  id: string
  name: string
}

export type DistributionMode = 'random' | 'balanced'

export type RecurrenceRule = 'none' | 'weekly' | 'biweekly' | 'monthly'

export type RoomQuickPick = 'all' | 'high-traffic' | 'wet-zones'
