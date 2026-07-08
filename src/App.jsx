import { useLenis } from './hooks/useLenis'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Manifiesto from './sections/Manifiesto'
import Proceso from './sections/Proceso'
import Servicios from './sections/Servicios'
import Trabajos from './sections/Trabajos'
import Planes from './sections/Planes'
import Equipo from './sections/Equipo'
import CTA from './sections/CTA'
import Contacto from './sections/Contacto'

export default function App() {
  useLenis()

  return (
    <>
      <Nav />
      <main id="inicio">
        <Hero />
        <Manifiesto />
        <Proceso />
        <Servicios />
        <Trabajos />
        <Planes />
        <Equipo />
        <CTA />
        <Contacto />
      </main>
      <Footer />
    </>
  )
}
