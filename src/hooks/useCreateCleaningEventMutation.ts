import { useMutation } from '@tanstack/react-query'
import { createCleaningEventRequest } from '../lib/cleaningEventApi'
import type { CreateCleaningEventPayload } from '../types/cleaningEvent'

export function useCreateCleaningEventMutation() {
  return useMutation({
    mutationFn: (payload: CreateCleaningEventPayload) => createCleaningEventRequest(payload),
  })
}
