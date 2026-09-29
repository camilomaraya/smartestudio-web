import { gsap } from '../../lib/gsap'
import { proyectosPublicables } from '../../data/proyectos'
import EnlaceRuta from '../../components/EnlaceRuta'
import boton from '../../components/ui/Button.module.css'
import styles from './Comunes.module.css'

/*
 * TEMPORAL — piezas compartidas por las variantes de Proyectos del home.
 * El foco es el trabajo de Smart: la pieza y su tipo mandan; el cliente
 * aparece como crédito chico.
 */

// Todas las piezas publicables, aplanadas, con su proyecto como crédito.
// Intercala clientes (una pieza de cada uno por vuelta) para que ninguna
// secuencia quede con tres piezas seguidas del mismo.
export function todasLasPiezas() {
  const proyectos = proyectosPublicables()
  const salida = []
  const maximo = Math.max(0, ...proyectos.map((p) => p.piezas.length))
  for (let vuelta = 0; vuelta < maximo; vuelta += 1) {
    for (const proyecto of proyectos) {
      const pieza = proyecto.piezas[vuelta]
      if (pieza) salida.push({ ...pieza, slug: proyecto.slug, cliente: proyecto.nombre })
    }
  }
  return salida
}

export function Titular() {
  return (
    <h2 className={styles.titular}>
      {['Lo que se ve', 'es la mitad'].map((texto) => (
        <span key={texto} className={styles.mascara}>
          <span className={styles.linea} data-vp="linea">
            {texto}
          </span>
        </span>
      ))}
      <span className={styles.mascara}>
        <span className={`${styles.linea} ${styles.acento}`} data-vp="linea">
          del trabajo
        </span>
      </span>
    </h2>
  )
}

export function Cierre() {
  return (
    <div className={styles.cierre}>
      <EnlaceRuta to="/proyectos" className={`${boton.button} ${boton.primary}`}>
        Ver todos los proyectos
      </EnlaceRuta>
    </div>
  )
}

/*
 * Una pieza: enlace a la ficha de su proyecto. Proporción según el tipo.
 * `credito`: 'hover' (aparece al pasar el mouse o con foco) o 'siempre'.
 */
export function Pieza({ pieza, credito = 'hover', className = '', ...resto }) {
  return (
    <EnlaceRuta
      to={`/proyectos/${pieza.slug}`}
      className={`${styles.pieza} ${styles[pieza.tipo] ?? ''} ${
        credito === 'siempre' ? styles.creditoFijo : ''
      } ${className}`}
      aria-label={`${pieza.titulo}, ${pieza.tipo} para ${pieza.cliente}`}
      draggable={false}
      {...resto}
    >
      <span className={styles.marco}>
        <img src={pieza.src} alt="" loading="lazy" decoding="async" draggable={false} />
      </span>
      <span className={styles.rotulo} aria-hidden="true">
        <span className={styles.tipo}>{pieza.tipo}</span>
        <span className={styles.credito}>para {pieza.cliente}</span>
      </span>
    </EnlaceRuta>
  )
}

// Reveal del titular desde la máscara. Llamar dentro de un matchMedia de
// movimiento permitido.
export function revelarTitular(raiz) {
  gsap.fromTo(
    raiz.querySelectorAll('[data-vp="linea"]'),
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
