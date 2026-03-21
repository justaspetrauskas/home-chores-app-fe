import React from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Label from '../ui/Label'
import Input from '../ui/Input'
import Button from '../ui/Button'
import DropdownSelect from '../ui/DropdownSelect'

export type EventChore = {
  name: string
  roomId: string
  roomName: string
}

type RoomOption = {
  id: string
  name: string
}

type Props = {
  chores: EventChore[]
  rooms: RoomOption[]
  choreInput: string
  selectedRoomId: string
  onChoreInputChange: (value: string) => void
  onSelectedRoomIdChange: (value: string) => void
  onAddChore: () => void
  onRemoveChore: (chore: EventChore) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const EventChoreList: React.FC<Props> = ({
  chores,
  rooms,
  choreInput,
  selectedRoomId,
  onChoreInputChange,
  onSelectedRoomIdChange,
  onAddChore,
  onRemoveChore,
  onKeyDown,
}) => {
  return (
    <div>
      <Label htmlFor="chore-input">Chores</Label>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_12rem_auto]">
        <Input
          id="chore-input"
          value={choreInput}
          onChange={(e) => onChoreInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="e.g. Vacuum living room"
        />
        <DropdownSelect
          value={selectedRoomId}
          options={[
            { value: '', label: 'Assign room' },
            ...rooms.map((room) => ({ value: room.id, label: room.name })),
          ]}
          placeholder="Assign room"
          onChange={onSelectedRoomIdChange}
          ariaLabel="Select room for chore"
        />
        <Button type="button" variant="secondary" onClick={onAddChore} disabled={!choreInput.trim()} className="shrink-0">
          <PlusIcon className="size-4" />
        </Button>
      </div>
      {chores.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {chores.map((chore) => (
            <li
              key={`${chore.name}-${chore.roomId}`}
              className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            >
              <div className="flex items-center gap-2">
                <span>{chore.name}</span>
                <span className="rounded-md bg-stone-200 px-2 py-0.5 text-xs text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                  {chore.roomName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveChore(chore)}
                className="ml-2 text-stone-400 hover:text-red-500 dark:text-stone-500 dark:hover:text-red-400"
              >
                <XMarkIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default EventChoreList
