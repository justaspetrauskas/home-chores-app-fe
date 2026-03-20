import React from 'react'
import { ArrowLeftOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import Button from '../ui/Button'

type DashboardHeaderProps = {
  onPrimaryAction?: () => void
  primaryActionLabel?: string
  onLogout: () => void
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
  }`

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onPrimaryAction, primaryActionLabel, onLogout }) => (
  <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/95 backdrop-blur">
    <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-3">
      <div className="flex items-center gap-3">
        <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-stone-900">
          Chore<span className="text-amber-500">Hub</span>
        </p>
        <nav className="ml-1 flex flex-wrap gap-1">
          <NavLink to="/dashboard" className={navLinkClassName}>
            Dashboard
          </NavLink>
          <NavLink to="/households" className={navLinkClassName}>
            Households
          </NavLink>
        </nav>
      </div>
      <div className="flex flex-wrap gap-2">
        {onPrimaryAction && primaryActionLabel ? (
          <Button variant="primary" onClick={onPrimaryAction} className="flex items-center gap-1.5">
            <PlusIcon className="size-4" />
            {primaryActionLabel}
          </Button>
        ) : null}
        <Button variant="secondary" onClick={onLogout} className="flex items-center gap-1.5">
          <ArrowLeftOnRectangleIcon className="size-4" />
          Log out
        </Button>
      </div>
    </div>
  </header>
)

export default DashboardHeader