import { proyectosPublicables } from '../data/proyectos'
import { servicioPorSlug } from '../data/servicios'
import { useReveal } from '../hooks/useReveal'
import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import Carrusel from '../components/Carrusel'
import styles from './Proyectos.module.css'

/*
 * Índice de proyectos (DESIGN.md §4, "Ritmo de un índice").
 *
 * Lista vertical, NO grilla: cada bloque lleva su propio carrusel, de modo
 * que el visitante ya vio varias piezas del caso antes de entrar a la ficha.
 * Ese es el gesto de la página; nada más compite con él.
 *
 * Composición de cada bloque, en este orden: carrusel → nombre → servicios
 * prestados → párrafo → doble enlace a la ficha.
 */
export default function Proyectos() {
  const proyectos = proyectosPublicables()
  const scope = useReveal()

  return (
    <>
      <CabeceraPagina
        lineas={['Marcas que', 'confiaron', 'en nosotrxs']}
        bajada="Cada proyecto es distinto, pero todos empiezan igual: entendiendo a qué se dedica la marca y a quién le habla."
      />

      <div ref={scope} className={`container ${styles.cuerpo}`}>
        {proyectos.length === 0 ? (
          <p className={styles.vacio}>
            Estamos preparando esta sección. Mientras tanto, escribinos y te
            mostramos el trabajo directamente.
          </p>
        ) : (
          <ol className={styles.lista}>
            {proyectos.map((proyecto) => (
              <li key={proyecto.slug} className={styles.item} data-reveal>
                <article className={styles.bloque}>
                  <Carrusel
                    piezas={proyecto.piezas}
                    etiqueta={`Piezas de ${proyecto.nombre}`}
                    className={styles.carrusel}
                  />

                  <div className={styles.texto}>
                    <h2 className={styles.nombre}>
                      {/* Todo el nombre es enlace: es el objetivo más grande y
                          el que la gente intenta tocar primero. */}
                      <EnlaceRuta
                        to={`/proyectos/${proyecto.slug}`}
                        className={styles.enlaceNombre}
                      >
                        {proyecto.nombre}
                      </EnlaceRuta>
                    </h2>

                    <ul className={styles.servicios}>
                      {proyecto.servicios.map((slug) => {
                        const servicio = servicioPorSlug(slug)
                        return servicio ? <li key={slug}>{servicio.titulo}</li> : null
                      })}
                    </ul>

                    <p className={styles.resumen}>{proyecto.resumen}</p>

                    <EnlaceRuta
                      to={`/proyectos/${proyecto.slug}`}
                      className={styles.enlaceFicha}
                    >
                      Ver el proyecto
                      <span className={styles.flecha} aria-hidden="true">
                        →
                      </span>
                      {/* El nombre viaja al lector de pantalla: varios enlaces
                          "Ver el proyecto" seguidos no se distinguen. */}
                      <span className="visually-hidden">: {proyecto.nombre}</span>
                    </EnlaceRuta>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}

        <EnlaceRuta to="/" className={styles.volver}>
          ← Volver al inicio
        </EnlaceRuta>
      </div>
    </>
  )
}
