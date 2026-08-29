import { useParams } from 'react-router'
import { proyectoPorSlug, proyectosPublicables } from '../data/proyectos'
import { servicioPorSlug } from '../data/servicios'
import { useReveal } from '../hooks/useReveal'
import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import Carrusel from '../components/Carrusel'
import NoEncontrada from './NoEncontrada'
import styles from './FichaProyecto.module.css'

/*
 * Ficha de proyecto (DESIGN.md §4, "Ritmo de una ficha").
 *
 * El eje de la página es el zigzag: cada pieza con su "detrás" al lado,
 * alternando lado. Es el mismo mecanismo de la sección E del home, pero acá
 * a fondo y con todas las piezas del cliente.
 *
 * Sin métricas ni porcentajes (§8, regla 2): material y contexto. Le conviene
 * a Smart, que no tiene números que mostrar, y evita prometer resultados que
 * después hay que sostener.
 */
export default function FichaProyecto() {
  const { slug } = useParams()
  const proyecto = proyectoPorSlug(slug)
  const scope = useReveal()

  /*
   * Un slug inexistente —o un cliente sin permiso confirmado— cae en el 404,
   * no en una ficha vacía. También protege al prerender, que falla si una
   * ruta sale sin <h1>.
   */
  if (!proyecto) return <NoEncontrada />

  const otros = proyectosPublicables().filter((otro) => otro.slug !== proyecto.slug)
  const destacada = proyecto.piezas[0]
  const resto = proyecto.piezas.slice(1)

  const palabras = proyecto.nombre.split(' ')
  const lineas =
    palabras.length > 2
      ? [palabras.slice(0, 2).join(' '), palabras.slice(2).join(' ')]
      : [proyecto.nombre]

  return (
    <>
      <CabeceraPagina lineas={lineas} bajada={proyecto.resumen} />

      <div ref={scope} className={`container ${styles.cuerpo}`}>
        <dl className={styles.datos} data-reveal>
          <div className={styles.dato}>
            <dt>Rubro</dt>
            <dd>{proyecto.rubro}</dd>
          </div>
          <div className={styles.dato}>
            <dt>Servicios</dt>
            <dd>
              <ul className={styles.servicios}>
                {proyecto.servicios.map((slugServicio) => {
                  const servicio = servicioPorSlug(slugServicio)
                  return servicio ? (
                    <li key={slugServicio}>
                      {/* Cruce entre secciones: desde el caso se llega al
                          servicio que lo hizo posible. */}
                      <EnlaceRuta
                        to={`/servicios/${slugServicio}`}
                        className={styles.enlaceServicio}
                      >
                        {servicio.titulo}
                      </EnlaceRuta>
                    </li>
                  ) : null
                })}
              </ul>
            </dd>
          </div>
        </dl>

        {destacada && (
          <figure className={styles.destacada} data-reveal>
            <img
              className={styles.destacadaImagen}
              src={destacada.src}
              alt={destacada.titulo}
              loading="eager"
              decoding="async"
            />
            <figcaption className={styles.destacadaPie}>
              <span className={styles.tipo}>{destacada.tipo}</span>
              <span className={styles.destacadaTitulo}>{destacada.titulo}</span>
            </figcaption>
          </figure>
        )}

        {destacada && <p className={styles.frase} data-reveal>{destacada.detras}</p>}

        {resto.length > 0 && (
          <section className={styles.piezas}>
            <h2 className="visually-hidden">Piezas del proyecto</h2>
            {resto.map((pieza, indice) => (
              <article
                key={pieza.src}
                /* El zigzag: par a la izquierda, impar a la derecha. Es el
                   gesto de la ficha y el que la distingue de una galería. */
                className={`${styles.fila} ${indice % 2 === 1 ? styles.invertida : ''}`}
                data-reveal
              >
                <figure className={styles.piezaMedia}>
                  <img
                    className={`${styles.piezaImagen} ${styles[pieza.tipo] ?? ''}`}
                    src={pieza.src}
                    alt={pieza.titulo}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className={styles.piezaTexto}>
                  <span className={styles.tipo}>{pieza.tipo}</span>
                  <h3 className={styles.piezaTitulo}>{pieza.titulo}</h3>
                  <p className={styles.piezaDetras}>{pieza.detras}</p>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className={styles.galeria} data-reveal>
          <h2 className={styles.subtitulo}>Todas las piezas</h2>
          <Carrusel piezas={proyecto.piezas} etiqueta={`Piezas de ${proyecto.nombre}`} />
        </section>

        {otros.length > 0 && (
          <section className={styles.otros} data-reveal>
            <h2 className={styles.subtitulo}>Explorar otros proyectos</h2>
            <ul className={styles.otrosLista}>
              {otros.map((otro) => (
                <li key={otro.slug}>
                  <EnlaceRuta to={`/proyectos/${otro.slug}`} className={styles.otroEnlace}>
                    <img
                      className={styles.otroImagen}
                      src={otro.portada}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={styles.otroNombre}>{otro.nombre}</span>
                    <span className={styles.otroRubro}>{otro.rubro}</span>
                  </EnlaceRuta>
                </li>
              ))}
            </ul>
          </section>
        )}

        <EnlaceRuta to="/proyectos" className={styles.volver}>
          ← Ver todos los proyectos
        </EnlaceRuta>
      </div>
    </>
  )
}
