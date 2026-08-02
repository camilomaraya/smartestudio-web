import { tituloDeRuta } from '../hooks/useRutaScroll'

/*
 * SEO por ruta para el prerender (Fase 3c).
 *
 * El título NO se define acá: se reutiliza el mismo `tituloDeRuta()` que ya
 * usa el cliente al navegar (hooks/useRutaScroll.js), para que la pestaña y
 * el HTML generado nunca digan cosas distintas.
 *
 * Open Graph y Twitter quedan fuera de esta fase: falta la imagen social.
 */

// TODO: confirmar el dominio definitivo antes de publicar.
const SITIO = 'https://smartestudio.cl'

const DESCRIPCION_BASE =
  'Smart Estudio, agencia de marketing digital en La Serena–Coquimbo. Creamos relaciones entre tu marca y tu público. De aquí salen buenas ideas.'

const DESCRIPCIONES = {
  '/': DESCRIPCION_BASE,
  '/servicios':
    'Community management, diseño gráfico e identidad, fotografía y video, y publicidad digital. Lo que hacemos por tu marca en Smart Estudio.',
  '/proyectos':
    'Marcas que confiaron en Smart Estudio. Casos de community management, contenido audiovisual y campañas en La Serena–Coquimbo.',
}

/*
 * Las fichas llevan placeholder con la estructura final. En la Fase 6 el
 * `resumen` del cliente o del servicio (§8) reemplaza a estas dos funciones:
 * un mismo párrafo escrito una vez sirve para el índice, la cabecera de la
 * ficha y esta meta description.
 */
function descripcionDeFicha(seccion, slug) {
  const nombre = slug.replace(/-/g, ' ')
  if (seccion === 'proyectos') {
    return `Proyecto ${nombre} — el trabajo que hicimos con esta marca en Smart Estudio, agencia de marketing digital en La Serena–Coquimbo.`
  }
  return `${nombre} en Smart Estudio — cómo trabajamos este servicio para marcas de La Serena–Coquimbo.`
}

export function descripcionDeRuta(pathname) {
  if (DESCRIPCIONES[pathname]) return DESCRIPCIONES[pathname]

  const [seccion, slug] = pathname.split('/').filter(Boolean)
  if (slug) return descripcionDeFicha(seccion, slug)

  return DESCRIPCION_BASE
}

export function canonicaDeRuta(pathname) {
  // Sin barra final salvo en la raíz, para no generar dos URLs por página.
  const limpia = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return `${SITIO}${limpia}`
}

// Todo lo que el prerender necesita inyectar en el <head> de una ruta.
export function seoDeRuta(pathname) {
  return {
    titulo: tituloDeRuta(pathname),
    descripcion: descripcionDeRuta(pathname),
    canonica: canonicaDeRuta(pathname),
  }
}
