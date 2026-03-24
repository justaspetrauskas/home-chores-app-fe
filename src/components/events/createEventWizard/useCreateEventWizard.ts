import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import type { HouseholdMember, HouseholdRoom } from '../../../types/household'
import { getQuickPickedRoomIds, getRoomTasks } from './roomTasks'
import type { DistributionMode, MemberDisplay, RecurrenceRule, RoomDisplay, RoomQuickPick } from './types'
import type { CreateEventData, CreateEventDraft } from './createEventTypes'
import { useEventDraftSession } from './useEventDraftSession'

type Params = {
  householdMembers: HouseholdMember[]
  householdRooms: HouseholdRoom[]
  onSubmit: (data: CreateEventData) => void
}

export function useCreateEventWizard({ householdMembers, householdRooms, onSubmit }: Params) {
  const draftSession = useEventDraftSession()
  const today = dayjs().format('YYYY-MM-DD')
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState(today)
  const [notificationDate, setNotificationDate] = useState(today)
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    householdMembers.map((member) => member.id ?? member.userId ?? '').filter(Boolean),
  )
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([])
  const [expandedRoomIds, setExpandedRoomIds] = useState<string[]>([])
  const [selectedPreviewRoomId, setSelectedPreviewRoomId] = useState<string>('')
  const [roomSearch, setRoomSearch] = useState('')
  const [distributionMode, setDistributionMode] = useState<DistributionMode>('random')
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule>('none')
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [notifyParticipants, setNotifyParticipants] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [lastCreatedName, setLastCreatedName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [pendingResumeDraft, setPendingResumeDraft] = useState<CreateEventDraft | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  const rooms = useMemo<RoomDisplay[]>(() => {
    return householdRooms
      .filter((room) => Boolean(room.id && room.name))
      .map((room) => ({ id: room.id as string, name: room.name as string }))
  }, [householdRooms])

  const memberDisplay = useMemo<MemberDisplay[]>(() => {
    return householdMembers
      .map((member) => ({
        id: member.id ?? member.userId ?? '',
        name: member.user?.name ?? member.user?.email ?? 'Unknown',
      }))
      .filter((member) => Boolean(member.id))
  }, [householdMembers])

  const filteredRooms = useMemo(() => {
    const normalizedSearch = roomSearch.trim().toLowerCase()
    if (!normalizedSearch) return rooms
    return rooms.filter((room) => room.name.toLowerCase().includes(normalizedSearch))
  }, [roomSearch, rooms])

  const selectedPreviewRoom = rooms.find((room) => room.id === selectedPreviewRoomId) ?? filteredRooms[0] ?? rooms[0]
  const selectedRoomCount = selectedRoomIds.length

  useEffect(() => {
    const draft = draftSession.readDraft()
    setPendingResumeDraft(draft)
    setIsHydrated(true)
  }, [draftSession])

  useEffect(() => {
    if (!isHydrated || pendingResumeDraft) return

    const draft: CreateEventDraft = {
      participants: selectedMemberIds,
      rooms: selectedRoomIds,
      date: eventDate || null,
      notificationDate: notificationDate || null,
      distributionType: distributionMode,
      eventName,
      recurrenceRule,
      notifyParticipants,
      currentStep,
    }

    draftSession.saveDraft(draft)
  }, [
    currentStep,
    distributionMode,
    draftSession,
    eventDate,
    eventName,
    isHydrated,
    notificationDate,
    notifyParticipants,
    pendingResumeDraft,
    recurrenceRule,
    selectedMemberIds,
    selectedRoomIds,
  ])

  const toggleRoomSelected = (roomId: string) => {
    setSelectedRoomIds((current) =>
      current.includes(roomId) ? current.filter((id) => id !== roomId) : [...current, roomId],
    )
    setFormError(null)
  }

  const toggleRoomExpanded = (roomId: string) => {
    setExpandedRoomIds((current) =>
      current.includes(roomId) ? current.filter((id) => id !== roomId) : [...current, roomId],
    )
  }

  const handleQuickPick = (pick: RoomQuickPick) => {
    setSelectedRoomIds(getQuickPickedRoomIds(rooms, pick))
    setFormError(null)
  }

  const handleToggleMember = (memberId: string) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    )
    setFormError(null)
  }

  const goToNextStep = () => {
    if (currentStep === 1 && selectedMemberIds.length === 0) {
      setFormError('Select at least one participant to continue.')
      return
    }

    if (currentStep === 2 && selectedRoomIds.length === 0) {
      setFormError('Select at least one room to continue.')
      return
    }

    setFormError(null)
    setCurrentStep((step) => Math.min(step + 1, 4))
  }

  const goToPreviousStep = () => {
    setFormError(null)
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedName = eventName.trim()

    if (!trimmedName || !eventDate || !notificationDate) {
      setFormError('Please fill in event name, event date, and notification date.')
      return
    }

    if (selectedMemberIds.length === 0) {
      setFormError('Select at least one participant before creating the event.')
      return
    }

    if (selectedRoomIds.length === 0) {
      setFormError('Select at least one room before creating the event.')
      return
    }

    if (notificationDate > eventDate) {
      setFormError('Notification date cannot be after the event date.')
      return
    }

    const selectedRooms = rooms.filter((room) => selectedRoomIds.includes(room.id))
    const chores = selectedRooms.flatMap((room) =>
      getRoomTasks(room.name).map((taskName) => ({
        name: taskName,
        roomId: room.id,
        roomName: room.name,
      })),
    )

    onSubmit({
      name: trimmedName,
      eventDate,
      notificationDate,
      memberIds: selectedMemberIds,
      roomIds: selectedRoomIds,
      chores,
      distributionMode,
      recurrenceRule,
      notifyParticipants,
    })
    draftSession.clearDraft()
    setPendingResumeDraft(null)
    setLastCreatedName(trimmedName)
    setCurrentStep(4)
    setFormError(null)
  }

  const resetWizardState = () => {
    setEventName('')
    setEventDate(today)
    setNotificationDate(today)
    setSelectedMemberIds(householdMembers.map((member) => member.id ?? member.userId ?? '').filter(Boolean))
    setSelectedRoomIds([])
    setExpandedRoomIds([])
    setSelectedPreviewRoomId('')
    setRoomSearch('')
    setDistributionMode('random')
    setRecurrenceRule('none')
    setNotifyParticipants(false)
    setFormError(null)
    setCurrentStep(1)
  }

  const handleCreateAnother = () => {
    draftSession.clearDraft()
    setPendingResumeDraft(null)
    resetWizardState()
  }

  const cancelFlow = () => {
    draftSession.clearDraft()
    setPendingResumeDraft(null)
    resetWizardState()
  }

  const discardResumeDraft = () => {
    draftSession.clearDraft()
    setPendingResumeDraft(null)
    resetWizardState()
  }

  const resumeDraft = () => {
    if (!pendingResumeDraft) return

    const validMemberIds = new Set(memberDisplay.map((member) => member.id))
    const validRoomIds = new Set(rooms.map((room) => room.id))

    setSelectedMemberIds(pendingResumeDraft.participants.filter((id) => validMemberIds.has(id)))
    setSelectedRoomIds(pendingResumeDraft.rooms.filter((id) => validRoomIds.has(id)))
    setEventDate(pendingResumeDraft.date ?? today)
    setNotificationDate(pendingResumeDraft.notificationDate ?? pendingResumeDraft.date ?? today)
    setDistributionMode(pendingResumeDraft.distributionType)
    setEventName(pendingResumeDraft.eventName)
    setRecurrenceRule(pendingResumeDraft.recurrenceRule)
    setNotifyParticipants(pendingResumeDraft.notifyParticipants)
    setCurrentStep(Math.max(1, Math.min(3, pendingResumeDraft.currentStep)))
    setFormError(null)
    setPendingResumeDraft(null)
  }

  return {
    today,
    currentStep,
    formError,
    hasResumeDraft: Boolean(pendingResumeDraft),
    memberDisplay,
    selectedMemberIds,
    filteredRooms,
    expandedRoomIds,
    selectedRoomIds,
    roomSearch,
    selectedRoomCount,
    selectedPreviewRoom,
    eventName,
    eventDate,
    notificationDate,
    distributionMode,
    recurrenceRule,
    showMoreOptions,
    notifyParticipants,
    lastCreatedName,
    setRoomSearch,
    setSelectedPreviewRoomId,
    setEventName,
    setEventDate,
    setNotificationDate,
    setDistributionMode,
    setRecurrenceRule,
    setNotifyParticipants,
    setShowMoreOptions,
    handleToggleMember,
    toggleRoomExpanded,
    toggleRoomSelected,
    goToNextStep,
    goToPreviousStep,
    handleSubmit,
    handleCreateAnother,
    cancelFlow,
    resumeDraft,
    discardResumeDraft,
    onQuickPickAll: () => handleQuickPick('all'),
    onQuickPickHighTraffic: () => handleQuickPick('high-traffic'),
    onQuickPickWetZones: () => handleQuickPick('wet-zones'),
    getRoomTasks,
    clearFormError: () => setFormError(null),
  }
}
