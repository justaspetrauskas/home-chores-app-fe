import { useMutation } from '@tanstack/react-query'
import { deleteRoomRequest } from '../lib/roomApi'

export function useDeleteRoomMutation() {
  return useMutation({
    mutationFn: (roomId: string) => deleteRoomRequest(roomId),
  })
}
