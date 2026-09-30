import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import Button from '../../components/ui/Button'
import { FRASE, WHATSAPP } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './CTAMarquee.module.css'

/*
 * TEMPORAL — variante «Marquee protagonista»: la frase del cierre deja de
 * ser una cinta de acompañamiento y pasa a ser la sección. Tres filas
 * cruzadas en sentidos alternos; el scroll las acelera y, si subes, las da
 * vuelta. La fila bajo el cursor frena para que se pueda leer.
 *
 * El loop es GSAP y no CSS (a diferencia de CTA.jsx) porque cada fila
 * necesita su propia velocidad y dirección.
 */
const FILAS = [
  { id: 'a', sentido: 1, estilo: 'contorno' },
  { id: 'b', sentido: -1, estilo: 'cinta' },
  { id: 'c', sentido: 1, estilo: 'lleno' },
]
const COPIAS = 4

export default function CTAMarquee({ id, etiqueta }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        const filas = gsap.utils.toArray('[data-ctm="fila"]', raiz)

        const loops = filas.map((fila, i) => {
          const pista = fila.querySelector('[data-ctm="pista"]')
          const sentido = FILAS[i].sentido
          // Media pista = dos copias: el loop cierra sin salto
          const loop = gsap.fromTo(
            pista,
            { xPercent: sentido > 0 ? 0 : -50 },
            { xPercent: sentido > 0 ? -50 : 0, duration: 38 + i * 6, ease: 'none', repeat: -1 },
          )
          // Con timeScale negativo el tween retrocede y se detendría en 0:
          // se arranca muchos ciclos adelante para que la contramarcha no
          // llegue nunca al principio
          loop.totalTime(loop.duration() * 1000)
          return { loop, fila, freno: 1 }
        })

        // Frenar la fila bajo el cursor (se suaviza en el tick)
        const cleanups = loops.map((l) => {
          const entrar = (e) => {
            if (e.pointerType === 'mouse') l.freno = 0.15
          }
          const salir = () => {
            l.freno = 1
          }
          l.fila.addEventListener('pointerenter', entrar)
          l.fila.addEventListener('pointerleave', salir)
          return () => {
            l.fila.removeEventListener('pointerenter', entrar)
            l.fila.removeEventListener('pointerleave', salir)
          }
        })

        // Scroll: acelera y define la dirección (subir = contramarcha)
        let direccion = 1
        const actual = loops.map(() => 1)
        const tick = () => {
          const v = getLenis()?.velocity ?? 0
          if (Math.abs(v) > 0.5) direccion = Math.sign(v)
          const empuje = 1 + Math.min(Math.abs(v) / 8, 5)
          loops.forEach((l, i) => {
            const objetivo = direccion * empuje * l.freno
            actual[i] += (objetivo - actual[i]) * 0.08
            l.loop.timeScale(actual[i])
          })
        }
        gsap.ticker.add(tick)

        // Entrada: las filas llegan barriendo desde los costados
        gsap.from(filas, {
          xPercent: (i) => (FILAS[i].sentido > 0 ? 30 : -30),
          opacity: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: { trigger: raiz, start: 'top 70%', once: true },
        })

        return () => {
          gsap.ticker.remove(tick)
          cleanups.forEach((c) => c())
        }
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.marquee} aria-label="Llamado a la acción">
      <div className={`container ${styles.cabecera}`}>
        <h2 className={`titular ${styles.titular}`}>
          Comencemos a <span className={styles.dorado}>trabajar</span>
        </h2>
      </div>

      {/* La frase se lee una vez (la primera copia de la primera fila); el
          resto es decorado */}
      <div className={styles.cruce}>
        {FILAS.map((f, i) => (
          <div
            key={f.id}
            className={`${styles.fila} ${styles[f.estilo]}`}
            data-ctm="fila"
            aria-hidden={i > 0}
          >
            <div className={styles.pista} data-ctm="pista">
              {Array.from({ length: COPIAS }, (_, j) => (
                <span key={j} className={styles.frase} aria-hidden={i > 0 || j > 0}>
                  {FRASE}
                  <span className={styles.separador} aria-hidden="true">
                    ✦
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.accion}>
        <Button href={WHATSAPP} target="_blank" rel="noreferrer">
          Escríbenos por WhatsApp
        </Button>
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
