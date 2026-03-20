import { useMutation } from '@tanstack/react-query'
import { createRoomRequest } from '../lib/roomApi'
import type { CreateRoomPayload } from '../types/room'

export function useCreateRoomMutation(householdId: string) {
  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => createRoomRequest(householdId, payload),
  })
}
