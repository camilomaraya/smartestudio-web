import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { ScrollTrigger } from '../lib/gsap'
import { getLenis } from '../lib/lenis'
import { servicioPorSlug } from '../data/servicios'

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
}

/*
 * Nombre legible de una ficha.
 *
 * Sale de los datos, no del slug: "Diseño gráfico e identidad", no
 * "Diseno-grafico" capitalizado a mano.
 * Esto alimenta el título de la pestaña y el nombre que muestra la cortina
 * de transición, así que un slug mal capitalizado se vería en ambos.
 *
 * El respaldo desde el slug queda para lo que no esté en los datos.
 */
function desdeSlug(seccion, slug) {
  if (seccion === 'servicios') {
    const servicio = servicioPorSlug(slug)
    if (servicio) return servicio.titulo
  }

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
  if (slug) return desdeSlug(seccion, slug)
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
  if (slug) return `${desdeSlug(seccion, slug)} — ${nombre} — ${MARCA}`
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
  const { pathname, state } = useLocation()
  const primeraRuta = useRef(true)

  // El navegador no debe restaurar posiciones por su cuenta.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  /*
   * Antes de pintar la ruta nueva. Con Lenis activo hay que pasar por él:
   * un window.scrollTo se revierte en su siguiente frame.
   *
   * `resize()` antes del salto y `force: true` no son decoración:
   *
   * - Lenis cachea el límite de scroll y lo usa para clampear. Al cambiar de
   *   ruta ese límite todavía es el del documento anterior, y su estado
   *   interno sigue apuntando a la posición vieja. Sin remedir, el siguiente
   *   frame de Lenis reescribe esa posición —clampeada al alto nuevo— encima
   *   del reset, y la página abre por la mitad.
   * - `force` salta aunque Lenis se considere detenido o fuera de límites.
   *
   * Síntoma cuando falta: entrar a una ficha desde un home scrolleado deja
   * al visitante a mitad de la página nueva, sin haber visto la cabecera.
   */
  const irArriba = () => {
    const lenis = getLenis()
    if (lenis) {
      lenis.resize()
      lenis.scrollTo(0, { immediate: true, force: true })
    } else {
      window.scrollTo(0, 0)
    }
  }

  useLayoutEffectSeguro(() => {
    irArriba()
  }, [pathname])

  useEffect(() => {
    document.title = tituloDeRuta(pathname)

    // Doble rAF: la ruta nueva ya pintó y reservó alto cuando ScrollTrigger
    // vuelve a medir. Con un solo frame las alturas todavía son las viejas.
    let segundo = 0
    const primero = requestAnimationFrame(() => {
      segundo = requestAnimationFrame(() => {
        ScrollTrigger.refresh()

        /*
         * Reafirmar arriba después de remedir. `refresh()` restaura la
         * posición de scroll que encontró al empezar, y al venir de una ruta
         * más alta esa posición es la vieja clampeada al alto nuevo.
         *
         * No corre cuando la ruta pide un ancla: ahí Home hace su propio
         * salto tras el refresh (lib/navegacion.js) y esto lo pisaría,
         * dejando al visitante arriba en vez de en la sección que pidió.
         */
        if (!state?.scrollTo) irArriba()
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
