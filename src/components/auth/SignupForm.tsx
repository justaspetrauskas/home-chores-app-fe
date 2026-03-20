import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Label from '../ui/Label'

type SignupFormProps = {
  isLoading: boolean
  errorMessage?: string
  onSubmit: (payload: { name: string; email: string; password: string }) => Promise<void> | void
}

const SignupForm: React.FC<SignupFormProps> = ({ isLoading, errorMessage, onSubmit }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) return
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      return
    }

    setConfirmPasswordError('')

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      password,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 pt-2 px-6 pb-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11"
          />
        </div>
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
          <Label htmlFor="password">Password</Label>
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
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (confirmPasswordError) setConfirmPasswordError('')
            }}
            required
            className="h-11"
          />
        </div>
        <Button type="submit" variant="primary" className="w-full h-11" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
        {confirmPasswordError && <p className="text-sm text-red-600">{confirmPasswordError}</p>}
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    </form>
  )
}

export default SignupForm