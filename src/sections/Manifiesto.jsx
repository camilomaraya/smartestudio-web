import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import styles from './Manifiesto.module.css'

/*
 * TEMPORAL — comparación de variantes de diseño (revisión 2026-09-09).
 * Se elige con `?m=` en la URL:
 *   (sin parámetro) base     — lo que está publicado hoy
 *   ?m=oro                   — banda dorada, CONECTAR en negativo desbordando
 *   ?m=frase                 — la frase entera justificada de borde a borde
 *   ?m=desborde              — igual que base, pero CONECTAR pasa los bordes
 * Cuando se decida una, se borra el switch y queda solo la ganadora.
 */
function leerVariante() {
  if (typeof window === 'undefined') return 'base'
  const m = new URLSearchParams(window.location.search).get('m')
  return ['oro', 'frase', 'desborde'].includes(m) ? m : 'base'
}

export default function Manifiesto() {
  const scope = useRef(null)
  const variante = leerVariante()

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
        if (entrada.length) gsap.set(entrada, { opacity: 0, y: 20 })
        if (statement) gsap.set(statement, { yPercent: 110 })
        if (echo) gsap.set(echo, { opacity: 0, y: 24 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 70%',
            once: true,
          },
        })

        if (entrada.length) {
          tl.to(entrada, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
            clearProps: 'opacity,transform',
          })
        }
        // El statement conserva su transform: la máscara es estructura.
        // Sube lento (1.4s) para ganar peso; el eco espera a que asiente.
        if (statement) {
          tl.to(statement, { yPercent: 0, duration: 1.4, ease: 'power4.out' }, 0.4)
        }
        if (echo) {
          tl.to(
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
        }
      })
    },
    { scope },
  )

  /* Variante 2: una sola frase justificada a los dos márgenes. El énfasis
     lo marca el cambio de familia (Big Shoulders dorado dentro de Archivo),
     no un apartado con opacidad — así el "eco" deja de ser ilegible. */
  if (variante === 'frase') {
    return (
      <section ref={scope} id="manifiesto" className={styles.manifiesto}>
        <p className={styles.frase}>
          <span className={styles.mascara}>
            <span className={styles.fraseLinea} data-inter="statement">
              Nuestro trabajo es <em className={styles.fraseAcento}>conectar</em> tu marca con tu
              público
            </span>
          </span>
        </p>
      </section>
    )
  }

  /* Variantes 1 y 3: misma estructura de tres piezas; cambian superficie
     y escala. En ambas el statement sale del container y pasa los bordes. */
  const desborda = variante === 'oro' || variante === 'desborde'

  return (
    <section
      ref={scope}
      id="manifiesto"
      className={`${styles.manifiesto} ${variante === 'oro' ? styles.varOro : ''}`}
    >
      <div className={`${desborda ? '' : 'container'} ${styles.interstitialContenido}`}>
        <p className={styles.contexto} data-inter="entrada">
          Nuestro trabajo es
        </p>
        <h2 className={`titular ${styles.statement} ${desborda ? styles.statementAncho : ''}`}>
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
