import { useQuery } from '@tanstack/react-query'
import { getCleaningEventsRequest } from '../lib/cleaningEventApi'
import type { CleaningEventsQueryResult } from '../types/cleaningEvent'

export const CLEANING_EVENTS_QUERY_KEY = ['cleaning-events'] as const

export function useCleaningEventsQuery(enabled: boolean) {
  return useQuery<CleaningEventsQueryResult, Error>({
    queryKey: CLEANING_EVENTS_QUERY_KEY,
    queryFn: getCleaningEventsRequest,
    enabled,
    staleTime: 0,
    refetchOnMount: true,
  })
}