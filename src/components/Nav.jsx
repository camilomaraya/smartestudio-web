import { useEffect, useState } from 'react'
import { scrollToSection } from '../lib/lenis'
import Button from './ui/Button'
import styles from './Nav.module.css'

const enlaces = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Trabajos', href: '#trabajos' },
  { label: 'Planes', href: '#planes' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Nav() {
  const [abierto, setAbierto] = useState(false)
  const [conScroll, setConScroll] = useState(false)

  // Transparente sobre el hero; sólida con blur al hacer scroll.
  useEffect(() => {
    const alScrollear = () => setConScroll(window.scrollY > 24)
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [])

  const irA = (event, href) => {
    event.preventDefault()
    setAbierto(false)
    scrollToSection(href)
  }

  return (
    <header
      className={`${styles.nav} ${conScroll ? styles.navSolida : ''} ${
        abierto ? styles.navAbierta : ''
      }`}
    >
      <div className={`container ${styles.inner}`}>
        <a href="#inicio" className={styles.logo} onClick={(e) => irA(e, '#inicio')}>
          {/* El logo real se sube a public/ más adelante */}
          <img src="/logo-placeholder.svg" alt="Smart Estudio" width="140" height="36" />
        </a>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={abierto}
          aria-controls="menu-principal"
          onClick={() => setAbierto((v) => !v)}
        >
          <span className="visually-hidden">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span className={styles.toggleBar} aria-hidden="true" />
          <span className={styles.toggleBar} aria-hidden="true" />
        </button>

        <nav
          id="menu-principal"
          className={`${styles.menu} ${abierto ? styles.menuAbierto : ''}`}
          aria-label="Navegación principal"
        >
          <ul className={styles.lista}>
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <a
                  href={enlace.href}
                  className={styles.enlace}
                  onClick={(e) => irA(e, enlace.href)}
                >
                  {enlace.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.ctaWrap}>
            <Button href="#contacto" onClick={(e) => irA(e, '#contacto')}>
              Conversemos
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
