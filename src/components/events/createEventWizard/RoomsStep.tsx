import React from 'react'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import Label from '../../ui/Label'
import type { RoomDisplay } from './types'

type Props = {
  filteredRooms: RoomDisplay[]
  totalRoomsCount: number
  expandedRoomIds: string[]
  selectedRoomIds: string[]
  roomSearch: string
  selectedRoomCount: number
  selectedPreviewRoom: RoomDisplay | undefined
  onQuickPickAll: () => void
  onRoomSearchChange: (value: string) => void
  onToggleRoomExpanded: (roomId: string) => void
  onToggleRoomSelected: (roomId: string) => void
  onSelectPreviewRoom: (roomId: string) => void
  getRoomTasks: (roomName: string) => string[]
  onBack: () => void
  onContinue: () => void
}

const RoomsStep: React.FC<Props> = ({
  filteredRooms,
  totalRoomsCount,
  expandedRoomIds,
  selectedRoomIds,
  roomSearch,
  selectedRoomCount,
  selectedPreviewRoom,
  onQuickPickAll,
  onRoomSearchChange,
  onToggleRoomExpanded,
  onToggleRoomSelected,
  onSelectPreviewRoom,
  getRoomTasks,
  onBack,
  onContinue,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Step 2: Select rooms</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Rooms are collapsible. Task previews are informational only for V1.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={onQuickPickAll}>
          Quick pick: All rooms
        </Button>
      </div>

      {totalRoomsCount > 5 ? (
        <div>
          <Label htmlFor="room-search">Search rooms</Label>
          <Input id="room-search" value={roomSearch} onChange={(e) => onRoomSearchChange(e.target.value)} placeholder="Type room name..." />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
          {filteredRooms.map((room) => {
            const isExpanded = expandedRoomIds.includes(room.id)
            const isSelected = selectedRoomIds.includes(room.id)
            const taskPreview = getRoomTasks(room.name)

            return (
              <div key={room.id} className="rounded-lg border border-stone-200 bg-white dark:border-stone-600 dark:bg-stone-700">
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleRoomExpanded(room.id)
                      onSelectPreviewRoom(room.id)
                    }}
                    className="flex min-w-0 items-center gap-2 text-left"
                  >
                    <span className="font-medium text-stone-800 dark:text-stone-100">{room.name}</span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-600 dark:text-stone-200">
                      {taskPreview.length} tasks
                    </span>
                  </button>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-300">
                    <input type="checkbox" checked={isSelected} onChange={() => onToggleRoomSelected(room.id)} className="size-4" />
                    Selected
                  </label>
                </div>

                {isExpanded ? (
                  <div className="border-t border-stone-200 px-3 py-2 dark:border-stone-600 lg:hidden">
                    <ul className="space-y-1 text-sm text-stone-600 dark:text-stone-300">
                      {taskPreview.map((task) => (
                        <li key={`${room.id}-${task}`}>• {task}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )
          })}

          {filteredRooms.length === 0 ? (
            <p className="rounded-lg border border-dashed border-stone-300 px-3 py-4 text-sm text-stone-500 dark:border-stone-600 dark:text-stone-400">
              No rooms match this search.
            </p>
          ) : null}
        </div>

        <div className="hidden rounded-lg border border-stone-200 bg-stone-50 p-4 lg:block dark:border-stone-600 dark:bg-stone-800">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            {selectedPreviewRoom ? `${selectedPreviewRoom.name} task preview` : 'Select a room to preview tasks'}
          </h3>
          {selectedPreviewRoom ? (
            <ul className="mt-3 space-y-2 text-sm text-stone-600 dark:text-stone-300">
              {getRoomTasks(selectedPreviewRoom.name).map((task) => (
                <li key={`${selectedPreviewRoom.id}-${task}`} className="rounded-md bg-white px-3 py-2 dark:bg-stone-700">
                  {task}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <p className="text-xs text-stone-500 dark:text-stone-400">{selectedRoomCount} room{selectedRoomCount === 1 ? '' : 's'} selected</p>

      <div className="flex justify-between gap-2">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}

export default RoomsStep
