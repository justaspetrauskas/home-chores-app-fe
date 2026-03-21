import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

type DropdownOption = {
  value: string
  label: string
}

type DropdownSelectProps = {
  id?: string
  value: string
  options: DropdownOption[]
  placeholder: string
  onChange: (value: string) => void
  disabled?: boolean
  ariaLabel?: string
  className?: string
  menuClassName?: string
  optionClassName?: string
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  id,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  ariaLabel,
  className,
  menuClassName,
  optionClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [typeahead, setTypeahead] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const typeaheadTimeoutRef = useRef<number | null>(null)

  const selectedIndex = useMemo(() => options.findIndex((option) => option.value === value), [options, value])
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex]?.label : ''

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (event.target instanceof Node && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0
    setHighlightedIndex(nextIndex)
  }, [isOpen, selectedIndex])

  useEffect(() => {
    if (!isOpen) return
    const activeOption = optionRefs.current[highlightedIndex]
    activeOption?.scrollIntoView({ block: 'nearest' })
  }, [highlightedIndex, isOpen])

  useEffect(() => {
    return () => {
      if (typeaheadTimeoutRef.current) {
        window.clearTimeout(typeaheadTimeoutRef.current)
      }
    }
  }, [])

  const handleSelect = (nextValue: string) => {
    onChange(nextValue)
    setIsOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setIsOpen(true)
        return
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        setIsOpen(true)
      }
      return
    }

    if (event.key.length === 1 && /\S/.test(event.key)) {
      const nextQuery = `${typeahead}${event.key.toLowerCase()}`
      const startIndex = highlightedIndex >= 0 ? highlightedIndex + 1 : 0

      const findMatchIndex = (query: string) => {
        const lowered = options.map((option) => option.label.toLowerCase())
        for (let i = 0; i < lowered.length; i += 1) {
          const idx = (startIndex + i) % lowered.length
          if (lowered[idx]?.startsWith(query)) return idx
        }
        return -1
      }

      let nextIndex = findMatchIndex(nextQuery)
      if (nextIndex < 0) {
        nextIndex = findMatchIndex(event.key.toLowerCase())
      }

      if (nextIndex >= 0) {
        event.preventDefault()
        setHighlightedIndex(nextIndex)
      }

      setTypeahead(nextQuery)
      if (typeaheadTimeoutRef.current) {
        window.clearTimeout(typeaheadTimeoutRef.current)
      }
      typeaheadTimeoutRef.current = window.setTimeout(() => setTypeahead(''), 400)
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      setTypeahead('')
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((current) => (current + 1) % options.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((current) => (current - 1 + options.length) % options.length)
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      setHighlightedIndex(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      setHighlightedIndex(options.length - 1)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const highlighted = options[highlightedIndex]
      if (highlighted) {
        handleSelect(highlighted.value)
      }
      return
    }

    if (event.key === 'Tab') {
      setIsOpen(false)
      setTypeahead('')
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => !disabled && setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        disabled={disabled}
        className={
          className ??
          'h-10 w-full rounded-lg border border-stone-300 bg-white pl-3 pr-10 text-left text-sm text-stone-700 transition-colors hover:border-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 dark:hover:border-stone-500 dark:focus:border-amber-400 dark:focus:ring-amber-900'
        }
      >
        <span className={selectedLabel ? '' : 'text-stone-400 dark:text-stone-500'}>{selectedLabel || placeholder}</span>
        <ChevronDownIcon
          className={`pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-stone-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className={
            menuClassName ??
            'absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-stone-200 bg-white p-1 shadow-lg dark:border-stone-700 dark:bg-stone-800'
          }
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isHighlighted = index === highlightedIndex

            return (
              <button
                key={option.value || `option-${index}`}
                ref={(el) => {
                  optionRefs.current[index] = el
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(option.value)}
                className={
                  optionClassName ??
                  `w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200'
                      : isHighlighted
                        ? 'bg-stone-100 text-stone-900 dark:bg-stone-700 dark:text-stone-100'
                        : 'text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-700'
                  }`
                }
              >
                {option.label}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export type { DropdownOption }
export default DropdownSelect
