import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap'
import { Titular, Cierre, Pieza, todasLasPiezas, revelarTitular } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './ProyectosCinta.module.css'

/*
 * TEMPORAL — variante «Cinta»: dos cintas de piezas que corren solas en
 * sentidos opuestos. El scroll las acelera según su velocidad y las da
 * vuelta al subir; el mouse encima frena la cinta.
 *
 * Cada cinta lleva sus piezas dos veces: el tween mueve la pista un 50%
 * (una copia entera) y vuelve a empezar sin costura. La segunda copia es
 * decorativa: fuera del árbol de accesibilidad y del tabulado.
 */
const piezas = todasLasPiezas()
// Cada copia repite su grupo dos veces: con ~10 piezas chicas una sola
// pasada medía menos que una pantalla ancha y dejaba un hueco al final
const CINTAS = [piezas.filter((_, i) => i % 2 === 0), piezas.filter((_, i) => i % 2 === 1)].map(
  (grupo) => [...grupo, ...grupo],
)

export default function ProyectosCinta({ id, etiqueta }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        revelarTitular(raiz)

        const pistas = [...raiz.querySelectorAll('[data-vc="pista"]')]
        // Sentido base de cada cinta: la de arriba a la izquierda, la de
        // abajo a la derecha. timeScale negativo = al revés.
        const estado = pistas.map((pista, i) => ({
          tween: gsap.fromTo(
            pista,
            { xPercent: i === 0 ? 0 : -50 },
            { xPercent: i === 0 ? -50 : 0, duration: 45, ease: 'none', repeat: -1 },
          ),
          encima: false,
        }))
        let sentido = 1

        const velocidadBase = (e) => (e.encima ? 0 : sentido)

        estado.forEach((e, i) => {
          pistas[i].addEventListener('pointerenter', () => {
            e.encima = true
            gsap.to(e.tween, { timeScale: 0, duration: 0.5, overwrite: true })
          })
          pistas[i].addEventListener('pointerleave', () => {
            e.encima = false
            gsap.to(e.tween, { timeScale: velocidadBase(e), duration: 0.8, overwrite: true })
          })
        })

        ScrollTrigger.create({
          trigger: raiz,
          start: 'top bottom',
          end: 'bottom top',
          // Fuera de pantalla no corren: no hay por qué gastar frames
          onToggle: (self) => estado.forEach((e) => (self.isActive ? e.tween.play() : e.tween.pause())),
          onUpdate: (self) => {
            sentido = self.direction
            // Empujón proporcional a la velocidad del scroll, con tope, que
            // después se asienta de nuevo en la velocidad base
            const empujon = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 8)
            estado.forEach((e) => {
              if (e.encima) return
              // Mata el empujón anterior (tweens sobre el timeScale del
              // tween de la cinta, no la cinta misma)
              gsap.killTweensOf(e.tween)
              gsap
                .timeline()
                .to(e.tween, { timeScale: sentido * empujon, duration: 0.2, ease: 'power2.out' })
                .to(e.tween, { timeScale: sentido, duration: 1.2, ease: 'power2.inOut' })
            })
          },
        })
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.cinta}>
      <div className="container">
        <Titular />
      </div>

      <div className={styles.cintas}>
        {CINTAS.map((grupo, i) => (
          <div key={i} className={styles.ventana}>
            <div className={styles.pista} data-vc="pista">
              {[0, 1].map((copia) =>
                grupo.map((pieza, j) => (
                  <Pieza
                    key={`${copia}-${j}-${pieza.src}`}
                    pieza={pieza}
                    className={styles.pieza}
                    // Solo la primera pasada de la primera copia es navegable
                    {...(copia === 1 || j >= grupo.length / 2
                      ? { 'aria-hidden': true, tabIndex: -1 }
                      : {})}
                  />
                )),
              )}
            </div>
          </div>
        ))}
      </div>

      <Cierre />
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
