import { useMutation } from '@tanstack/react-query'
import { updateRoomRequest } from '../lib/roomApi'

export function useUpdateRoomMutation() {
  return useMutation({
    mutationFn: ({ roomId, name }: { roomId: string; name: string }) => updateRoomRequest(roomId, name),
  })
}
