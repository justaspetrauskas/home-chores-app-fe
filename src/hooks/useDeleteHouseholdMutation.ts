import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteHouseholdRequest } from '../lib/householdApi'
import type { MeResponse } from '../types/auth'
import type { Household } from '../types/household'
import { HOUSEHOLDS_QUERY_KEY } from './useHouseholdsQuery'
import { ME_QUERY_KEY } from './useMeQuery'

export function useDeleteHouseholdMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (householdId: string) => deleteHouseholdRequest(householdId),
    onSuccess: (_, householdId) => {
      queryClient.setQueryData<Household[]>(HOUSEHOLDS_QUERY_KEY, (current) => {
        const households = current ?? []
        return households.filter((household) => household.id !== householdId)
      })

      queryClient.setQueryData<MeResponse>(ME_QUERY_KEY, (current) => {
        if (!current) return current

        const memberships = (current.memberships ?? []).filter((membership) => membership.householdId !== householdId)

        const isDefaultDeleted = current.defaultHousehold?.id === householdId
        const fallbackMembership = memberships[0]

        return {
          ...current,
          memberships,
          defaultHousehold: isDefaultDeleted
            ? fallbackMembership
              ? {
                  id: fallbackMembership.householdId,
                  name: fallbackMembership.household?.name,
                }
              : null
            : current.defaultHousehold,
        }
      })
    },
  })
}