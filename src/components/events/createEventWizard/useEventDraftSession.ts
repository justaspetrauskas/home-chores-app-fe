import { useCallback } from 'react'
import type { CreateEventDraft } from './createEventTypes'

const DRAFT_KEY = 'create-event-flow-draft-v1'

export function useEventDraftSession() {
  const readDraft = useCallback((): CreateEventDraft | null => {
    if (typeof window === 'undefined') return null

    const raw = window.sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return null

    try {
      return JSON.parse(raw) as CreateEventDraft
    } catch {
      return null
    }
  }, [])

  const saveDraft = useCallback((draft: CreateEventDraft) => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [])

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return
    window.sessionStorage.removeItem(DRAFT_KEY)
  }, [])

  return {
    readDraft,
    saveDraft,
    clearDraft,
  }
}
