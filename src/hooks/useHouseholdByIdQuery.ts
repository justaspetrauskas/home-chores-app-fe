import { useQuery } from '@tanstack/react-query'
import { getHouseholdByIdRequest } from '../lib/householdApi'
import type { HouseholdDetails } from '../types/household'

export function useHouseholdByIdQuery(householdId?: string) {
  return useQuery<HouseholdDetails, Error>({
    queryKey: ['households', 'detail', householdId],
    queryFn: () => getHouseholdByIdRequest(householdId as string),
    enabled: Boolean(householdId),
    staleTime: 0,
    refetchOnMount: true,
  })
}
