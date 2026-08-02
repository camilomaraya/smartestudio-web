import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router'
import { gsap } from '../lib/gsap'
import { nombreDeRuta } from '../hooks/useRutaScroll'
import { ContextoTransicion } from '../hooks/useTransicion'
import styles from './Transicion.module.css'

// Navegación normal: 900ms fijos — 420 de entrada + 60 de respiro + 420 de salida.
const DURACION = 0.42
const RESPIRO = 0.06
// Con ancla la espera es variable; este tope la acota a ~1300ms totales.
const TOPE_ESPERA = 460

/*
 * Cortina de transición entre rutas: cubrir, después navegar.
 *
 * El click no navega de inmediato. La cortina entra desde abajo, y recién
 * con la pantalla cubierta se llama a navigate(): ahí useRutaScroll hace su
 * reset de scroll y su ScrollTrigger.refresh() sin que se vea el salto.
 * Después la cortina sale hacia arriba — entra por abajo y sale por arriba,
 * un solo movimiento continuo, no un telón que va y vuelve.
 *
 * La cortina nace oculta por CSS (visibility: hidden). Si el JS falla, los
 * <a href> reales de EnlaceRuta siguen navegando: la transición se suma
 * encima del camino de la Fase 3a, no lo reemplaza.
 */
export default function Transicion({ children }) {
  const navigate = useNavigate()
  const tipoNavegacion = useNavigationType()
  const { key: claveUbicacion } = useLocation()

  const cortinaRef = useRef(null)
  const nombreRef = useRef(null)
  const timelineRef = useRef(null)
  const enCurso = useRef(false)
  // Solo en el camino con ancla: la salida queda en pausa hasta que Home
  // avisa que ya scrolleó (o hasta que salta el tope).
  const esperandoSenal = useRef(false)
  const topeRef = useRef(null)

  const [destino, setDestino] = useState(null)

  const finalizar = useCallback(() => {
    timelineRef.current = null
    enCurso.current = false
    setDestino(null)
  }, [])

  // Levanta la cortina. Se llama por la señal de scroll listo o por el tope;
  // el primero que llegue cancela al otro.
  const destapar = useCallback(() => {
    if (!esperandoSenal.current) return
    esperandoSenal.current = false
    clearTimeout(topeRef.current)
    topeRef.current = null

    const cortina = cortinaRef.current
    if (!cortina) {
      finalizar()
      return
    }

    const tl = gsap.timeline()
    timelineRef.current = tl
    tl.to(cortina, { yPercent: -100, duration: DURACION, ease: 'power3.inOut' })
      .set(cortina, { autoAlpha: 0, yPercent: 100 })
      .add(finalizar)
  }, [finalizar])

  /*
   * Señal de "ya scrolleé", que emite Home tras saltar al ancla.
   * Es seguro llamarla siempre: si no había espera —navegación normal, o
   * reduced motion donde nunca hubo cortina— no hace nada.
   */
  const avisarScrollListo = useCallback(() => destapar(), [destapar])

  const navegarCon = useCallback(
    (to, opciones) => {
      // Una a la vez: lo que se dispare durante una transición se ignora,
      // no se encola.
      if (enCurso.current) return

      const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // Con la pestaña en segundo plano el navegador congela los rAF: la
      // cortina no avanzaría y dejaría la navegación trabada. Además, no
      // tiene sentido animar algo que nadie está viendo.
      if (sinMovimiento || document.hidden || !cortinaRef.current) {
        navigate(to, opciones)
        return
      }

      // Llegar a un ancla del home implica un scroll después de montar, y
      // ese salto tiene que quedar detrás de la cortina.
      const hayAncla = Boolean(opciones?.state?.scrollTo)

      enCurso.current = true
      setDestino(typeof to === 'string' ? to : '/')

      // Un frame para que el nombre del destino esté en el DOM antes de
      // que la máscara lo anime.
      requestAnimationFrame(() => {
        const cortina = cortinaRef.current
        if (!cortina) {
          enCurso.current = false
          navigate(to, opciones)
          return
        }

        const tl = gsap.timeline()
        timelineRef.current = tl

        tl.set(cortina, { yPercent: 100, autoAlpha: 1 })
          .set(nombreRef.current, { yPercent: 110 })
          .to(cortina, { yPercent: 0, duration: DURACION, ease: 'power3.inOut' })
          // El nombre entra mientras la cortina cubre y sale con ella:
          // no retrasa la secuencia.
          .to(nombreRef.current, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 0.12)
          /*
           * Punto exacto de "ya está cubierto".
           *
           * El navigate se difiere un frame a propósito: si se llama dentro
           * del callback, React monta la página nueva en medio del tick del
           * ticker de GSAP, y las timelines que esa página crea al montar
           * (la máscara de CabeceraPagina, por ejemplo) nacen
           * desincronizadas y se quedan en su estado inicial — el titular
           * queda tapado por su propia máscara.
           */
          .add(() => {
            requestAnimationFrame(() => navigate(to, opciones))
            if (!hayAncla) return
            // La salida queda esperando la señal. El tope garantiza que la
            // cortina se levante igual si esa señal nunca llega.
            esperandoSenal.current = true
            topeRef.current = setTimeout(destapar, TOPE_ESPERA)
          }, DURACION)

        // Navegación normal: duración fija, la salida va encadenada.
        if (!hayAncla) {
          tl.to(
            cortina,
            { yPercent: -100, duration: DURACION, ease: 'power3.inOut' },
            DURACION + RESPIRO,
          )
            .set(cortina, { autoAlpha: 0, yPercent: 100 })
            .add(finalizar)
        }
      })
    },
    [navigate, destapar, finalizar],
  )

  /*
   * Si la pestaña se oculta con una transición en curso, los rAF se
   * congelan y la timeline quedaría a medias: la navegación sin terminar y
   * enCurso trabado en true, con lo que ningún enlace volvería a responder.
   * Se salta al estado final, que ya incluye navegar y limpiar.
   */
  useEffect(() => {
    const alCambiarVisibilidad = () => {
      if (!document.hidden) return
      // Si estaba esperando la señal del ancla, no va a llegar: se destapa.
      if (esperandoSenal.current) {
        destapar()
        timelineRef.current?.progress(1)
        return
      }
      timelineRef.current?.progress(1)
    }

    document.addEventListener('visibilitychange', alCambiarVisibilidad)
    return () => document.removeEventListener('visibilitychange', alCambiarVisibilidad)
  }, [destapar])

  /*
   * Atrás y adelante son instantáneos, sin cortina. Si un POP ocurre en
   * medio de una transición, se corta: la cortina no puede quedar tapando
   * ni bloqueando clicks.
   */
  useEffect(() => {
    if (tipoNavegacion !== 'POP' || !enCurso.current) return

    timelineRef.current?.kill()
    timelineRef.current = null
    // También corta la espera del ancla: su tope no debe destapar después.
    esperandoSenal.current = false
    clearTimeout(topeRef.current)
    topeRef.current = null
    enCurso.current = false
    gsap.set(cortinaRef.current, { autoAlpha: 0, yPercent: 100 })
    setDestino(null)
  }, [tipoNavegacion, claveUbicacion])

  // Al desmontar no puede quedar un tope pendiente disparando sobre nada.
  useEffect(() => () => clearTimeout(topeRef.current), [])

  return (
    <ContextoTransicion.Provider value={{ navegarCon, avisarScrollListo }}>
      {children}
      {/* Decorativa: el cambio de página lo anuncian el document.title y el
          foco al <main> que ya resuelve la Fase 3a. */}
      <div
        ref={cortinaRef}
        className={`${styles.cortina} ${destino ? styles.activa : ''}`}
        aria-hidden="true"
      >
        <span className={styles.mascara}>
          <span ref={nombreRef} className={`titular ${styles.nombre}`}>
            {destino ? nombreDeRuta(destino) : ''}
          </span>
        </span>
      </div>
    </ContextoTransicion.Provider>
  )
}
