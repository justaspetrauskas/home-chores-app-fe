import { useCallback, useState } from 'react'

const SELECTED_HOUSEHOLD_STORAGE_KEY = 'selectedHouseholdId'

export function getSelectedHouseholdStorageValue(): string | null {
  return localStorage.getItem(SELECTED_HOUSEHOLD_STORAGE_KEY)
}

export function clearSelectedHouseholdStorage() {
  localStorage.removeItem(SELECTED_HOUSEHOLD_STORAGE_KEY)
}

export function useSelectedHouseholdStorage() {
  const [value, setValueState] = useState<string | null>(() => getSelectedHouseholdStorageValue())

  const setValue = useCallback((householdId: string) => {
    localStorage.setItem(SELECTED_HOUSEHOLD_STORAGE_KEY, householdId)
    setValueState(householdId)
  }, [])

  const clearValue = useCallback(() => {
    clearSelectedHouseholdStorage()
    setValueState(null)
  }, [])

  const refreshValue = useCallback(() => {
    setValueState(getSelectedHouseholdStorageValue())
  }, [])

  return { value, setValue, clearValue, refreshValue }
}
