import React from 'react'
import Button from '../../ui/Button'

type Props = {
  onResume: () => void
  onStartFresh: () => void
  onCancel: () => void
}

const ResumeDraftNotice: React.FC<Props> = ({ onResume, onStartFresh, onCancel }) => {
  return (
    <div className="space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
      <div>
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200">Resume your in-progress event?</h2>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          We found a draft in this tab. Resume where you left off or start fresh.
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="secondary" onClick={onStartFresh}>
          Start fresh
        </Button>
        <Button type="button" onClick={onResume}>
          Resume draft
        </Button>
      </div>
    </div>
  )
}

export default ResumeDraftNotice
