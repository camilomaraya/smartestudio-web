import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { ScrollTrigger } from '../lib/gsap'
import { getLenis, scrollToSection } from '../lib/lenis'
import { useTransicion } from '../hooks/useTransicion'
import Hero from '../sections/Hero'
import Manifiesto from '../sections/Manifiesto'
import Proceso from '../sections/Proceso'
import Servicios from '../sections/Servicios'
import Trabajos from '../sections/Trabajos'
import Planes from '../sections/Planes'
import Equipo from '../sections/Equipo'
import CTA from '../sections/CTA'

export default function Home() {
  const location = useLocation()
  const { avisarScrollListo } = useTransicion()

  /*
   * Llegada desde otra ruta con destino (ver lib/navegacion.js).
   *
   * El scroll se hace acá y no en el Layout porque las secciones del home
   * solo existen cuando este componente montó.
   */
  useEffect(() => {
    const destino = location.state?.scrollTo
    if (!destino) return

    // El state se limpia en el history directamente, sin pasar por el
    // router: un navigate() acá modificaría location.state — que es la
    // dependencia de este efecto — y volvería a dispararlo, además de
    // ensuciar la URL con "?index" al hacerlo desde la ruta índice.
    window.history.replaceState({ ...window.history.state, usr: null }, '')

    /*
     * ScrollTrigger.refresh() restaura la posición de scroll al remedir, así
     * que si se scrollea antes de que termine, la animación de Lenis se pisa
     * y queda en 0. useRutaScroll dispara ese refresh al cambiar de ruta:
     * acá se espera a que ocurra y se scrollea en el frame siguiente, en vez
     * de contar frames a ciegas.
     */
    let hecho = false
    const scrollear = () => {
      if (hecho) return
      hecho = true
      ScrollTrigger.removeEventListener('refresh', scrollear)

      /*
       * Espera a que la sección destino deje de moverse antes de saltar.
       * El hero es full-viewport y su canvas monta después: hasta que eso
       * asienta, todo lo que viene abajo se desplaza, y un scrollTo
       * calculado antes deja el scroll a mitad de camino. Se mide la
       * posición del propio destino, no el alto del documento, porque es
       * lo que determina a dónde hay que ir.
       * Tope de 30 frames (~0.5s) para no quedar esperando indefinidamente.
       */
      let posicionPrevia = -1
      let estables = 0
      let intentos = 0
      const cuandoEstable = () => {
        const elemento = document.getElementById(destino)
        const posicion = elemento
          ? Math.round(elemento.getBoundingClientRect().top + window.scrollY)
          : -1

        // Cuatro frames iguales, no dos: la posición pasa por valores
        // intermedios que se repiten un par de frames mientras las
        // secciones full-viewport toman su alto definitivo.
        estables = posicion === posicionPrevia ? estables + 1 : 0
        posicionPrevia = posicion
        intentos += 1

        if ((estables >= 4 && posicion > 0) || intentos > 40) {
          /*
           * Lenis cachea el límite de scroll (alto del documento menos el
           * viewport) y clampea cualquier destino a ese valor. Al llegar
           * desde otra ruta ese límite es el que midió cuando el home
           * todavía no existía, así que sin este resize el scroll se
           * detenía siempre en el mismo punto, fuera cual fuera la sección
           * pedida.
           */
          getLenis()?.resize()
          // Instantáneo: esto ocurre detrás de la cortina de transición.
          scrollToSection(`#${destino}`, { inmediato: true })
          /*
           * Recién ahora la cortina puede levantarse. Es seguro llamarlo
           * siempre: si no había cortina esperando —navegación normal, o
           * movimiento reducido, donde nunca se montó— no hace nada.
           */
          avisarScrollListo()
          return
        }
        requestAnimationFrame(cuandoEstable)
      }
      requestAnimationFrame(cuandoEstable)
    }

    ScrollTrigger.addEventListener('refresh', scrollear)
    // Respaldo: el scroll no puede quedar colgado si el refresh no llega
    // (por ejemplo, con la pestaña en segundo plano los rAF se congelan).
    const respaldo = setTimeout(scrollear, 500)

    return () => {
      ScrollTrigger.removeEventListener('refresh', scrollear)
      clearTimeout(respaldo)
    }
  }, [location.state])

  return (
    <div id="inicio">
      <Hero />
      <Manifiesto />
      <Proceso />
      <Servicios />
      <Trabajos />
      <Planes />
      <Equipo />
      <CTA />
    </div>
  )
}
