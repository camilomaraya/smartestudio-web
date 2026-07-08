import { lazy, Suspense, useEffect, useState } from 'react'
import TexturaEstatica from './TexturaEstatica'

// Lazy: three/R3F viven en un chunk aparte que solo se descarga
// si el dispositivo pasa los chequeos. En mobile no se paga ese peso.
const HeroCanvas = lazy(() => import('./HeroCanvas'))

// Fallback (crítico): sin WebGL pesado en pantallas chicas, táctiles de baja
// potencia, sin soporte WebGL o con reduced-motion. En esos casos se muestra
// la textura de íconos estática (TexturaEstatica), sin cursor ni dorado.
function puedeConWebGL() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.matchMedia('(max-width: 860px)').matches) return false

  const esTactil = window.matchMedia('(pointer: coarse)').matches
  const nucleos = navigator.hardwareConcurrency ?? 4
  if (esTactil && nucleos <= 4) return false

  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  return Boolean(gl)
}

export default function FondoIconos() {
  // null = aún sin decidir (primer render); evita montar y desmontar
  // el fallback en desktop.
  const [apto, setApto] = useState(null)

  useEffect(() => {
    setApto(puedeConWebGL())
  }, [])

  if (apto === null) return null

  if (!apto) return <TexturaEstatica />

  return (
    <Suspense fallback={null}>
      <HeroCanvas />
    </Suspense>
  )
}
