import React, { useState } from 'react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Label from '../ui/Label'
import Button from '../ui/Button'
import SingleDayDatePicker from '../ui/SingleDayDatePicker'
import EventMemberPicker from './EventMemberPicker'
import EventChoreList, { type EventChore } from './EventChoreList'
import type { HouseholdMember, HouseholdRoom } from '../../types/household'

export type CreateEventData = {
  name: string
  eventDate: string
  notificationDate: string
  memberIds: string[]
  chores: EventChore[]
}

type Props = {
  householdMembers: HouseholdMember[]
  householdRooms: HouseholdRoom[]
  onSubmit: (data: CreateEventData) => void
  onCancel: () => void
}

const CreateEventForm: React.FC<Props> = ({ householdMembers, householdRooms, onSubmit, onCancel }) => {
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [notificationDate, setNotificationDate] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [chores, setChores] = useState<EventChore[]>([])
  const [choreInput, setChoreInput] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleToggleMember = (memberId: string) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    )
  }

  const handleAddChore = () => {
    const trimmed = choreInput.trim()
    if (!trimmed) return

    const selectedRoom = householdRooms.find((room) => room.id === selectedRoomId)
    const roomId = selectedRoom?.id
    const roomName = selectedRoom?.name
    if (!roomId || !roomName) {
      setFormError('Please choose a room before adding a chore.')
      return
    }

    const exists = chores.some((chore) => chore.name.toLowerCase() === trimmed.toLowerCase() && chore.roomId === roomId)
    if (exists) return

    setChores((current) => [...current, { name: trimmed, roomId, roomName }])
    setChoreInput('')
    setFormError(null)
  }

  const handleChoreInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddChore()
    }
  }

  const handleRemoveChore = (chore: EventChore) => {
    setChores((current) => current.filter((c) => !(c.name === chore.name && c.roomId === chore.roomId)))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedName = eventName.trim()

    if (!trimmedName || !eventDate || !notificationDate) {
      setFormError('Please fill in event name, event date, and notification date.')
      return
    }

    if (notificationDate > eventDate) {
      setFormError('Notification date cannot be after the event date.')
      return
    }

    onSubmit({ name: trimmedName, eventDate, notificationDate, memberIds: selectedMemberIds, chores })
  }

  const handleCancel = () => {
    setFormError(null)
    onCancel()
  }

  return (
    <Card className="mb-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="event-name">Event name</Label>
          <Input
            id="event-name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Kitchen Deep Clean"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="event-date">Event date</Label>
            <SingleDayDatePicker id="event-date" value={eventDate} onChange={setEventDate} placeholder="Select event date" />
          </div>
          <div>
            <Label htmlFor="notification-date">Notification date</Label>
            <SingleDayDatePicker
              id="notification-date"
              value={notificationDate}
              onChange={setNotificationDate}
              placeholder="Select notification date"
            />
          </div>
        </div>

        <EventMemberPicker members={householdMembers} selectedMemberIds={selectedMemberIds} onToggle={handleToggleMember} />

        {formError ? <p className="text-sm text-red-600 dark:text-red-400">{formError}</p> : null}

        <EventChoreList
          chores={chores}
          rooms={householdRooms.filter((room) => Boolean(room.id && room.name)).map((room) => ({ id: room.id as string, name: room.name as string }))}
          choreInput={choreInput}
          selectedRoomId={selectedRoomId}
          onChoreInputChange={setChoreInput}
          onSelectedRoomIdChange={setSelectedRoomId}
          onAddChore={handleAddChore}
          onRemoveChore={handleRemoveChore}
          onKeyDown={handleChoreInputKeyDown}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </Card>
  )
}

export default CreateEventForm
