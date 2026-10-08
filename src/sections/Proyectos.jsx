import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap'
import { piezasPublicables } from '../data/proyectos'
import Pieza from '../components/Pieza'
import DialogoPieza from '../components/DialogoPieza'
import styles from './Proyectos.module.css'

/*
 * Sección E — Proyectos del home: dos cintas de piezas que corren solas en
 * sentidos opuestos. El scroll las acelera según su velocidad y las da
 * vuelta al subir; el mouse encima frena la cinta.
 *
 * Cada cinta lleva sus piezas dos veces: el tween mueve la pista un 50%
 * (una copia entera) y vuelve a empezar sin costura. La segunda copia es
 * decorativa: fuera del árbol de accesibilidad y del tabulado.
 *
 * El sitio no promociona clientes: cada pieza muestra solo lo que es (su
 * tipo y su título). Tocarla la abre en grande con el texto de lo que hay
 * detrás (components/DialogoPieza.jsx).
 */

// `n`: posición en la lista única, para ubicar cada pieza entre sus copias
const piezas = piezasPublicables().map((pieza, n) => ({ ...pieza, n }))
// Cada copia repite su grupo dos veces: con ~10 piezas chicas una sola
// pasada medía menos que una pantalla ancha y dejaba un hueco al final
const CINTAS = [piezas.filter((_, i) => i % 2 === 0), piezas.filter((_, i) => i % 2 === 1)].map(
  (grupo) => [...grupo, ...grupo],
)

export default function Proyectos() {
  const scope = useRef(null)
  // Control de la cinta desde el diálogo: frenarla al abrir, soltarla al cerrar
  const control = useRef(null)
  const detenida = useRef(false)
  const [abierta, setAbierta] = useState(null) // { n, origen }

  const abrir = (evento, pieza) => {
    detenida.current = true
    control.current?.frenar()
    setAbierta({ n: pieza.n, origen: evento.currentTarget })
  }

  const cerrar = () => {
    setAbierta(null)
    detenida.current = false
    control.current?.soltar()
  }

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

        const velocidadBase = (e) => (e.encima || detenida.current ? 0 : sentido)

        control.current = {
          frenar: () =>
            estado.forEach((e) =>
              gsap.to(e.tween, { timeScale: 0, duration: 0.5, overwrite: true }),
            ),
          soltar: () =>
            estado.forEach((e) =>
              gsap.to(e.tween, { timeScale: velocidadBase(e), duration: 0.8, overwrite: true }),
            ),
        }

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
          onToggle: (self) =>
            estado.forEach((e) => (self.isActive ? e.tween.play() : e.tween.pause())),
          onUpdate: (self) => {
            sentido = self.direction
            // Empujón proporcional a la velocidad del scroll, con tope, que
            // después se asienta de nuevo en la velocidad base
            const empujon = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 8)
            estado.forEach((e) => {
              if (e.encima || detenida.current) return
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

        return () => {
          control.current = null
        }
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="proyectos" className={styles.proyectos}>
      <div className="container">
        <h2 className={styles.titular}>
          <span className={styles.mascara}>
            <span className={styles.linea} data-vp="linea">
              Lo que se ve es
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={styles.linea} data-vp="linea">
              la mitad <span className={styles.acento}>del trabajo</span>
            </span>
          </span>
        </h2>
      </div>

      <div className={styles.cintas}>
        {CINTAS.map((grupo, i) => (
          <div key={i} className={styles.ventana} data-vc="ventana">
            <div className={styles.pista} data-vc="pista">
              {[0, 1].map((copia) =>
                grupo.map((pieza, j) => (
                  <Pieza
                    key={`${copia}-${j}-${pieza.src}`}
                    pieza={pieza}
                    onClick={(evento) => abrir(evento, pieza)}
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

      {abierta && (
        <DialogoPieza
          piezas={piezas}
          inicial={abierta.n}
          origen={abierta.origen}
          raiz={scope}
          onCerrar={cerrar}
        />
      )}
    </section>
  )
}

// Reveal del titular desde la máscara
function revelarTitular(raiz) {
  gsap.fromTo(
    raiz.querySelectorAll('[data-vp="linea"]'),
    { yPercent: 110, y: 0 },
    {
      yPercent: 0,
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: { trigger: raiz, start: 'top 75%', once: true },
    },
  )
}
