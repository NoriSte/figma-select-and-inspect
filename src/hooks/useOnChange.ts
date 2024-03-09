import { useEffect, useRef } from 'preact/hooks'

export function useOnChange<T>(value: T, onChange: (value: T) => void, debounceMs = 0) {
  const firstRun = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(-1)
  const debouncedValue = useRef<T>(value)

  useEffect(() => {
    // The first time the value did not change...
    if (firstRun.current) {
      firstRun.current = false
      return
    }

    if (debounceMs === 0) {
      onChange(value)
      return
    }

    debouncedValue.current = value
    timeoutRef.current = setTimeout(() => {
      onChange(debouncedValue.current)
    }, debounceMs)

    return () =>
      clearTimeout(timeoutRef.current)
  }, [value])

  function flushOnChange() {
    onChange(debouncedValue.current)
    clearTimeout(timeoutRef.current)
  }

  return flushOnChange
}
