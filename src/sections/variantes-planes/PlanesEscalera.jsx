import { useId, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { planes, categoriasPlanes } from '../../data/planes'
import { Titular, Cierre, Valor, irAContacto, revelarTitular } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './PlanesEscalera.module.css'

/*
 * TEMPORAL — variante «Escalera»: las cuatro cartas con alturas crecientes,
 * alineadas abajo; el plan más completo es el escalón más alto. Cada carta
 * muestra cuatro números clave y despliega el resto dentro de sí.
 */

// Los cuatro números que más se comparan: van siempre a la vista
const CLAVE = ['posts', 'reels', 'sesiones-foto', 'campanas-meta']
const clave = categoriasPlanes.filter((c) => CLAVE.includes(c.id))

export default function PlanesEscalera({ id, etiqueta }) {
  const scope = useRef(null)
  const base = useId()
  const [abiertos, setAbiertos] = useState(() => new Set())

  const alternar = (planId) =>
    setAbiertos((prev) => {
      const siguiente = new Set(prev)
      if (siguiente.has(planId)) siguiente.delete(planId)
      else siguiente.add(planId)
      return siguiente
    })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Celular: el carrusel arranca con el recomendado centrado
      mm.add('(max-width: 900px)', () => {
        const fila = scope.current.querySelector('[data-pe="fila"]')
        const destacada = fila?.querySelector('[data-destacado]')
        if (destacada) {
          fila.scrollLeft = destacada.offsetLeft - (fila.clientWidth - destacada.offsetWidth) / 2
        }
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        revelarTitular(raiz)
        const cartas = raiz.querySelectorAll('[data-pe="carta"]')
        gsap.set(cartas, { y: 80, opacity: 0 })
        gsap.to(cartas, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          // El recomendado llega un beat después, como en la tabla
          stagger: (i, el) => i * 0.12 + ('destacado' in el.dataset ? 0.18 : 0),
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
        })
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.escalera}>
      <div className="container">
        <Titular />

        <ol className={styles.escalones} data-pe="fila">
          {planes.map((plan, i) => {
            const abierto = abiertos.has(plan.id)
            const idLista = `${base}-${plan.id}`
            return (
              <li
                key={plan.id}
                className={`${styles.carta} ${plan.destacado ? styles.destacada : ''}`}
                style={{ '--i': i }}
                data-pe="carta"
                data-destacado={plan.destacado ? '' : undefined}
              >
                {plan.destacado && <span className={styles.badge}>Recomendado</span>}
                <span className={styles.escalon} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={`titular ${styles.nombre}`}>{plan.nombre}</h3>
                {plan.tagline && <p className={styles.tagline}>{plan.tagline}</p>}
                <p className={styles.precio}>
                  <span className={styles.desde}>desde</span>
                  <span className={styles.monto}>{plan.precio}</span>
                </p>

                <dl className={styles.claves}>
                  {clave.map((categoria) => (
                    <div key={categoria.id} className={styles.clave}>
                      <dt>{categoria.etiqueta}</dt>
                      <dd>
                        <Valor
                          valor={categoria.valores[plan.id]}
                          plan={plan}
                          categoria={categoria}
                        />
                      </dd>
                    </div>
                  ))}
                </dl>

                <button
                  type="button"
                  className={styles.desplegar}
                  aria-expanded={abierto}
                  aria-controls={idLista}
                  onClick={() => alternar(plan.id)}
                >
                  {abierto ? 'Ver menos' : 'Ver todo lo que incluye'}
                  <span className={styles.signo} aria-hidden="true">
                    +
                  </span>
                </button>

                {/* 0fr → 1fr: la altura se anima sin medir en JS */}
                <div
                  id={idLista}
                  className={`${styles.resto} ${abierto ? styles.restoAbierto : ''}`}
                  inert={!abierto}
                >
                  <dl className={styles.lista}>
                    {categoriasPlanes
                      .filter((c) => !CLAVE.includes(c.id))
                      .map((categoria) => (
                        <div key={categoria.id} className={styles.item}>
                          <dt>{categoria.etiqueta}</dt>
                          <dd>
                            <Valor
                              valor={categoria.valores[plan.id]}
                              plan={plan}
                              categoria={categoria}
                            />
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>

                <a
                  href="#contacto"
                  onClick={irAContacto}
                  className={`${styles.cta} ${plan.destacado ? styles.ctaDestacado : ''}`}
                >
                  Conversemos
                  <span className="visually-hidden"> sobre el plan {plan.nombre}</span>
                </a>
              </li>
            )
          })}
        </ol>

        <Cierre />
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
