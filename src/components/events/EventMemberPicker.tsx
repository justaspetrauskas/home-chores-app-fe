import React from 'react'
import Label from '../ui/Label'
import type { HouseholdMember } from '../../types/household'

type Props = {
  members: HouseholdMember[]
  selectedMemberIds: string[]
  onToggle: (memberId: string) => void
}

const EventMemberPicker: React.FC<Props> = ({ members, selectedMemberIds, onToggle }) => {
  if (members.length === 0) return null

  return (
    <div>
      <Label>Assign members</Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {members.map((member) => {
          const memberId = member.id ?? member.userId ?? ''
          const displayName = member.user?.name ?? member.user?.email ?? 'Unknown'
          const initials = displayName
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
          const isSelected = selectedMemberIds.includes(memberId)

          return (
            <button
              key={memberId}
              type="button"
              onClick={() => onToggle(memberId)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-400 dark:bg-amber-900/30 dark:text-amber-200'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-200 dark:hover:border-amber-600'
              }`}
            >
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isSelected
                    ? 'bg-amber-500 text-white dark:bg-amber-600'
                    : 'bg-stone-200 text-stone-600 dark:bg-stone-600 dark:text-stone-200'
                }`}
              >
                {initials}
              </span>
              {displayName}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default EventMemberPicker
