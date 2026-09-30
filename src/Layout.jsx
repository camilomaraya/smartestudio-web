import { useRef } from 'react'
import { Outlet } from 'react-router'
import { useLenis } from './hooks/useLenis'
import { useRutaScroll } from './hooks/useRutaScroll'
import Nav from './components/Nav'
import ContactoActual from './sections/variantes-contacto/ContactoActual'
import ContactoChat from './sections/variantes-contacto/ContactoChat'
import ContactoPantalla from './sections/variantes-contacto/ContactoPantalla'
import Footer from './components/Footer'
import Transicion from './components/Transicion'
import styles from './Layout.module.css'

/*
 * Layout compartido por todas las rutas.
 *
 * Lenis se monta acá y no en las páginas: es instancia única y no se
 * destruye al navegar. Contacto y Footer también viven acá, así que
 * #contacto existe en cualquier ruta y su enlace nunca navega.
 */
export default function Layout() {
  const mainRef = useRef(null)

  useLenis()
  useRutaScroll(mainRef)

  return (
    // Transicion provee navegarCon() a Nav y Footer, y monta la cortina
    // por encima de todo.
    <Transicion>
      <Nav />
      {/* tabIndex -1: destino del foco al cambiar de ruta (ver useRutaScroll) */}
      <main ref={mainRef} tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      {/* TEMPORAL: variantes del formulario para comparar, en todas las
          rutas como el original. Al elegir una, pasa a ser
          sections/Contacto.jsx (con id="contacto", ancla del hero, la nav y
          el footer) y se borra sections/variantes-contacto. */}
      <ContactoActual id="contacto" etiqueta="Formulario: actual pulido" />
      <ContactoChat etiqueta="Formulario: chat" />
      <ContactoPantalla etiqueta="Formulario: una pregunta por pantalla" />
      <Footer />
    </Transicion>
  )
}
