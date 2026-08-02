/*
 * Rutas que se convierten en HTML real durante el build.
 *
 * Este es el único lugar donde vive esa lista. La configuración del
 * prerender (vite.config.js) no sabe nada de slugs: solo llama al script,
 * que lee de acá.
 *
 * FASE 6: los slugs de proyectos pasan a salir de src/data/proyectos.js
 * —algo como `proyectos.map((p) => p.slug)`— y los de servicios de
 * src/data/servicios.js. Cambiar estas dos constantes es todo lo que hace
 * falta; nada más de la configuración se toca.
 *
 * El catch-all (*) NO se prerenderiza a propósito: no es una página del
 * sitio, es la respuesta a una URL que no existe.
 */

// Placeholders hasta la Fase 6. Villa Verla es el proyecto piloto.
export const SLUGS_PROYECTOS = ['villa-verla']
export const SLUGS_SERVICIOS = ['community-management']

export const RUTAS_PRERENDER = [
  '/',
  '/servicios',
  '/proyectos',
  ...SLUGS_SERVICIOS.map((slug) => `/servicios/${slug}`),
  ...SLUGS_PROYECTOS.map((slug) => `/proyectos/${slug}`),
]
