import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setDefaultHouseholdRequest } from '../lib/householdApi'
import type { MeResponse } from '../types/auth'
import type { Household } from '../types/household'
import { HOUSEHOLDS_QUERY_KEY } from './useHouseholdsQuery'
import { ME_QUERY_KEY } from './useMeQuery'

export function useSetDefaultHouseholdMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (householdId: string) => setDefaultHouseholdRequest(householdId),
    onSuccess: (_, householdId) => {
      const households = queryClient.getQueryData<Household[]>(HOUSEHOLDS_QUERY_KEY) ?? []
      const selected = households.find((household) => household.id === householdId)

      queryClient.setQueryData<MeResponse>(ME_QUERY_KEY, (current) => {
        if (!current) return current
        return {
          ...current,
          defaultHousehold: {
            id: householdId,
            name: selected?.name ?? current.defaultHousehold?.name,
          },
        }
      })
    },
  })
}