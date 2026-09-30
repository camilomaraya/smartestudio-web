import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { serviciosPrincipales } from '../data/servicios'
import EnlaceRuta from '../components/EnlaceRuta'
import boton from '../components/ui/Button.module.css'
import styles from './Servicios.module.css'

/*
 * Servicios en el home, como un mazo: las cuatro cartas parten apiladas
 * con la 01 encima. El mazo se fija y, al scrollear, la carta de arriba sale
 * volando hacia arriba y destapa la siguiente, que avanza al frente. Nada se
 * oscurece: lo de abajo siempre está a la vista.
 *
 * El mazo vive solo con movimiento permitido (CSS y JS usan la misma
 * condición). Con movimiento reducido o sin JS, las cartas son una lista
 * vertical normal.
 */
const N = serviciosPrincipales.length
// Cómo esperan las cartas de abajo: un poco más chicas y corridas hacia
// abajo, así asoma el borde del mazo
const ESPERA = { scale: 0.94, y: 24 }

export default function Servicios() {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        revelarTitular(raiz)
        const mazo = raiz.querySelector('[data-sa="mazo"]')
        const cartas = [...raiz.querySelectorAll('[data-sa="carta"]')]

        gsap.set(cartas[0], { yPercent: 0, rotation: 0, scale: 1, y: 0 })
        gsap.set(cartas.slice(1), { yPercent: 0, rotation: 0, ...ESPERA })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: mazo,
            start: 'top top',
            end: `+=${(N - 1) * 100}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Un tramo por carta que sale; la última queda. Los huecos entre
        // tramos son pausas para leer la carta que quedó arriba.
        cartas.slice(0, -1).forEach((carta, i) => {
          const t = i * 1.3
          // Sale opaca, sin fundirse: a medio camino no se mezcla con la de abajo
          tl.to(carta, { yPercent: -170, rotation: -4, duration: 1, ease: 'power2.in' }, t)
            .to(cartas[i + 1], { scale: 1, y: 0, duration: 0.8, ease: 'power2.out' }, t + 0.3)
        })
        tl.set({}, {}, (N - 1) * 1.3 + 0.3)
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="servicios" className={styles.servicios}>
      {/* El titular va dentro del escenario fijado: queda sobre el mazo
          mientras las cartas salen, sin un hueco de pantalla entre ambos */}
      <div className={styles.mazo} data-sa="mazo">
        <div className={`container ${styles.cabecera}`}>
          <h2 className={styles.titular}>
            <span className={styles.mascara}>
              <span className={styles.linea} data-sa="linea">
                Lo que hacemos por tu marca,
              </span>
            </span>
            <span className={styles.mascara}>
              <span className={`${styles.linea} ${styles.acento}`} data-sa="linea">
                en concreto
              </span>
            </span>
          </h2>
        </div>
        <div className={`container ${styles.pila}`}>
          {serviciosPrincipales.map((servicio, i) => (
            <article
              key={servicio.slug}
              className={styles.carta}
              style={{ '--i': i }}
              data-sa="carta"
            >
              <div className={styles.texto}>
                <span className={styles.numero} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </span>
                <h3 className={`titular ${styles.nombre}`}>{servicio.titulo}</h3>
                <p className={styles.resumen}>{servicio.gancho}</p>
                <ul className={styles.incluye}>
                  {servicio.incluye.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <EnlaceRuta to={`/servicios/${servicio.slug}`} className={styles.enlace}>
                  Ver servicio <span aria-hidden="true">→</span>
                </EnlaceRuta>
              </div>
              <img className={styles.imagen} src={servicio.imagen} alt="" loading="lazy" />
            </article>
          ))}
        </div>
      </div>

      <div className={`container ${styles.cierre}`}>
        <p className={styles.bajada}>Cada servicio funciona solo, pero juntos se potencian.</p>
        {/* Mismo estilo que el botón primario, pero con cortina de ruta */}
        <EnlaceRuta to="/servicios" className={`${boton.button} ${boton.primary}`}>
          Ver todos los servicios
        </EnlaceRuta>
      </div>
    </section>
  )
}

// Reveal del titular desde la máscara
function revelarTitular(raiz) {
  gsap.fromTo(
    raiz.querySelectorAll('[data-sa="linea"]'),
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
