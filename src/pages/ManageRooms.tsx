import React, { useMemo, useState } from 'react'
import {
  BeakerIcon,
  CubeIcon,
  CheckCircleIcon,
  FireIcon,
  GiftTopIcon,
  HeartIcon,
  HomeModernIcon,
  MapPinIcon,
  MinusCircleIcon,
  QueueListIcon,
  RectangleGroupIcon,
  SparklesIcon,
  SunIcon,
  TableCellsIcon,
  TvIcon,
  WrenchScrewdriverIcon,
  MoonIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import CardDescription from '../components/ui/CardDescription'
import CardHeader from '../components/ui/CardHeader'
import CardTitle from '../components/ui/CardTitle'
import Input from '../components/ui/Input'
import ToastMessage from '../components/ui/ToastMessage'
import RoomCard from '../components/households/RoomCard'
import { useCreateRoomMutation } from '../hooks/useCreateRoomMutation'
import { useDeleteRoomMutation } from '../hooks/useDeleteRoomMutation'
import { useUpdateRoomMutation } from '../hooks/useUpdateRoomMutation'
import { useCreateRoomsBulkMutation } from '../hooks/useCreateRoomsBulkMutation'
import { useHouseholdRoomsQuery, HOUSEHOLD_ROOMS_QUERY_KEY } from '../hooks/useHouseholdRoomsQuery'
import { useRoomTypesQuery } from '../hooks/useRoomTypesQuery'
import { queryClient } from '../lib/queryClient'
import type { RoomTypeResponse } from '../lib/roomApi'

type MockRoom = {
  id: string
  name: string
  originalName: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

type HouseholdRoom = {
  id: string
  name: string
}

type RoomTemplate = {
  id: string
  key: string
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

type IconSuggestion = {
  key: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  keywords: string[]
}

function getRoomTemplateIconByKey(roomTypeKey: string): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  const key = roomTypeKey.toLowerCase()

  if (key === 'bedroom') return MoonIcon
  if (key === 'living_room') return HomeModernIcon
  if (key === 'kitchen') return FireIcon
  if (key === 'bathroom') return BeakerIcon
  if (key === 'dining_room') return TableCellsIcon
  if (key === 'office') return QueueListIcon
  if (key === 'garage') return WrenchScrewdriverIcon
  if (key === 'laundry_room') return SparklesIcon
  if (key === 'storage') return CubeIcon
  if (key === 'balcony') return SunIcon
  if (key === 'hallway') return RectangleGroupIcon
  if (key === 'other') return MinusCircleIcon

  if (key.includes('bedroom')) return MoonIcon
  if (key.includes('living')) return HomeModernIcon
  if (key.includes('kitchen')) return FireIcon
  if (key.includes('bath')) return BeakerIcon
  if (key.includes('dining')) return TableCellsIcon
  if (key.includes('office')) return QueueListIcon
  if (key.includes('garage')) return WrenchScrewdriverIcon
  if (key.includes('laundry')) return SparklesIcon
  if (key.includes('storage')) return CubeIcon
  if (key.includes('balcony')) return SunIcon
  if (key.includes('hallway')) return RectangleGroupIcon
  if (key.includes('nursery')) return GiftTopIcon
  if (key.includes('gym')) return HeartIcon
  if (key.includes('theater') || key.includes('media')) return TvIcon

  return MapPinIcon
}

const iconSuggestions: IconSuggestion[] = [
  { key: 'bedroom', label: 'Bedroom', icon: MoonIcon, keywords: ['bedroom', 'sleep', 'master'] },
  { key: 'living', label: 'Living', icon: HomeModernIcon, keywords: ['living', 'family', 'lounge'] },
  { key: 'kitchen', label: 'Kitchen', icon: FireIcon, keywords: ['kitchen', 'cook'] },
  { key: 'bathroom', label: 'Bathroom', icon: BeakerIcon, keywords: ['bath', 'laundry', 'wash'] },
  { key: 'dining', label: 'Dining', icon: TableCellsIcon, keywords: ['dining', 'table'] },
  { key: 'office', label: 'Office', icon: QueueListIcon, keywords: ['office', 'work', 'study'] },
  { key: 'garage', label: 'Garage', icon: WrenchScrewdriverIcon, keywords: ['garage', 'tool', 'workshop'] },
  { key: 'storage', label: 'Storage', icon: CubeIcon, keywords: ['storage', 'closet', 'basement'] },
  { key: 'balcony', label: 'Balcony', icon: SunIcon, keywords: ['balcony', 'outdoor', 'patio'] },
  { key: 'hallway', label: 'Hallway', icon: RectangleGroupIcon, keywords: ['hall', 'entry', 'hallway'] },
]

const ManageRooms: React.FC = () => {
  const navigate = useNavigate()
  const { householdId } = useParams<{ householdId: string }>()
  const [localEdits, setLocalEdits] = useState<Record<string, string>>({})
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([])
  const [customRoomName, setCustomRoomName] = useState('')
  const [selectedCustomTypeId, setSelectedCustomTypeId] = useState<string | null>(null)
  const [selectedCustomIconKey, setSelectedCustomIconKey] = useState<string | null>(null)
  const [roomMutationError, setRoomMutationError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ open: boolean; title: string; description?: string; variant: 'success' | 'error' }>({ open: false, title: '', variant: 'success' })
  const { data: roomTypes = [], isLoading: isRoomTypesLoading, error: roomTypesError } = useRoomTypesQuery(isPickerOpen)
  const { data: fetchedRooms = [], isLoading: isRoomsLoading, error: roomsError } = useHouseholdRoomsQuery(householdId)
  const createRoomMutation = useCreateRoomMutation(householdId)
  const createRoomsBulkMutation = useCreateRoomsBulkMutation(householdId)
  const deleteRoomMutation = useDeleteRoomMutation()
  const updateRoomMutation = useUpdateRoomMutation()

  const rooms: HouseholdRoom[] = fetchedRooms.map((room) => ({
    id: room.id,
    name: localEdits[room.id] ?? room.name,
  }))

  const roomTemplates = useMemo<RoomTemplate[]>(
    () =>
      roomTypes.map((roomType) => ({
        id: roomType.id,
        key: roomType.key,
        name: roomType.label,
        icon: getRoomTemplateIconByKey(roomType.key),
      })),
    [roomTypes],
  )

  const suggestedRoomTypes = useMemo(() => {
    const value = customRoomName.trim().toLowerCase()

    if (!value) {
      return []
    }

    const matches = roomTemplates.filter(
      (template) => template.name.toLowerCase().includes(value) || template.key.toLowerCase().includes(value.replace(/\s+/g, '_')),
    )

    return matches.slice(0, 4)
  }, [customRoomName, roomTemplates])

  const suggestedIcons = useMemo(() => {
    const value = customRoomName.trim().toLowerCase()

    if (!value) {
      return []
    }

    const scored = iconSuggestions
      .map((item) => ({
        ...item,
        score: item.keywords.reduce((acc, keyword) => (value.includes(keyword) || keyword.includes(value) ? acc + 1 : acc), 0),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)

    const topMatches = scored.slice(0, 4)
    return topMatches.length > 0 ? topMatches : iconSuggestions.slice(0, 4)
  }, [customRoomName])

  const handleRoomNameChange = (roomId: string, value: string) => {
    setLocalEdits((current) => ({ ...current, [roomId]: value }))
  }

  const handleSaveRoom = async (roomId: string) => {
    const newName = localEdits[roomId]?.trim()
    if (!newName) return

    try {
      await updateRoomMutation.mutateAsync({ roomId, name: newName })
    } catch (error) {
      setToast({
        open: true,
        title: 'Failed to update room',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      })
      return
    }

    setLocalEdits((current) => {
      const updated = { ...current }
      delete updated[roomId]
      return updated
    })
    await queryClient.invalidateQueries({ queryKey: HOUSEHOLD_ROOMS_QUERY_KEY(householdId ?? '') })
    setToast({ open: true, title: 'Room updated', description: 'Room name has been saved.', variant: 'success' })
  }

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoomMutation.mutateAsync(roomId)
    } catch (error) {
      setToast({
        open: true,
        title: 'Failed to delete room',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      })
      return
    }

    setLocalEdits((current) => {
      const updated = { ...current }
      delete updated[roomId]
      return updated
    })
    await queryClient.invalidateQueries({ queryKey: HOUSEHOLD_ROOMS_QUERY_KEY(householdId ?? '') })
    setToast({ open: true, title: 'Room deleted', description: 'The room has been removed from your household.', variant: 'success' })
  }

  const handleOpenPicker = () => {
    setIsPickerOpen(true)
    setSelectedTemplateIds([])
    setCustomRoomName('')
    setSelectedCustomTypeId(null)
    setSelectedCustomIconKey(null)
    setRoomMutationError(null)
  }

  const handleToggleTemplateSelection = (templateId: string) => {
    setSelectedTemplateIds((current) =>
      current.includes(templateId) ? current.filter((item) => item !== templateId) : [...current, templateId],
    )
  }

  const handleConfirmTemplates = async () => {
    if (selectedTemplateIds.length === 0) {
      return
    }

    const selectedTemplates = roomTemplates.filter((template) => selectedTemplateIds.includes(template.id))

    if (selectedTemplates.length === 0) {
      return
    }

    setRoomMutationError(null)

    try {
      await createRoomsBulkMutation.mutateAsync({
        rooms: selectedTemplates.map((template) => ({
          roomTypeId: template.id,
        })),
      })
    } catch (error) {
      setRoomMutationError(error instanceof Error ? error.message : 'Failed to create selected rooms')
      return
    }

    await queryClient.invalidateQueries({ queryKey: HOUSEHOLD_ROOMS_QUERY_KEY(householdId ?? '') })
    setIsPickerOpen(false)
    setSelectedTemplateIds([])
  }

  const handleAddCustomRoom = async () => {
    const trimmedName = customRoomName.trim()

    if (!trimmedName) {
      return
    }

    const inferredRoomTypeId = selectedCustomTypeId || suggestedRoomTypes[0]?.id || roomTemplates.find((template) => template.key === 'other')?.id

    if (!inferredRoomTypeId) {
      setRoomMutationError('Please select a room type suggestion before creating a custom room')
      return
    }

    setRoomMutationError(null)

    try {
      await createRoomMutation.mutateAsync({
        name: trimmedName,
        roomTypeId: inferredRoomTypeId,
      })
    } catch (error) {
      setRoomMutationError(error instanceof Error ? error.message : 'Failed to create custom room')
      return
    }

    await queryClient.invalidateQueries({ queryKey: HOUSEHOLD_ROOMS_QUERY_KEY(householdId ?? '') })
    setCustomRoomName('')
    setSelectedCustomTypeId(null)
    setSelectedCustomIconKey(null)
  }

  return (
    <div className="space-y-6">
      <ToastMessage
        open={toast.open}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardHeader className="mb-0 p-0">
              <CardTitle>Manage Rooms</CardTitle>
              <CardDescription>Preview layout for household room management.</CardDescription>
            </CardHeader>

            <Button className="mt-4" variant="secondary" onClick={() => navigate(`/households/${householdId}`)}>
              Return
            </Button>
          </div>

          <Button type="button" className="flex items-center gap-1.5 self-start" onClick={handleOpenPicker}>
            <PlusIcon className="size-4" />
            Add Room
          </Button>
        </div>
      </Card>

      {isPickerOpen ? (
        <Card>
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-base">Choose Room Type</CardTitle>
            <CardDescription>Select one or more room options and confirm to add them to your household.</CardDescription>
          </CardHeader>

          <div className="space-y-6">
            {isRoomTypesLoading ? (
              <p className="text-sm text-stone-600 dark:text-stone-300">Loading room types...</p>
            ) : null}

            {roomTypesError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{roomTypesError.message}</p>
            ) : null}

            {!isRoomTypesLoading && !roomTypesError && roomTemplates.length === 0 ? (
              <p className="text-sm text-stone-600 dark:text-stone-300">No room types available.</p>
            ) : null}

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {roomTemplates.map((template) => {
                const Icon = template.icon
                const isSelected = selectedTemplateIds.includes(template.id)

                return (
                  <label
                    key={template.id}
                    className={`aspect-square cursor-pointer rounded-lg border p-2 transition-colors ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20'
                        : 'border-stone-200 bg-white hover:border-amber-300 dark:border-stone-700 dark:bg-stone-900/40 dark:hover:border-amber-600'
                    }`}
                  >
                    <div className="flex h-full flex-col">
                      <div className="flex justify-end">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleTemplateSelection(template.id)}
                          className="size-3.5 accent-amber-600"
                        />
                      </div>

                      <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
                        <div className="rounded-md bg-amber-100 p-1.5 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          <Icon className="size-4" />
                        </div>
                        <span className="line-clamp-2 text-[10px] font-medium leading-tight text-stone-700 dark:text-stone-200">
                          {template.name}
                        </span>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>

            <div className="space-y-3 rounded-lg border border-stone-200 bg-stone-50/60 p-3 dark:border-stone-700 dark:bg-stone-900/30">
              <label htmlFor="custom-room-name" className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Or create your own:
              </label>

              <Input
                id="custom-room-name"
                value={customRoomName}
                onChange={(event) => setCustomRoomName(event.target.value)}
                placeholder="Enter room name"
              />

              {customRoomName.trim() ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">Suggested icon</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedIcons.map((item) => {
                        const Icon = item.icon
                        const isSelected = selectedCustomIconKey === item.key

                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setSelectedCustomIconKey(item.key)}
                            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                              isSelected
                                ? 'border-amber-500 bg-amber-100 text-amber-800 dark:border-amber-400 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'border-stone-300 bg-white text-stone-700 hover:border-amber-300 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-600'
                            }`}
                          >
                            <Icon className="size-3.5" />
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">Suggested room type</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedRoomTypes.length > 0 ? (
                        suggestedRoomTypes.map((template) => {
                          const isSelected = selectedCustomTypeId === template.id

                          return (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => setSelectedCustomTypeId(template.id)}
                              className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-100 text-amber-800 dark:border-amber-400 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'border-stone-300 bg-white text-stone-700 hover:border-amber-300 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-600'
                              }`}
                            >
                              {template.name}
                            </button>
                          )
                        })
                      ) : (
                        <p className="text-xs text-stone-500 dark:text-stone-400">No type suggestions for this name yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleAddCustomRoom}
                      disabled={createRoomMutation.isPending || !customRoomName.trim()}
                    >
                      Add Custom Room
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {roomMutationError ? <p className="text-sm text-red-600 dark:text-red-400">{roomMutationError}</p> : null}

            <div className="flex justify-end gap-2 border-t border-stone-200 pt-4 dark:border-stone-700">
              <Button type="button" variant="secondary" onClick={() => setIsPickerOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmTemplates}
                disabled={
                  selectedTemplateIds.length === 0 ||
                  isRoomTypesLoading ||
                  roomTemplates.length === 0 ||
                  createRoomsBulkMutation.isPending
                }
              >
                <CheckCircleIcon className="size-4" />
                {selectedTemplateIds.length > 1 ? 'Confirm Rooms' : 'Confirm Room'}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {rooms.length === 0 && !isRoomsLoading ? (
        <Card>
          {roomsError ? (
            <p className="text-sm text-red-600 dark:text-red-400">{roomsError.message}</p>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <CardTitle className="text-base">No rooms yet</CardTitle>
              <CardDescription>Add predefined room types or create your own room to get started.</CardDescription>
              <Button type="button" onClick={handleOpenPicker} className="flex items-center gap-1.5">
                <PlusIcon className="size-4" />
                Add Room
              </Button>
            </div>
          )}
        </Card>
      ) : isRoomsLoading ? (
        <p className="text-sm text-stone-500 dark:text-stone-400">Loading rooms...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {rooms.map((room) => {
            const Icon = getRoomTemplateIconByKey(room.name.toLowerCase().replace(/\s+\d+$/, '').trim().replace(/\s+/g, '_'))
            const originalName = fetchedRooms.find((r) => r.id === room.id)?.name ?? room.name
            const hasChanges = room.name.trim() !== originalName

            return (
              <RoomCard
                key={room.id}
                roomName={room.name}
                icon={Icon}
                hasChanges={hasChanges}
                onNameChange={(value) => handleRoomNameChange(room.id, value)}
                onSave={() => handleSaveRoom(room.id)}
                onDelete={() => handleDeleteRoom(room.id)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ManageRooms
