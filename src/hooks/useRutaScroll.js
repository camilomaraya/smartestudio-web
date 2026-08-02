import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { ScrollTrigger } from '../lib/gsap'
import { getLenis } from '../lib/lenis'

/*
 * useLayoutEffect no existe en el servidor: durante el prerender React
 * advertiría en cada build ("does nothing on the server"), y un warning
 * permanente acaba tapando los que sí importan. Mismo patrón que usa
 * @gsap/react internamente.
 */
const useLayoutEffectSeguro = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const MARCA = 'Smart Estudio'

const SECCIONES = {
  servicios: 'Servicios',
  proyectos: 'Proyectos',
}

// "villa-verla" → "Villa verla". Provisional: cuando exista src/data/
// el nombre real sale de ahí, no del slug.
function desdeSlug(slug) {
  const texto = slug.replace(/-/g, ' ')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/*
 * Nombre corto de la ruta, para la cortina de transición (Transicion.jsx).
 * Comparte SECCIONES y desdeSlug con el título del documento: el formato
 * del slug se define una sola vez, acá.
 */
export function nombreDeRuta(pathname) {
  if (pathname === '/') return 'Inicio'

  const [seccion, slug] = pathname.split('/').filter(Boolean)
  if (slug) return desdeSlug(slug)
  return SECCIONES[seccion] ?? MARCA
}

// Exportado para el prerender (lib/seo.js): el título de cada ruta se
// define una sola vez, acá, y sirve tanto en cliente como en build.
export function tituloDeRuta(pathname) {
  if (pathname === '/') {
    return `${MARCA} — Agencia de marketing digital · La Serena–Coquimbo`
  }

  const [seccion, slug] = pathname.split('/').filter(Boolean)
  const nombre = SECCIONES[seccion]

  if (!nombre) return `Página no encontrada — ${MARCA}`
  if (slug) return `${desdeSlug(slug)} — ${nombre} — ${MARCA}`
  return `${nombre} — ${MARCA}`
}

/*
 * Ciclo de vida del scroll entre rutas.
 *
 * Toda navegación arranca arriba, incluido el botón atrás: no hay
 * restauración de posición. Después de que la ruta nueva pinta,
 * ScrollTrigger vuelve a medir.
 */
export function useRutaScroll(mainRef) {
  const { pathname } = useLocation()
  const primeraRuta = useRef(true)

  // El navegador no debe restaurar posiciones por su cuenta.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Antes de pintar la ruta nueva. Con Lenis activo hay que pasar por él:
  // un window.scrollTo se revierte en su siguiente frame.
  useLayoutEffectSeguro(() => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  useEffect(() => {
    document.title = tituloDeRuta(pathname)

    // Doble rAF: la ruta nueva ya pintó y reservó alto cuando ScrollTrigger
    // vuelve a medir. Con un solo frame las alturas todavía son las viejas.
    let segundo = 0
    const primero = requestAnimationFrame(() => {
      segundo = requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    })

    // El foco se mueve solo en navegaciones reales: hacerlo en la primera
    // carga sería quitárselo al usuario sin que haya pedido nada.
    // preventScroll porque enfocar arrastra el scroll y pelearía con el reset.
    if (!primeraRuta.current) {
      mainRef.current?.focus({ preventScroll: true })
    }
    primeraRuta.current = false

    return () => {
      cancelAnimationFrame(primero)
      cancelAnimationFrame(segundo)
    }
  }, [pathname, mainRef])
}
