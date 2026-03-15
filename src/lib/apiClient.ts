import axios from 'axios'

function getApiBaseUrl() {
  const raw = (import.meta.env.API_BASE_URL as string | undefined) || (import.meta.env.VITE_API_BASE_URL as string | undefined)
  if (!raw) {
    throw new Error('Missing API_BASE_URL in .env')
  }
  return raw.replace(/\/$/, '')
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
