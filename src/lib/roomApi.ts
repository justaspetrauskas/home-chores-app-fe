import axios from 'axios'
import { apiClient } from './apiClient'
import type {
  CreateRoomPayload,
  CreateRoomResponse,
  CreateRoomsBulkPayload,
  CreateRoomsBulkResponse,
  HouseholdRoomRecord,
} from '../types/room'

export type {
  CreateRoomPayload,
  CreateRoomResponse,
  CreateRoomsBulkPayload,
  CreateRoomsBulkResponse,
}

export type { HouseholdRoomRecord } from '../types/room'

export type RoomTypeResponse = {
  id: string
  key: string
  label: string
  isDefault: boolean
  createdAt: string
}

type GetRoomTypesApiResponse = {
  status: string
  data: {
    roomTypes: RoomTypeResponse[]
  }
}

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

export async function createRoomsBulkRequest(
  householdId: string,
  payload: CreateRoomsBulkPayload,
): Promise<CreateRoomsBulkResponse> {
  try {
    const { data } = await apiClient.post<CreateRoomsBulkResponse>(`/households/${householdId}/rooms/bulk`, payload)
    return data
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to create rooms in bulk')
    }
    throw new Error('Failed to create rooms in bulk')
  }
}

type GetRoomsByHouseholdApiResponse = {
  status: string
  data: {
    rooms: HouseholdRoomRecord[]
  }
}

export async function getRoomsByHouseholdRequest(householdId: string): Promise<HouseholdRoomRecord[]> {
  try {
    const { data } = await apiClient.get<GetRoomsByHouseholdApiResponse>(`/rooms/household/${householdId}`)
    return data.data.rooms
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to fetch rooms')
    }
    throw new Error('Failed to fetch rooms')
  }
}

export async function updateRoomRequest(roomId: string, name: string): Promise<void> {
  try {
    await apiClient.put(`/rooms/${roomId}`, { name })
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to update room')
    }
    throw new Error('Failed to update room')
  }
}

export async function deleteRoomRequest(roomId: string): Promise<void> {
  try {
    await apiClient.delete(`/rooms/${roomId}`)
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to delete room')
    }
    throw new Error('Failed to delete room')
  }
}

export async function getRoomTypesRequest(): Promise<RoomTypeResponse[]> {
  try {
    const { data } = await apiClient.get<GetRoomTypesApiResponse>('/rooms/types')
    return data.data.roomTypes
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to fetch room types')
    }
    throw new Error('Failed to fetch room types')
  }
}
