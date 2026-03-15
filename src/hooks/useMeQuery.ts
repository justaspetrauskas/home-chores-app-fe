import { useQuery } from '@tanstack/react-query'
import { meRequest } from '../lib/authApi'
import type { MeResponse } from '../types/auth'

export const ME_QUERY_KEY = ['me'] as const

export function useMeQuery() {
  return useQuery<MeResponse, Error>({
    queryKey: ME_QUERY_KEY,
    queryFn: meRequest,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
