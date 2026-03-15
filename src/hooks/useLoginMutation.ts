import { useMutation } from '@tanstack/react-query'
import { loginRequest } from '../lib/authApi'
import type { LoginPayload } from '../types/auth'

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
  })
}
