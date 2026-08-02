import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import styles from './CabeceraPagina.module.css'

/*
 * Cabecera de página: el h1 del estándar nuevo (DESIGN.md §4).
 *
 * Las líneas llegan ya partidas a propósito — cada corte es una decisión de
 * composición, no un wrap automático. El último fragmento va dorado y no
 * hay eyebrow: el titular se sostiene solo.
 */
export default function CabeceraPagina({ lineas, bajada }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lineasEl = scope.current.querySelectorAll('[data-cabecera="linea"]')
        const bajadaEl = scope.current.querySelector('[data-cabecera="bajada"]')

        // Estado inicial vía JS: si el JS falla, la cabecera queda visible.
        gsap.set(lineasEl, { yPercent: 110, y: 0 })
        if (bajadaEl) gsap.set(bajadaEl, { opacity: 0, y: 20 })

        /*
         * fromTo con `y: 0` explícito, no `to` con solo yPercent.
         *
         * GSAP guarda `y` (px) y `yPercent` como componentes separadas y las
         * suma. Al navegar con la cortina, este bloque corre dos veces (doble
         * montaje de StrictMode) y la segunda pasada lee el transform que
         * dejó la primera —translateY(64px)— como `y: 64`, le suma otra vez
         * el 110% y el titular termina al doble de desplazamiento, recortado
         * por su propia máscara. Fijar ambas componentes lo hace
         * independiente del estado en que encuentre al elemento.
         * Las líneas conservan su transform: la máscara es estructura.
         */
        const tl = gsap.timeline()
        tl.fromTo(
          lineasEl,
          { yPercent: 110, y: 0 },
          { yPercent: 0, y: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
        )

        if (bajadaEl) {
          tl.to(
            bajadaEl,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            },
            0.4,
          )
        }
      })
    },
    { scope },
  )

  return (
    <header ref={scope} className={styles.cabecera}>
      <div className="container">
        <h1 className={styles.titulo}>
          {lineas.map((linea, indice) => (
            <span key={linea} className={styles.mascara}>
              <span
                className={`${styles.linea} ${
                  indice === lineas.length - 1 ? styles.acento : ''
                }`}
                data-cabecera="linea"
              >
                {linea}
              </span>
            </span>
          ))}
        </h1>

        {bajada && (
          <p className={styles.bajada} data-cabecera="bajada">
            {bajada}
          </p>
        )}
      </div>
    </header>
  )
}
