import { gsap } from '../../lib/gsap'
import styles from './Comunes.module.css'

/*
 * TEMPORAL — piezas compartidas por las variantes de Equipo del home. Los
 * datos son los de data/equipo.js, sin tocar.
 */

export const iniciales = (nombre) =>
  nombre
    .split(' ')
    .map((parte) => parte[0])
    .join('')

// Marco 3:4 listo para la foto real: hoy lo ocupa el placeholder con
// iniciales; cuando llegue el retrato va acá dentro y nada se mueve.
export function Retrato({ persona, className = '' }) {
  return (
    <div className={`${styles.retrato} ${className}`}>
      <span className={styles.iniciales} aria-hidden="true">
        {iniciales(persona.nombre)}
      </span>
    </div>
  )
}

export function Titular() {
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

export function Bajada() {
  return (
    <p className={styles.bajada}>
      Somos un equipo chico a propósito: hablas con quien hace el trabajo, sin intermediarios ni
      cuentas que rebotan entre departamentos.
    </p>
  )
}

export function revelarTitular(raiz) {
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
