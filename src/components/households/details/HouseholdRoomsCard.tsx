import React from 'react'
import type { HouseholdRoom } from '../../../types/household'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import CardDescription from '../../ui/CardDescription'
import CardHeader from '../../ui/CardHeader'
import CardTitle from '../../ui/CardTitle'

type HouseholdRoomsCardProps = {
  rooms: HouseholdRoom[]
  onManageRooms: () => void
}

const HouseholdRoomsCard: React.FC<HouseholdRoomsCardProps> = ({ rooms, onManageRooms }) => {
  return (
    <Card>
      <CardHeader className="mb-0 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Rooms ({rooms.length})</CardTitle>
            <CardDescription>Spaces to organize chores</CardDescription>
          </div>
          <Button type="button" size="sm" variant="secondary" onClick={onManageRooms}>
            Manage rooms
          </Button>
        </div>
      </CardHeader>

      {rooms.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 dark:border-stone-600 dark:bg-stone-700/30">
          <p className="text-sm text-stone-500 dark:text-stone-400">No rooms yet.</p>
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {rooms.map((room, index) => (
            <li key={room.id ?? `${room.name ?? 'room'}-${index}`} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-800 dark:border-stone-700 dark:text-stone-100">
              {room.name ?? 'Unnamed room'}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default HouseholdRoomsCard
