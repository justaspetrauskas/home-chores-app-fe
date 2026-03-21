import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import CardDescription from '../components/ui/CardDescription'
import CardHeader from '../components/ui/CardHeader'
import CardTitle from '../components/ui/CardTitle'
import useAuth from '../hooks/useAuth'
import { useHouseholdByIdQuery } from '../hooks/useHouseholdByIdQuery'
import HouseholdOverviewCard from '../components/households/details/HouseholdOverviewCard'
import HouseholdMembersCard from '../components/households/details/HouseholdMembersCard'
import HouseholdRoomsCard from '../components/households/details/HouseholdRoomsCard'
import HouseholdEventsCard from '../components/households/details/HouseholdEventsCard'

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
      <HouseholdOverviewCard
        householdName={household.name}
        membershipRole={membershipRole}
        onBack={() => navigate('/households')}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <HouseholdMembersCard members={members} formatMembershipRole={formatMembershipRole} />
        <HouseholdRoomsCard rooms={rooms} onManageRooms={() => navigate(`/households/${household.id}/manage-rooms`)} />
        <HouseholdEventsCard events={events} onManageEvents={() => navigate(`/households/${household.id}/manage-events`)} />
      </div>
    </div>
  )
}

export default HouseholdDetails
