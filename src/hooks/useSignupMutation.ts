import { useMutation } from '@tanstack/react-query'
import { signupRequest } from '../lib/authApi'
import type { SignupPayload } from '../types/auth'

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => signupRequest(payload),
  })
}
