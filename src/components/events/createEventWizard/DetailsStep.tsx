import React from 'react'
import Button from '../../ui/Button'
import DropdownSelect from '../../ui/DropdownSelect'
import Input from '../../ui/Input'
import Label from '../../ui/Label'
import SingleDayDatePicker from '../../ui/SingleDayDatePicker'
import type { DistributionMode, RecurrenceRule } from './types'

type Props = {
  eventName: string
  eventDate: string
  notificationDate: string
  distributionMode: DistributionMode
  recurrenceRule: RecurrenceRule
  showMoreOptions: boolean
  notifyParticipants: boolean
  isSubmitting: boolean
  onEventNameChange: (value: string) => void
  onEventDateChange: (value: string) => void
  onNotificationDateChange: (value: string) => void
  onDistributionModeChange: (value: DistributionMode) => void
  onRecurrenceRuleChange: (value: RecurrenceRule) => void
  onToggleMoreOptions: () => void
  onNotifyParticipantsChange: (value: boolean) => void
  onBack: () => void
}

const DetailsStep: React.FC<Props> = ({
  eventName,
  eventDate,
  notificationDate,
  distributionMode,
  recurrenceRule,
  showMoreOptions,
  notifyParticipants,
  isSubmitting,
  onEventNameChange,
  onEventDateChange,
  onNotificationDateChange,
  onDistributionModeChange,
  onRecurrenceRuleChange,
  onToggleMoreOptions,
  onNotifyParticipantsChange,
  onBack,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Step 3: Set event details</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Defaults: today, no repeat, random distribution.</p>
      </div>

      <div>
        <Label htmlFor="event-name">Event name</Label>
        <Input id="event-name" value={eventName} onChange={(e) => onEventNameChange(e.target.value)} placeholder="Kitchen Deep Clean" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="event-date">Event date</Label>
          <SingleDayDatePicker
            id="event-date"
            value={eventDate}
            onChange={onEventDateChange}
            placeholder="Select event date"
          />
        </div>
        <div>
          <Label htmlFor="notification-date">Notification date</Label>
          <SingleDayDatePicker
            id="notification-date"
            value={notificationDate}
            onChange={onNotificationDateChange}
            placeholder="Select notification date"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="distribution">Distribution</Label>
        <DropdownSelect
          id="distribution"
          value={distributionMode}
          onChange={(value) => onDistributionModeChange(value as DistributionMode)}
          options={[
            { value: 'random', label: 'Random distribution' },
            { value: 'balanced', label: 'Balanced distribution' },
          ]}
          placeholder="Select distribution"
          ariaLabel="Select distribution mode"
        />
      </div>

      <div>
        <button
          type="button"
          onClick={onToggleMoreOptions}
          className="text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
        >
          {showMoreOptions ? 'Hide more options' : 'More options'}
        </button>

        {showMoreOptions ? (
          <div className="mt-3 space-y-3 rounded-lg border border-stone-200 p-3 dark:border-stone-600">
            <div>
              <Label htmlFor="recurrence">Recurrence</Label>
              <select
                id="recurrence"
                value={recurrenceRule}
                onChange={(e) => onRecurrenceRuleChange(e.target.value as RecurrenceRule)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-200"
              >
                <option value="none">No repeat</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Every 2 weeks</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
        <input type="checkbox" checked={notifyParticipants} onChange={(e) => onNotifyParticipantsChange(e.target.checked)} className="size-4" />
        Notify participants right after creation
      </label>

      <div className="flex justify-between gap-2">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </Button>
      </div>
    </div>
  )
}

export default DetailsStep
