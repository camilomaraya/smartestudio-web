// Vite convierte estos imports en URLs de los .woff2 empaquetados (sin CDN).
// OJO: este archivo NO debe importar three — lo comparte el fallback de
// mobile (TexturaEstatica) y arrastraría three al bundle principal.
import faSolidUrl from '@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2?url'
import faBrandsUrl from '@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2?url'

/*
 * Íconos de marca dibujados con Font Awesome a un <canvas>.
 * Dos salidas:
 *   - crearAtlasIconos(): textura-atlas para el campo WebGL (desktop).
 *   - crearPatronIconos(): tile PNG (data URL) para el fallback estático
 *     de mobile/low-power. Cero WebGL.
 *
 * Si más adelante llegan los SVG originales del brochure, basta con
 * reemplazar el dibujo de cada glyph (fillText → drawImage/Path2D)
 * manteniendo el mismo layout.
 */

// Codepoints de Font Awesome (v6/v7); "at" y "hashtag" usan su carácter ASCII.
const ICONOS = [
  { codepoint: 0xf0e7, familia: 'solid' }, // rayo (bolt)
  { codepoint: 0xf004, familia: 'solid' }, // corazón (heart)
  { codepoint: 0x40, familia: 'solid' }, // arroba (at) → '@'
  { codepoint: 0xf030, familia: 'solid' }, // cámara (camera)
  { codepoint: 0xf04b, familia: 'solid' }, // play
  { codepoint: 0x23, familia: 'solid' }, // hashtag → '#'
  { codepoint: 0xf007, familia: 'solid' }, // user
  { codepoint: 0xf16d, familia: 'brands' }, // Instagram
  { codepoint: 0xf39e, familia: 'brands' }, // Facebook (facebook-f)
  { codepoint: 0xe07b, familia: 'brands' }, // TikTok
  { codepoint: 0xf232, familia: 'brands' }, // WhatsApp
  // Cierran el trío del engagement (el corazón ya estaba) y suman el canal
  // B2B y la voz de campaña. Siluetas sólidas: a 14-36px y baja opacidad,
  // los íconos de trazo fino (gráficos, estadísticas) se deshacen.
  { codepoint: 0xf075, familia: 'solid' }, // comentario (comment)
  { codepoint: 0xf1e0, familia: 'solid' }, // compartir (share-nodes)
  { codepoint: 0xf0a1, familia: 'solid' }, // megáfono (bullhorn)
  { codepoint: 0xf08c, familia: 'brands' }, // LinkedIn
  // Más variedad para que el campo no se sienta repetido. Mismo criterio:
  // siluetas sólidas del universo redes/contenido/campaña.
  { codepoint: 0xf164, familia: 'solid' }, // like (thumbs-up)
  { codepoint: 0xf005, familia: 'solid' }, // estrella (star)
  { codepoint: 0xf0f3, familia: 'solid' }, // notificación (bell)
  { codepoint: 0xf1d8, familia: 'solid' }, // enviar (paper-plane)
  { codepoint: 0xf03e, familia: 'solid' }, // imagen (image)
  { codepoint: 0xf03d, familia: 'solid' }, // video
  { codepoint: 0xf06e, familia: 'solid' }, // alcance (eye)
  { codepoint: 0xf3c5, familia: 'solid' }, // ubicación (location-dot)
  { codepoint: 0xf0eb, familia: 'solid' }, // idea (lightbulb)
  { codepoint: 0xf135, familia: 'solid' }, // lanzamiento (rocket)
  { codepoint: 0xf06d, familia: 'solid' }, // tendencia (fire)
  { codepoint: 0xf167, familia: 'brands' }, // YouTube
  { codepoint: 0xf1bc, familia: 'brands' }, // Spotify
]

// Carga única de las fuentes (compartida entre atlas y patrón).
let promesaFuentes = null

function cargarFuentes() {
  if (!promesaFuentes) {
    const solid = new FontFace('AtlasFASolid', `url(${faSolidUrl})`, { weight: '900' })
    const brands = new FontFace('AtlasFABrands', `url(${faBrandsUrl})`)
    promesaFuentes = Promise.all([solid.load(), brands.load()]).then(([s, b]) => {
      document.fonts.add(s)
      document.fonts.add(b)
    })
  }
  return promesaFuentes
}

function fuenteCanvas(familia, tamano) {
  return familia === 'solid' ? `900 ${tamano}px AtlasFASolid` : `400 ${tamano}px AtlasFABrands`
}

/* ============================================
   Atlas para el campo WebGL
   ============================================ */

