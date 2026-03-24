import type { RoomDisplay, RoomQuickPick } from './types'

export function getRoomTasks(roomName: string) {
  const normalized = roomName.toLowerCase()

  if (normalized.includes('kitchen')) {
    return ['Wipe counters', 'Clean sink', 'Check floor spills']
  }

  if (normalized.includes('bath')) {
    return ['Scrub sink and mirror', 'Refresh towels', 'Sanitize surfaces']
  }

  if (normalized.includes('living')) {
    return ['Straighten surfaces', 'Vacuum main area', 'Dust shelves']
  }

  if (normalized.includes('bed')) {
    return ['Reset bed area', 'Collect laundry', 'Dust side tables']
  }

  return ['Quick tidy', 'Wipe high-touch surfaces', 'Floor check']
}

export function getQuickPickedRoomIds(rooms: RoomDisplay[], pick: RoomQuickPick) {
  if (pick === 'all') {
    return rooms.map((room) => room.id)
  }

  if (pick === 'high-traffic') {
    return rooms.filter((room) => /kitchen|living|hall|entry|corridor/i.test(room.name)).map((room) => room.id)
  }

  return rooms.filter((room) => /bath|kitchen|laundry/i.test(room.name)).map((room) => room.id)
}
