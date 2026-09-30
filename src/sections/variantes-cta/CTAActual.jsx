import CTA from '../CTA'
import Etiqueta from './Etiqueta'

/*
 * TEMPORAL — el CTA de hoy, montado tal cual como referencia. El envoltorio
 * solo existe para ubicar la etiqueta (CTA.jsx no se toca).
 */
export default function CTAActual({ etiqueta }) {
  return (
    <div style={{ position: 'relative' }}>
      <CTA />
      <Etiqueta>{etiqueta}</Etiqueta>
    </div>
  )
}
