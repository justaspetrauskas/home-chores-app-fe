import React from 'react'
import type { HouseholdEvent } from '../../../types/household'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import CardDescription from '../../ui/CardDescription'
import CardHeader from '../../ui/CardHeader'
import CardTitle from '../../ui/CardTitle'

type HouseholdEventsCardProps = {
  events: HouseholdEvent[]
  onManageEvents: () => void
}

const HouseholdEventsCard: React.FC<HouseholdEventsCardProps> = ({ events, onManageEvents }) => {
  return (
    <Card>
      <CardHeader className="mb-0 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Events ({events.length})</CardTitle>
            <CardDescription>Cleaning events in this household</CardDescription>
          </div>
          <Button type="button" size="sm" variant="secondary" onClick={onManageEvents}>
            Manage events
          </Button>
        </div>
      </CardHeader>

      {events.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 dark:border-stone-600 dark:bg-stone-700/30">
          <p className="text-sm text-stone-500 dark:text-stone-400">No events yet.</p>
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((event, index) => (
            <li key={event.id ?? `${event.title ?? event.name ?? 'event'}-${index}`} className="rounded-lg border border-stone-200 px-3 py-2 text-sm dark:border-stone-700">
              <p className="font-semibold text-stone-800 dark:text-stone-100">{event.title ?? event.name ?? 'Untitled event'}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">{event.status ?? 'Planned'}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default HouseholdEventsCard
