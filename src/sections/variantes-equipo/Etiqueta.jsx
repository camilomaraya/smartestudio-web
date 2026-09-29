import styles from './Etiqueta.module.css'

/*
 * TEMPORAL — etiqueta de las variantes de Equipo en comparación. Se
 * borra junto con la carpeta `variantes-equipo/` al elegir una.
 */
export default function Etiqueta({ children }) {
  if (!children) return null
  return <p className={styles.etiqueta}>{children}</p>
}
