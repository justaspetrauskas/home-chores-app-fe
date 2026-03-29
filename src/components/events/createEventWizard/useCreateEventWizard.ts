import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import type { HouseholdMember, HouseholdRoom } from '../../../types/household'
import { getAllRoomIds, getRoomTasks } from './roomTasks'
import type { DistributionMode, MemberDisplay, RecurrenceRule, RoomDisplay } from './types'
import type { CreateEventData, CreateEventDraft } from './createEventTypes'
import { useEventDraftSession } from './useEventDraftSession'

type Params = {
  householdMembers: HouseholdMember[]
  householdRooms: HouseholdRoom[]
  onSubmit: (data: CreateEventData) => Promise<void>
}

export function useCreateEventWizard({ householdMembers, householdRooms, onSubmit }: Params) {
  const { readDraft, saveDraft, clearDraft } = useEventDraftSession()
  const today = dayjs().format('YYYY-MM-DD')
  const defaultEventDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
  const defaultNotificationDate = dayjs(defaultEventDate).subtract(1, 'day').format('YYYY-MM-DD')

  const isValidDateString = (value?: string | null) => {
    if (!value) return false
    return dayjs(value, 'YYYY-MM-DD', true).isValid()
  }

  const getSafeEventDate = (candidateDate?: string | null): string => {
    if (!isValidDateString(candidateDate)) return defaultEventDate
    return candidateDate as string
  }

  const getSafeNotificationDate = (_targetEventDate: string, candidateDate?: string | null): string => {
    if (!isValidDateString(candidateDate)) return defaultNotificationDate
    return candidateDate as string
  }

  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState(defaultEventDate)
  const [notificationDate, setNotificationDate] = useState(defaultNotificationDate)
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
  const [notifyParticipants, setNotifyParticipants] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [lastCreatedName, setLastCreatedName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [pendingResumeDraft, setPendingResumeDraft] = useState<CreateEventDraft | null>(() => readDraft())
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
    if (rooms.length <= 5 && roomSearch) {
      setRoomSearch('')
    }
  }, [rooms.length, roomSearch])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated || pendingResumeDraft) return

    if (currentStep === 4) {
      clearDraft()
      return
    }

    const hasMeaningfulProgress =
      currentStep > 1
      || eventName.trim().length > 0
      || selectedRoomIds.length > 0
      || roomSearch.trim().length > 0
      || distributionMode !== 'random'
      || recurrenceRule !== 'none'
      || notifyParticipants !== true

    if (!hasMeaningfulProgress) {
      clearDraft()
      return
    }

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

    saveDraft(draft)
  }, [
    currentStep,
    distributionMode,
    saveDraft,
    eventDate,
    eventName,
    isHydrated,
    notificationDate,
    notifyParticipants,
    pendingResumeDraft,
    recurrenceRule,
    roomSearch,
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

  const handleQuickPickAll = () => {
    setSelectedRoomIds(getAllRoomIds(rooms))
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

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

    const selectedRooms = rooms.filter((room) => selectedRoomIds.includes(room.id))
    const chores = selectedRooms.flatMap((room) =>
      getRoomTasks(room.name).map((taskName) => ({
        name: taskName,
        roomId: room.id,
        roomName: room.name,
      })),
    )

    setIsSubmitting(true)
    setFormError(null)

    try {
      await onSubmit({
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

      clearDraft()
      setPendingResumeDraft(null)
      setLastCreatedName(trimmedName)
      setCurrentStep(4)
      setFormError(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create event.'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetWizardState = () => {
    setEventName('')
    setEventDate(defaultEventDate)
    setNotificationDate(defaultNotificationDate)
    setSelectedMemberIds(householdMembers.map((member) => member.id ?? member.userId ?? '').filter(Boolean))
    setSelectedRoomIds([])
    setExpandedRoomIds([])
    setSelectedPreviewRoomId('')
    setRoomSearch('')
    setDistributionMode('random')
    setRecurrenceRule('none')
    setNotifyParticipants(true)
    setFormError(null)
    setCurrentStep(1)
  }

  const handleCreateAnother = () => {
    clearDraft()
    setPendingResumeDraft(null)
    resetWizardState()
  }

  const resetFlow = () => {
    clearDraft()
    setPendingResumeDraft(null)
    resetWizardState()
  }

  const cancelFlow = () => {
    clearDraft()
    setPendingResumeDraft(null)
    resetWizardState()
  }

  const discardResumeDraft = () => {
    clearDraft()
    setPendingResumeDraft(null)
    resetWizardState()
  }

  const resumeDraft = () => {
    if (!pendingResumeDraft) return

    const validMemberIds = new Set(memberDisplay.map((member) => member.id))
    const validRoomIds = new Set(rooms.map((room) => room.id))

    setSelectedMemberIds(pendingResumeDraft.participants.filter((id) => validMemberIds.has(id)))
    setSelectedRoomIds(pendingResumeDraft.rooms.filter((id) => validRoomIds.has(id)))
    const draftEventDate = getSafeEventDate(pendingResumeDraft.date)
    setEventDate(draftEventDate)
    setNotificationDate(getSafeNotificationDate(draftEventDate, pendingResumeDraft.notificationDate))
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
    totalRoomsCount: rooms.length,
    selectedPreviewRoom,
    eventName,
    eventDate,
    notificationDate,
    distributionMode,
    recurrenceRule,
    showMoreOptions,
    notifyParticipants,
    isSubmitting,
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
    resetFlow,
    cancelFlow,
    resumeDraft,
    discardResumeDraft,
    onQuickPickAll: handleQuickPickAll,
    getRoomTasks,
    clearFormError: () => setFormError(null),
  }
}
