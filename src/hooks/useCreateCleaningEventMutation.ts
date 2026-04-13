import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCleaningEventRequest } from '../lib/cleaningEventApi'
import type { CreateCleaningEventPayload } from '../types/cleaningEvent'
import { CLEANING_EVENTS_QUERY_KEY } from './useCleaningEventsQuery'

export function useCreateCleaningEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCleaningEventPayload) => createCleaningEventRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CLEANING_EVENTS_QUERY_KEY })
    },
  })
}
