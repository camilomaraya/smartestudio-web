import { serviciosPrincipales, complementarios } from '../data/servicios'
import { useReveal } from '../hooks/useReveal'
import styles from './Servicios.module.css'

export default function Servicios() {
  const scope = useReveal()

  return (
    <section ref={scope} id="servicios" className={styles.servicios}>
      <div className="container">
        <div className={styles.encabezado} data-reveal-group>
          <p className="eyebrow">Servicios</p>
          <h2 className={styles.titulo}>Lo que hacemos por tu marca</h2>
        </div>

        <ul className={styles.grilla} data-reveal-group>
          {serviciosPrincipales.map((servicio, indice) => (
            <li key={servicio.id} className={`card ${styles.tarjeta}`}>
              <span className="card-numero" aria-hidden="true">
                {String(indice + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.nombre}>{servicio.titulo}</h3>
              <p className={styles.descripcion}>{servicio.descripcion}</p>
            </li>
          ))}
        </ul>

        {/* Bloque subordinado: servicios complementarios agrupados.
            Revela como una sola pieza, después de las tarjetas. */}
        <div className={styles.complementarios} data-reveal>
          <h3 className={styles.complementariosTitulo}>¿Necesitas más? También hacemos</h3>
          <div className={styles.grupos}>
            {complementarios.map((bloque) => (
              <div
                key={bloque.grupo}
                className={`${styles.grupo} ${
                  bloque.grupo === 'Coordinamos' ? styles.grupoExterno : ''
                }`}
              >
                <h4 className={styles.grupoTitulo}>{bloque.grupo}</h4>
                <ul className={styles.grupoLista}>
                  {bloque.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
