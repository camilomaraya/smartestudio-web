import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { Titular, Cierre, Pieza, todasLasPiezas } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './ProyectosCollage.module.css'

/*
 * TEMPORAL — variante «Collage que se abre»: el escenario se fija y las
 * piezas, que parten amontonadas al centro como fotos tiradas en una mesa,
 * vuelan a su lugar alrededor del titular con el scroll.
 *
 * Reposo (sin JS o con movimiento reducido) = el collage armado.
 */

// Lugar final de cada pieza: centro en % del escenario y alto en svh.
// Compuesto a mano alrededor del hueco central del titular.
const LUGARES = [
  { x: 9, y: 22, alto: 28, giro: -3 },
  { x: 27, y: 11, alto: 19, giro: 2 },
  { x: 50, y: 11, alto: 17, giro: -1 },
  { x: 73, y: 12, alto: 21, giro: 3 },
  { x: 91, y: 24, alto: 28, giro: -2 },
  { x: 7, y: 66, alto: 26, giro: 2 },
  { x: 25, y: 85, alto: 20, giro: -3 },
  { x: 50, y: 88, alto: 17, giro: 1 },
  { x: 75, y: 85, alto: 22, giro: -2 },
  { x: 93, y: 67, alto: 26, giro: 3 },
]
const piezas = todasLasPiezas().slice(0, LUGARES.length)

export default function ProyectosCollage({ id, etiqueta }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        const escenario = raiz.querySelector('[data-vl="escenario"]')
        const fotos = [...raiz.querySelectorAll('[data-vl="foto"]')]
        const centro = raiz.querySelector('[data-vl="centro"]')
        const cierre = raiz.querySelector('[data-vl="cierre"]')

        // Distancia de cada foto al centro del escenario, recalculada en
        // cada refresh. offsetLeft/Top y no getBoundingClientRect: ignoran
        // los transforms que ya aplicó GSAP, y como la foto se centra con
        // translate -50%, su offset ES su centro.
        const alCentro = (el, eje) =>
          eje === 'x'
            ? escenario.clientWidth / 2 - el.offsetLeft
            : escenario.clientHeight / 2 - el.offsetTop
        // Giro del montón: fijo por foto para que el scrub sea reversible
        const giros = fotos.map((_, i) => ((i * 47) % 40) - 20)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: escenario,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        fotos.forEach((foto, i) => {
          tl.fromTo(
            foto,
            {
              x: () => alCentro(foto, 'x'),
              y: () => alCentro(foto, 'y'),
              rotation: giros[i],
              scale: 0.55,
            },
            {
              x: 0,
              y: 0,
              rotation: LUGARES[i].giro,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
            },
            i * 0.05,
          )
        })
        tl.fromTo(centro, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }, 0.5)
          .fromTo(cierre, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 1)
          .set({}, {}, 1.6)
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.collage}>
      <div className={styles.escenario} data-vl="escenario">
        {piezas.map((pieza, i) => (
          <div
            key={pieza.src}
            className={styles.foto}
            style={{
              left: `${LUGARES[i].x}%`,
              top: `${LUGARES[i].y}%`,
              '--alto-pieza': `${LUGARES[i].alto}svh`,
              '--giro': `${LUGARES[i].giro}deg`,
            }}
            data-vl="foto"
          >
            <Pieza pieza={pieza} />
          </div>
        ))}

        <div className={styles.centro} data-vl="centro">
          <Titular />
          <div data-vl="cierre">
            <Cierre />
          </div>
        </div>
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
