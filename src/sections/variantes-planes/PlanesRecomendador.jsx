import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { planes, categoriasPlanes } from '../../data/planes'
import { Titular, Cierre, Valor, irAContacto, revelarTitular } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './PlanesRecomendador.module.css'

/*
 * TEMPORAL — variante «Arma tu plan»: marcas lo que necesita tu marca y la
 * carta de la derecha recomienda el plan más chico que lo cubre.
 *
 * Cada necesidad pide un plan mínimo, sacado de las cantidades reales de
 * data/planes.js (p. ej. Google Ads aparece recién en Smart, el dron en
 * Marketing 360°). Gana el más alto de los marcados.
 */
const NECESIDADES = [
  { id: 'redes', texto: 'Publicar seguido en redes', minimo: 'despega' },
  { id: 'google', texto: 'Campañas en Google', minimo: 'smart' },
  { id: 'meta', texto: 'Más de una campaña en Meta', minimo: 'marketing-360' },
  { id: 'reels', texto: '4 reels al mes o más', minimo: 'marketing-360' },
  { id: 'dron', texto: 'Tomas con dron', minimo: 'marketing-360' },
  { id: 'cobertura', texto: 'Cobertura de eventos', minimo: 'marketing-360' },
  { id: 'historias', texto: 'Historias semanales', minimo: 'full-marketing' },
  { id: 'organizacion', texto: 'Organización de eventos', minimo: 'full-marketing' },
]
const indicePlan = (planId) => planes.findIndex((p) => p.id === planId)
const RESUMEN = ['posts', 'reels', 'campanas-meta']
const resumen = categoriasPlanes.filter((c) => RESUMEN.includes(c.id))

export default function PlanesRecomendador({ id, etiqueta }) {
  const scope = useRef(null)
  const carta = useRef(null)
  const [marcadas, setMarcadas] = useState(() => new Set())

  const elegidas = NECESIDADES.filter((n) => marcadas.has(n.id))
  const recomendado = elegidas.reduce((max, n) => Math.max(max, indicePlan(n.minimo)), 0)
  const plan = planes[recomendado]

  const alternar = (necesidadId) =>
    setMarcadas((prev) => {
      const siguiente = new Set(prev)
      if (siguiente.has(necesidadId)) siguiente.delete(necesidadId)
      else siguiente.add(necesidadId)
      return siguiente
    })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => revelarTitular(scope.current))
    },
    { scope },
  )

  // La carta entra de nuevo cuando cambia el plan recomendado
  const primera = useRef(true)
  useEffect(() => {
    if (primera.current) {
      primera.current = false
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.fromTo(
      carta.current,
      { opacity: 0, y: 16, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', clearProps: 'all' },
    )
    return () => tween.kill()
  }, [recomendado])

  return (
    <section ref={scope} id={id} className={styles.recomendador}>
      <div className="container">
        <Titular />

        <div className={styles.grilla}>
          <div className={styles.preguntas}>
            <h3 className={styles.pregunta}>¿Qué necesita tu marca?</h3>
            <p className={styles.ayuda}>Marca todo lo que aplique.</p>
            <ul className={styles.fichas}>
              {NECESIDADES.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    aria-pressed={marcadas.has(n.id)}
                    className={`${styles.ficha} ${marcadas.has(n.id) ? styles.fichaMarcada : ''}`}
                    onClick={() => alternar(n.id)}
                  >
                    <span className={styles.check} aria-hidden="true" />
                    {n.texto}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.resultado}>
            {/* Dónde queda el recomendado en la escala de planes */}
            <div className={styles.escala} style={{ '--i': recomendado }} aria-hidden="true">
              <span className={styles.indicador} />
              {planes.map((p, i) => (
                <span key={p.id} className={i === recomendado ? styles.escalaActiva : undefined}>
                  {p.nombre}
                </span>
              ))}
            </div>

            <div ref={carta} className={styles.carta} aria-live="polite">
              <p className={styles.sugerimos}>
                {elegidas.length ? 'Te recomendamos' : 'Para empezar'}
              </p>
              <h3 className={`titular ${styles.nombre}`}>{plan.nombre}</h3>
              {plan.tagline && <p className={styles.tagline}>{plan.tagline}</p>}
              <p className={styles.precio}>
                <span className={styles.desde}>desde</span>
                <span className={styles.monto}>{plan.precio}</span>
                <span className={styles.desde}>+ IVA</span>
              </p>

              {elegidas.length ? (
                <div className={styles.porque}>
                  <p>Incluye lo que marcaste:</p>
                  <ul>
                    {elegidas.map((n) => (
                      <li key={n.id}>{n.texto}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className={styles.vacio}>
                  Marca lo que necesitas y te decimos por dónde empezar.
                </p>
              )}

              <dl className={styles.numeros}>
                {resumen.map((categoria) => (
                  <div key={categoria.id}>
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

              <a href="#contacto" onClick={irAContacto} className={styles.cta}>
                Conversemos
                <span className="visually-hidden"> sobre el plan {plan.nombre}</span>
              </a>
            </div>
          </div>
        </div>

        <Cierre />
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
