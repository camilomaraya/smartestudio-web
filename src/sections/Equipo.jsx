import { useRef } from 'react'
import { equipo } from '../data/equipo'
import { gsap, useGSAP } from '../lib/gsap'
import styles from './Equipo.module.css'

/*
 * Equipo — sección de contenido del estándar nuevo (DESIGN.md §4).
 *
 * Deja de ser una grilla de `.card` con avatares circulares chicos: ahora
 * son tres retratos verticales grandes, sin caja, con el texto debajo. En
 * una agencia de tres personas el equipo ES el producto, y un círculo de
 * 80px con iniciales no comunica eso.
 *
 * Está pensado para que las fotos reales entren sin rediseñar nada: el
 * marco ya tiene su proporción 3:4 y hoy lo ocupa un placeholder con
 * iniciales. Cuando lleguen los retratos, se reemplaza el contenido del
 * marco y el layout no se mueve.
 *
 * El gesto propio: cada retrato se descubre de abajo hacia arriba con una
 * máscara, y su texto entra después. No es el reveal genérico ni el zigzag
 * de la sección E — un gesto por sección (§6).
 */
export default function Equipo() {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lineas = scope.current.querySelectorAll('[data-equipo="linea"]')
        const retratos = scope.current.querySelectorAll('[data-equipo="retrato"]')
        const textos = scope.current.querySelectorAll('[data-equipo="texto"]')
        const bajada = scope.current.querySelector('[data-equipo="bajada"]')

        gsap.set(lineas, { yPercent: 110, y: 0 })
        // El retrato nace recortado por abajo y se descubre; la escala
        // interna evita que el borde superior se vea entrar.
        gsap.set(retratos, { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(textos, { opacity: 0, y: 16 })
        gsap.set(bajada, { opacity: 0, y: 20 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: 'top 75%', once: true },
        })

        // fromTo con `y: 0` explícito: GSAP suma `y` y `yPercent`, y bajo el
        // doble montaje de StrictMode la segunda pasada duplicaría el
        // desplazamiento dejando el titular tapado por su máscara.
        tl.fromTo(
          lineas,
          { yPercent: 110, y: 0 },
          { yPercent: 0, y: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
        )
          .to(
            retratos,
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1,
              stagger: 0.12,
              ease: 'power3.inOut',
              // Sin clearProps: el clip-path final es el estado de reposo y
              // limpiarlo no cambia nada, pero dejarlo evita un repaint.
            },
            0.4,
          )
          .to(
            textos,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            },
            0.75,
          )
          .to(
            bajada,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            },
            '>-0.3',
          )
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="equipo" className={styles.equipo}>
      <div className="container">
        <h2 className={styles.titular}>
          <span className={styles.mascara}>
            <span className={styles.linea} data-equipo="linea">
              Detrás de cada
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={styles.linea} data-equipo="linea">
              publicación hay
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={`${styles.linea} ${styles.acento}`} data-equipo="linea">
              tres personas
            </span>
          </span>
        </h2>

        <ul className={styles.lista}>
          {equipo.map((persona) => {
            const iniciales = persona.nombre
              .split(' ')
              .map((parte) => parte[0])
              .join('')

            return (
              <li key={persona.id} className={styles.persona}>
                {/* Marco 3:4 listo para la foto real. Hoy lo ocupa el
                    placeholder de iniciales; cuando llegue el retrato se
                    reemplaza acá dentro y el layout no se mueve. */}
                <div className={styles.retrato} data-equipo="retrato">
                  <span className={styles.iniciales} aria-hidden="true">
                    {iniciales}
                  </span>
                </div>

                <div className={styles.texto} data-equipo="texto">
                  <h3 className={styles.nombre}>{persona.nombre}</h3>
                  <p className={styles.cargo}>{persona.cargo}</p>
                  <p className={styles.bio}>{persona.bio}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <p className={styles.bajada} data-equipo="bajada">
          Somos un equipo chico a propósito: hablas con quien hace el trabajo, sin
          intermediarios ni cuentas que rebotan entre departamentos.
        </p>
      </div>
    </section>
  )
}
