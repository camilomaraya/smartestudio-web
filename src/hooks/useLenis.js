import { useEffect } from 'react'
import { initLenis, destroyLenis } from '../lib/lenis'

// Monta Lenis al iniciar la app y lo limpia al desmontar.
export function useLenis() {
  useEffect(() => {
    initLenis()
    return () => destroyLenis()
  }, [])
}
