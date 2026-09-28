import { Fragment, useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToSection } from '../lib/lenis'
import Button from '../components/ui/Button'
import FondoIconos from './hero3d/FondoIconos'
import styles from './Hero.module.css'

const TITULAR = 'De aquí salen buenas ideas'
const LINEAS = [
  { texto: 'De aquí salen', dorado: false },
  { texto: 'buenas ideas', dorado: true },
]

// Imán: las letras cercanas al cursor se levantan y se inclinan hacia él.
const RADIO_IMAN = 220

export default function Hero() {
  const scope = useRef(null)

  // Intro al montar: eyebrow → titular (máscara por línea) → lead → CTAs.
  // Al terminar, se activa el imán sobre las letras del titular.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const mascaras = gsap.utils.toArray('[data-hero="mascara"]', scope.current)
        const letras = gsap.utils.toArray('[data-letra]', scope.current)
        const conHover = window.matchMedia('(hover: hover)').matches

        // Estado inicial vía JS: si el JS falla, el contenido queda visible.
        gsap.set(['[data-hero="eyebrow"]', '[data-hero="bajada"]'], { opacity: 0, y: 24 })
        gsap.set('[data-hero="linea"]', { yPercent: 110 })
        gsap.set('[data-hero="acciones"] > *', { opacity: 0, y: 24 })

        // Posiciones cacheadas (en coordenadas de página) para no medir el
        // layout en cada movimiento del cursor.
        let centros = []
        const medirLetras = () => {
          centros = letras.map((letra) => {
            const rect = letra.getBoundingClientRect()
            return {
              x: rect.left + rect.width / 2 + window.scrollX,
              y: rect.top + rect.height / 2 + window.scrollY,
              alto: rect.height,
              moverY: gsap.quickTo(letra, 'y', { duration: 0.45, ease: 'power3' }),
              rotar: gsap.quickTo(letra, 'rotation', { duration: 0.45, ease: 'power3' }),
            }
          })
        }

        // Las letras que se inclinan salen de la máscara del reveal: se
        // libera recién cuando la intro terminó.
        const alTerminarIntro = () => {
          gsap.set(mascaras, { overflow: 'visible' })
          medirLetras()
        }

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

        tl.to('[data-hero="eyebrow"]', { opacity: 1, y: 0, duration: 0.6 })
          .to('[data-hero="linea"]', { yPercent: 0, duration: 0.9, stagger: 0.12 }, '-=0.25')
          .to('[data-hero="bajada"]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
          .to(
            '[data-hero="acciones"] > *',
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
            '-=0.5',
          )
          .call(alTerminarIntro)

        if (!conHover) return

        const seccion = scope.current
        const alMover = (evento) => {
          const px = evento.clientX + window.scrollX
          const py = evento.clientY + window.scrollY
          centros.forEach((c) => {
            const dx = px - c.x
            const cercania = Math.max(0, 1 - Math.hypot(dx, py - c.y) / RADIO_IMAN)
            c.moverY(-c.alto * 0.25 * cercania)
            c.rotar(gsap.utils.clamp(-1, 1, dx / RADIO_IMAN) * 12 * cercania)
          })
        }
        const alSalir = () => {
          centros.forEach((c) => {
            c.moverY(0)
            c.rotar(0)
          })
        }
        const alRedimensionar = () => {
          if (centros.length) medirLetras()
        }
        seccion.addEventListener('pointermove', alMover)
        seccion.addEventListener('pointerleave', alSalir)
        window.addEventListener('resize', alRedimensionar)

        return () => {
          seccion.removeEventListener('pointermove', alMover)
          seccion.removeEventListener('pointerleave', alSalir)
          window.removeEventListener('resize', alRedimensionar)
        }
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
          Agencia de marketing digital
        </p>
        {/* Letra por letra para el imán: el aria-label conserva la frase
            completa para lectores de pantalla. */}
        <h1 className={styles.titular} aria-label={TITULAR}>
          {LINEAS.map((linea) => {
            const palabras = linea.texto.split(' ')
            return (
              <span key={linea.texto} className={styles.mascara} data-hero="mascara" aria-hidden="true">
                <span
                  className={`${styles.linea} ${linea.dorado ? styles.dorado : ''}`}
                  data-hero="linea"
                >
                  {palabras.map((palabra, indice) => (
                    <Fragment key={palabra}>
                      {indice > 0 && ' '}
                      <span className={styles.palabra}>
                        {[...palabra].map((letra, i) => (
                          <span key={i} className={styles.letra} data-letra>
                            {letra}
                          </span>
                        ))}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </span>
            )
          })}
        </h1>
        <p className={styles.bajada} data-hero="bajada">
          Creamos relaciones entre tu marca y tu público.
          <br />
          Tus metas son las nuestras.
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
