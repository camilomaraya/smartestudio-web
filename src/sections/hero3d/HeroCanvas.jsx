import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap } from '../../lib/gsap'
import { crearAtlasIconos } from './atlasIconos'
import CampoIconos from './CampoIconos'
import styles from './FondoIconos.module.css'

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
      </Canvas>
      {/* Glow dorado que sigue al cursor (DOM, no WebGL) */}
      <div ref={glowRef} className={styles.glowCursor} aria-hidden="true" />
    </div>
  )
}
