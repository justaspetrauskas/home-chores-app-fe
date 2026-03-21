import React from 'react'
import type { HouseholdMember } from '../../../types/household'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import CardDescription from '../../ui/CardDescription'
import CardHeader from '../../ui/CardHeader'
import CardTitle from '../../ui/CardTitle'

type HouseholdMembersCardProps = {
  members: HouseholdMember[]
  formatMembershipRole: (role?: string) => string
}

const HouseholdMembersCard: React.FC<HouseholdMembersCardProps> = ({ members, formatMembershipRole }) => {
  return (
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
  )
}

export default HouseholdMembersCard
