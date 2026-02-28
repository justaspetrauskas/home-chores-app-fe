import { useEffect, useState } from 'react'

type User = { username: string } | null

let currentUser: User = null
try {
  const raw = localStorage.getItem('hc_user')
  currentUser = raw ? JSON.parse(raw) : null
} catch {
  currentUser = null
}

const subscribers = new Set<(u: User) => void>()

function notify(u: User) {
  subscribers.forEach((s) => s(u))
}

function setCurrentUser(u: User) {
  currentUser = u
  try {
    if (u) localStorage.setItem('hc_user', JSON.stringify(u))
    else localStorage.removeItem('hc_user')
  } catch {
    // ignore localStorage errors for now
  }
  notify(u)
}

export function useAuth() {
  const [user, setUser] = useState<User>(currentUser)

  useEffect(() => {
    const sub = (u: User) => setUser(u)
    subscribers.add(sub)
    return () => {
      subscribers.delete(sub)
    }
  }, [])

  const login = (username: string) => setCurrentUser({ username })
  const register = (username: string) => setCurrentUser({ username })
  const logout = () => setCurrentUser(null)

  return { user, login, register, logout }
}

export default useAuth

