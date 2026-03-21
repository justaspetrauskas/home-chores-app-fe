import React from 'react'
import { HomeModernIcon, StarIcon } from '@heroicons/react/24/outline'
import type { Household } from '../../types/household'
import Button from '../ui/Button'

type HouseholdRowProps = {
  household: Household
  isDefault: boolean
  canDelete: boolean
  onOpen: (householdId: string) => void
  onMakeDefault: (householdId: string) => void
  onDelete: (householdId: string) => void
  isSettingDefault?: boolean
  isDeleting?: boolean
}

const HouseholdRow: React.FC<HouseholdRowProps> = ({
  household,
  isDefault,
  canDelete,
  onOpen,
  onMakeDefault,
  onDelete,
  isSettingDefault = false,
  isDeleting = false,
}) => {
  const isRowClickable = !isSettingDefault && !isDeleting

  const handleRowClick = () => {
    if (!isRowClickable) return
    onOpen(household.id)
  }

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (!isRowClickable) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen(household.id)
    }
  }

  return (
  <li
    className={`flex flex-col gap-3 rounded-xl border px-5 py-4 transition-[background-color,border-color,box-shadow] md:flex-row md:items-center md:justify-between ${
      isDefault
        ? 'border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-900/10'
        : 'border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800'
    } ${
      isRowClickable
        ? 'cursor-pointer hover:border-amber-300 hover:bg-amber-50/40 hover:shadow-sm dark:hover:border-amber-700 dark:hover:bg-amber-900/10 dark:hover:shadow-stone-950/30 focus-within:border-amber-300'
        : 'cursor-default'
    }`}
    onClick={handleRowClick}
    onKeyDown={handleRowKeyDown}
    role={isRowClickable ? 'button' : undefined}
    tabIndex={isRowClickable ? 0 : undefined}
    aria-label={isRowClickable ? `Open ${household.name} household details` : undefined}
  >
    <div className="flex items-center gap-3">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg shadow-sm ${
          isDefault ? 'bg-amber-400 dark:bg-amber-600/80' : 'bg-stone-200 dark:bg-stone-700'
        }`}
      >
        <HomeModernIcon className={`size-5 ${isDefault ? 'text-stone-900' : 'text-stone-600 dark:text-stone-300'}`} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{household.name}</span>
        {isDefault ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <StarIcon className="size-3.5" />
            Default
          </span>
        ) : null}
      </div>
    </div>

    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isDefault || isSettingDefault || isDeleting}
        onClick={(event) => {
          event.stopPropagation()
          onMakeDefault(household.id)
        }}
      >
        {isDefault ? 'Current default' : isSettingDefault ? 'Updating...' : 'Make default'}
      </Button>

      {canDelete ? (
        <Button
          type="button"
          variant="danger"
          size="sm"
          disabled={isDeleting || isSettingDefault}
          onClick={(event) => {
            event.stopPropagation()
            onDelete(household.id)
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      ) : null}
    </div>
  </li>
  )
}

export default HouseholdRow
