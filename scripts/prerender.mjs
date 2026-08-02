import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'
import { RUTAS_PRERENDER } from '../src/lib/rutasPrerender.js'

/*
 * Build completo: bundle de cliente + un HTML real por ruta.
 *
 * Es el único comando de build (`npm run build`); no hay que acordarse de
 * correr dos cosas en orden para deployar.
 *
 * Por qué un script propio y no un plugin: DESIGN.md §3. En corto, los
 * plugins de prerender ejecutan el bundle de CLIENTE dentro de Node, y el
 * scheduler de React abre ahí un MessageChannel que deja el proceso colgado
 * para siempre. Un bundle SSR resuelve a react-dom/server.node y no tiene
 * ese problema.
 */

const RAIZ = path.resolve(import.meta.dirname, '..')
const DIST = path.join(RAIZ, 'dist')
// Fuera de dist/: es un artefacto de build, no algo que se suba al hosting.
const SALIDA_SSR = path.join(RAIZ, 'node_modules', '.prerender')

// Un HTML sin contenido real dentro del root es exactamente el fallo que
// este script existe para evitar, así que se exige un mínimo evidente.
const MINIMO_BYTES = 500

function inyectar(plantilla, { html, titulo, descripcion, canonica }) {
  let salida = plantilla

  salida = salida.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  salida = salida.replace(/<title>[\s\S]*?<\/title>/, `<title>${titulo}</title>`)
  salida = salida.replace(
    /<meta\s+name="description"[\s\S]*?\/?>/,
    `<meta name="description" content="${descripcion}" />`,
  )
  salida = salida.replace('</head>', `  <link rel="canonical" href="${canonica}" />\n  </head>`)

  return salida
}

// Devuelve el motivo del fallo, o null si la ruta está bien.
function revisar(ruta, html, documento) {
  if (!html || !html.trim()) return 'el render devolvió HTML vacío'
  if (html.length < MINIMO_BYTES) return `el HTML mide ${html.length} bytes (mínimo ${MINIMO_BYTES})`
  if (!/<h1[\s>]/.test(html)) return 'no hay <h1> en la página'

  // Nada de regex con `</div>`: el contenido trae divs anidados y cualquier
  // cierre haría falso negativo. Basta con mirar qué sigue a la apertura.
  const APERTURA = '<div id="root">'
  const posicion = documento.indexOf(APERTURA)
  if (posicion === -1) return `no se encontró ${APERTURA} en el index.html`
  if (documento.slice(posicion + APERTURA.length).trimStart().startsWith('</div>')) {
    return 'el root quedó vacío: la inyección no llegó al documento'
  }
  return null
}

async function principal() {
  // 1. Bundle de cliente, con la config del proyecto tal cual.
  await build()

  // 2. Bundle SSR del entry de prerender. Vite externaliza las dependencias,
  //    así que react-dom/server lo resuelve Node desde node_modules.
  await build({
    logLevel: 'warn',
    build: {
      ssr: path.join(RAIZ, 'src', 'prerender.jsx'),
      outDir: SALIDA_SSR,
      emptyOutDir: true,
    },
  })

  const { prerender } = await import(pathToFileURL(path.join(SALIDA_SSR, 'prerender.js')).href)
  const plantilla = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')

  const fallos = []

  for (const ruta of RUTAS_PRERENDER) {
    let resultado
    try {
      resultado = await prerender(ruta)
    } catch (error) {
      fallos.push(`${ruta} — el render lanzó: ${error.message}`)
      continue
    }

    const documento = inyectar(plantilla, resultado)
    const motivo = revisar(ruta, resultado.html, documento)
    if (motivo) {
      fallos.push(`${ruta} — ${motivo}`)
      continue
    }

    // "/" va a dist/index.html; el resto a dist/<ruta>/index.html, que es lo
    // que sirve DirectAdmin sin necesitar el rewrite del .htaccess.
    const destino =
      ruta === '/'
        ? path.join(DIST, 'index.html')
        : path.join(DIST, ...ruta.split('/').filter(Boolean), 'index.html')

    await fs.mkdir(path.dirname(destino), { recursive: true })
    await fs.writeFile(destino, documento, 'utf8')
    console.log(`  ✓ ${ruta.padEnd(34)} ${(documento.length / 1024).toFixed(1)} kB`)
  }

  await fs.rm(SALIDA_SSR, { recursive: true, force: true })

  if (fallos.length) {
    console.error('\nPrerender incompleto:')
    for (const fallo of fallos) console.error(`  ✗ ${fallo}`)
    console.error('\nNo se sube un build a medias: revisá los errores de arriba.')
    process.exit(1)
  }

  console.log(`\nPrerender completo: ${RUTAS_PRERENDER.length} rutas.`)
}

principal().catch((error) => {
  console.error('\nEl prerender falló:')
  console.error(error)
  process.exit(1)
})
