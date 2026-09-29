import { gsap } from '../../lib/gsap'
import EnlaceRuta from '../../components/EnlaceRuta'
import boton from '../../components/ui/Button.module.css'
import styles from './Comunes.module.css'

/*
 * TEMPORAL — titular y bajada compartidos por las variantes de Servicios,
 * iguales a los de Servicios.jsx para comparar solo la forma de la lista.
 */

export function Titular() {
  return (
    <h2 className={styles.titular}>
      <span className={styles.mascara}>
        <span className={styles.linea} data-sv="linea">
          Lo que hacemos por tu marca,
        </span>
      </span>
      <span className={styles.mascara}>
        <span className={`${styles.linea} ${styles.acento}`} data-sv="linea">
          en concreto
        </span>
      </span>
    </h2>
  )
}

export function Bajada() {
  return (
    <div className={styles.cierre}>
      <p className={styles.bajada}>
        Cada servicio funciona solo, pero juntos se potencian.
      </p>
      {/* Mismo estilo que el botón primario, pero con cortina de ruta */}
      <EnlaceRuta to="/servicios" className={`${boton.button} ${boton.primary}`}>
        Ver todos los servicios
      </EnlaceRuta>
    </div>
  )
}

// Reveal del titular desde la máscara, igual que Servicios.jsx. Llamar
// dentro de un matchMedia de movimiento permitido.
export function revelarTitular(raiz) {
  const lineas = raiz.querySelectorAll('[data-sv="linea"]')
  gsap.fromTo(
    lineas,
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
