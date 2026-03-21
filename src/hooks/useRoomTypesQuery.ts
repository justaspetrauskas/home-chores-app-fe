import { useQuery } from '@tanstack/react-query'
import { getRoomTypesRequest } from '../lib/roomApi'
import type { RoomTypeResponse } from '../lib/roomApi'

export const ROOM_TYPES_QUERY_KEY = ['rooms', 'types'] as const

export function useRoomTypesQuery(enabled: boolean) {
  return useQuery<RoomTypeResponse[], Error>({
    queryKey: ROOM_TYPES_QUERY_KEY,
    queryFn: getRoomTypesRequest,
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  })
}
