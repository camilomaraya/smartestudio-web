import styles from './Pieza.module.css'

/*
 * Una pieza como botón, con la proporción de su tipo. Tocarla la abre en
 * grande (DialogoPieza.jsx). El rótulo (tipo y título) aparece al pasar el
 * mouse o con foco.
 *
 * Por defecto mide `--alto-pieza` de alto (la cinta del home); `className`
 * permite que una grilla la mida por el ancho.
 */
export default function Pieza({ pieza, className = '', ...resto }) {
  return (
    <button
      type="button"
      className={`${styles.pieza} ${styles[pieza.tipo] ?? ''} ${className}`}
      data-n={pieza.n}
      aria-label={`${pieza.titulo} (${pieza.tipo}). Ver en grande`}
      {...resto}
    >
      <span className={styles.marco} data-marco>
        <img src={pieza.src} alt="" loading="lazy" decoding="async" draggable={false} />
      </span>
      <span className={styles.rotulo} aria-hidden="true">
        <span className={styles.tipo}>{pieza.tipo}</span>
        <span className={styles.titulo}>{pieza.titulo}</span>
      </span>
    </button>
  )
}
