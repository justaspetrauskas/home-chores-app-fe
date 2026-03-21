import React from 'react'
import Card from '../../ui/Card'
import CardDescription from '../../ui/CardDescription'
import CardHeader from '../../ui/CardHeader'
import CardTitle from '../../ui/CardTitle'
import Button from '../../ui/Button'

type HouseholdOverviewCardProps = {
  householdName: string
  membershipRole: string
  onBack: () => void
}

const HouseholdOverviewCard: React.FC<HouseholdOverviewCardProps> = ({ householdName, membershipRole, onBack }) => {
  return (
    <Card>
      <CardHeader className="mb-0 space-y-1">
        <CardTitle>{householdName}</CardTitle>
        <CardDescription>Manage members, rooms, and events</CardDescription>
      </CardHeader>

      <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">
        Your role in this household: <span className="font-semibold text-stone-800 dark:text-stone-100">{membershipRole}</span>
      </p>

      <div className="mt-6">
        <Button variant="secondary" onClick={onBack}>
          Back to households
        </Button>
      </div>
    </Card>
  )
}

export default HouseholdOverviewCard
