import { useRef, useState } from 'react'
import Pieza from './Pieza'
import DialogoPieza from './DialogoPieza'
import styles from './GaleriaPiezas.module.css'

/*
 * Piezas quietas que se abren en grande (DialogoPieza.jsx): la tira del
 * índice de Servicios y la grilla de cada ficha. Todas a la misma altura y
 * cada una con la proporción de su tipo, así la mezcla de formatos arma el
 * ritmo sin recortar nada.
 *
 * `limite` corta lo que se ve (la tira muestra unas pocas), pero el diálogo
 * recorre todas las `piezas`: las que no están a la vista se funden al
 * cerrar en vez de volar.
 */
export default function GaleriaPiezas({ piezas, limite, variante = 'grilla', etiqueta }) {
  const scope = useRef(null)
  const [abierta, setAbierta] = useState(null) // { n, origen }

  if (piezas.length === 0) return null

  // `n`: posición en la lista, para que el diálogo encuentre la pieza
  const conIndice = piezas.map((pieza, n) => ({ ...pieza, n }))
  const visibles = limite ? conIndice.slice(0, limite) : conIndice

  return (
    <div ref={scope} className={`${styles.galeria} ${styles[variante]}`}>
      <ul className={styles.lista} aria-label={etiqueta} data-reveal-group>
        {visibles.map((pieza) => (
          <li key={pieza.src} className={styles.item}>
            <Pieza
              pieza={pieza}
              onClick={(evento) => setAbierta({ n: pieza.n, origen: evento.currentTarget })}
            />
          </li>
        ))}
      </ul>

      {abierta && (
        <DialogoPieza
          piezas={conIndice}
          inicial={abierta.n}
          origen={abierta.origen}
          raiz={scope}
          onCerrar={() => setAbierta(null)}
        />
      )}
    </div>
  )
}
