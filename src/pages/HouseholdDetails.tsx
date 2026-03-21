import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import CardDescription from '../components/ui/CardDescription'
import CardHeader from '../components/ui/CardHeader'
import CardTitle from '../components/ui/CardTitle'
import Button from '../components/ui/Button'
import useAuth from '../hooks/useAuth'
import { useHouseholdByIdQuery } from '../hooks/useHouseholdByIdQuery'

function formatMembershipRole(role?: string) {
  if (!role) return 'Member'
  const normalized = role.replace(/_/g, ' ').toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const HouseholdDetails: React.FC = () => {
  const navigate = useNavigate()
  const { householdId } = useParams<{ householdId: string }>()
  const { user } = useAuth()

  const { data: household, isLoading, isError, error } = useHouseholdByIdQuery(householdId)

  const membership = (user?.memberships ?? []).find((item) => item.householdId === householdId)
  const membershipRole = formatMembershipRole(membership?.role)

  if (isLoading) {
    return <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">Loading household details...</p>
  }

  if (isError) {
    return (
      <Card className="mb-6">
        <CardHeader className="mb-0">
          <CardTitle>Unable to load household</CardTitle>
          <CardDescription>{error instanceof Error ? error.message : 'Something went wrong.'}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!household) return null

  const members = household.members ?? []
  const rooms = household.rooms ?? []
  const events = household.events ?? []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="mb-0 space-y-1">
          <CardTitle>{household.name}</CardTitle>
          <CardDescription>Manage members, rooms, and events</CardDescription>
        </CardHeader>

        <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">
          Your role in this household: <span className="font-semibold text-stone-800 dark:text-stone-100">{membershipRole}</span>
        </p>

        <div className="mt-6">
          <Button variant="secondary" onClick={() => navigate('/households')}>
            Back to households
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="mb-0 pb-2">
            <CardTitle className="text-lg">Members ({members.length})</CardTitle>
            <CardDescription>Users in this household</CardDescription>
          </CardHeader>

          {members.length === 0 ? (
            <div className="mt-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 dark:border-stone-600 dark:bg-stone-700/30">
              <p className="text-sm text-stone-500 dark:text-stone-400">No members yet.</p>
              <Button type="button" size="sm" className="mt-3" onClick={() => {}}>
                Create member
              </Button>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {members.map((member, index) => (
                <li key={member.id ?? `${member.userId ?? 'member'}-${index}`} className="rounded-lg border border-stone-200 px-3 py-2 text-sm dark:border-stone-700">
                  <p className="font-semibold text-stone-800 dark:text-stone-100">{member.user?.name ?? 'Unknown user'}</p>
                  <p className="text-stone-500 dark:text-stone-400">{member.user?.email ?? 'No email'}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">{formatMembershipRole(member.role)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader className="mb-0 pb-2">
            <CardTitle className="text-lg">Rooms ({rooms.length})</CardTitle>
            <CardDescription>Spaces to organize chores</CardDescription>
          </CardHeader>

          {rooms.length === 0 ? (
            <div className="mt-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 dark:border-stone-600 dark:bg-stone-700/30">
              <p className="text-sm text-stone-500 dark:text-stone-400">No rooms yet.</p>
              <Button type="button" size="sm" className="mt-3" onClick={() => {}}>
                Create room
              </Button>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {rooms.map((room, index) => (
                <li key={room.id ?? `${room.name ?? 'room'}-${index}`} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-800 dark:border-stone-700 dark:text-stone-100">
                  {room.name ?? 'Unnamed room'}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader className="mb-0 pb-2">
            <CardTitle className="text-lg">Events ({events.length})</CardTitle>
            <CardDescription>Cleaning events in this household</CardDescription>
          </CardHeader>

          {events.length === 0 ? (
            <div className="mt-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 dark:border-stone-600 dark:bg-stone-700/30">
              <p className="text-sm text-stone-500 dark:text-stone-400">No events yet.</p>
              <Button type="button" size="sm" className="mt-3" onClick={() => {}}>
                Create event
              </Button>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {events.map((event, index) => (
                <li key={event.id ?? `${event.title ?? event.name ?? 'event'}-${index}`} className="rounded-lg border border-stone-200 px-3 py-2 text-sm dark:border-stone-700">
                  <p className="font-semibold text-stone-800 dark:text-stone-100">{event.title ?? event.name ?? 'Untitled event'}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">{event.status ?? 'Planned'}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

export default HouseholdDetails
