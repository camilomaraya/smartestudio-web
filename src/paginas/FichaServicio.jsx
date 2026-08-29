import { useParams } from 'react-router'
import {
  servicioPorSlug,
  complementariosDe,
  serviciosPrincipales,
} from '../data/servicios'
import { useReveal } from '../hooks/useReveal'
import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import NoEncontrada from './NoEncontrada'
import styles from './FichaServicio.module.css'

/*
 * Ficha de servicio.
 *
 * El `resumen` entra como bajada de la cabecera: es el mismo párrafo del
 * índice y de la meta description (DESIGN.md §8), escrito una sola vez.
 *
 * Sin métricas ni porcentajes, igual que las fichas de proyecto: material y
 * contexto, nada que después haya que sostener con números.
 */
export default function FichaServicio() {
  const { slug } = useParams()
  const servicio = servicioPorSlug(slug)
  const scope = useReveal()

  /*
   * Un slug inexistente cae en la página de 404, no en una ficha vacía.
   * También protege al prerender, que falla si una ruta sale sin <h1>.
   */
  if (!servicio) return <NoEncontrada />

  const complementarios = complementariosDe(servicio.slug)
  const otros = serviciosPrincipales.filter((otro) => otro.slug !== servicio.slug)

  // El título parte en dos líneas cuando tiene con qué: una línea sola a
  // esta escala se lee como etiqueta, no como titular.
  const palabras = servicio.titulo.split(' ')
  const lineas =
    palabras.length > 2
      ? [palabras.slice(0, 2).join(' '), palabras.slice(2).join(' ')]
      : [servicio.titulo]

  return (
    <>
      <CabeceraPagina lineas={lineas} bajada={servicio.resumen} />

      <div ref={scope} className={`container ${styles.cuerpo}`}>
        <div className={styles.principal}>
          <section className={styles.comoTrabajamos} data-reveal>
            <h2 className={styles.subtitulo}>Cómo trabajamos</h2>
            <p className={styles.detalle}>{servicio.detalle}</p>
          </section>

          <section className={styles.incluyeBloque} data-reveal>
            <h2 className={styles.subtitulo}>Qué incluye</h2>
            <ul className={styles.incluye}>
              {servicio.incluye.map((linea) => (
                <li key={linea}>{linea}</li>
              ))}
            </ul>
          </section>
        </div>

        {complementarios.length > 0 && (
          <section className={styles.complementarios} data-reveal>
            <h2 className={styles.subtitulo}>Súmale</h2>
            {complementarios.map((bloque) => (
              <div key={bloque.grupo} className={styles.grupo}>
                <h3 className={styles.grupoTitulo}>
                  {bloque.grupo}
                  {bloque.externalizado && (
                    <span className={styles.marcaExterna}> · con terceros</span>
                  )}
                </h3>
                <ul className={styles.grupoLista}>
                  {bloque.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <section className={styles.otros} data-reveal>
          <h2 className={styles.subtitulo}>Explorar otros servicios</h2>
          <ul className={styles.otrosLista}>
            {otros.map((otro) => (
              <li key={otro.slug}>
                <EnlaceRuta to={`/servicios/${otro.slug}`} className={styles.otroEnlace}>
                  <span className={styles.otroNombre}>{otro.titulo}</span>
                  <span className={styles.otroGancho}>{otro.gancho}</span>
                </EnlaceRuta>
              </li>
            ))}
          </ul>
        </section>

        <EnlaceRuta to="/servicios" className={styles.volver}>
          ← Ver todos los servicios
        </EnlaceRuta>
      </div>
    </>
  )
}
