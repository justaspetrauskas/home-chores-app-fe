import { useQuery } from '@tanstack/react-query'
import { getRoomsByHouseholdRequest } from '../lib/roomApi'
import type { HouseholdRoomRecord } from '../types/room'

export const HOUSEHOLD_ROOMS_QUERY_KEY = (householdId: string) => ['rooms', 'household', householdId] as const

export function useHouseholdRoomsQuery(householdId?: string) {
  return useQuery<HouseholdRoomRecord[], Error>({
    queryKey: HOUSEHOLD_ROOMS_QUERY_KEY(householdId ?? ''),
    queryFn: () => getRoomsByHouseholdRequest(householdId as string),
    enabled: Boolean(householdId),
    staleTime: 0,
    refetchOnMount: true,
  })
}
