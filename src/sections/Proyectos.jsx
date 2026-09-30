import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap'
import { proyectosPublicables } from '../data/proyectos'
import EnlaceRuta from '../components/EnlaceRuta'
import boton from '../components/ui/Button.module.css'
import { DialogoPieza, Etiqueta, PanelPieza } from './variantes-proyectos/VistaPrevia'
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

// `n`: posición en la lista única, para ubicar cada pieza entre sus copias
const piezas = todasLasPiezas().map((pieza, n) => ({ ...pieza, n }))
// Cada copia repite su grupo dos veces: con ~10 piezas chicas una sola
// pasada medía menos que una pantalla ancha y dejaba un hueco al final
const CINTAS = [piezas.filter((_, i) => i % 2 === 0), piezas.filter((_, i) => i % 2 === 1)].map(
  (grupo) => [...grupo, ...grupo],
)

/*
 * TEMPORAL — `vista` compara las dos vistas previas al tocar una pieza
 * (ver variantes-proyectos/VistaPrevia.jsx): 'abrir' o 'detener'. Sin
 * `vista`, tocar una pieza lleva directo a su ficha.
 */
export default function Proyectos({ id, vista, etiqueta }) {
  const scope = useRef(null)
  // Control de la cinta desde las vistas previas: frenarla y soltarla
  const control = useRef(null)
  const detenida = useRef(false)
  const [abierta, setAbierta] = useState(null) // { n, origen }
  const [elegida, setElegida] = useState(null) // { n, clave }

  const frenar = () => {
    detenida.current = true
    control.current?.frenar()
  }
  const soltar = () => {
    detenida.current = false
    control.current?.soltar()
  }

  const alTocarPieza = (evento, pieza, clave) => {
    if (vista === 'abrir') {
      evento.preventDefault()
      frenar()
      setAbierta({ n: pieza.n, origen: evento.currentTarget })
    } else if (vista === 'detener') {
      // Segundo toque sobre la misma pieza: sigue a la ficha
      if (elegida?.clave === clave) return
      evento.preventDefault()
      frenar()
      setElegida({ n: pieza.n, clave })
    }
  }

  const cerrarPanel = () => {
    setElegida(null)
    soltar()
  }

  useEffect(() => {
    if (!elegida) return undefined
    const alTeclear = (evento) => evento.key === 'Escape' && cerrarPanel()
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  })

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
    <section
      ref={scope}
      id={id}
      className={`${styles.proyectos} ${elegida ? styles.conElegida : ''}`}
    >
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
                grupo.map((pieza, j) => {
                  const clave = `${i}-${copia}-${j}`
                  return (
                    <Pieza
                      key={clave}
                      pieza={pieza}
                      elegida={elegida?.clave === clave}
                      onClick={vista ? (evento) => alTocarPieza(evento, pieza, clave) : undefined}
                      // Solo la primera pasada de la primera copia es navegable
                      {...(copia === 1 || j >= grupo.length / 2
                        ? { 'aria-hidden': true, tabIndex: -1 }
                        : {})}
                    />
                  )
                }),
              )}
            </div>
          </div>
        ))}
      </div>

      {vista === 'detener' && (
        <PanelPieza pieza={elegida && piezas[elegida.n]} onCerrar={cerrarPanel} />
      )}
      {vista === 'abrir' && abierta && (
        <DialogoPieza
          piezas={piezas}
          inicial={abierta.n}
          origen={abierta.origen}
          raiz={scope}
          onCerrar={() => {
            setAbierta(null)
            soltar()
          }}
        />
      )}

      <div className={styles.cierre}>
        <EnlaceRuta to="/proyectos" className={`${boton.button} ${boton.primary}`}>
          Ver todos los proyectos
        </EnlaceRuta>
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}

// Una pieza: enlace a la ficha de su proyecto, con la proporción de su tipo.
// El rótulo (tipo y cliente) aparece al pasar el mouse o con foco.
function Pieza({ pieza, elegida = false, ...resto }) {
  return (
    <EnlaceRuta
      to={`/proyectos/${pieza.slug}`}
      className={`${styles.pieza} ${styles[pieza.tipo] ?? ''} ${elegida ? styles.elegida : ''}`}
      data-n={pieza.n}
      aria-label={`${pieza.titulo}, ${pieza.tipo} para ${pieza.cliente}`}
      draggable={false}
      {...resto}
    >
      <span className={styles.marco} data-marco>
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
