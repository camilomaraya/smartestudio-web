import { useEffect, useState } from 'react'
import { crearPatronIconos } from './atlasIconos'
import styles from './FondoIconos.module.css'

/*
 * Fallback liviano para mobile / low-power / reduced-motion / sin WebGL:
 * la misma textura de íconos de marca, como background repetido (PNG
 * generado una vez en un canvas 2D). Cero WebGL, cero loop de render.
 * El drift CSS es opcional y lo anula el bloque global de reduced-motion.
 */
export default function TexturaEstatica() {
  const [patron, setPatron] = useState(null)

  useEffect(() => {
    let activo = true
    crearPatronIconos()
      .then((resultado) => {
        if (activo) setPatron(resultado)
      })
      .catch(() => {
        // Si las fuentes no cargan, queda el resplandor CSS del contenedor.
      })
    return () => {
      activo = false
    }
  }, [])

  if (!patron) return null

  return (
    <div className={styles.wrap}>
      <div
        className={styles.patron}
        style={{
          backgroundImage: `url(${patron.url})`,
          backgroundSize: `${patron.tamano}px ${patron.tamano}px`,
        }}
      />
      {/* Resplandor dorado por encima de la textura */}
      <div className={styles.brillo} />
    </div>
  )
}
