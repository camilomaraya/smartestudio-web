import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { equipo } from '../data/equipo'
import styles from './Equipo.module.css'

/*
 * Equipo — cada persona es un carné. Al pasar el
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

export default function Equipo() {
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
    <section ref={scope} id="equipo" className={styles.equipo}>
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
                      <Retrato persona={persona} />
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
    </section>
  )
}

const iniciales = (nombre) =>
  nombre
    .split(' ')
    .map((parte) => parte[0])
    .join('')

// Marco 3:4 listo para la foto real: hoy lo ocupa el placeholder con
// iniciales; cuando llegue el retrato va acá dentro y nada se mueve.
function Retrato({ persona }) {
  return (
    <div className={styles.retrato}>
      <span className={styles.iniciales} aria-hidden="true">
        {iniciales(persona.nombre)}
      </span>
    </div>
  )
}

function Titular() {
  return (
    <h2 className={styles.titular}>
      {['Detrás de cada', 'publicación hay'].map((texto) => (
        <span key={texto} className={styles.mascara}>
          <span className={styles.linea} data-veq="linea">
            {texto}
          </span>
        </span>
      ))}
      <span className={styles.mascara}>
        <span className={`${styles.linea} ${styles.acento}`} data-veq="linea">
          tres personas
        </span>
      </span>
    </h2>
  )
}

function Bajada() {
  return (
    <p className={styles.bajada}>
      Somos un equipo chico a propósito: hablas con quien hace el trabajo, sin intermediarios ni
      cuentas que rebotan entre departamentos.
    </p>
  )
}

function revelarTitular(raiz) {
  gsap.fromTo(
    raiz.querySelectorAll('[data-veq="linea"]'),
    { yPercent: 110, y: 0 },
    {
      yPercent: 0,
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: { trigger: raiz, start: 'top 75%', once: true },
    },
  )
}
