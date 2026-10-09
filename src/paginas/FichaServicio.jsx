import { useParams } from 'react-router'
import {
  servicioPorSlug,
  complementariosDe,
  serviciosPrincipales,
} from '../data/servicios'
import { piezasDeServicio } from '../data/proyectos'
import { useReveal } from '../hooks/useReveal'
import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import GaleriaPiezas from '../components/GaleriaPiezas'
import NoEncontrada from './NoEncontrada'
import styles from './FichaServicio.module.css'

/*
 * Ficha de servicio.
 *
 * El `resumen` entra como bajada de la cabecera: es el mismo párrafo del
 * índice y de la meta description (DESIGN.md §8), escrito una sola vez.
 *
 * La pieza va primero: justo bajo la cabecera, lo hecho por Smart en este
 * servicio (sin cliente); cada pieza se abre con su texto «detrás».
 * Después, cómo se trabaja y qué incluye.
 *
 * Sin métricas ni porcentajes: material y contexto, nada que después haya
 * que sostener con números. Los `rubros` dicen para qué tipo de negocios ya
 * se hizo, sin nombrar a ningún cliente.
 */
const listaRubros = new Intl.ListFormat('es', { type: 'conjunction' })

export default function FichaServicio() {
  const { slug } = useParams()
  const servicio = servicioPorSlug(slug)
  const scope = useReveal()

  /*
   * Un slug inexistente cae en la página de 404, no en una ficha vacía.
   * También protege al prerender, que falla si una ruta sale sin <h1>.
   */
  if (!servicio) return <NoEncontrada />

  const piezas = piezasDeServicio(servicio.slug)
  const complementarios = complementariosDe(servicio.slug)
  const otros = serviciosPrincipales.filter((otro) => otro.slug !== servicio.slug)

  // El título parte en dos líneas cuando tiene con qué: una línea sola a
  // esta escala se lee como etiqueta, no como titular. Con dos palabras va
  // una por línea («Community / Management» no entra en una).
  const palabras = servicio.titulo.split(' ')
  const corte = palabras.length > 2 ? 2 : 1
  const lineas =
    palabras.length > 1
      ? [palabras.slice(0, corte).join(' '), palabras.slice(corte).join(' ')]
      : [servicio.titulo]

  return (
    <>
      <CabeceraPagina lineas={lineas} bajada={servicio.resumen} />

      <div ref={scope} className={`container ${styles.cuerpo}`}>
        {piezas.length > 0 && (
          <section className={styles.piezas}>
            <h2 className={styles.subtitulo} data-reveal>
              Lo que hicimos
            </h2>
            <GaleriaPiezas piezas={piezas} etiqueta={`Piezas de ${servicio.titulo}`} />
          </section>
        )}

        {servicio.rubros.length > 0 && (
          <p className={styles.rubros} data-reveal>
            Lo hemos hecho para {listaRubros.format(servicio.rubros)}.
          </p>
        )}

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
                    <li key={item.nombre}>{item.nombre}</li>
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
