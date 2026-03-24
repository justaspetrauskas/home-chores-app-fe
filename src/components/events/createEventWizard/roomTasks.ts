import type { RoomDisplay } from './types'

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

export function getAllRoomIds(rooms: RoomDisplay[]) {
  return rooms.map((room) => room.id)
}
