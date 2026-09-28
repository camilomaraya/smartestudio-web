import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import styles from './Manifiesto.module.css'

/*
 * TEMPORAL — comparación de variantes (ver Home.jsx):
 *   cortina  entra en negro y, al scrollear, el dorado sube y lo invierte
 *   union    CONEC y TAR llegan separados por un cable que se acorta al
 *            scrollear hasta que la palabra se une
 *   red      CONECTAR al centro y líneas que se trazan hacia los canales
 * Cuando se elija una, borrar las demás y las props `variante`/`etiqueta`.
 */

const NODOS = [
  { texto: 'Tu marca', x: 12, y: 18 },
  { texto: 'Instagram', x: 50, y: 10 },
  { texto: 'Tu público', x: 88, y: 20 },
  { texto: 'Reels', x: 13, y: 52 },
  { texto: 'Comunidad', x: 88, y: 54 },
  { texto: 'Campañas', x: 16, y: 86 },
  { texto: 'TikTok', x: 52, y: 92 },
  { texto: 'Ventas', x: 86, y: 84 },
]

function Contexto() {
  return (
    <p className={styles.contexto} data-inter="entrada">
      Nuestro trabajo es
    </p>
  )
}

function Eco() {
  return (
    <p className={`titular ${styles.echo}`} data-inter="echo">
      Tu marca con tu público
    </p>
  )
}

// Intro compartida: contexto → statement desde la máscara → eco.
function introEstandar(scope, tl) {
  const entrada = scope.querySelectorAll('[data-inter="entrada"]')
  const statement = scope.querySelector('[data-inter="statement"]')
  const echo = scope.querySelector('[data-inter="echo"]')

  if (entrada.length) {
    gsap.set(entrada, { opacity: 0, y: 20 })
    tl.to(entrada, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 })
  }
  if (statement) {
    gsap.set(statement, { yPercent: 110 })
    tl.to(statement, { yPercent: 0, duration: 1.4, ease: 'power4.out' }, 0.4)
  }
  if (echo) {
    gsap.set(echo, { opacity: 0, y: 24 })
    tl.to(echo, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.5)
  }
}

export default function Manifiesto({ variante = 'cortina', etiqueta, id }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        const tl = gsap.timeline({
          scrollTrigger: { trigger: raiz, start: 'top 70%', once: true },
        })

        // Cortina: la capa dorada sube desde abajo atada al scroll.
        if (variante === 'cortina') {
          introEstandar(raiz, tl)
          gsap.fromTo(
            '[data-cortina="capa"]',
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: { trigger: raiz, start: 'top 40%', end: 'center 35%', scrub: 0.6 },
            },
          )
        }

        // Unión: el cable entre las dos mitades se acorta con el scroll.
        if (variante === 'union') {
          introEstandar(raiz, tl)
          gsap.fromTo(
            '[data-union="cable"]',
            { width: '32vw' },
            {
              width: 0,
              ease: 'none',
              scrollTrigger: { trigger: raiz, start: 'top 60%', end: 'center center', scrub: 0.6 },
            },
          )
        }

        // Red: el centro entra, después las líneas se trazan en cascada y
        // cada canal aparece cuando su línea llega.
        if (variante === 'red') {
          introEstandar(raiz, tl)
          const lineas = raiz.querySelectorAll('[data-red="linea"]')
          const nodos = raiz.querySelectorAll('[data-red="nodo"]')
          gsap.set(lineas, { strokeDashoffset: 1 })
          gsap.set(nodos, { opacity: 0, scale: 0.8 })
          tl.to(lineas, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', stagger: 0.08 }, 1)
          tl.to(
            nodos,
            { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.08 },
            1.5,
          )
        }
      })
    },
    { scope, dependencies: [variante] },
  )

  const clases = [styles.manifiesto, styles.varOro, styles[`var_${variante}`]]
    .filter(Boolean)
    .join(' ')
  const marca = etiqueta && <p className={styles.etiqueta}>{etiqueta}</p>

  if (variante === 'cortina') {
    const contenido = (
      <>
        <p className={styles.contexto}>Nuestro trabajo es</p>
        <p className={`titular ${styles.statement} ${styles.cortinaStatement}`}>Conectar</p>
        <p className={`titular ${styles.echo}`}>Tu marca con tu público</p>
      </>
    )
    return (
      <section ref={scope} id={id} className={`${styles.manifiesto} ${styles.var_cortina}`}>
        {marca}
        <div className={styles.cortinaBase}>
          <Contexto />
          <h2 className={`titular ${styles.statement} ${styles.cortinaStatement}`}>
            <span className={styles.mascara}>
              <span className={styles.statementLinea} data-inter="statement">
                Conectar
              </span>
            </span>
          </h2>
          <Eco />
        </div>
        <div className={styles.cortinaCapa} data-cortina="capa" aria-hidden="true">
          {contenido}
        </div>
      </section>
    )
  }

  if (variante === 'union') {
    return (
      <section ref={scope} id={id} className={clases}>
        {marca}
        <Contexto />
        <h2 className={`titular ${styles.statement} ${styles.union}`} aria-label="Conectar">
          <span className={styles.mascara}>
            <span className={styles.unionFila} data-inter="statement" aria-hidden="true">
              <span>Conec</span>
              <span className={styles.unionCable} data-union="cable" />
              <span>tar</span>
            </span>
          </span>
        </h2>
        <Eco />
      </section>
    )
  }

  // red
  return (
    <section ref={scope} id={id} className={clases}>
      {marca}
      {/* Coordenadas en % sin viewBox: el trazo no se deforma con el
          aspecto de la sección y pathLength sigue valiendo para dibujarlo. */}
      <svg className={styles.redLineas} aria-hidden="true">
        {NODOS.map((nodo) => (
          <line
            key={nodo.texto}
            x1="50%"
            y1="50%"
            x2={`${nodo.x}%`}
            y2={`${nodo.y}%`}
            pathLength="1"
            data-red="linea"
          />
        ))}
      </svg>
      <ul className={styles.redNodos} aria-hidden="true">
        {NODOS.map((nodo) => (
          <li
            key={nodo.texto}
            className={styles.redNodo}
            style={{ left: `${nodo.x}%`, top: `${nodo.y}%` }}
            data-red="nodo"
          >
            {nodo.texto}
          </li>
        ))}
      </ul>
      <div className={styles.redCentro}>
        <Contexto />
        <h2 className={`titular ${styles.statement} ${styles.redStatement}`}>
          <span className={styles.mascara}>
            <span className={styles.statementLinea} data-inter="statement">
              Conectar
            </span>
          </span>
        </h2>
        <Eco />
      </div>
    </section>
  )
}
