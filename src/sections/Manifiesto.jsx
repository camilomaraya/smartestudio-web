import { useEffect, useId, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap'
import { NODOS } from '../data/red'
import { redes } from '../data/redes'
import styles from './Manifiesto.module.css'

/*
 * CONECTAR al centro y líneas que se trazan hacia los canales, sobre negro
 * con ondas de señal que se abren desde el centro y siguen latiendo.
 * Cada canal abre una card con trabajo real (hover, foco o toque); el
 * contenido vive en data/red.js.
 */

const iconoWhatsApp = redes.find((red) => red.label === 'WhatsApp')?.icono

// Margen para pasar el mouse de la píldora a la card sin que se cierre
const RETARDO_CIERRE = 120

// Hacia dónde abre la card según la posición del canal: siempre hacia el
// centro de la sección, así nunca queda cortada por el borde.
function ladoCard({ x, y }) {
  const h = x < 50 ? styles.hDerecha : x > 50 ? styles.hIzquierda : styles.hCentro
  const v = x === 50 ? styles.vBajo : y < 35 ? styles.vAbajo : y > 65 ? styles.vArriba : styles.vCentro
  return `${h} ${v}`
}

function MediaCard({ card, reproducir }) {
  const video = useRef(null)

  useEffect(() => {
    const el = video.current
    if (!el || !card.src) return
    if (reproducir) el.play().catch(() => {})
    else el.pause()
  }, [reproducir, card.src])

  if (card.tipo === 'imagen') {
    return <img className={styles.cardMedia} src={card.src} alt={card.alt} loading="lazy" />
  }

  if (card.tipo === 'video') {
    return (
      <video
        ref={video}
        className={styles.cardMedia}
        src={card.src || undefined}
        poster={card.poster}
        muted
        loop
        playsInline
        preload="none"
      />
    )
  }

  if (card.tipo === 'mensaje') {
    return (
      <div className={`${styles.cardMedia} ${styles.mensaje}`}>
        <div className={styles.mensajeAutor}>
          <span className={styles.mensajeAvatar} aria-hidden="true">
            {card.autor.charAt(0).toUpperCase()}
          </span>
          {card.autor}
        </div>
        <p className={styles.mensajeBurbuja}>{card.mensaje}</p>
      </div>
    )
  }

  // notificacion
  return (
    <div className={`${styles.cardMedia} ${styles.notificacion}`}>
      <div className={styles.aviso}>
        <div className={styles.avisoCabecera}>
          <span className={styles.avisoIcono} aria-hidden="true">
            {iconoWhatsApp}
          </span>
          {card.app} · ahora
        </div>
        <p className={styles.avisoTitulo}>Nueva consulta</p>
        <p className={styles.avisoMensaje}>«{card.mensaje}»</p>
      </div>
    </div>
  )
}

export default function Manifiesto({ id }) {
  const scope = useRef(null)
  const idCard = useId()
  // activo: canal abierto. mostrado: el último abierto, para que la card
  // conserve su contenido mientras se desvanece al cerrar.
  const [activo, setActivo] = useState(null)
  const [mostrado, setMostrado] = useState(0)
  const cierre = useRef(null)

  const cancelarCierre = () => clearTimeout(cierre.current)
  const abrir = (i) => {
    cancelarCierre()
    setActivo(i)
    setMostrado(i)
  }
  const cerrar = () => {
    cancelarCierre()
    setActivo(null)
  }
  const cerrarLuego = () => {
    cancelarCierre()
    cierre.current = setTimeout(() => setActivo(null), RETARDO_CIERRE)
  }

  // Con una card abierta: tocar fuera de píldoras y card, o Escape, cierra
  useEffect(() => {
    if (activo === null) return
    const alTocar = (e) => {
      if (!e.target.closest('[data-red="boton"], [data-red="card"]')) cerrar()
    }
    const alTeclear = (e) => {
      if (e.key === 'Escape') cerrar()
    }
    document.addEventListener('pointerdown', alTocar)
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('pointerdown', alTocar)
      document.removeEventListener('keydown', alTeclear)
    }
  }, [activo])

  useEffect(() => cancelarCierre, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        const tl = gsap.timeline({
          scrollTrigger: { trigger: raiz, start: 'top 70%', once: true },
        })

        const entrada = raiz.querySelector('[data-inter="entrada"]')
        const statement = raiz.querySelector('[data-inter="statement"]')
        const echo = raiz.querySelector('[data-inter="echo"]')
        const ondas = raiz.querySelector('[data-red="ondas"]')
        const lineas = raiz.querySelectorAll('[data-red="linea"]')
        const nodos = raiz.querySelectorAll('[data-red="nodo"]')

        // Contexto → statement desde la máscara → eco
        gsap.set(entrada, { opacity: 0, y: 20 })
        gsap.set(statement, { yPercent: 110 })
        gsap.set(echo, { opacity: 0, y: 24 })
        tl.to(entrada, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        tl.to(statement, { yPercent: 0, duration: 1.4, ease: 'power4.out' }, 0.4)
        tl.to(echo, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.5)

        // Las ondas se abren desde el centro mientras entra CONECTAR y
        // después siguen latiendo hacia afuera (CSS), solo en pantalla.
        gsap.set(ondas, { scale: 0.6, opacity: 0 })
        tl.to(ondas, { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' }, 0.6)
        ScrollTrigger.create({
          trigger: raiz,
          start: 'top bottom',
          end: 'bottom top',
          toggleClass: { targets: ondas, className: styles.latiendo },
        })

        // Las líneas se trazan en cascada y cada canal aparece cuando su
        // línea llega.
        gsap.set(lineas, { strokeDashoffset: 1 })
        gsap.set(nodos, { opacity: 0, scale: 0.8 })
        tl.to(lineas, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', stagger: 0.08 }, 1)
        tl.to(
          nodos,
          { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.08 },
          1.5,
        )
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.manifiesto}>
      <div className={styles.ondas} data-red="ondas" aria-hidden="true" />
      {/* Coordenadas en % sin viewBox: el trazo no se deforma con el
          aspecto de la sección y pathLength sigue valiendo para dibujarlo. */}
      <svg className={styles.lineas} aria-hidden="true">
        {NODOS.map((nodo, i) => (
          <line
            key={nodo.texto}
            className={activo === i ? styles.lineaActiva : undefined}
            x1="50%"
            y1="50%"
            x2={`${nodo.x}%`}
            y2={`${nodo.y}%`}
            pathLength="1"
            data-red="linea"
          />
        ))}
      </svg>
      <ul className={styles.nodos} aria-label="Canales">
        {NODOS.map((nodo, i) => (
          <li
            key={nodo.texto}
            className={styles.nodo}
            style={{ left: `${nodo.x}%`, top: `${nodo.y}%` }}
            data-red="nodo"
          >
            {/* Hover solo con mouse: en táctil el pointerenter llega junto
                con el click y abriría dos veces. Ahí manda el toque. */}
            <button
              type="button"
              className={`${styles.pildora} ${activo === i ? styles.pildoraActiva : ''}`}
              aria-expanded={activo === i}
              aria-controls={idCard}
              data-red="boton"
              onPointerEnter={(e) => e.pointerType === 'mouse' && abrir(i)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && cerrarLuego()}
              onFocus={() => abrir(i)}
              onBlur={cerrarLuego}
              onClick={() => abrir(i)}
            >
              {nodo.texto}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.centro}>
        <p className={styles.contexto} data-inter="entrada">
          Nuestro trabajo es
        </p>
        <h2 className={`titular ${styles.statement}`}>
          <span className={styles.mascara}>
            <span className={styles.statementLinea} data-inter="statement">
              Conectar
            </span>
          </span>
        </h2>
        <p className={`titular ${styles.echo}`} data-inter="echo">
          Tu marca con tu público
        </p>
      </div>
      {/* Una sola card para toda la red: se mueve al canal activo y cambia
          de contenido. Queda montada para que la salida se vea. */}
      <div
        id={idCard}
        className={`${styles.card} ${ladoCard(NODOS[mostrado])} ${activo !== null ? styles.cardVisible : ''}`}
        style={{ '--x': `${NODOS[mostrado].x}%`, '--y': `${NODOS[mostrado].y}%` }}
        data-red="card"
        aria-hidden={activo === null}
        onPointerEnter={(e) => e.pointerType === 'mouse' && cancelarCierre()}
        onPointerLeave={(e) => e.pointerType === 'mouse' && cerrarLuego()}
      >
        <MediaCard card={NODOS[mostrado].card} reproducir={activo === mostrado} />
        <p className={styles.cardEtiqueta}>{NODOS[mostrado].texto}</p>
        <p className={styles.cardTexto}>{NODOS[mostrado].card.texto}</p>
      </div>
    </section>
  )
}
