import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Register: React.FC = () => {
  const [username, setUsername] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return
    register(username)
    navigate('/dashboard')
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Register
