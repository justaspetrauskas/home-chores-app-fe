import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return
    login(username)
    navigate('/dashboard')
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <button type="submit">Login</button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default Login
