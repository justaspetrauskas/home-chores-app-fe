export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  id?: string
  name?: string
  email?: string
  message?: string
}

export type SignupPayload = {
  name: string
  email: string
  password: string
}

export type SignupResponse = {
  id?: string
  name?: string
  email?: string
  token?: string
  message?: string
}

export type LogoutResponse = {
  message?: string
}

export type MeResponse = {
  id?: string
  name?: string
  email?: string
  username?: string
}

export type AuthUser = {
  username: string
  id?: string
  email?: string
}
