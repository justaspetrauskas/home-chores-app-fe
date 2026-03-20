import axios from 'axios'
import { apiClient } from './apiClient'
import type { CreateRoomPayload, CreateRoomResponse } from '../types/room'

export type { CreateRoomPayload, CreateRoomResponse }

export async function createRoomRequest(householdId: string, payload: CreateRoomPayload): Promise<CreateRoomResponse> {
  try {
    const { data } = await apiClient.post<CreateRoomResponse>(`/households/${householdId}/rooms`, payload)
    return data
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to create room')
    }
    throw new Error('Failed to create room')
  }
}
