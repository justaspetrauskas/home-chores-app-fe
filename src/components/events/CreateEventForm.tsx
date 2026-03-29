import React from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import type { HouseholdMember, HouseholdRoom } from '../../types/household'
import CreatedStep from './createEventWizard/CreatedStep'
import DetailsStep from './createEventWizard/DetailsStep'
import ParticipantsStep from './createEventWizard/ParticipantsStep'
import ResumeDraftNotice from './createEventWizard/ResumeDraftNotice'
import RoomsStep from './createEventWizard/RoomsStep'
import StepIndicators from './createEventWizard/StepIndicators'
import type { CreateEventData } from './createEventWizard/createEventTypes'
import { useCreateEventWizard } from './createEventWizard/useCreateEventWizard'

export type { CreateEventData }

type Props = {
  householdMembers: HouseholdMember[]
  householdRooms: HouseholdRoom[]
  onSubmit: (data: CreateEventData) => Promise<void>
  onCancel: () => void
}

const CreateEventForm: React.FC<Props> = ({ householdMembers, householdRooms, onSubmit, onCancel }) => {
  const wizard = useCreateEventWizard({ householdMembers, householdRooms, onSubmit })

  const handleCancel = () => {
    wizard.cancelFlow()
    onCancel()
  }

  return (
    <Card className="mb-6">
      <form className="space-y-4" onSubmit={wizard.handleSubmit}>
        {wizard.hasResumeDraft ? (
          <ResumeDraftNotice onResume={wizard.resumeDraft} onStartFresh={wizard.discardResumeDraft} onCancel={handleCancel} />
        ) : null}

        {!wizard.hasResumeDraft ? (
          <div className="flex items-center justify-between gap-3">
            <StepIndicators currentStep={wizard.currentStep} />
            <Button type="button" variant="ghost" size="sm" onClick={wizard.resetFlow}>
              Reset
            </Button>
          </div>
        ) : null}

        {!wizard.hasResumeDraft && wizard.currentStep === 1 ? (
          <ParticipantsStep
            members={wizard.memberDisplay}
            selectedMemberIds={wizard.selectedMemberIds}
            onToggleMember={wizard.handleToggleMember}
            onCancel={handleCancel}
            onContinue={wizard.goToNextStep}
          />
        ) : null}

        {!wizard.hasResumeDraft && wizard.currentStep === 2 ? (
          <RoomsStep
            filteredRooms={wizard.filteredRooms}
            totalRoomsCount={wizard.totalRoomsCount}
            expandedRoomIds={wizard.expandedRoomIds}
            selectedRoomIds={wizard.selectedRoomIds}
            roomSearch={wizard.roomSearch}
            selectedRoomCount={wizard.selectedRoomCount}
            selectedPreviewRoom={wizard.selectedPreviewRoom}
            onQuickPickAll={wizard.onQuickPickAll}
            onRoomSearchChange={wizard.setRoomSearch}
            onToggleRoomExpanded={wizard.toggleRoomExpanded}
            onToggleRoomSelected={wizard.toggleRoomSelected}
            onSelectPreviewRoom={wizard.setSelectedPreviewRoomId}
            getRoomTasks={wizard.getRoomTasks}
            onBack={wizard.goToPreviousStep}
            onContinue={wizard.goToNextStep}
          />
        ) : null}

        {!wizard.hasResumeDraft && wizard.currentStep === 3 ? (
          <DetailsStep
            eventName={wizard.eventName}
            eventDate={wizard.eventDate}
            notificationDate={wizard.notificationDate}
            distributionMode={wizard.distributionMode}
            recurrenceRule={wizard.recurrenceRule}
            showMoreOptions={wizard.showMoreOptions}
            notifyParticipants={wizard.notifyParticipants}
            isSubmitting={wizard.isSubmitting}
            onEventNameChange={wizard.setEventName}
            onEventDateChange={wizard.setEventDate}
            onNotificationDateChange={wizard.setNotificationDate}
            onDistributionModeChange={wizard.setDistributionMode}
            onRecurrenceRuleChange={wizard.setRecurrenceRule}
            onToggleMoreOptions={() => wizard.setShowMoreOptions((current) => !current)}
            onNotifyParticipantsChange={wizard.setNotifyParticipants}
            onBack={wizard.goToPreviousStep}
          />
        ) : null}

        {!wizard.hasResumeDraft && wizard.currentStep === 4 ? (
          <CreatedStep
            lastCreatedName={wizard.lastCreatedName}
            notifyParticipants={wizard.notifyParticipants}
            onCreateAnother={wizard.handleCreateAnother}
            onDone={handleCancel}
          />
        ) : null}

        {!wizard.hasResumeDraft && wizard.formError ? <p className="text-sm text-red-600 dark:text-red-400">{wizard.formError}</p> : null}
      </form>
    </Card>
  )
}

export default CreateEventForm
