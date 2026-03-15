import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Label from '../ui/Label'

type LoginFormProps = {
  isLoading: boolean
  errorMessage?: string
  onSubmit: (payload: { email: string; password: string }) => Promise<void> | void
}

const LoginForm: React.FC<LoginFormProps> = ({ isLoading, errorMessage, onSubmit }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) return

    await onSubmit({
      email: email.trim(),
      password,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 pt-2 px-6 pb-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <Button type="submit" className="w-full h-11 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}
      </div>
    </form>
  )
}

export default LoginForm