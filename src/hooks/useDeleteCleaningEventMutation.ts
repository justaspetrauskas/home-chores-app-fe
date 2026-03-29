import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCleaningEventRequest } from '../lib/cleaningEventApi'
import type { MeResponse } from '../types/auth'
import { ME_QUERY_KEY } from './useMeQuery'

export function useDeleteCleaningEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) => deleteCleaningEventRequest(eventId),
    onSuccess: (_, eventId) => {
      queryClient.setQueryData<MeResponse>(ME_QUERY_KEY, (current) => {
        if (!current) return current

        return {
          ...current,
          cleaningEvents: (current.cleaningEvents ?? []).filter((event) => event.id !== eventId),
        }
      })
    },
  })
}
