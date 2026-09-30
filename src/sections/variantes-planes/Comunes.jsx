import { gsap } from '../../lib/gsap'
import { scrollToSection } from '../../lib/lenis'
import { notaPlanes } from '../../data/planes'
import styles from './Comunes.module.css'

/*
 * TEMPORAL — piezas compartidas por las variantes de Planes del home. Los
 * datos (precios, cantidades) son los reales de data/planes.js y no se
 * tocan: las variantes cambian solo la forma de mostrarlos.
 */

export const irAContacto = (evento) => {
  evento.preventDefault()
  scrollToSection('#contacto')
}

// Valor de una categoría con su texto para lector de pantalla, igual que
// en la tabla original
export function Valor({ valor, plan, categoria, className = '' }) {
  if (valor === null) {
    return (
      <span className={`${styles.no} ${className}`}>
        <span aria-hidden="true">—</span>
        <span className="visually-hidden">
          No incluido en {plan.nombre}: {categoria.etiqueta}
        </span>
      </span>
    )
  }
  if (valor === true) {
    return (
      <span className={`${styles.si} ${className}`}>
        <span aria-hidden="true">✓</span>
        <span className="visually-hidden">Incluido</span>
      </span>
    )
  }
  return <span className={className}>{valor}</span>
}

export function Titular() {
  return (
    <h2 className={styles.titular}>
      <span className={styles.mascara}>
        <span className={styles.linea} data-vpl="linea">
          Cuatro formas
        </span>
      </span>
      <span className={styles.mascara}>
        <span className={styles.linea} data-vpl="linea">
          de trabajar <span className={styles.acento}>juntxs</span>
        </span>
      </span>
    </h2>
  )
}

export function Cierre() {
  return (
    <div className={styles.cierre}>
      <p className={styles.adaptable}>
        ¿Necesitas algo más específico para tu empresa? Todo es conversable: los planes son un
        punto de partida, no una lista cerrada.{' '}
        <a href="#contacto" onClick={irAContacto} className={styles.enlace}>
          Armemos el tuyo
        </a>
      </p>
      <p className={styles.nota}>{notaPlanes}</p>
    </div>
  )
}

export function revelarTitular(raiz) {
  gsap.fromTo(
    raiz.querySelectorAll('[data-vpl="linea"]'),
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
