import { serviciosPrincipales, complementariosSueltos } from '../data/servicios'
import { piezasDeServicio } from '../data/proyectos'
import { useReveal } from '../hooks/useReveal'
import { useRevealLineas } from '../hooks/useRevealLineas'
import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import GaleriaPiezas from '../components/GaleriaPiezas'
import Icono from '../components/Icono'
import styles from './Servicios.module.css'

/*
 * Índice de servicios (DESIGN.md §4, "Ritmo de un índice").
 *
 * Lista vertical, no grilla: un bloque por servicio, uno debajo del otro.
 * Arriba, el nombre a escala de titular y al lado el desarrollo; abajo, una
 * tira con piezas de ese servicio, para que el trabajo se pueda juzgar
 * antes de entrar a la ficha. Lo que incluye cada uno queda para la ficha.
 *
 * El `resumen` es el mismo párrafo que sirve en la ficha y en la meta
 * description: se escribe una vez (§8).
 */
const PIEZAS_EN_TIRA = 4

export default function Servicios() {
  const scope = useReveal()
  const lineas = useRevealLineas()

  return (
    <>
      <CabeceraPagina
        lineas={['Lo que hacemos', 'por tu marca,', 'en detalle']}
        bajada="Cuatro servicios que trabajamos en casa, de principio a fin. Puedes tomar uno solo o combinarlos: se potencian entre ellos."
      />

      <div ref={scope} className={`container ${styles.cuerpo}`}>
        <ol ref={lineas} className={styles.lista}>
          {serviciosPrincipales.map((servicio, indice) => (
            <li key={servicio.slug} className={styles.item}>
              <article className={styles.bloque}>
                <div className={styles.columnaNombre}>
                  <span className={styles.numero} aria-hidden="true">
                    {String(indice + 1).padStart(2, '0')}
                  </span>
                  <h2 className={styles.nombre}>
                    <span className={styles.mascara}>
                      <span className={styles.linea} data-linea>
                        {servicio.titulo}
                      </span>
                    </span>
                  </h2>
                </div>

                <div className={styles.columnaDetalle} data-reveal>
                  <p className={styles.gancho}>{servicio.gancho}</p>
                  <p className={styles.resumen}>{servicio.resumen}</p>

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

                <div className={styles.tira}>
                  <GaleriaPiezas
                    piezas={piezasDeServicio(servicio.slug)}
                    limite={PIEZAS_EN_TIRA}
                    variante="tira"
                    etiqueta={`Piezas de ${servicio.titulo}`}
                  />
                </div>
              </article>
            </li>
          ))}
        </ol>

        {/* Bloque subordinado: no llevan página propia a propósito, refleja
            la jerarquía real del negocio (DESIGN.md §8). Cards informativas,
            sin enlace: no hay a dónde llevar. */}
        {complementariosSueltos.length > 0 && (
          <section className={styles.complementarios}>
            <h2 className={styles.complementariosTitulo} data-reveal>
              También hacemos
            </h2>
            {complementariosSueltos.map((bloque) => (
              <div key={bloque.grupo} className={styles.grupo}>
                <h3 className={styles.grupoTitulo} data-reveal>
                  {bloque.grupo}
                </h3>
                <ul className={styles.cards} data-reveal-group>
                  {bloque.items.map((item) => (
                    <li key={item.nombre} className={`card ${styles.cardItem}`}>
                      <Icono nombre={item.icono} className={styles.cardIcono} />
                      <span className={styles.cardNombre}>{item.nombre}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <EnlaceRuta to="/" className={styles.volver}>
          ← Volver al inicio
        </EnlaceRuta>
      </div>
    </>
  )
}
