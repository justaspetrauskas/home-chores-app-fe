import React from 'react'
import { useAuth } from '../hooks/useAuth'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Signed in as: {user?.username}</p>
      <button onClick={logout}>Log out</button>
    </div>
  )
}

export default Dashboard
