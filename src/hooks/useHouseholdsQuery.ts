import { useQuery } from '@tanstack/react-query'
import { getHouseholdsRequest } from '../lib/householdApi'
import type { Household } from '../types/household'

export const HOUSEHOLDS_QUERY_KEY = ['households'] as const

export function useHouseholdsQuery(enabled: boolean) {
  return useQuery<Household[], Error>({
    queryKey: HOUSEHOLDS_QUERY_KEY,
    queryFn: getHouseholdsRequest,
    enabled,
    staleTime: 0,
    refetchOnMount: true,
  })
}
