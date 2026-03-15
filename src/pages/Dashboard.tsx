import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import EmptyStateCard from '../components/dashboard/EmptyStateCard'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      <DashboardHeader onCreateEvent={() => navigate('/events/new')} onLogout={handleLogout} />

      <main className="w-full px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <p className="mb-4 text-sm text-slate-600">
            Welcome back{user?.username ? `, ${user.username}` : ''}. Your dashboard will fill up as you create events.
          </p>

          <DashboardOverview title="Overview" description="Once events exist, this area can show activity, assignments, and progress." />

          <EmptyStateCard
            title="No events yet"
            description="This dashboard is ready, but there is no event data to display yet. Create your first event to start tracking chores and activity here."
            actionLabel="Create New Event"
            onAction={() => navigate('/events/new')}
          />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
