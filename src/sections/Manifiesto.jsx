import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import styles from './Manifiesto.module.css'

export default function Manifiesto() {
  const scope = useRef(null)

  // Secuencia propia: el contexto prepara, el statement golpea desde la
  // máscara y el eco llega después, más lento, como reverberación.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const entrada = scope.current.querySelectorAll('[data-inter="entrada"]')
        const statement = scope.current.querySelector('[data-inter="statement"]')
        const echo = scope.current.querySelector('[data-inter="echo"]')

        // Estado inicial vía JS: si el JS falla, la sección queda visible.
        gsap.set(entrada, { opacity: 0, y: 20 })
        gsap.set(statement, { yPercent: 110 })
        gsap.set(echo, { opacity: 0, y: 24 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 70%',
            once: true,
          },
        })

        tl.to(entrada, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          clearProps: 'opacity,transform',
        })
          // El statement conserva su transform: la máscara es estructura.
          // Sube lento (1.4s) para ganar peso; el eco espera a que asiente.
          .to(statement, { yPercent: 0, duration: 1.4, ease: 'power4.out' }, 0.4)
          .to(
            echo,
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            },
            1.5,
          )
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="manifiesto" className={styles.manifiesto}>
      <div className={`container ${styles.interstitialContenido}`}>
        <p className={styles.contexto} data-inter="entrada">
          Nuestro trabajo es
        </p>
        <h2 className={`titular ${styles.statement}`}>
          <span className={styles.mascara}>
            <span className={styles.statementLinea} data-inter="statement">
              Conectar
            </span>
          </span>
        </h2>
        <p className={`titular ${styles.echo}`} data-inter="echo">
          Tu marca con tu público
        </p>
      </div>
    </section>
  )
}
