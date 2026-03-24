import React from 'react'
import Button from '../../ui/Button'
import type { MemberDisplay } from './types'

type Props = {
  members: MemberDisplay[]
  selectedMemberIds: string[]
  onToggleMember: (memberId: string) => void
  onCancel: () => void
  onContinue: () => void
}

const ParticipantsStep: React.FC<Props> = ({ members, selectedMemberIds, onToggleMember, onCancel, onContinue }) => {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Step 1: Who is participating?</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Tap members to include them. All members are preselected by default.</p>
      </div>

      {members.length > 8 ? (
        <button
          type="button"
          className="rounded-lg border border-dashed border-stone-300 px-3 py-2 text-sm text-stone-600 transition-colors hover:border-amber-400 hover:text-amber-700 dark:border-stone-600 dark:text-stone-300 dark:hover:border-amber-500 dark:hover:text-amber-300"
        >
          + Add member
        </button>
      ) : null}

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-full flex-wrap gap-2 sm:flex-nowrap">
          {members.map((member) => {
            const initials = member.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
            const isSelected = selectedMemberIds.includes(member.id)

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => onToggleMember(member.id)}
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
                <span className="whitespace-nowrap">{member.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}

export default ParticipantsStep
