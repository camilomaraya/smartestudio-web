import { scrollToSection } from './lenis'

/*
 * Enlaces a secciones que solo existen en el home.
 *
 * Desde "/" es scroll directo. Desde cualquier otra ruta hay que navegar
 * primero y dejar el destino en el state: Home lo consume después de montar
 * (ver paginas/Home.jsx), porque antes del montaje la sección no existe.
 *
 * Ojo: esto NO aplica a #contacto, que vive en el Layout y por lo tanto
 * está presente en todas las rutas — ese siempre es scroll local.
 */
export function irAAncla(id, { pathname, navigate }) {
  if (pathname === '/') {
    scrollToSection(`#${id}`)
    return
  }
  navigate('/', { state: { scrollTo: id } })
}
