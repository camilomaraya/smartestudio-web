import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, Flip } from '../lib/gsap'
import { getLenis } from '../lib/lenis'
import styles from './ProyectosDialogo.module.css'

/*
 * Vista previa de una pieza de la cinta (sections/Proyectos.jsx): la pieza
 * vuela desde la cinta al centro (Flip) y queda al lado de su texto, con la
 * cinta desenfocada detrás. Flechas para pasar a la siguiente; Esc o un
 * clic afuera la devuelven a la copia de la cinta más cercana al centro de
 * la pantalla.
 *
 * Muestra la pieza y el texto «detrás»; el cliente no aparece.
 */

const ID_FLIP = 'vista-previa'
// Proporción de cada tipo, la misma que usa la cinta
const RATIO = { reel: 9 / 16, historia: 9 / 16, web: 16 / 10, informe: 16 / 10 }
const ratio = (tipo) => RATIO[tipo] ?? 4 / 5
const conMovimiento = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function DialogoPieza({ piezas, inicial, origen, raiz, onCerrar }) {
  const [n, setN] = useState(inicial)
  const dialogo = useRef(null)
  const grande = useRef(null)
  const cerrando = useRef(false)
  const nPrevio = useRef(inicial)
  const idTitulo = useId()
  const pieza = piezas[n]
  const marcoOrigen = origen.querySelector('[data-marco]')

  // Apertura
  useLayoutEffect(() => {
    const d = dialogo.current
    getLenis()?.stop()
    d.querySelector('[data-cerrar]')?.focus({ preventScroll: true })

    // En un contexto: el doble montaje de StrictMode revierte la primera
    // pasada entera en vez de apilar dos aperturas
    const ctx = gsap.context(() => {
      if (conMovimiento()) {
        marcoOrigen.dataset.flipId = ID_FLIP
        const estado = Flip.getState(marcoOrigen)
        gsap.set(marcoOrigen, { autoAlpha: 0 })
        Flip.from(estado, {
          targets: grande.current,
          duration: 0.7,
          ease: 'power3.inOut',
          scale: true,
        })
        gsap.from(d.querySelector('[data-dp="fondo"]'), { opacity: 0, duration: 0.4 })
        gsap.from(d.querySelectorAll('[data-dp="texto"] > *'), {
          opacity: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.06,
          delay: 0.35,
          ease: 'power3.out',
        })
      } else {
        gsap.set(marcoOrigen, { autoAlpha: 0 })
      }
    })

    return () => {
      ctx.revert()
      getLenis()?.start()
      gsap.set(marcoOrigen, { clearProps: 'opacity,visibility' })
    }
  }, [marcoOrigen])

  // Al pasar a otra pieza: la original vuelve a su lugar en la cinta y el
  // contenido cambia con un fundido corto
  useEffect(() => {
    // Compara con la pieza anterior y no con «primer render»: StrictMode
    // corre los efectos dos veces al montar
    if (n === nPrevio.current) return
    nPrevio.current = n
    gsap.set(marcoOrigen, { clearProps: 'opacity,visibility' })
    if (!conMovimiento()) return
    gsap.fromTo(
      [
        grande.current.querySelector('img'),
        ...dialogo.current.querySelectorAll('[data-dp="texto"] > :not(nav)'),
      ],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' },
    )
  }, [n, marcoOrigen])

  const ir = (delta) => setN((actual) => (actual + delta + piezas.length) % piezas.length)

  const cerrar = () => {
    if (cerrando.current) return
    cerrando.current = true
    const d = dialogo.current
    d.style.pointerEvents = 'none'
    const destino = masCentrada(raiz.current, n)
    const terminar = () => {
      ;(destino ?? origen).focus({ preventScroll: true })
      onCerrar()
    }

    if (!conMovimiento()) return terminar()
    if (!destino) {
      gsap.to(d, { opacity: 0, duration: 0.3, onComplete: terminar })
      return
    }

    const marcoDestino = destino.querySelector('[data-marco]')
    marcoDestino.dataset.flipId = ID_FLIP
    const estado = Flip.getState(grande.current)
    gsap.set(marcoOrigen, { clearProps: 'opacity,visibility' })
    gsap.set(marcoDestino, { autoAlpha: 1 })
    grande.current.style.visibility = 'hidden'
    gsap.to(d.querySelectorAll('[data-dp="fondo"], [data-dp="texto"], [data-cerrar]'), {
      opacity: 0,
      duration: 0.35,
    })
    // La cinta de la pieza queda por encima de la otra mientras vuela
    const ventana = destino.closest('[data-vc="ventana"]')
    if (ventana) ventana.style.zIndex = '3'
    Flip.from(estado, {
      targets: marcoDestino,
      duration: 0.6,
      ease: 'power3.inOut',
      scale: true,
      onComplete: () => {
        if (ventana) ventana.style.zIndex = ''
        terminar()
      },
    })
  }

  const alTeclear = (evento) => {
    if (evento.key === 'Escape') cerrar()
    else if (evento.key === 'ArrowRight') ir(1)
    else if (evento.key === 'ArrowLeft') ir(-1)
    else if (evento.key === 'Tab') {
      const focusables = [...dialogo.current.querySelectorAll('a[href], button')]
      const primero = focusables[0]
      const ultimo = focusables[focusables.length - 1]
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primero.focus()
      }
    }
  }

  return createPortal(
    <div
      ref={dialogo}
      className={styles.dialogo}
      role="dialog"
      aria-modal="true"
      aria-labelledby={idTitulo}
      onKeyDown={alTeclear}
      data-lenis-prevent
    >
      <div className={styles.fondo} data-dp="fondo" onClick={cerrar} />

      <div className={styles.contenido}>
        <div
          ref={grande}
          className={styles.grande}
          style={{ '--ratio': ratio(pieza.tipo) }}
          data-flip-id={ID_FLIP}
        >
          <img src={pieza.src} alt="" />
        </div>

        <div className={styles.texto} data-dp="texto">
          <p className={styles.tipo}>{pieza.tipo}</p>
          <h3 id={idTitulo} className={styles.titulo}>
            {pieza.titulo}
          </h3>
          <p className={styles.detras}>{pieza.detras}</p>
          <nav className={styles.navegacion} aria-label="Otras piezas">
            <button type="button" onClick={() => ir(-1)} aria-label="Pieza anterior">
              ‹
            </button>
            <span>
              {n + 1} / {piezas.length}
            </span>
            <button type="button" onClick={() => ir(1)} aria-label="Pieza siguiente">
              ›
            </button>
          </nav>
        </div>
      </div>

      <button
        type="button"
        className={styles.cerrar}
        onClick={cerrar}
        data-cerrar
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>,
    document.body,
  )
}

// Copia de la pieza `n` en la cinta más cercana al centro de la pantalla
function masCentrada(raiz, n) {
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  let mejor = null
  let distancia = Infinity
  raiz?.querySelectorAll(`[data-n="${n}"]`).forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.right < 0 || r.left > window.innerWidth || r.bottom < 0 || r.top > window.innerHeight)
      return
    const d = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy)
    if (d < distancia) {
      distancia = d
      mejor = el
    }
  })
  return mejor
}
