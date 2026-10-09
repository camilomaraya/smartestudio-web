/*
 * Genera los SVG de relleno de public/placeholders/.
 *
 * Existen para poder maquetar y calibrar las piezas con proporciones reales
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
 * Cada trabajo tiene su ángulo de trama, para que dos placeholders distintos
 * no se confundan de un vistazo mientras se revisa el layout. El nombre del
 * cliente no va escrito: el sitio no lo muestra (data/proyectos.js).
 */
const ANGULOS = {
  'villa-verla': 0,
  'automotriz-carmona': 45,
  'la-rusia': 90,
  'veterinaria-larrain': 135,
  'alfalfa-cakes': 22,
  'corleone-cafeteria': 30,
  'optica-vision-global': 60,
  'perfumeria-dreams': 75,
  'la-casita-del-molle': 105,
  'crece-activo': 120,
  goanimal: 150,
  'los-perdedores': 165,
}

function svg({ w, h, formato, indice, angulo }) {
  const diagonal = Math.round(Math.sqrt(w * w + h * h))
  const cuerpo = Math.round(Math.min(w, h) * 0.055)
  const chico = Math.round(cuerpo * 0.5)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Marcador de posición: ${formato}">
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
    <text x="${w / 2}" y="${h / 2 - cuerpo * 0.4}" font-size="${cuerpo}" font-weight="700" fill="${MUTED}" letter-spacing="2">${formato.toUpperCase()}</text>
    <text x="${w / 2}" y="${h / 2 + cuerpo * 0.9}" font-size="${chico}" font-weight="500" fill="${GOLD}" letter-spacing="4">${String(indice).padStart(2, '0')}</text>
    <text x="${w / 2}" y="${h / 2 + cuerpo * 2.1}" font-size="${chico * 0.8}" fill="${LINE}" letter-spacing="3">${w}×${h}</text>
  </g>
  <text x="${w / 2}" y="${h - cuerpo}" font-family="'Space Grotesk', 'Segoe UI', sans-serif" font-size="${chico * 0.8}" text-anchor="middle" fill="${LINE}" letter-spacing="3">MATERIAL PENDIENTE</text>
  <!-- diagonal ${diagonal}px -->
</svg>
`
}

/*
 * Qué se genera por trabajo: exactamente lo que referencian data/proyectos.js,
 * data/servicios.js (imágenes del home) y data/red.js. El número de cada
 * archivo sale del orden: el segundo 'reel' de un trabajo es su reel-2.
 */
const PLAN = {
  'villa-verla': ['portada', 'post', 'web', 'reel', 'reel', 'reel'],
  'automotriz-carmona': ['post', 'reel', 'reel', 'reel', 'reel'],
  'la-rusia': ['post', 'post', 'reel', 'reel', 'historia'],
  'veterinaria-larrain': ['post', 'post', 'post', 'reel', 'reel', 'reel'],
  'alfalfa-cakes': ['post', 'reel'],
  'corleone-cafeteria': ['post', 'post', 'reel'],
  'optica-vision-global': ['post', 'reel'],
  'perfumeria-dreams': ['post'],
  'la-casita-del-molle': ['reel'],
  'crece-activo': ['reel', 'reel'],
  goanimal: ['reel', 'web'],
  'los-perdedores': ['post'],
}

await fs.mkdir(DESTINO, { recursive: true })

let total = 0
for (const [slug, formatos] of Object.entries(PLAN)) {
  const angulo = ANGULOS[slug]
  if (angulo === undefined) throw new Error(`Trabajo sin ángulo de trama: ${slug}`)

  const contador = {}
  for (const formato of formatos) {
    const dim = FORMATOS[formato]
    if (!dim) throw new Error(`Formato desconocido: ${formato}`)

    contador[formato] = (contador[formato] ?? 0) + 1
    const n = contador[formato]
    const nombre = formato === 'portada' ? `${slug}-portada.svg` : `${slug}-${formato}-${n}.svg`

    await fs.writeFile(
      path.join(DESTINO, nombre),
      svg({ ...dim, formato, indice: n, angulo }),
      'utf8',
    )
    total += 1
  }
}

console.log(`${total} placeholders generados en public/placeholders/`)
