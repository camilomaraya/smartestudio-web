import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap'
import { proyectosPublicables } from '../data/proyectos'
import EnlaceRuta from '../components/EnlaceRuta'
import boton from '../components/ui/Button.module.css'
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
 * El foco es el trabajo de Smart: la pieza y su tipo mandan; el cliente
 * aparece como crédito chico.
 */

// Todas las piezas publicables, aplanadas, con su proyecto como crédito.
// Intercala clientes (una pieza de cada uno por vuelta) para que ninguna
// secuencia quede con tres piezas seguidas del mismo.
function todasLasPiezas() {
  const proyectos = proyectosPublicables()
  const salida = []
  const maximo = Math.max(0, ...proyectos.map((p) => p.piezas.length))
  for (let vuelta = 0; vuelta < maximo; vuelta += 1) {
    for (const proyecto of proyectos) {
      const pieza = proyecto.piezas[vuelta]
      if (pieza) salida.push({ ...pieza, slug: proyecto.slug, cliente: proyecto.nombre })
    }
  }
  return salida
}

const piezas = todasLasPiezas()
// Cada copia repite su grupo dos veces: con ~10 piezas chicas una sola
// pasada medía menos que una pantalla ancha y dejaba un hueco al final
const CINTAS = [piezas.filter((_, i) => i % 2 === 0), piezas.filter((_, i) => i % 2 === 1)].map(
  (grupo) => [...grupo, ...grupo],
)

export default function Proyectos() {
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
          <div key={i} className={styles.ventana}>
            <div className={styles.pista} data-vc="pista">
              {[0, 1].map((copia) =>
                grupo.map((pieza, j) => (
                  <Pieza
                    key={`${copia}-${j}-${pieza.src}`}
                    pieza={pieza}
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

      <div className={styles.cierre}>
        <EnlaceRuta to="/proyectos" className={`${boton.button} ${boton.primary}`}>
          Ver todos los proyectos
        </EnlaceRuta>
      </div>
    </section>
  )
}

// Una pieza: enlace a la ficha de su proyecto, con la proporción de su tipo.
// El rótulo (tipo y cliente) aparece al pasar el mouse o con foco.
function Pieza({ pieza, ...resto }) {
  return (
    <EnlaceRuta
      to={`/proyectos/${pieza.slug}`}
      className={`${styles.pieza} ${styles[pieza.tipo] ?? ''}`}
      aria-label={`${pieza.titulo}, ${pieza.tipo} para ${pieza.cliente}`}
      draggable={false}
      {...resto}
    >
      <span className={styles.marco}>
        <img src={pieza.src} alt="" loading="lazy" decoding="async" draggable={false} />
      </span>
      <span className={styles.rotulo} aria-hidden="true">
        <span className={styles.tipo}>{pieza.tipo}</span>
        <span className={styles.credito}>para {pieza.cliente}</span>
      </span>
    </EnlaceRuta>
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
