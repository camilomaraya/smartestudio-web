import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gsap } from '../../lib/gsap'
import { crearAtlasIconos } from './atlasIconos'
import CampoIconos from './CampoIconos'
import styles from './FondoIconos.module.css'

/*
 * Calidad adaptativa: mide el FPS en ventanas de ~2s y, si un equipo que
 * pasó los chequeos de FondoIconos igual no llega a 45 FPS, baja el dpr a 1
 * una sola vez (no vuelve a subir, para no oscilar). Se salta el primer
 * segundo (compilación del shader) y los frames largos que deja volver a la
 * pestaña o reanudar el frameloop congelado.
 */
const FPS_MINIMO = 45
const VENTANA = 2
const CALENTAMIENTO = 1

function VigilanteRendimiento() {
  const setDpr = useThree((estado) => estado.setDpr)
  const medicion = useRef({ transcurrido: 0, tiempo: 0, frames: 0, listo: false })

  useFrame((_, delta) => {
    const m = medicion.current
    if (m.listo || delta > 0.25) return

    m.transcurrido += delta
    if (m.transcurrido < CALENTAMIENTO) return

    m.tiempo += delta
    m.frames++
    if (m.tiempo < VENTANA) return

    if (m.frames / m.tiempo < FPS_MINIMO) {
      setDpr(1)
      m.listo = true
    }
    m.tiempo = 0
    m.frames = 0
  })

  return null
}

/*
 * Monta el <Canvas> de R3F con el campo de íconos.
 * - El atlas se genera async (carga de fuentes); hasta entonces no hay canvas
 *   y queda visible el resplandor CSS de .canvasFondo.
 * - Un IntersectionObserver congela el frameloop cuando el hero sale del
 *   viewport: cero trabajo de GPU mientras se scrollea el resto del sitio.
 * - El tracking del cursor vive aquí (el canvas tiene pointer-events: none,
 *   así que se escucha en window): alimenta el uniform uMouse de la escena
 *   y el glow DOM que sigue al cursor (cero draw calls extra).
 */
export default function HeroCanvas() {
  const contenedorRef = useRef(null)
  const glowRef = useRef(null)
  // Mutable compartido con la escena: NDC del cursor + si está sobre el hero.
  const punteroRef = useRef({ x: 0, y: -10, activo: false })
  const [atlas, setAtlas] = useState(null)
  const [enViewport, setEnViewport] = useState(true)

  useEffect(() => {
    let activo = true
    crearAtlasIconos()
      .then((resultado) => {
        if (activo) setAtlas(resultado)
      })
      .catch(() => {
        // Si las fuentes no cargan, simplemente queda el fondo CSS.
      })
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return

    const observador = new IntersectionObserver(([entrada]) => {
      setEnViewport(entrada.isIntersecting)
    })
    observador.observe(contenedor)
    return () => observador.disconnect()
  }, [atlas])

  // Cursor: actualiza el puntero compartido (para el shader) y mueve el
  // glow DOM con quickTo (trailing suave, sin re-render de React).
  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    const moverX = gsap.quickTo(glow, 'x', { duration: 0.5, ease: 'power3' })
    const moverY = gsap.quickTo(glow, 'y', { duration: 0.5, ease: 'power3' })
    const opacidad = gsap.quickTo(glow, 'opacity', { duration: 0.4, ease: 'power2' })

    const alMover = (evento) => {
      const rect = contenedorRef.current.getBoundingClientRect()
      const dentro =
        evento.clientX >= rect.left &&
        evento.clientX <= rect.right &&
        evento.clientY >= rect.top &&
        evento.clientY <= rect.bottom

      punteroRef.current.activo = dentro
      opacidad(dentro ? 1 : 0)
      if (!dentro) return

      // Coordenadas normalizadas (-1..1) relativas al hero.
      punteroRef.current.x = ((evento.clientX - rect.left) / rect.width) * 2 - 1
      punteroRef.current.y = -(((evento.clientY - rect.top) / rect.height) * 2 - 1)

      moverX(evento.clientX - rect.left)
      moverY(evento.clientY - rect.top)
    }

    window.addEventListener('pointermove', alMover, { passive: true })
    return () => window.removeEventListener('pointermove', alMover)
  }, [atlas])

  if (!atlas) return null

  return (
    <div ref={contenedorRef} className={styles.wrap}>
      <Canvas
        frameloop={enViewport ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      >
        <CampoIconos atlas={atlas} puntero={punteroRef} />
        <VigilanteRendimiento />
      </Canvas>
      {/* Glow dorado que sigue al cursor (DOM, no WebGL) */}
      <div ref={glowRef} className={styles.glowCursor} aria-hidden="true" />
    </div>
  )
}
