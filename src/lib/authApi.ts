import axios from 'axios'
import { apiClient } from './apiClient'
import type { LoginPayload, LoginResponse, SignupPayload, SignupResponse, LogoutResponse, MeEnvelopeResponse, MeResponse } from '../types/auth'

export type { LoginPayload, LoginResponse, SignupPayload, SignupResponse, LogoutResponse, MeEnvelopeResponse, MeResponse }

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload)
    return data
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Login failed')
    }
    throw new Error('Login failed')
  }
}

export async function meRequest(): Promise<MeResponse> {
  try {
    const { data } = await apiClient.get<MeEnvelopeResponse>('/users/me')
    return data.data?.user ?? {}
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Failed to load current user')
    }
    throw new Error('Failed to load current user')
  }
}

export async function signupRequest(payload: SignupPayload): Promise<SignupResponse> {
  try {
    const { data } = await apiClient.post<SignupResponse>('/auth/register', payload)
    return data
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Sign up failed')
    }
    throw new Error('Sign up failed')
  }
}

export async function logoutRequest(): Promise<LogoutResponse> {
  try {
    const { data } = await apiClient.post<LogoutResponse>('/auth/logout')
    return data
  } catch (error) {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
      const apiMessage = error.response?.data?.error || error.response?.data?.message
      throw new Error(apiMessage || 'Log out failed')
    }
    throw new Error('Log out failed')
  }
}
