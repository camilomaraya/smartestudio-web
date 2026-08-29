import { serviciosPrincipales, complementariosSueltos } from '../data/servicios'
import { useReveal } from '../hooks/useReveal'
import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import styles from './Servicios.module.css'

/*
 * Índice de servicios (DESIGN.md §4, "Ritmo de un índice").
 *
 * Lista vertical, no grilla: un bloque por servicio, uno debajo del otro.
 * Cada bloque es asimétrico —nombre a la izquierda, desarrollo a la
 * derecha— para que la página no se lea como una tabla de precios.
 *
 * El `resumen` es el mismo párrafo que sirve en la ficha y en la meta
 * description: se escribe una vez (§8).
 */
export default function Servicios() {
  const scope = useReveal()

  return (
    <>
      <CabeceraPagina
        lineas={['Lo que hacemos', 'por tu marca,', 'en detalle']}
        bajada="Cuatro servicios que trabajamos en casa, de principio a fin. Puedes tomar uno solo o combinarlos: se potencian entre ellos."
      />

      <div ref={scope} className={`container ${styles.cuerpo}`}>
        <ol className={styles.lista}>
          {serviciosPrincipales.map((servicio, indice) => (
            <li key={servicio.slug} className={styles.item} data-reveal>
              <article className={styles.bloque}>
                <div className={styles.columnaNombre}>
                  <span className={styles.numero} aria-hidden="true">
                    {String(indice + 1).padStart(2, '0')}
                  </span>
                  <h2 className={styles.nombre}>{servicio.titulo}</h2>
                </div>

                <div className={styles.columnaDetalle}>
                  <p className={styles.resumen}>{servicio.resumen}</p>

                  <ul className={styles.incluye}>
                    {servicio.incluye.map((linea) => (
                      <li key={linea}>{linea}</li>
                    ))}
                  </ul>

                  <EnlaceRuta
                    to={`/servicios/${servicio.slug}`}
                    className={styles.enlaceFicha}
                  >
                    Ver el servicio
                    <span className={styles.flecha} aria-hidden="true">
                      →
                    </span>
                    {/* El nombre viaja al lector de pantalla: cuatro enlaces
                        "Ver el servicio" seguidos no se distinguen entre sí. */}
                    <span className="visually-hidden">: {servicio.titulo}</span>
                  </EnlaceRuta>
                </div>
              </article>
            </li>
          ))}
        </ol>

        {/* Bloque subordinado: no llevan página propia a propósito, refleja
            la jerarquía real del negocio (DESIGN.md §8). */}
        {complementariosSueltos.length > 0 && (
          <section className={styles.complementarios} data-reveal>
            <h2 className={styles.complementariosTitulo}>También hacemos</h2>
            <div className={styles.grupos}>
              {complementariosSueltos.map((bloque) => (
                <div key={bloque.grupo} className={styles.grupo}>
                  <h3 className={styles.grupoTitulo}>{bloque.grupo}</h3>
                  <ul className={styles.grupoLista}>
                    {bloque.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <EnlaceRuta to="/" className={styles.volver}>
          ← Volver al inicio
        </EnlaceRuta>
      </div>
    </>
  )
}
