import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Label from '../ui/Label'
import { useCreateRoomMutation } from '../../hooks/useCreateRoomMutation'

type CreatedRoom = { id?: string; name: string }

type CreateRoomsProps = {
  householdId: string
  householdName: string
}

const CreateRooms: React.FC<CreateRoomsProps> = ({ householdId, householdName }) => {
  const [open, setOpen] = useState(true)
  const [roomName, setRoomName] = useState('')
  const [createdRooms, setCreatedRooms] = useState<CreatedRoom[]>([])
  const mutation = useCreateRoomMutation(householdId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (roomName.trim().length < 2) return
    try {
      const result = await mutation.mutateAsync({ name: roomName.trim() })
      setCreatedRooms((prev) => [...prev, { id: result.id, name: result.name ?? roomName.trim() }])
      setRoomName('')
      mutation.reset()
    } catch {
      // error displayed from mutation.error
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50/60 dark:border-stone-700 dark:bg-stone-700/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-stone-800">Add rooms to {householdName}</p>
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">Add rooms to {householdName}</p>
          {createdRooms.length > 0 && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {createdRooms.length} room{createdRooms.length === 1 ? '' : 's'} added
            </p>
          )}
        </div>
        {open ? (
          <ChevronUpIcon className="size-5 text-stone-400 dark:text-stone-500 shrink-0" />
        ) : (
          <ChevronDownIcon className="size-5 text-stone-400 dark:text-stone-500 shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-stone-200 dark:border-stone-600 px-6 pb-6 pt-4 space-y-4">
          {createdRooms.length > 0 && (
            <ul className="space-y-1.5">
              {createdRooms.map((room) => (
                <li key={room.id ?? room.name} className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                  <CheckCircleIcon className="size-4 text-amber-500 shrink-0" />
                  {room.name}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="flex gap-3 items-end max-w-md">
            <div className="flex-1 space-y-2">
              <Label htmlFor="room-name">Room name</Label>
              <Input
                id="room-name"
                type="text"
                placeholder="e.g. Living Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="h-10"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isPending || roomName.trim().length < 2}
              className="h-10 shrink-0"
            >
              {mutation.isPending ? 'Adding...' : 'Add room'}
            </Button>
          </form>

          {mutation.isError && (
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {mutation.error instanceof Error ? mutation.error.message : 'Something went wrong'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateRooms
