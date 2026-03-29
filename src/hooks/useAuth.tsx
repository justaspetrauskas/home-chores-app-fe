import { useQueryClient } from '@tanstack/react-query'
import { logoutRequest } from '../lib/authApi'
import { disconnectSocketClient } from '../lib/socketClient'
import { ME_QUERY_KEY, useMeQuery } from './useMeQuery'
import type { AuthUser } from '../types/auth'
import { clearSelectedHouseholdStorage } from './useSelectedHouseholdStorage'

type User = AuthUser

export function useAuth() {
  const queryClient = useQueryClient()
  const { data: me, isLoading } = useMeQuery()

  const user: User | null = me
    ? {
        username: me.name ?? me.username ?? me.email ?? '',
        id: me.id,
        email: me.email,
        defaultHousehold: me.defaultHousehold ?? null,
        memberships: me.memberships ?? [],
        cleaningEvents: me.cleaningEvents ?? [],
      }
    : null

  const login = () => queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
  const register = () => queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })

  const logout = async () => {
    try {
      await logoutRequest()
    } catch {
      // Always clear regardless of backend response
    } finally {
      disconnectSocketClient()
      clearSelectedHouseholdStorage()
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY })
    }
  }

  return { user, isLoading, login, register, logout }
}

export default useAuth

