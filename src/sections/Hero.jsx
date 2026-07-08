import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToSection } from '../lib/lenis'
import Button from '../components/ui/Button'
import FondoIconos from './hero3d/FondoIconos'
import styles from './Hero.module.css'

export default function Hero() {
  const scope = useRef(null)

  // Intro al montar: eyebrow → titular (máscara por línea) → lead → CTAs.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Estado inicial vía JS: si el JS falla, el contenido queda visible.
        gsap.set(['[data-hero="eyebrow"]', '[data-hero="bajada"]'], { opacity: 0, y: 24 })
        gsap.set('[data-hero="linea"]', { yPercent: 110 })
        gsap.set('[data-hero="acciones"] > *', { opacity: 0, y: 24 })

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

        tl.to('[data-hero="eyebrow"]', { opacity: 1, y: 0, duration: 0.6 })
          .to('[data-hero="linea"]', { yPercent: 0, duration: 0.9, stagger: 0.12 }, '-=0.25')
          .to('[data-hero="bajada"]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
          .to(
            '[data-hero="acciones"] > *',
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
            '-=0.5',
          )
      })
    },
    { scope },
  )

  const irA = (event, href) => {
    event.preventDefault()
    scrollToSection(href)
  }

  return (
    <section ref={scope} className={styles.hero} aria-label="Presentación">
      {/* Fondo: campo de íconos WebGL detrás del titular. Si el dispositivo
          no aplica (mobile, reduced-motion, sin WebGL), queda solo el
          resplandor radial CSS como versión liviana. */}
      <div className={styles.canvasFondo} aria-hidden="true">
        <FondoIconos />
      </div>

      <div className={`container ${styles.contenido}`}>
        <p className="eyebrow" data-hero="eyebrow">
          Agencia de marketing digital · La Serena–Coquimbo
        </p>
        <h1 className={styles.titular}>
          <span className={styles.mascara}>
            <span className={styles.linea} data-hero="linea">
              De aquí salen
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={`${styles.linea} ${styles.dorado}`} data-hero="linea">
              buenas ideas
            </span>
          </span>
        </h1>
        <p className={styles.bajada} data-hero="bajada">
          Creamos relaciones entre tu marca y tu público. Tus metas son las nuestras.
        </p>
        <div className={styles.acciones} data-hero="acciones">
          <Button href="#contacto" onClick={(e) => irA(e, '#contacto')}>
            Conversemos
          </Button>
          <Button variant="ghost" href="#planes" onClick={(e) => irA(e, '#planes')}>
            Nuestros planes
          </Button>
        </div>
      </div>
    </section>
  )
}
