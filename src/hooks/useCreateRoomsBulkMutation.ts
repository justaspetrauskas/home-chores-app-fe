import { useMutation } from '@tanstack/react-query'
import { createRoomsBulkRequest } from '../lib/roomApi'
import type { CreateRoomsBulkPayload } from '../types/room'

export function useCreateRoomsBulkMutation(householdId?: string) {
  return useMutation({
    mutationFn: (payload: CreateRoomsBulkPayload) => {
      if (!householdId) {
        throw new Error('Missing household id')
      }

      return createRoomsBulkRequest(householdId, payload)
    },
  })
}
