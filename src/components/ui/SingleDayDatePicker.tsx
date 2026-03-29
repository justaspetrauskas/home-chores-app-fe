import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import Datepicker, { type DateValueType } from 'react-tailwindcss-datepicker'

type SingleDayDatePickerProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
}

const SingleDayDatePicker: React.FC<SingleDayDatePickerProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
}) => {
  const minimumDate = useMemo(() => minDate ?? null, [minDate])
  const maximumDate = useMemo(() => maxDate ?? null, [maxDate])
  const clampToBounds = (date: dayjs.Dayjs) => {
    if (minimumDate) {
      const min = dayjs(minimumDate)
      if (date.isBefore(min, 'day')) return min
    }

    if (maximumDate) {
      const max = dayjs(maximumDate)
      if (date.isAfter(max, 'day')) return max
    }

    return date
  }

  const shortcutConfigs = useMemo(() => {
    const today = dayjs().startOf('day')
    const tomorrow = clampToBounds(today.add(1, 'day'))
    const inAWeek = clampToBounds(today.add(7, 'day'))

    let nextSaturday = today.day(6)
    if (!nextSaturday.isAfter(today, 'day')) {
      nextSaturday = nextSaturday.add(1, 'week')
    }
    nextSaturday = clampToBounds(nextSaturday)

    return {
      shortcuts: {
        tomorrow: {
          text: 'Tomorrow',
          period: { start: tomorrow.toDate(), end: tomorrow.toDate() },
        },
        nextSaturday: {
          text: 'Next Saturday',
          period: { start: nextSaturday.toDate(), end: nextSaturday.toDate() },
        },
        inAWeek: {
          text: 'In a Week',
          period: { start: inAWeek.toDate(), end: inAWeek.toDate() },
        },
      },
    }
  }, [minimumDate, maximumDate])

  const selectedDate = useMemo(() => {
    if (!value) return null
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.toDate() : null
  }, [value])

  const datepickerValue = useMemo<DateValueType>(
    () => ({
      startDate: selectedDate,
      endDate: selectedDate,
    }),
    [selectedDate],
  )

  const handleDateChange = (nextValue: DateValueType) => {
    const selectedDate = nextValue?.startDate

    if (!selectedDate) {
      onChange('')
      return
    }

    onChange(dayjs(selectedDate).format('YYYY-MM-DD'))
  }

  return (
    <Datepicker
      inputId={id}
      value={datepickerValue}
      onChange={handleDateChange}
      useRange={false}
      asSingle={true}
      displayFormat="YYYY-MM-DD"
      showShortcuts={true}
      showFooter={false}
      configs={shortcutConfigs}
      placeholder={placeholder}
      minDate={minimumDate ?? undefined}
      maxDate={maximumDate ?? undefined}
      inputClassName="w-full rounded-lg border border-stone-300 bg-white pl-3 pr-10 py-2 text-stone-900 placeholder:text-stone-400 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
      toggleClassName="absolute right-0 top-0 h-full px-3 flex items-center text-stone-500 hover:text-stone-800 dark:text-stone-300 dark:hover:text-stone-100"
      containerClassName="relative w-full"
      primaryColor="amber"
    />
  )
}

export default SingleDayDatePicker
