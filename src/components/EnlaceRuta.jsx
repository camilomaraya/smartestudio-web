import { useTransicion } from '../hooks/useTransicion'

/*
 * Enlace de ruta con cortina.
 *
 * Renderiza un <a href> real, no un botón: lo necesitan el navegador (para
 * cmd+click, "abrir en pestaña nueva", copiar dirección) y el rastreo de
 * rutas del prerender más adelante. El preventDefault va encima, y solo
 * cuando el click es un click normal.
 *
 * `alNavegar` corre antes de la cortina — lo usa el nav para cerrar su panel.
 */
export default function EnlaceRuta({ to, children, alNavegar, ...props }) {
  const { navegarCon } = useTransicion()

  const alHacerClick = (evento) => {
    // Modificadores y botones que no son el izquierdo abren pestaña o
    // ventana nueva: interceptarlos rompería esos gestos.
    if (
      evento.defaultPrevented ||
      evento.button !== 0 ||
      evento.metaKey ||
      evento.ctrlKey ||
      evento.shiftKey ||
      evento.altKey
    ) {
      return
    }

    evento.preventDefault()
    alNavegar?.()
    navegarCon(to)
  }

  return (
    <a href={to} onClick={alHacerClick} {...props}>
      {children}
    </a>
  )
}
