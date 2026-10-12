import { useEffect, useRef } from 'react'

/** Place le focus sur le titre de chaque nouvel écran (lecteurs d'écran, clavier). */
export function useFocusOnMount() {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
  }, [])
  return ref
}
