/*
 * Rutas que se convierten en HTML real durante el build.
 *
 * Este es el único lugar donde vive esa lista. La configuración del
 * prerender (vite.config.js) no sabe nada de slugs: solo llama al script,
 * que lee de acá.
 *
 * Las fichas de servicio salen de src/data/servicios.js: agregar un
 * servicio no requiere tocar este archivo ni la configuración del build.
 *
 * El catch-all (*) NO se prerenderiza a propósito: no es una página del
 * sitio, es la respuesta a una URL que no existe.
 */

/*
 * Extensión .js explícita, a diferencia del resto del código: este módulo lo
 * importa scripts/prerender.mjs con Node directamente, sin pasar por Vite, y
 * el resolvedor de ESM de Node no completa extensiones. Sin ella el build
 * muere en ERR_MODULE_NOT_FOUND antes de compilar nada.
 */
import { SLUGS_SERVICIOS } from '../data/servicios.js'

export { SLUGS_SERVICIOS }

export const RUTAS_PRERENDER = [
  '/',
  '/servicios',
  ...SLUGS_SERVICIOS.map((slug) => `/servicios/${slug}`),
]
