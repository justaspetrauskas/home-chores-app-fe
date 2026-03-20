import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createHouseholdRequest } from '../lib/householdApi'
import type { CreateHouseholdPayload, Household } from '../types/household'
import type { MeResponse } from '../types/auth'
import { ME_QUERY_KEY } from './useMeQuery'
import { HOUSEHOLDS_QUERY_KEY } from './useHouseholdsQuery'

export function useCreateHouseholdMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateHouseholdPayload) => createHouseholdRequest(payload),
    onSuccess: (created) => {
      const createdId = created.id
      const createdName = created.name
      if (!createdId || !createdName) return

      queryClient.setQueryData<Household[]>(HOUSEHOLDS_QUERY_KEY, (current) => {
        const list = current ?? []
        if (list.some((household) => household.id === createdId)) return list
        return [...list, { id: createdId, name: createdName }]
      })

      queryClient.setQueryData<MeResponse>(ME_QUERY_KEY, (current) => {
        if (!current) return current

        const memberships = current.memberships ?? []
        const alreadyMember = memberships.some((membership) => membership.householdId === createdId)

        return {
          ...current,
          defaultHousehold: current.defaultHousehold ?? { id: createdId, name: createdName },
          memberships: alreadyMember
            ? memberships
            : [
                ...memberships,
                {
                  householdId: createdId,
                  role: 'admin',
                  household: { id: createdId, name: createdName },
                },
              ],
        }
      })
    },
  })
}
