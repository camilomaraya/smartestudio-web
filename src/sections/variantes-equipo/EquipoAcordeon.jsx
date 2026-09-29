import { useId, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { equipo } from '../../data/equipo'
import { Titular, Bajada, Retrato, revelarTitular } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './EquipoAcordeon.module.css'

/*
 * TEMPORAL — variante «Acordeón»: tres paneles altos lado a lado; el que
 * está bajo el mouse (o con foco, o tocado) se ensancha y muestra retrato,
 * cargo y bio. Los otros quedan angostos con el nombre en vertical.
 */
export default function EquipoAcordeon({ id, etiqueta }) {
  const scope = useRef(null)
  const base = useId()
  // Arranca con el del medio abierto
  const [activo, setActivo] = useState(Math.floor(equipo.length / 2))

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        revelarTitular(raiz)
        gsap.fromTo(
          raiz.querySelectorAll('[data-eqa="panel"]'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
            scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
          },
        )
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.acordeon}>
      <div className="container">
        <Titular />

        <ul className={styles.paneles}>
          {equipo.map((persona, i) => {
            const abierto = i === activo
            const idDetalle = `${base}-${persona.id}`
            return (
              <li
                key={persona.id}
                className={`${styles.panel} ${abierto ? styles.panelAbierto : ''}`}
                data-eqa="panel"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActivo(i)}
              >
                <button
                  type="button"
                  className={styles.cabecera}
                  aria-expanded={abierto}
                  aria-controls={idDetalle}
                  onClick={() => setActivo(i)}
                  onFocus={() => setActivo(i)}
                >
                  <span className={styles.numero}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.nombreVertical}>{persona.nombre}</span>
                </button>

                <div
                  id={idDetalle}
                  className={styles.detalle}
                  aria-hidden={!abierto}
                >
                  <Retrato persona={persona} className={styles.retrato} />
                  <div className={styles.texto}>
                    <p className={styles.cargo}>{persona.cargo}</p>
                    <h3 className={`titular ${styles.nombre}`}>{persona.nombre}</h3>
                    <p className={styles.bio}>{persona.bio}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <Bajada />
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
