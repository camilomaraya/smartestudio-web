import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { equipo } from '../../data/equipo'
import { Titular, Bajada, Retrato, revelarTitular } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './EquipoQuien.module.css'

/*
 * TEMPORAL — variante «¿Quién hace qué?»: eliges una tarea y se ilumina
 * quién la hace. Responde «¿con quién voy a hablar?», la promesa de la
 * bajada.
 *
 * POR CONFIRMAR CON ABBY: el reparto de tareas (acá sale de los cargos).
 */
const TAREAS = [
  { id: 'identidad', texto: 'Tu identidad visual', quienes: ['danae-reyes'] },
  { id: 'publicaciones', texto: 'Tus publicaciones y comunidad', quienes: ['abby-herrera'] },
  { id: 'fotos', texto: 'Tu sesión de fotos o reel', quienes: ['abraham-flores'] },
  { id: 'pauta', texto: 'Tu campaña de pauta', quienes: ['abby-herrera', 'danae-reyes'] },
]

const nombresDe = (ids) =>
  equipo
    .filter((p) => ids.includes(p.id))
    .map((p) => p.nombre.split(' ')[0])
    .join(' y ')

export default function EquipoQuien({ id, etiqueta }) {
  const scope = useRef(null)
  const [tareaId, setTareaId] = useState('publicaciones')
  const tarea = TAREAS.find((t) => t.id === tareaId)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        revelarTitular(raiz)
        gsap.fromTo(
          raiz.querySelectorAll('[data-eqq="entra"]'),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
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
    <section ref={scope} id={id} className={styles.quien}>
      <div className="container">
        <Titular />

        <p className={styles.pregunta} data-eqq="entra">
          ¿Qué necesitas? Te mostramos quién lo hace.
        </p>
        <ul className={styles.tareas} data-eqq="entra">
          {TAREAS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                aria-pressed={t.id === tareaId}
                className={`${styles.tarea} ${t.id === tareaId ? styles.tareaActiva : ''}`}
                onClick={() => setTareaId(t.id)}
              >
                {t.texto}
              </button>
            </li>
          ))}
        </ul>

        <p className={styles.respuesta} aria-live="polite">
          {tarea.texto}: {tarea.quienes.length > 1 ? 'lo hacen' : 'lo hace'}{' '}
          <strong>{nombresDe(tarea.quienes)}</strong>.
        </p>

        <ul className={styles.personas}>
          {equipo.map((persona) => {
            const encendida = tarea.quienes.includes(persona.id)
            return (
              <li
                key={persona.id}
                className={`${styles.persona} ${encendida ? styles.encendida : styles.apagada}`}
                data-eqq="entra"
              >
                <Retrato persona={persona} className={styles.retrato} />
                <h3 className={styles.nombre}>{persona.nombre}</h3>
                <p className={styles.cargo}>{persona.cargo}</p>
                {/* La bio se despliega solo en quien hace la tarea */}
                <div className={styles.bioCaja}>
                  <p className={styles.bio}>{persona.bio}</p>
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
