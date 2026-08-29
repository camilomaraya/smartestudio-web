import { useCallback, useEffect, useId, useRef, useState } from 'react'
import styles from './Carrusel.module.css'

/*
 * Carrusel de piezas (DESIGN.md §5).
 *
 * Requisitos que lo definen, en orden de importancia:
 *
 * 1. **Degrada a la primera imagen si el JS falla.** El scroll horizontal es
 *    nativo (`scroll-snap`), no un transform manejado por JS: sin JS el
 *    visitante igual ve las piezas y puede arrastrarlas. Los controles son un
 *    agregado, no la condición para ver el contenido.
 * 2. **Sin autoplay.** Nada que se mueva solo compitiendo con el scroll de la
 *    página, que es el eje de lectura del sitio.
 * 3. **Navegable con teclado y con posición anunciada.** Flechas ← → sobre la
 *    pista, foco visible, y un `aria-live` que dice "2 de 5" a quien no ve.
 *
 * La posición se lee del scroll real (no de un índice que el JS cree tener),
 * así que arrastrar con el dedo, girar la rueda o usar los botones dejan
 * siempre el mismo estado.
 */
export default function Carrusel({ piezas, etiqueta, className = '' }) {
  const pistaRef = useRef(null)
  const [indice, setIndice] = useState(0)
  const idBase = useId()

  const total = piezas.length

  // La posición sale del scroll, que es la única fuente de verdad: el dedo,
  // la rueda y los botones terminan todos acá.
  const alScrollear = useCallback(() => {
    const pista = pistaRef.current
    if (!pista) return
    const hijos = Array.from(pista.children)
    if (!hijos.length) return

    // El más cercano al borde de inicio, no una división por ancho fijo: las
    // piezas tienen proporciones distintas (un reel vertical y un post 4:5 no
    // miden lo mismo) y un cálculo por ancho promedio se desalinea.
    let masCerca = 0
    let menorDistancia = Infinity
    hijos.forEach((hijo, i) => {
      const distancia = Math.abs(hijo.offsetLeft - pista.scrollLeft)
      if (distancia < menorDistancia) {
        menorDistancia = distancia
        masCerca = i
      }
    })
    setIndice(masCerca)
  }, [])

  useEffect(() => {
    const pista = pistaRef.current
    if (!pista) return
    pista.addEventListener('scroll', alScrollear, { passive: true })
    return () => pista.removeEventListener('scroll', alScrollear)
  }, [alScrollear])

  const irA = useCallback(
    (destino) => {
      const pista = pistaRef.current
      if (!pista) return
      const limite = Math.max(0, Math.min(destino, total - 1))
      const hijo = pista.children[limite]
      if (!hijo) return
      // scrollTo sobre la pista, no scrollIntoView: este último arrastra
      // también el scroll vertical de la página y da un salto del que el
      // visitante no pidió nada.
      pista.scrollTo({ left: hijo.offsetLeft, behavior: 'smooth' })
    },
    [total],
  )

  const alPresionarTecla = (evento) => {
    if (evento.key === 'ArrowRight') {
      evento.preventDefault()
      irA(indice + 1)
    } else if (evento.key === 'ArrowLeft') {
      evento.preventDefault()
      irA(indice - 1)
    }
  }

  if (!total) return null

  return (
    <div className={`${styles.carrusel} ${className}`}>
      {/* group + tabIndex: la pista recibe foco para que las flechas del
          teclado tengan dónde actuar. */}
      <div
        ref={pistaRef}
        className={styles.pista}
        role="group"
        aria-roledescription="carrusel"
        aria-label={etiqueta}
        tabIndex={0}
        onKeyDown={alPresionarTecla}
      >
        {piezas.map((pieza, i) => (
          <figure
            key={pieza.src}
            className={`${styles.pieza} ${styles[pieza.tipo] ?? ''}`}
            id={`${idBase}-${i}`}
            role="group"
            aria-roledescription="pieza"
            aria-label={`${i + 1} de ${total}`}
          >
            <img
              className={styles.imagen}
              src={pieza.src}
              alt={pieza.titulo ?? ''}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable="false"
            />
            {pieza.titulo && <figcaption className={styles.pie}>{pieza.titulo}</figcaption>}
          </figure>
        ))}
      </div>

      {total > 1 && (
        <div className={styles.controles}>
          <div className={styles.botones}>
            <button
              type="button"
              className={styles.boton}
              onClick={() => irA(indice - 1)}
              disabled={indice === 0}
              aria-label="Pieza anterior"
            >
              ←
            </button>
            <button
              type="button"
              className={styles.boton}
              onClick={() => irA(indice + 1)}
              disabled={indice === total - 1}
              aria-label="Pieza siguiente"
            >
              →
            </button>
          </div>

          {/* La posición se anuncia como texto, no solo con los puntos:
              un punto dorado no le dice nada a un lector de pantalla. */}
          <p className={styles.posicion} aria-live="polite" aria-atomic="true">
            <span className={styles.actual}>{String(indice + 1).padStart(2, '0')}</span>
            <span className={styles.separador} aria-hidden="true">
              /
            </span>
            <span className={styles.total}>{String(total).padStart(2, '0')}</span>
          </p>

          <ol className={styles.puntos} aria-hidden="true">
            {piezas.map((pieza, i) => (
              <li key={pieza.src}>
                <button
                  type="button"
                  className={`${styles.punto} ${i === indice ? styles.puntoActivo : ''}`}
                  onClick={() => irA(i)}
                  tabIndex={-1}
                  aria-label={`Ir a la pieza ${i + 1}`}
                />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
