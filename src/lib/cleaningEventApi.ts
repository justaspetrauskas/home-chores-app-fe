import axios from 'axios'
import { apiClient } from './apiClient'
import type { CreateCleaningEventPayload, CreateCleaningEventResponse } from '../types/cleaningEvent'

export type { CreateCleaningEventPayload, CreateCleaningEventResponse } from '../types/cleaningEvent'

export async function createCleaningEventRequest(payload: CreateCleaningEventPayload): Promise<CreateCleaningEventResponse> {
  try {
    const { data } = await apiClient.post<CreateCleaningEventResponse>('/cleaning-events', payload)

    if (data?.status !== 'success') {
      throw new Error('Create cleaning event did not return success status')
    }

    return data
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to create cleaning event')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Failed to create cleaning event')
  }
}

type DeleteCleaningEventResponse = {
  status?: string
  message?: string
}

export async function deleteCleaningEventRequest(eventId: string): Promise<void> {
  try {
    const { data } = await apiClient.delete<DeleteCleaningEventResponse>(`/cleaning-events/${eventId}`)

    if (data?.status && data.status !== 'success') {
      throw new Error(data.message || 'Delete cleaning event did not return success status')
    }
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to delete cleaning event')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Failed to delete cleaning event')
  }
}
