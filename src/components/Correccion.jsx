import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import styles from './Correccion.module.css'

/*
 * La frase como datos: cada bloque es un array de líneas y cada línea un
 * array de tokens con su tipo. Cambiar el copy es editar esto y nada más.
 *
 * Bloque A son los estados 1 y 2: la misma frase, corregida en su lugar.
 * Bloque B es el estado 3: una frase distinta que reemplaza a la anterior.
 */
const BLOQUE_A = [
  { tokens: [{ t: 'QUIERO MÁS', tipo: 'estable' }] },
  {
    tokens: [
      { t: 'SEGUIDORES', tipo: 'tachada' },
      { t: 'CLIENTES', tipo: 'entra' },
    ],
  },
]

const BLOQUE_B = [
  {
    tokens: [
      { t: 'NO QUEREMOS MÁS', tipo: 'estable' },
      { t: 'SEGUIDORES.', tipo: 'acento' },
    ],
  },
  {
    tokens: [
      { t: 'QUEREMOS MÁS', tipo: 'estable' },
      { t: 'CLIENTES.', tipo: 'acento' },
    ],
  },
]

function renderTokens(tokens) {
  return tokens.flatMap((token, j) => {
    // Espacio real (texto, no margin) entre tokens de la misma línea.
    const separador = j > 0 ? [' '] : []

    if (token.tipo === 'tachada') {
      return [
        ...separador,
        // aria-hidden sobre la palabra entera: el lector de pantalla lee la
        // frase corregida, no el "antes" que el tacho ya descartó.
        <span key={j} className={styles.tachada} data-correccion="tachada" aria-hidden="true">
          {token.t}
          <span className={styles.tacho} data-correccion="tacho" />
        </span>,
      ]
    }

    if (token.tipo === 'entra') {
      return [
        ...separador,
        <span key={j} className={styles.entra} data-correccion="entra">
          {token.t}
        </span>,
      ]
    }

    if (token.tipo === 'acento') {
      return [
        ...separador,
        <span key={j} className={styles.acento}>
          {token.t}
        </span>,
      ]
    }

    return [...separador, token.t]
  })
}

function renderLineas(lineas) {
  return lineas.map((linea, i) => (
    <span key={i} className={styles.linea}>
      <span className={styles.lineaInner} data-correccion="linea">
        {renderTokens(linea.tokens)}
      </span>
    </span>
  ))
}

export default function Correccion() {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      /*
       * Con movimiento reducido no entra nada de esto: sin pin y sin scrub,
       * la sección queda como un bloque normal de 100svh mostrando el estado
       * 3. Es la decisión, no un olvido: el mensaje final ya está en reposo.
       */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const seccion = scope.current
        const bloqueA = seccion.querySelector('[data-bloque="a"]')
        const bloqueB = seccion.querySelector('[data-bloque="b"]')

        // Solo las líneas del bloque A se revelan con máscara; las de B entran
        // con el bloque entero cuando le llega su estado.
        const lineasA = bloqueA.querySelectorAll('[data-correccion="linea"]')
        const tachada = bloqueA.querySelector('[data-correccion="tachada"]')
        const tacho = bloqueA.querySelector('[data-correccion="tacho"]')
        const entra = bloqueA.querySelector('[data-correccion="entra"]')

        /*
         * Los colores se resuelven desde los tokens acá y no se pasan como
         * `var(--x)` al tween: GSAP no sabe interpolar una custom property de
         * color, y con scrub un salto de color se vería entero. Los tokens
         * siguen siendo la única fuente de verdad, solo se leen antes.
         */
        const estilos = getComputedStyle(seccion)
        const colorIngenuo = estilos.getPropertyValue('--white').trim()
        const colorTachado = estilos.getPropertyValue('--gray-dim').trim()

        /*
         * Reconstruye el ESTADO 1 encima del reposo (que es el estado 3).
         * Si algo de esto no corre, lo que queda a la vista es el mensaje
         * final: esa es la regla de fallback de la sección.
         */
        gsap.set(bloqueA, { opacity: 1 })
        gsap.set(tachada, { color: colorIngenuo })
        gsap.set(tacho, { scaleX: 0 })
        gsap.set(entra, { opacity: 0, clipPath: 'inset(100% 0 0 0)' })
        gsap.set(bloqueB, { opacity: 0, y: 40 })

        /*
         * TRIGGER 1 — entrada de la frase ingenua. Once y sin scrub: la
         * lectura llega antes de que la sección se fije.
         *
         * fromTo con yPercent explícito en los dos extremos, nunca set + to:
         * bajo StrictMode la segunda pasada leería el translate de la primera
         * como `y` en px y lo sumaría al porcentaje (trampa #1 del §6).
         */
        gsap.fromTo(
          lineasA,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.09,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: seccion,
              start: 'top 60%',
              once: true,
            },
          },
        )

        /*
         * TRIGGER 2 — los tres estados, atados al progreso del scroll.
         *
         * Sin clearProps en toda esta timeline: el scrub la reproduce hacia
         * atrás al subir y necesita conservar el estado para revertirlo.
         */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: seccion,
            start: 'top top',
            end: '+=250%',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Los huecos entre tiempos son pausas de lectura: con scrub se
        // traducen en tramos de scroll donde la frase se queda quieta.
        tl
          // t=0 → 1: se lee "QUIERO MÁS SEGUIDORES".
          .to(tacho, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 1)
          .to(tachada, { color: colorTachado, duration: 0.5, ease: 'power2.inOut' }, 1)
          .to(
            entra,
            { clipPath: 'inset(0 0 0 0)', opacity: 1, duration: 0.6, ease: 'power3.out' },
            1.15,
          )
          // t=1.75 → 2.6: se lee la frase ya corregida.
          .to(bloqueA, { opacity: 0, y: -40, duration: 0.6, ease: 'power2.in' }, 2.6)
          .to(bloqueB, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 2.8)
          // Marca el final en t=4: el tramo entre 3.5 y 4 es el hold que deja
          // leer el mensaje nuevo antes de que la sección se suelte.
          .set({}, {}, 4)
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="correccion" className={styles.correccion}>
      <div className={`container ${styles.contenido}`}>
        <div className={styles.columnaTexto}>
          {/* Bloque A es el planteo que se corrige: un gesto visual, y por eso
              queda entero fuera del árbol de accesibilidad. El mensaje de la
              sección —y su h2— es el bloque B, que además es el reposo. */}
          <p
            className={`titular ${styles.frase} ${styles.bloqueA}`}
            data-bloque="a"
            aria-hidden="true"
          >
            {renderLineas(BLOQUE_A)}
          </p>
          <h2 className={`titular ${styles.frase} ${styles.bloqueB}`} data-bloque="b">
            {renderLineas(BLOQUE_B)}
          </h2>
        </div>

        {/* Espacio reservado: marco vacío a propósito, sin contenido todavía. */}
        <div className={styles.columnaReservada} aria-hidden="true" />
      </div>
    </section>
  )
}
