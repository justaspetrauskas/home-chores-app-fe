import React from 'react'
import { ArrowLeftOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline'
import Button from '../ui/Button'

type DashboardHeaderProps = {
  onCreateEvent: () => void
  onLogout: () => void
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateEvent, onLogout }) => (
  <header className="sticky top-0 z-40 relative w-full border-b border-cyan-100/80 bg-gradient-to-r from-white/95 via-cyan-50/80 to-teal-50/80 backdrop-blur">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.10),transparent_45%)]" />
    <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
      <div>
        <p className="text-base font-bold uppercase tracking-[0.2em] text-cyan-700 md:text-lg">ChoreHub</p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <Button className="flex items-center rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 shadow-md shadow-cyan-200 hover:from-cyan-600 hover:to-teal-600" onClick={onCreateEvent}>
          <PlusIcon className="mr-2 size-4" />
          Create New Event
        </Button>
        <Button className="flex items-center rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-white shadow-sm hover:bg-slate-800" onClick={onLogout}>
          <ArrowLeftOnRectangleIcon className="mr-2 size-4" />
          Log out
        </Button>
      </div>
    </div>
  </header>
)

export default DashboardHeader