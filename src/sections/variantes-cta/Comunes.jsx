import { scrollToSection } from '../../lib/lenis'

/*
 * TEMPORAL — piezas compartidas por las variantes del CTA del home. Los
 * textos son los reales del brief (cierre y frase), sin tocar.
 */

export const FRASE = '¿Listx para despegar tus ideas?'

// Cuando exista el número definitivo en data/redes.jsx, sale de ahí.
export const WHATSAPP = 'https://wa.me/56981649378'

export const irAContacto = (evento) => {
  evento.preventDefault()
  scrollToSection('#contacto')
}
