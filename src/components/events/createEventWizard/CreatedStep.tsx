import React from 'react'
import Button from '../../ui/Button'

type Props = {
  lastCreatedName: string
  notifyParticipants: boolean
  onCreateAnother: () => void
  onDone: () => void
}

const CreatedStep: React.FC<Props> = ({ lastCreatedName, notifyParticipants, onCreateAnother, onDone }) => {
  return (
    <div className="space-y-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-900/20">
      <div>
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">Step 4: Event created</h2>
        <p className="text-sm text-emerald-800 dark:text-emerald-300">
          {lastCreatedName ? `${lastCreatedName} was created successfully.` : 'Your event was created successfully.'}
        </p>
      </div>
      <p className="text-sm text-stone-700 dark:text-stone-300">
        {notifyParticipants ? 'Participants were marked for notification.' : 'You can notify participants later.'}
      </p>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCreateAnother}>
          Create another
        </Button>
        <Button type="button" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  )
}

export default CreatedStep