const CELDA = 128 // px por celda
const COLUMNAS = 8
const FILAS = 4 // 8×4 = 32 celdas para 28 íconos (atlas 1024×512, potencia de 2)

export async function crearAtlasIconos() {
  await cargarFuentes()

  const canvas = document.createElement('canvas')
  canvas.width = COLUMNAS * CELDA
  canvas.height = FILAS * CELDA

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff' // el color final lo pone el shader; aquí solo importa el alfa
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ICONOS.forEach((icono, indice) => {
    const columna = indice % COLUMNAS
    const fila = Math.floor(indice / COLUMNAS)
    ctx.font = fuenteCanvas(icono.familia, CELDA * 0.6)
    ctx.fillText(
      String.fromCharCode(icono.codepoint),
      columna * CELDA + CELDA / 2,
      fila * CELDA + CELDA / 2,
    )
  })

  return {
    // Canvas crudo: quien lo consuma (CampoIconos) lo envuelve en
    // THREE.CanvasTexture, para que three viva solo en el chunk WebGL.
    canvas,
    columnas: COLUMNAS,
    filas: FILAS,
    // Offset UV de la celda de cada ícono. La textura usa flipY (default de
    // three), por eso la fila se cuenta desde abajo.
    celdas: ICONOS.map((_, indice) => {
      const columna = indice % COLUMNAS
      const fila = Math.floor(indice / COLUMNAS)
      return [columna / COLUMNAS, 1 - (fila + 1) / FILAS]
    }),
  }
}

/* ============================================
   Tile del patrón estático (fallback mobile/low-power)
   ============================================ */

const TILE = 480 // tamaño lógico del tile en px (se dibuja a 2x para retina)

// Distribución fija y hecha a mano: dispersión orgánica sin tocar los bordes
// (así el tile se repite sin cortes). x/y en fracción del tile.
const DISTRIBUCION_PATRON = [
  { icono: 0, x: 0.14, y: 0.12, tamano: 44, rotacion: -0.15, alfa: 0.16 },
  { icono: 7, x: 0.52, y: 0.08, tamano: 34, rotacion: 0.1, alfa: 0.12 },
  { icono: 3, x: 0.86, y: 0.16, tamano: 40, rotacion: 0.2, alfa: 0.15 },
  { icono: 5, x: 0.3, y: 0.3, tamano: 30, rotacion: -0.1, alfa: 0.11 },
  { icono: 9, x: 0.68, y: 0.34, tamano: 46, rotacion: 0.12, alfa: 0.16 },
  { icono: 1, x: 0.1, y: 0.48, tamano: 36, rotacion: 0.18, alfa: 0.13 },
  { icono: 4, x: 0.44, y: 0.52, tamano: 42, rotacion: -0.2, alfa: 0.15 },
  { icono: 10, x: 0.85, y: 0.55, tamano: 34, rotacion: -0.08, alfa: 0.12 },
  { icono: 2, x: 0.22, y: 0.7, tamano: 46, rotacion: 0.1, alfa: 0.16 },
  { icono: 8, x: 0.58, y: 0.74, tamano: 30, rotacion: 0.15, alfa: 0.11 },
  { icono: 6, x: 0.9, y: 0.8, tamano: 40, rotacion: -0.12, alfa: 0.14 },
  { icono: 9, x: 0.36, y: 0.9, tamano: 34, rotacion: 0.05, alfa: 0.12 },
]

// Devuelve { url, tamano }: un PNG (data URL) para usar como
// background-image repetido, con los íconos en gris muy tenue.
export async function crearPatronIconos() {
  await cargarFuentes()

  const escala = 2 // nitidez en pantallas retina
  const canvas = document.createElement('canvas')
  canvas.width = TILE * escala
  canvas.height = TILE * escala

  const ctx = canvas.getContext('2d')
  ctx.scale(escala, escala)
  ctx.fillStyle = '#6a6a6a' // mismo gris tenue que el campo WebGL
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  DISTRIBUCION_PATRON.forEach((entrada) => {
    const icono = ICONOS[entrada.icono]
    ctx.save()
    ctx.translate(entrada.x * TILE, entrada.y * TILE)
    ctx.rotate(entrada.rotacion)
    ctx.globalAlpha = entrada.alfa
    ctx.font = fuenteCanvas(icono.familia, entrada.tamano)
    ctx.fillText(String.fromCharCode(icono.codepoint), 0, 0)
    ctx.restore()
  })

  return { url: canvas.toDataURL('image/png'), tamano: TILE }
}
