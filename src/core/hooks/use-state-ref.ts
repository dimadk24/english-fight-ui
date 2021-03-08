import { RefObject, useCallback, useRef, useState } from 'react'

/**
 * Combines React's useState and useRef hooks
 * Causes re-render when value changes and allows to use value inside closures
 * See https://stackoverflow.com/a/63039797/7119080
 * @param {any} defaultValue
 */
export default function useStateRef<T>(
  defaultValue: T
): [T, (newValue: T) => void, RefObject<T>] {
  const [state, setState] = useState(defaultValue)
  const ref = useRef(defaultValue)
  ref.current = state

  const setValue = useCallback((newValue) => {
    ref.current = newValue
    setState(newValue)
  }, [])

  return [state, setValue, ref]
}
