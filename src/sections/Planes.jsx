import { planes, notaPlanes } from '../data/planes'
import { gsap, useGSAP } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'
import { scrollToSection } from '../lib/lenis'
import Button from '../components/ui/Button'
import styles from './Planes.module.css'

export default function Planes() {
  const scope = useReveal()

  // Las 4 tarjetas suben en cascada; la destacada (Smart) entra un beat después.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tarjetas = gsap.utils.toArray('[data-planes-grilla] > *')
        gsap.set(tarjetas, { opacity: 0, y: 24 })
        gsap.to(tarjetas, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: (indice, tarjeta) =>
            indice * 0.12 + ('planDestacado' in tarjeta.dataset ? 0.12 : 0),
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '[data-planes-grilla]',
            start: 'top 85%',
            once: true,
          },
        })
      })
    },
    { scope },
  )

  const irA = (event, href) => {
    event.preventDefault()
    scrollToSection(href)
  }

  return (
    <section ref={scope} id="planes" className={styles.planes}>
      <div className="container">
        <div className={styles.encabezado} data-reveal-group>
          <p className="eyebrow">Planes</p>
          <h2 className={styles.titulo}>Elige cómo despegar</h2>
        </div>

        <ul className={styles.grilla} data-planes-grilla>
          {planes.map((plan) => (
            <li
              key={plan.id}
              className={`card ${styles.tarjeta} ${plan.destacado ? styles.destacada : ''}`}
              data-plan-destacado={plan.destacado ? '' : undefined}
            >
              {plan.destacado && <span className={styles.badge}>Recomendado</span>}

              <div className={styles.cabecera}>
                <h3 className={styles.nombre}>{plan.nombre}</h3>
                {plan.tagline && <p className={styles.tagline}>{plan.tagline}</p>}
                <p className={styles.precio}>
                  <span className={styles.desde}>desde</span>
                  <span className={styles.monto}>{plan.precio.replace('desde ', '')}</span>
                </p>
              </div>

              <ul className={styles.items}>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className={styles.accion}>
                <Button
                  variant={plan.destacado ? 'primary' : 'ghost'}
                  href="#contacto"
                  onClick={(e) => irA(e, '#contacto')}
                >
                  Conversemos
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.personaliza} data-reveal>
          <div className={styles.personalizaTexto}>
            <h3 className={styles.personalizaTitulo}>Personaliza tu plan</h3>
            <p className={styles.personalizaBajada}>
              ¿Necesitas algo más específico que se adapte a tu empresa? No hay problema, todo es
              conversable.
            </p>
          </div>
          <Button href="#contacto" onClick={(e) => irA(e, '#contacto')}>
            Da el primer paso
          </Button>
        </div>

        <p className={styles.nota} data-reveal>
          {notaPlanes}
        </p>
      </div>
    </section>
  )
}
