import { useLocation } from 'react-router'
import { scrollToSection } from '../lib/lenis'
import { irAAncla } from '../lib/navegacion'
import { useReveal } from '../hooks/useReveal'
import { useTransicion } from '../hooks/useTransicion'
import { redes } from '../data/redes'
import EnlaceRuta from './EnlaceRuta'
import styles from './Footer.module.css'

// Mismos tres tipos que en Nav.jsx. El footer vive en el Layout, así que
// sus anclas del home tienen que navegar cuando se está en otra ruta.
const enlaces = [
  { label: 'Servicios', ruta: '/servicios' },
  { label: 'Proyectos', ancla: 'proyectos' },
  { label: 'Planes', ancla: 'planes' },
  { label: 'Equipo', ancla: 'equipo' },
  { label: 'Contacto', ancla: 'contacto', local: true },
]

export default function Footer() {
  const scope = useReveal()
  const { pathname } = useLocation()
  const { navegarCon } = useTransicion()

  const irA = (evento, enlace) => {
    evento.preventDefault()

    // Contacto vive en el Layout: está en todas las rutas, no navega nunca.
    if (enlace.local) {
      scrollToSection(`#${enlace.ancla}`)
      return
    }
    // navegarCon: desde otra ruta esto es navegación y lleva cortina.
    irAAncla(enlace.ancla, { pathname, navigate: navegarCon })
  }

  return (
    <footer ref={scope} className={styles.footer}>
      <div className={`container ${styles.inner}`} data-reveal-group>
        <div className={styles.marca}>
          <img
            src="/logo-smart.png"
            alt="Smart Estudio"
            width="512"
            height="512"
            className={styles.logo}
          />
        </div>

        <nav aria-label="Navegación del pie de página">
          <ul className={styles.lista}>
            {enlaces.map((enlace) => (
              <li key={enlace.label}>
                {enlace.ruta ? (
                  <EnlaceRuta to={enlace.ruta}>{enlace.label}</EnlaceRuta>
                ) : (
                  <a href={`#${enlace.ancla}`} onClick={(evento) => irA(evento, enlace)}>
                    {enlace.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <ul className={styles.redes} aria-label="Redes sociales">
          {redes.map((red) => (
            <li key={red.label}>
              <a
                href={red.href}
                className={styles.redSocial}
                aria-label={red.label}
                target={red.href.startsWith('http') ? '_blank' : undefined}
                rel={red.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {red.icono}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={`container ${styles.legal}`} data-reveal>
        <p>© 2026 Smart Estudio · De aquí salen buenas ideas.</p>
      </div>
    </footer>
  )
}
