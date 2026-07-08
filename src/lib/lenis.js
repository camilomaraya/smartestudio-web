import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

// Instancia única de Lenis para toda la app, sincronizada con ScrollTrigger.
let lenis = null
let tickerCallback = null

export function initLenis() {
  if (lenis) return lenis

  // Respeta prefers-reduced-motion: sin scroll suave.
  // ScrollTrigger funciona igual con el scroll nativo.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  lenis = new Lenis()

  // Punto crítico: cada scroll de Lenis actualiza las mediciones de ScrollTrigger.
  lenis.on('scroll', ScrollTrigger.update)

  // Un solo raf: el ticker de GSAP maneja a Lenis (Lenis espera milisegundos).
  tickerCallback = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tickerCallback)

  // Sin suavizado de lag: evita saltos de medición entre Lenis y ScrollTrigger.
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function destroyLenis() {
  if (!lenis) return
  gsap.ticker.remove(tickerCallback)
  tickerCallback = null
  lenis.destroy()
  lenis = null
}

export function getLenis() {
  return lenis
}

// Scroll a una sección por selector ("#planes") o elemento.
// Con fallback nativo cuando Lenis está desactivado (reduced motion).
export function scrollToSection(target) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -8 })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ block: 'start' })
}
