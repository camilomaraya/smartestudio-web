import { useReveal } from '../hooks/useReveal'
import styles from './Manifiesto.module.css'

export default function Manifiesto() {
  const scope = useReveal()

  return (
    <section ref={scope} id="manifiesto" className={styles.manifiesto}>
      <div className={`container ${styles.inner}`} data-reveal-group>
        <p className="eyebrow">Manifiesto</p>
        <h2 className={styles.titulo}>Queremos conectar</h2>
        <p className={styles.texto}>
          Nuestro trabajo es crear relaciones entre tu empresa y tu público de forma rápida, sin
          jerarquías ni límites físicos. Tus redes sociales son la vitrina que tu marca necesita, y
          la construimos contigo.
        </p>
        <p className={styles.remate}>
          <span>
            Tus <span className={styles.dorado}>metas</span> son las nuestras.
          </span>
          <span className={styles.separador} aria-hidden="true">
            ·
          </span>
          <span>
            Nos <span className={styles.dorado}>adaptamos</span> a ti.
          </span>
        </p>
      </div>
    </section>
  )
}
