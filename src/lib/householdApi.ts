import axios from 'axios'
import { apiClient } from './apiClient'
import type { CreateHouseholdPayload, CreateHouseholdResponse, Household, HouseholdDetails } from '../types/household'

export type { CreateHouseholdPayload, CreateHouseholdResponse, Household, HouseholdDetails }

export async function getHouseholdsRequest(): Promise<Household[]> {
  const { data } = await apiClient.get<Household[]>('/households')
  return data
}

export async function getHouseholdByIdRequest(householdId: string): Promise<HouseholdDetails> {
  const { data } = await apiClient.get(`/households/${householdId}`)

  const unwrapped =
    (data?.data?.household as HouseholdDetails | undefined)
    ?? (data?.data as HouseholdDetails | undefined)
    ?? (data as HouseholdDetails)

  return unwrapped
}

export async function createHouseholdRequest(payload: CreateHouseholdPayload): Promise<CreateHouseholdResponse> {
  try {
    const { data } = await apiClient.post<CreateHouseholdResponse>('/households', payload)
    return data
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to create household')
    }
    throw new Error('Failed to create household')
  }
}

export async function setDefaultHouseholdRequest(householdId: string): Promise<void> {
  try {
    await apiClient.post(`/households/${householdId}/set-default`, { householdId })
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to set default household')
    }
    throw new Error('Failed to set default household')
  }
}

export async function deleteHouseholdRequest(householdId: string): Promise<void> {
  try {
    await apiClient.delete(`/households/${householdId}`)
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to delete household')
    }
    throw new Error('Failed to delete household')
  }
}
