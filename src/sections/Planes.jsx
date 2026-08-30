import { useRef } from 'react'
import { planes, categoriasPlanes, notaPlanes } from '../data/planes'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToSection } from '../lib/lenis'
import styles from './Planes.module.css'

/*
 * Planes — sección de contenido del estándar nuevo (DESIGN.md §4).
 *
 * Es una TABLA comparativa, no cuatro tarjetas. Los cuatro planes describen
 * las mismas categorías con distintas cantidades, y lo que alguien hace
 * frente a planes escalonados es compararlos: en tarjetas hay que ir y
 * volver cuatro veces para responder "¿cuántos reels tiene cada uno?".
 *
 * Es una <table> de verdad, con th scope: son datos tabulares, y un lector
 * de pantalla debe poder anunciar "Reels profesionales, Smart, 3". Con divs
 * la relación entre el número y su fila/columna se pierde.
 *
 * El gesto es el que ya tenía la sección: las columnas entran escalonadas y
 * la destacada un beat después. Se conserva porque comunica jerarquía —el
 * plan recomendado llega último y por eso se mira.
 */
export default function Planes() {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lineas = scope.current.querySelectorAll('[data-planes="linea"]')
        const columnas = scope.current.querySelectorAll('[data-planes="columna"]')
        const filas = scope.current.querySelectorAll('[data-planes="fila"]')
        const cierre = scope.current.querySelector('[data-planes="cierre"]')

        gsap.set(lineas, { yPercent: 110, y: 0 })
        gsap.set(columnas, { opacity: 0, y: 20 })
        gsap.set(filas, { opacity: 0 })
        gsap.set(cierre, { opacity: 0, y: 20 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: 'top 75%', once: true },
        })

        // fromTo con `y: 0` explícito: GSAP suma `y` y `yPercent`, y bajo el
        // doble montaje de StrictMode la segunda pasada duplicaría el
        // desplazamiento dejando el titular tapado por su máscara.
        tl.fromTo(
          lineas,
          { yPercent: 110, y: 0 },
          { yPercent: 0, y: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
        )
          .to(
            columnas,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
              // El destacado llega un beat después: la jerarquía se comunica
              // con el tiempo, no sumando otro color.
              stagger: (i, el) => i * 0.1 + ('destacado' in el.dataset ? 0.14 : 0),
            },
            0.45,
          )
          .to(
            filas,
            {
              opacity: 1,
              duration: 0.5,
              stagger: 0.05,
              ease: 'power2.out',
              clearProps: 'opacity',
            },
            0.7,
          )
          .to(
            cierre,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            },
            '>-0.2',
          )
      })
    },
    { scope },
  )

  const irAContacto = (evento) => {
    evento.preventDefault()
    scrollToSection('#contacto')
  }

  // Un valor puede ser una cantidad, `true` (incluido) o `null` (no va).
  const celda = (valor, plan, categoria) => {
    if (valor === null) {
      return (
        <>
          <span aria-hidden="true" className={styles.no}>
            —
          </span>
          <span className="visually-hidden">
            No incluido en {plan.nombre}: {categoria.etiqueta}
          </span>
        </>
      )
    }
    if (valor === true) {
      return (
        <>
          <span aria-hidden="true" className={styles.si}>
            ✓
          </span>
          <span className="visually-hidden">Incluido</span>
        </>
      )
    }
    return <span className={styles.cantidad}>{valor}</span>
  }

  return (
    <section ref={scope} id="planes" className={styles.planes}>
      <div className="container">
        <h2 className={styles.titular}>
          <span className={styles.mascara}>
            <span className={styles.linea} data-planes="linea">
              Cuatro formas
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={styles.linea} data-planes="linea">
              de trabajar
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={`${styles.linea} ${styles.acento}`} data-planes="linea">
              juntxs
            </span>
          </span>
        </h2>

        {/* El scroll horizontal se anuncia y recibe foco: en pantallas
            angostas la tabla no entra y hay que poder recorrerla con
            teclado, no solo arrastrando. */}
        <div
          className={styles.marco}
          tabIndex={0}
          role="region"
          aria-label="Comparación de planes, desplazable horizontalmente"
        >
          <table className={styles.tabla}>
            <caption className="visually-hidden">
              Comparación de los cuatro planes: qué incluye cada uno y su precio
              referencial.
            </caption>

            <thead>
              <tr>
                {/* Esquina vacía: encabeza la columna de categorías */}
                <td className={styles.esquina} />
                {planes.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={`${styles.cabecera} ${plan.destacado ? styles.destacada : ''}`}
                    data-planes="columna"
                    data-destacado={plan.destacado ? '' : undefined}
                  >
                    {plan.destacado && <span className={styles.badge}>Recomendado</span>}
                    <span className={styles.nombre}>{plan.nombre}</span>
                    {plan.tagline && <span className={styles.tagline}>{plan.tagline}</span>}
                    <span className={styles.precio}>
                      <span className={styles.desde}>desde</span>
                      <span className={styles.monto}>{plan.precio}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {categoriasPlanes.map((categoria) => (
                <tr key={categoria.id} className={styles.fila} data-planes="fila">
                  <th scope="row" className={styles.categoria}>
                    {categoria.etiqueta}
                  </th>
                  {planes.map((plan) => (
                    <td
                      key={plan.id}
                      className={`${styles.valor} ${plan.destacado ? styles.destacada : ''}`}
                    >
                      {celda(categoria.valores[plan.id], plan, categoria)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td className={styles.esquina} />
                {planes.map((plan) => (
                  <td
                    key={plan.id}
                    className={`${styles.accion} ${plan.destacado ? styles.destacada : ''}`}
                  >
                    <a
                      href="#contacto"
                      onClick={irAContacto}
                      className={`${styles.boton} ${plan.destacado ? styles.botonDestacado : ''}`}
                    >
                      Conversemos
                      {/* Cuatro botones "Conversemos" seguidos no se
                          distinguen entre sí al tabular. */}
                      <span className="visually-hidden"> sobre el plan {plan.nombre}</span>
                    </a>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <div className={styles.cierre} data-planes="cierre">
          <p className={styles.adaptable}>
            ¿Necesitas algo más específico para tu empresa? Todo es conversable: los
            planes son un punto de partida, no una lista cerrada.{' '}
            <a href="#contacto" onClick={irAContacto} className={styles.enlaceCierre}>
              Armemos el tuyo
            </a>
          </p>
          <p className={styles.nota}>{notaPlanes}</p>
        </div>
      </div>
    </section>
  )
}
