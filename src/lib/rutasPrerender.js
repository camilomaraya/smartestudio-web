/*
 * Rutas que se convierten en HTML real durante el build.
 *
 * Este es el único lugar donde vive esa lista. La configuración del
 * prerender (vite.config.js) no sabe nada de slugs: solo llama al script,
 * que lee de acá.
 *
 * La lista está entera derivada de los datos: servicios y proyectos salen de
 * src/data/. Agregar un servicio o un proyecto no requiere tocar este
 * archivo ni la configuración del build.
 *
 * Los proyectos SIN permiso confirmado quedan fuera solos, porque
 * SLUGS_PROYECTOS se calcula sobre `proyectosPublicables()`: un cliente sin
 * autorización no puede terminar publicado por descuido.
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
import { SLUGS_PROYECTOS } from '../data/proyectos.js'

export { SLUGS_SERVICIOS, SLUGS_PROYECTOS }

export const RUTAS_PRERENDER = [
  '/',
  '/servicios',
  '/proyectos',
  ...SLUGS_SERVICIOS.map((slug) => `/servicios/${slug}`),
  ...SLUGS_PROYECTOS.map((slug) => `/proyectos/${slug}`),
]
