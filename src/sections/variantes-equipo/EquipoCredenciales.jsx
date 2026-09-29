import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { equipo } from '../../data/equipo'
import { Titular, Bajada, Retrato, revelarTitular } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './EquipoCredenciales.module.css'

/*
 * TEMPORAL — variante «Credenciales»: cada persona es un carné. Al pasar el
 * mouse, o al tocar el botón de girar, la credencial da vuelta y muestra
 * la bio y en qué te ayuda.
 *
 * POR CONFIRMAR CON ABBY: qué servicios toca cada una (acá sale del cargo).
 */
const AYUDA = {
  'abby-herrera': ['Community Management', 'Contenido mensual', 'Tus mensajes y comentarios'],
  'danae-reyes': ['Identidad de marca', 'Diseño gráfico', 'Línea visual para redes'],
  'abraham-flores': ['Fotografía', 'Reels y video', 'Sesiones para redes'],
}
// Giro de reposo de cada credencial «sobre la mesa»
const GIROS = [-3, 1.5, -1]

export default function EquipoCredenciales({ id, etiqueta }) {
  const scope = useRef(null)
  const [volteadas, setVolteadas] = useState(() => new Set())

  const voltear = (personaId) =>
    setVolteadas((prev) => {
      const siguiente = new Set(prev)
      if (siguiente.has(personaId)) siguiente.delete(personaId)
      else siguiente.add(personaId)
      return siguiente
    })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        revelarTitular(raiz)
        // Llegan como si alguien las dejara sobre la mesa. El giro de
        // reposo lo pone la propiedad CSS rotate; GSAP solo suma el giro
        // extra de la caída y lo lleva a 0.
        gsap.fromTo(
          raiz.querySelectorAll('[data-eqc="credencial"]'),
          { opacity: 0, y: -60, rotation: (i) => GIROS[i] * 3 },
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
          },
        )
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.credenciales}>
      <div className="container">
        <Titular />

        <ul className={styles.mesa}>
          {equipo.map((persona, i) => {
            const volteada = volteadas.has(persona.id)
            return (
              <li
                key={persona.id}
                className={styles.lugar}
                style={{ '--giro': `${GIROS[i]}deg` }}
              >
                <div className={styles.credencial} data-eqc="credencial">
                  <div className={`${styles.giro} ${volteada ? styles.volteada : ''}`}>
                    {/* Frente */}
                    <div className={`${styles.cara} ${styles.frente}`} aria-hidden={volteada}>
                      <span className={styles.ranura} aria-hidden="true" />
                      <div className={styles.encabezado}>
                        <span>Smart Estudio</span>
                        <span className={styles.codigo}>SMART-{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <Retrato persona={persona} className={styles.retrato} />
                      <h3 className={`titular ${styles.nombre}`}>{persona.nombre}</h3>
                      <p className={styles.cargo}>{persona.cargo}</p>
                    </div>

                    {/* Dorso */}
                    <div className={`${styles.cara} ${styles.dorso}`} aria-hidden={!volteada}>
                      <p className={styles.cargo}>{persona.nombre}</p>
                      <p className={styles.bio}>{persona.bio}</p>
                      <p className={styles.ayudaTitulo}>En qué te ayuda</p>
                      <ul className={styles.ayuda}>
                        {AYUDA[persona.id]?.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.voltear}
                  aria-pressed={volteada}
                  onClick={() => voltear(persona.id)}
                >
                  {volteada ? 'Ver credencial' : `Conocer a ${persona.nombre.split(' ')[0]}`}
                  <span aria-hidden="true"> ↻</span>
                </button>
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
