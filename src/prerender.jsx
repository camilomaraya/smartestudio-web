import { StaticRouter, useRoutes } from 'react-router'
import { rutas } from './rutas'
import { seoDeRuta } from './lib/seo'

/*
 * Entry del prerender (Fase 3c). scripts/prerender.mjs lo compila como
 * bundle SSR y llama a `prerender()` una vez por ruta.
 *
 * Importa `rutas.jsx`, NUNCA `main.jsx`: ese hace createRoot() con
 * document.getElementById a nivel de módulo y reventaría fuera del navegador.
 *
 * Nada de esto necesita guardas de `typeof window`: todo lo que toca el
 * navegador —Lenis, el campo de íconos WebGL, la cortina, los ScrollTrigger—
 * vive dentro de efectos, y los efectos no corren en el servidor. Esa es la
 * regla 1 del §6 de DESIGN.md pagando sola.
 *
 * El CSS no se importa acá: las clases ya viajan como strings en el JSX y la
 * hoja de estilos la emite el bundle de cliente.
 */

// StaticRouter es declarativo; useRoutes consume el mismo array de objetos
// que createBrowserRouter usa en el cliente, sin duplicar la definición.
function Rutas() {
  return useRoutes(rutas)
}

export async function prerender(url) {
  // Dinámico: en el bundle SSR esto resuelve a react-dom/server.node, que es
  // justamente lo que evita el MessageChannel del scheduler (DESIGN.md §3).
  const { renderToString } = await import('react-dom/server')

  const html = renderToString(
    <StaticRouter location={url}>
      <Rutas />
    </StaticRouter>,
  )

  return { html, ...seoDeRuta(url) }
}
