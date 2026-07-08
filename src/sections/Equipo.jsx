import { equipo } from '../data/equipo'
import { gsap, useGSAP } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'
import styles from './Equipo.module.css'

export default function Equipo() {
  const scope = useReveal()

  // Tarjetas en cascada; los avatares entran con un scale sutil.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tarjetas = gsap.utils.toArray('[data-equipo-grilla] > *')
        const fotos = gsap.utils.toArray('[data-equipo-foto]')

        gsap.set(tarjetas, { opacity: 0, y: 24 })
        gsap.set(fotos, { scale: 0.85 })

        const tl = gsap.timeline({
          defaults: { duration: 0.8, ease: 'power3.out' },
          scrollTrigger: {
            trigger: '[data-equipo-grilla]',
            start: 'top 85%',
            once: true,
          },
        })

        tl.to(tarjetas, { opacity: 1, y: 0, stagger: 0.12, clearProps: 'opacity,transform' }, 0)
        tl.to(fotos, { scale: 1, stagger: 0.12, clearProps: 'transform' }, 0.08)
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="equipo" className={styles.equipo}>
      <div className="container">
        <div className={styles.encabezado} data-reveal-group>
          <p className="eyebrow">Equipo</p>
          <h2 className={styles.titulo}>Quiénes están detrás</h2>
        </div>

        <ul className={styles.grilla} data-equipo-grilla>
          {equipo.map((persona) => (
            <li key={persona.id} className={`card ${styles.tarjeta}`}>
              {/* Foto real pendiente; placeholder circular con iniciales */}
              <div className={styles.foto} aria-hidden="true" data-equipo-foto>
                {persona.nombre
                  .split(' ')
                  .map((parte) => parte[0])
                  .join('')}
              </div>
              <h3 className={styles.nombre}>{persona.nombre}</h3>
              <p className={styles.cargo}>{persona.cargo}</p>
              <p className={styles.bio}>{persona.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
