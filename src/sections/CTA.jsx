import { gsap, useGSAP } from '../lib/gsap'
import { getLenis } from '../lib/lenis'
import { useReveal } from '../hooks/useReveal'
import Button from '../components/ui/Button'
import styles from './CTA.module.css'

const FRASE = '¿Listx para despegar tus ideas?'

export default function CTA() {
  const scope = useReveal()

  // El loop sigue siendo CSS; aquí solo se modula su playbackRate
  // con la velocidad de scroll de Lenis (más rápido al scrollear).
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const pista = scope.current.querySelector('[data-marquee-pista]')
        const animacion = pista?.getAnimations()[0]
        if (!animacion) return

        let velocidad = 1
        const tick = () => {
          const objetivo = 1 + Math.min(Math.abs(getLenis()?.velocity ?? 0) / 12, 3)
          velocidad += (objetivo - velocidad) * 0.08
          animacion.playbackRate = velocidad
        }

        gsap.ticker.add(tick)
        return () => {
          gsap.ticker.remove(tick)
          animacion.playbackRate = 1
        }
      })
    },
    { scope },
  )

  // Cierre editorial: el headline sube desde la máscara y el botón lo sigue.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const headline = scope.current.querySelector('[data-cta="headline"]')
        const accion = scope.current.querySelector('[data-cta="accion"]')

        gsap.set(headline, { yPercent: 110 })
        gsap.set(accion, { opacity: 0, y: 20 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 75%',
            once: true,
          },
        })

        // El headline conserva su transform: la máscara es estructura.
        tl.to(headline, { yPercent: 0, duration: 0.9, ease: 'power4.out' }).to(
          accion,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          },
          0.4,
        )
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="cta" className={styles.cta} aria-label="Llamado a la acción">
      <div className={`container ${styles.ctaHeadline}`}>
        <h2 className="titular">
          <span className={styles.mascara}>
            <span className={styles.linea} data-cta="headline">
              Comencemos a <span className={styles.dorado}>trabajar</span>
            </span>
          </span>
        </h2>
      </div>

      {/* Marquee: el texto se repite para el loop; solo la primera copia es accesible */}
      <div className={styles.marquee} data-reveal>
        <div className={styles.pista} data-marquee-pista>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={styles.frase} aria-hidden={i > 0}>
              {FRASE}
              <span className={styles.separador} aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.ctaAccion} data-cta="accion">
        <Button href="https://wa.me/56981649378" target="_blank" rel="noreferrer">
          Escríbenos por WhatsApp
        </Button>
      </div>
    </section>
  )
}
