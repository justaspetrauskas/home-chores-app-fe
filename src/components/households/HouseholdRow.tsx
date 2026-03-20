import React from 'react'
import { HomeModernIcon } from '@heroicons/react/24/outline'
import type { Household } from '../../types/household'
import Button from '../ui/Button'

type HouseholdRowProps = {
  household: Household
  isDefault: boolean
  canDelete: boolean
  onMakeDefault: (householdId: string) => void
  onDelete: (householdId: string) => void
  isSettingDefault?: boolean
  isDeleting?: boolean
}

const HouseholdRow: React.FC<HouseholdRowProps> = ({
  household,
  isDefault,
  canDelete,
  onMakeDefault,
  onDelete,
  isSettingDefault = false,
  isDeleting = false,
}) => (
  <li className={`flex flex-col gap-3 rounded-xl border px-5 py-4 transition-colors md:flex-row md:items-center md:justify-between ${
    isDefault ? 'border-amber-400 bg-amber-50/80 ring-1 ring-amber-300' : 'border-stone-200 bg-white'
  }`}>
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 shadow-sm">
        <HomeModernIcon className="size-5 text-stone-900" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-stone-800">{household.name}</span>
        {isDefault ? (
          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800">Default</span>
        ) : null}
      </div>
    </div>

    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isDefault || isSettingDefault || isDeleting}
        onClick={() => onMakeDefault(household.id)}
      >
        {isDefault ? 'Current default' : isSettingDefault ? 'Updating...' : 'Make default'}
      </Button>

      {canDelete ? (
        <Button
          type="button"
          variant="danger"
          size="sm"
          disabled={isDeleting || isSettingDefault}
          onClick={() => onDelete(household.id)}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      ) : null}
    </div>
  </li>
)

export default HouseholdRow
