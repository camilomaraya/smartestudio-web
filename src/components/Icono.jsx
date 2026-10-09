import desktop from '@fortawesome/fontawesome-free/svgs/solid/desktop.svg?raw'
import cartShopping from '@fortawesome/fontawesome-free/svgs/solid/cart-shopping.svg?raw'
import server from '@fortawesome/fontawesome-free/svgs/solid/server.svg?raw'
import locationDot from '@fortawesome/fontawesome-free/svgs/solid/location-dot.svg?raw'
import gaugeHigh from '@fortawesome/fontawesome-free/svgs/solid/gauge-high.svg?raw'
import chartLine from '@fortawesome/fontawesome-free/svgs/solid/chart-line.svg?raw'
import gears from '@fortawesome/fontawesome-free/svgs/solid/gears.svg?raw'
import envelopeOpenText from '@fortawesome/fontawesome-free/svgs/solid/envelope-open-text.svg?raw'
import styles from './Icono.module.css'

/*
 * Ícono de Font Awesome como SVG inline: hereda el color (currentColor) y
 * mide 1em. Se importa uno por uno a propósito: traer la carpeta o el CSS
 * de Font Awesome sumaría cientos de íconos que no se usan. Para uno
 * nuevo, importarlo acá y sumarlo al mapa.
 */
const ICONOS = {
  desktop,
  'cart-shopping': cartShopping,
  server,
  'location-dot': locationDot,
  'gauge-high': gaugeHigh,
  'chart-line': chartLine,
  gears,
  'envelope-open-text': envelopeOpenText,
}

export default function Icono({ nombre, className = '' }) {
  const svg = ICONOS[nombre]
  if (!svg) return null
  return (
    <span
      className={`${styles.icono} ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
