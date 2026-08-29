/*
 * Genera los SVG de relleno de public/placeholders/.
 *
 * Existen para poder maquetar y calibrar /proyectos con proporciones reales
 * antes de tener el material del cliente. NO son parte del diseño: cuando
 * lleguen las fotos y videos se reemplazan por archivos reales y este script
 * y su carpeta se borran.
 *
 * Se corre a mano (`node scripts/generar-placeholders.mjs`), no en el build:
 * el resultado se commitea como cualquier otro asset.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DESTINO = path.join(RAIZ, 'public', 'placeholders')

// Tokens del sistema (DESIGN.md §2). Duplicados acá a propósito: este script
// genera assets estáticos y no puede leer el CSS.
const BG = '#0a0a0a'
const LINE = '#2a2a2a'
const MUTED = '#8e8e8e'
const GOLD = '#f3c13a'

// Proporciones reales de cada formato, para que el maquetado no mienta.
const FORMATOS = {
  post: { w: 1080, h: 1350 }, // 4:5
  reel: { w: 1080, h: 1920 }, // 9:16
  historia: { w: 1080, h: 1920 },
  informe: { w: 1414, h: 1000 }, // A4 apaisado
  web: { w: 1600, h: 900 }, // 16:9
  portada: { w: 1600, h: 1200 }, // 4:3
}

/*
 * Cada cliente tiene su ángulo de trama, para que dos placeholders distintos
 * no se confundan de un vistazo mientras se revisa el layout.
 */
const CLIENTES = {
  'villa-verla': { angulo: 0, etiqueta: 'Villa Verla' },
  'automotriz-carmona': { angulo: 45, etiqueta: 'Automotriz Carmona' },
  'la-rusia': { angulo: 90, etiqueta: 'La Rusia' },
  'veterinaria-larrain': { angulo: 135, etiqueta: 'Veterinaria Larraín' },
  'alfalfa-cakes': { angulo: 22, etiqueta: 'Alfalfa Cakes' },
}

function svg({ w, h, etiqueta, formato, indice, angulo }) {
  const diagonal = Math.round(Math.sqrt(w * w + h * h))
  const cuerpo = Math.round(Math.min(w, h) * 0.055)
  const chico = Math.round(cuerpo * 0.5)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Marcador de posición: ${etiqueta}, ${formato}">
  <defs>
    <pattern id="t" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(${angulo})">
      <line x1="0" y1="0" x2="0" y2="46" stroke="${LINE}" stroke-width="1.5"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="${BG}"/>
  <rect width="${w}" height="${h}" fill="url(#t)" opacity="0.6"/>
  <line x1="0" y1="0" x2="${w}" y2="${h}" stroke="${LINE}" stroke-width="1"/>
  <line x1="${w}" y1="0" x2="0" y2="${h}" stroke="${LINE}" stroke-width="1"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${LINE}" stroke-width="2"/>
  <g font-family="'Space Grotesk', 'Segoe UI', sans-serif" text-anchor="middle">
    <text x="${w / 2}" y="${h / 2 - cuerpo * 0.4}" font-size="${cuerpo}" font-weight="700" fill="${MUTED}" letter-spacing="2">${etiqueta.toUpperCase()}</text>
    <text x="${w / 2}" y="${h / 2 + cuerpo * 0.9}" font-size="${chico}" font-weight="500" fill="${GOLD}" letter-spacing="4">${formato.toUpperCase()} ${String(indice).padStart(2, '0')}</text>
    <text x="${w / 2}" y="${h / 2 + cuerpo * 2.1}" font-size="${chico * 0.8}" fill="${LINE}" letter-spacing="3">${w}×${h}</text>
  </g>
  <text x="${w / 2}" y="${h - cuerpo}" font-family="'Space Grotesk', 'Segoe UI', sans-serif" font-size="${chico * 0.8}" text-anchor="middle" fill="${LINE}" letter-spacing="3">MATERIAL PENDIENTE</text>
  <!-- diagonal ${diagonal}px -->
</svg>
`
}

// Qué se genera por cliente: una portada + las piezas que usa cada ficha.
const PLAN = {
  'villa-verla': ['portada', 'web', 'post', 'post', 'reel', 'informe'],
  'automotriz-carmona': ['portada', 'post', 'post', 'reel', 'historia'],
  'la-rusia': ['portada', 'post', 'reel', 'reel', 'historia'],
  'veterinaria-larrain': ['portada', 'post', 'post', 'historia'],
  'alfalfa-cakes': ['portada', 'post', 'reel', 'post'],
}

await fs.mkdir(DESTINO, { recursive: true })

let total = 0
for (const [slug, formatos] of Object.entries(PLAN)) {
  const cliente = CLIENTES[slug]
  if (!cliente) throw new Error(`Cliente sin ficha de estilo: ${slug}`)

  const contador = {}
  for (const formato of formatos) {
    const dim = FORMATOS[formato]
    if (!dim) throw new Error(`Formato desconocido: ${formato}`)

    contador[formato] = (contador[formato] ?? 0) + 1
    const n = contador[formato]
    const nombre = formato === 'portada' ? `${slug}-portada.svg` : `${slug}-${formato}-${n}.svg`

    await fs.writeFile(
      path.join(DESTINO, nombre),
      svg({ ...dim, etiqueta: cliente.etiqueta, formato, indice: n, angulo: cliente.angulo }),
      'utf8',
    )
    total += 1
  }
}

console.log(`${total} placeholders generados en public/placeholders/`)
