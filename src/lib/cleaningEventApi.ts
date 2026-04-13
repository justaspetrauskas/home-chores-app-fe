import axios from 'axios'
import { apiClient } from './apiClient'
import type { CleaningEventsQueryResult, CreateCleaningEventPayload, CreateCleaningEventResponse } from '../types/cleaningEvent'

export type { CreateCleaningEventPayload, CreateCleaningEventResponse } from '../types/cleaningEvent'

type CleaningEventsEnvelopeResponse = {
  status?: string
  data?: {
    events?: CleaningEventsQueryResult['events']
    cleaningEvents?: CleaningEventsQueryResult['events']
    items?: CleaningEventsQueryResult['events']
    insights?: CleaningEventsQueryResult['insights']
  }
  events?: CleaningEventsQueryResult['events']
  cleaningEvents?: CleaningEventsQueryResult['events']
  insights?: CleaningEventsQueryResult['insights']
}

export async function getCleaningEventsRequest(): Promise<CleaningEventsQueryResult> {
  try {
    const { data } = await apiClient.get<CleaningEventsEnvelopeResponse>('/cleaning-events')

    const eventsFromData = data?.data?.events ?? data?.data?.cleaningEvents ?? data?.data?.items
    const eventsFromRoot = data?.events ?? data?.cleaningEvents
    const insights = data?.data?.insights ?? data?.insights

    return {
      events: eventsFromData ?? eventsFromRoot ?? [],
      insights,
    }
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to load cleaning events')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Failed to load cleaning events')
  }
}

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
