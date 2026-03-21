import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import Datepicker, { type DateValueType } from 'react-tailwindcss-datepicker'

type SingleDayDatePickerProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SingleDayDatePicker: React.FC<SingleDayDatePickerProps> = ({ id, value, onChange, placeholder = 'Select date' }) => {
  const datepickerValue = useMemo<DateValueType>(
    () => ({
      startDate: value || null,
      endDate: value || null,
    }),
    [value],
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
      showShortcuts={false}
      showFooter={false}
      placeholder={placeholder}
      inputClassName="w-full rounded-lg border border-stone-300 bg-white pl-3 pr-10 py-2 text-stone-900 placeholder:text-stone-400 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
      toggleClassName="absolute right-0 top-0 h-full px-3 flex items-center text-stone-500 hover:text-stone-800 dark:text-stone-300 dark:hover:text-stone-100"
      containerClassName="relative w-full"
      primaryColor="amber"
    />
  )
}

export default SingleDayDatePicker
