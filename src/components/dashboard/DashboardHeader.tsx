import React from 'react'
import { ArrowLeftOnRectangleIcon, PlusIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import Button from '../ui/Button'
import { useTheme } from '../../hooks/useTheme'

export type HouseholdSwitcherOption = {
  id: string
  name: string
  membershipStatus: string
}

type DashboardHeaderProps = {
  onPrimaryAction?: () => void
  primaryActionLabel?: string
  onLogout: () => void
  householdOptions?: HouseholdSwitcherOption[]
  selectedHouseholdId?: string
  onSelectHousehold?: (householdId: string) => void
  isSwitchingHousehold?: boolean
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-100'
  }`

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onPrimaryAction,
  primaryActionLabel,
  onLogout,
  householdOptions = [],
  selectedHouseholdId,
  onSelectHousehold,
  isSwitchingHousehold = false,
}) => {
  const { theme, toggleTheme } = useTheme()
  const showHouseholdSwitcher = householdOptions.length > 1 && Boolean(onSelectHousehold)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/95 backdrop-blur dark:border-stone-700 dark:bg-stone-900/95">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-3">
        <div className="flex items-center gap-3">
          <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-stone-900 dark:text-stone-100">
            Chore<span className="text-amber-500">Hub</span>
          </p>
          <nav className="ml-1 flex flex-wrap gap-1">
            <NavLink to="/dashboard" className={navLinkClassName}>
              Dashboard
            </NavLink>
            <NavLink to="/events" className={navLinkClassName}>
              Events
            </NavLink>
            <NavLink to="/households" className={navLinkClassName}>
              Households
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {showHouseholdSwitcher ? (
            <label className="sr-only" htmlFor="household-switcher">
              Select household
            </label>
          ) : null}
          {showHouseholdSwitcher ? (
            <select
              id="household-switcher"
              value={selectedHouseholdId ?? householdOptions[0]?.id ?? ''}
              onChange={(event) => onSelectHousehold?.(event.target.value)}
              disabled={isSwitchingHousehold}
              className="min-w-52 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition-colors hover:border-amber-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-700"
            >
              {householdOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} ({option.membershipStatus})
                </option>
              ))}
            </select>
          ) : null}

          {onPrimaryAction && primaryActionLabel ? (
            <Button variant="primary" onClick={onPrimaryAction} className="flex items-center gap-1.5">
              <PlusIcon className="size-4" />
              {primaryActionLabel}
            </Button>
          ) : null}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-100"
          >
            {theme === 'dark' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
          </button>
          <Button variant="secondary" onClick={onLogout} className="flex items-center gap-1.5">
            <ArrowLeftOnRectangleIcon className="size-4" />
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader