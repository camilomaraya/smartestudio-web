import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { ScrollTrigger } from '../lib/gsap'
import { getLenis, scrollToSection } from '../lib/lenis'
import { useTransicion } from '../hooks/useTransicion'
import Hero from '../sections/Hero'
import Manifiesto from '../sections/Manifiesto'
import Correccion from '../components/Correccion'
import ServiciosPreview from '../sections/variantes-servicios/ServiciosPreview'
import ServiciosApilados from '../sections/variantes-servicios/ServiciosApilados'
import ProyectosCinta from '../sections/variantes-proyectos/ProyectosCinta'
import ProyectosCollage from '../sections/variantes-proyectos/ProyectosCollage'
import ProyectosCarrusel from '../sections/variantes-proyectos/ProyectosCarrusel'
import PlanesEscalera from '../sections/variantes-planes/PlanesEscalera'
import PlanesRecomendador from '../sections/variantes-planes/PlanesRecomendador'
import EquipoAcordeon from '../sections/variantes-equipo/EquipoAcordeon'
import EquipoCredenciales from '../sections/variantes-equipo/EquipoCredenciales'
import EquipoQuien from '../sections/variantes-equipo/EquipoQuien'
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
    let cancelado = false
    let frame = 0
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
      let posicionPrevia = null
      let estables = 0
      let intentos = 0

      /*
       * Salta y CONFIRMA. Un solo scrollTo no alcanza: entre el salto y el
       * frame siguiente hay varios actores que pueden dejar el scroll en
       * otro lado —el reset de ruta de useRutaScroll, el `refresh()` de
       * ScrollTrigger restaurando la posición que midió al empezar, el pin
       * de la sección F creando su pin-spacer, el canvas del hero tomando
       * su alto—. Cuál de ellos gana depende del orden en que caigan los
       * frames, y por eso el fallo era intermitente: a veces la sección
       * quedaba centrada y a veces el visitante aterrizaba arriba de todo.
       *
       * En vez de adivinar el instante correcto, se verifica el resultado y
       * se reintenta. Es idempotente y barato: si el primer salto quedó
       * bien, la comprobación del frame siguiente no hace nada.
       */
      let reintentos = 0
      const saltar = () => {
        if (cancelado) return
        const elemento = document.getElementById(destino)
        if (!elemento) return terminar()

        // Lenis cachea el límite de scroll (alto del documento menos el
        // viewport) y clampea cualquier destino a ese valor. Al llegar desde
        // otra ruta ese límite es el que midió cuando el home todavía no
        // existía, así que sin este resize el scroll se detiene siempre en el
        // mismo punto, fuera cual fuera la sección pedida.
        getLenis()?.resize()
        // Instantáneo: esto ocurre detrás de la cortina de transición.
        scrollToSection(`#${destino}`, { inmediato: true })

        frame = requestAnimationFrame(() => {
          if (cancelado) return
          const distancia = Math.abs(elemento.getBoundingClientRect().top)
          // 4px de tolerancia: scrollToSection aplica un offset de -8px y el
          // redondeo subpíxel del navegador nunca deja el top exacto en 0.
          const llego = distancia <= 12
          reintentos += 1
          if (llego || reintentos >= 8) return terminar()
          saltar()
        })
      }

      /*
       * Recién ahora la cortina puede levantarse. Es seguro llamarlo
       * siempre: si no había cortina esperando —navegación normal, o
       * movimiento reducido, donde nunca se montó— no hace nada.
       */
      const terminar = () => {
        if (cancelado) return
        avisarScrollListo()
      }

      const cuandoEstable = () => {
        if (cancelado) return
        const elemento = document.getElementById(destino)
        const posicion = elemento
          ? Math.round(elemento.getBoundingClientRect().top + window.scrollY)
          : null

        /*
         * Cuatro frames iguales, no dos: la posición pasa por valores
         * intermedios que se repiten un par de frames mientras las secciones
         * full-viewport toman su alto definitivo.
         *
         * `null` (la sección todavía no montó) no cuenta como estable: antes
         * se usaba -1 y cuatro frames sin elemento se leían como "ya se
         * asentó", disparando el salto contra una posición que no existía.
         */
        estables = posicion !== null && posicion === posicionPrevia ? estables + 1 : 0
        posicionPrevia = posicion
        intentos += 1

        if ((estables >= 4 && posicion > 0) || intentos > 40) {
          saltar()
          return
        }
        frame = requestAnimationFrame(cuandoEstable)
      }
      frame = requestAnimationFrame(cuandoEstable)
    }

    ScrollTrigger.addEventListener('refresh', scrollear)
    // Respaldo: el scroll no puede quedar colgado si el refresh no llega
    // (por ejemplo, con la pestaña en segundo plano los rAF se congelan).
    const respaldo = setTimeout(scrollear, 500)

    return () => {
      // `cancelado` corta las cadenas de rAF: sin esto, el doble montaje de
      // StrictMode deja la cadena de la primera pasada corriendo contra un
      // Home ya desmontado, peleándose por el scroll con la segunda.
      cancelado = true
      cancelAnimationFrame(frame)
      ScrollTrigger.removeEventListener('refresh', scrollear)
      clearTimeout(respaldo)
    }
  }, [location.state])

  return (
    <div id="inicio">
      <Hero />
      <Manifiesto id="manifiesto" />
      <Correccion />
      {/* TEMPORAL: variantes de Servicios para comparar. Al elegir una, dejar
          solo esa (con id="servicios") en lugar de sections/Servicios.jsx y
          borrar sections/variantes-servicios. */}
      <ServiciosPreview id="servicios" etiqueta="Servicios: vista previa" />
      <ServiciosApilados etiqueta="Servicios: apilados" />
      <ServiciosApilados largo etiqueta="Servicios: apilados, texto largo" />
      {/* TEMPORAL: variantes de Proyectos para comparar. Al elegir una,
          dejarla (con id="detras") en lugar de sections/Detras.jsx y borrar
          sections/variantes-proyectos. */}
      <ProyectosCinta id="detras" etiqueta="Proyectos: cinta" />
      <ProyectosCollage etiqueta="Proyectos: collage" />
      <ProyectosCarrusel etiqueta="Proyectos: carrusel" />
      {/* TEMPORAL: variantes de Planes para comparar. Al elegir una, dejarla
          (con id="planes", ancla del botón del hero) en lugar de
          sections/Planes.jsx y borrar sections/variantes-planes. */}
      <PlanesEscalera id="planes" etiqueta="Planes: escalera" />
      <PlanesRecomendador etiqueta="Planes: arma tu plan" />
      {/* TEMPORAL: variantes de Equipo para comparar. Al elegir una,
          dejarla (con id="equipo") en lugar de sections/Equipo.jsx y borrar
          sections/variantes-equipo. */}
      <EquipoAcordeon id="equipo" etiqueta="Equipo: acordeón" />
      <EquipoCredenciales etiqueta="Equipo: credenciales" />
      <EquipoQuien etiqueta="Equipo: ¿quién hace qué?" />
      <CTA />
    </div>
  )
}
