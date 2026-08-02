import { useLocation } from 'react-router'
import { scrollToSection } from '../lib/lenis'
import { irAAncla } from '../lib/navegacion'
import { useReveal } from '../hooks/useReveal'
import { useTransicion } from '../hooks/useTransicion'
import EnlaceRuta from './EnlaceRuta'
import styles from './Footer.module.css'

// Mismos tres tipos que en Nav.jsx. El footer vive en el Layout, así que
// sus anclas del home tienen que navegar cuando se está en otra ruta.
const enlaces = [
  { label: 'Servicios', ancla: 'servicios' },
  { label: 'Proceso', ancla: 'proceso' },
  { label: 'Proyectos', ruta: '/proyectos' },
  { label: 'Planes', ancla: 'planes' },
  { label: 'Equipo', ancla: 'equipo' },
  { label: 'Contacto', ancla: 'contacto', local: true },
]

// TODO: reemplazar los "#" por las URLs reales de cada red.
const redes = [
  {
    label: 'Instagram',
    href: '#',
    icono: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icono: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2-.1-2.1 0-3.5 1.3-3.5 3.6V11H8.5v3h2.4v7z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icono: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M16.6 5.8c-.7-.8-1.1-1.8-1.1-2.8h-3v12.4a2.6 2.6 0 1 1-2.6-2.6c.28 0 .55.04.8.13V9.9a5.66 5.66 0 1 0 4.8 5.6V9.5c.94.7 2.1 1.1 3.3 1.1V7.6c-.86 0-1.66-.68-2.2-1.8z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/56981649378',
    icono: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9.3 8.2c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c.5 1 1.4 1.9 2.4 2.4l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.6c0 .6-.5 1.1-1.1 1-3.3-.3-6-2.9-6.4-6.2 0-.3 0-.7.1-1z"
          fill="currentColor"
        />
      </svg>
    ),
  },
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
