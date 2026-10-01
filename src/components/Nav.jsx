import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToSection } from '../lib/lenis'
import { irAAncla } from '../lib/navegacion'
import { useTransicion } from '../hooks/useTransicion'
import { redes } from '../data/redes'
import EnlaceRuta from './EnlaceRuta'
import styles from './Nav.module.css'

/*
 * Tres tipos de enlace:
 *   ruta   → navegación real con Link.
 *   local  → sección que existe en todas las rutas (vive en el Layout):
 *            scroll directo, nunca navega.
 *   ancla  → sección que solo existe en el home: desde otra ruta hay que
 *            navegar primero (ver lib/navegacion.js).
 */
const enlaces = [
  { label: 'Servicios', ruta: '/servicios' },
  { label: 'Proyectos', ancla: 'proyectos' },
  { label: 'Planes', ancla: 'planes' },
  { label: 'Equipo', ancla: 'equipo' },
  { label: 'Contacto', ancla: 'contacto', local: true },
]

// Píxeles de scroll a partir de los cuales el logo se oculta.
const UMBRAL_LOGO = 80

export default function Nav() {
  // `abierto` es el estado lógico; `visible` mantiene el panel en el DOM
  // mientras corre el fade de salida.
  const [abierto, setAbierto] = useState(false)
  const [visible, setVisible] = useState(false)
  const [oculto, setOculto] = useState(false)

  const { pathname } = useLocation()
  const { navegarCon } = useTransicion()

  const logoRef = useRef(null)
  const botonRef = useRef(null)
  const panelRef = useRef(null)
  const permiteMovimiento = useRef(false)
  const yaMontado = useRef(false)

  const abrir = () => {
    setVisible(true)
    setAbierto(true)
  }

  const cerrar = () => setAbierto(false)

  const irA = (evento, enlace) => {
    evento.preventDefault()
    cerrar()

    // Contacto vive en el Layout: está en todas las rutas, no navega nunca.
    if (enlace.local) {
      scrollToSection(`#${enlace.ancla}`)
      return
    }
    // navegarCon en lugar de navigate: desde otra ruta esto SÍ es una
    // navegación y lleva cortina. Desde el home, irAAncla hace scroll
    // directo y no la usa.
    irAAncla(enlace.ancla, { pathname, navigate: navegarCon })
  }

  const irAlInicio = () => {
    cerrar()
    irAAncla('inicio', { pathname, navigate: navegarCon })
  }

  // La preferencia de movimiento se resuelve una vez y se mantiene actualizada
  // por matchMedia; las animaciones del panel la consultan al dispararse.
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      permiteMovimiento.current = true
      return () => {
        permiteMovimiento.current = false
      }
    })
    return () => mm.revert()
  }, [])

  // Apertura y cierre del panel.
  useGSAP(
    () => {
      // El montaje inicial no anima nada: el panel nace cerrado.
      if (!yaMontado.current) {
        yaMontado.current = true
        return
      }

      const panel = panelRef.current
      const items = gsap.utils.toArray('[data-enlace]', panel)

      if (!permiteMovimiento.current) {
        // Sin movimiento: el panel aparece y desaparece sin transición.
        gsap.set(panel, { opacity: 1 })
        gsap.set(items, { clearProps: 'opacity,transform' })
        if (!abierto) setVisible(false)
        return
      }

      if (abierto) {
        gsap.set(panel, { opacity: 0 })
        gsap.set(items, { opacity: 0, y: 30 })
        gsap
          .timeline()
          .to(panel, { opacity: 1, duration: 0.4, ease: 'power2.out' })
          .to(
            items,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: 'power3.out',
              // Los estilos inline no deben pisar el hover CSS del enlace.
              clearProps: 'opacity,transform',
            },
            0.15,
          )
        return
      }

      // Al cerrar, el fade del panel cubre a los enlaces: no se animan aparte.
      gsap.to(panel, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setVisible(false),
      })
    },
    { dependencies: [abierto] },
  )

  // Escape cierra; Tab queda atrapado entre los círculos y el panel.
  useEffect(() => {
    if (!abierto) return

    const alTeclear = (evento) => {
      if (evento.key === 'Escape') {
        cerrar()
        return
      }
      if (evento.key !== 'Tab') return

      // En orden visual: los dos círculos siguen sobre el panel, así que
      // el ciclo del foco tiene que incluirlos.
      const focusables = [
        logoRef.current,
        botonRef.current,
        ...panelRef.current.querySelectorAll('a[href], button'),
      ].filter(Boolean)
      const primero = focusables[0]
      const ultimo = focusables[focusables.length - 1]

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [abierto])

  // El logo solo vive arriba de todo: lejos del top se oculta, en cualquier
  // ancho y sin importar la dirección, y queda solo el botón del menú.
  // Lenis mueve el scroll nativo, así que el evento de window llega igual.
  useEffect(() => {
    const alScrollear = () => setOculto(window.scrollY > UMBRAL_LOGO)
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [])

  // Scrollear con el panel abierto lo cierra.
  useEffect(() => {
    if (!abierto) return
    const alScrollear = () => cerrar()
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [abierto])

  // Foco al primer enlace al abrir; de vuelta al botón al cerrar.
  useEffect(() => {
    if (abierto) {
      panelRef.current?.querySelector('[data-enlace]')?.focus()
    } else if (yaMontado.current) {
      botonRef.current?.focus()
    }
  }, [abierto])

  return (
    <>
      <button
        ref={logoRef}
        type="button"
        className={[
          styles.marca,
          // Con el menú abierto el logo es parte de la trampa de foco: siempre visible.
          oculto && !abierto && styles.marcaOculta,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Smart Estudio — ir al inicio"
        onClick={irAlInicio}
      >
        <img src="/logo-smart.png" alt="" className={styles.logo} width="512" height="512" />
      </button>

      <button
        ref={botonRef}
        type="button"
        className={`${styles.circulo} ${styles.circuloHamburguesa}`}
        aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={abierto}
        aria-controls="menu-principal"
        onClick={() => (abierto ? cerrar() : abrir())}
      >
        <span className={styles.lineas} aria-hidden="true">
          <span className={styles.linea} />
          <span className={styles.linea} />
          <span className={styles.linea} />
        </span>
      </button>

      <div
        ref={panelRef}
        id="menu-principal"
        className={`${styles.panel} ${visible ? styles.panelVisible : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        inert={!abierto}
      >
        <div className={`container ${styles.panelInner}`}>
          <nav aria-label="Navegación principal">
            <ul className={styles.lista}>
              {enlaces.map((enlace) => (
                <li key={enlace.label}>
                  {enlace.ruta ? (
                    <EnlaceRuta
                      to={enlace.ruta}
                      className={styles.enlace}
                      data-enlace
                      alNavegar={cerrar}
                    >
                      {enlace.label}
                    </EnlaceRuta>
                  ) : (
                    <a
                      href={`#${enlace.ancla}`}
                      className={styles.enlace}
                      data-enlace
                      onClick={(evento) => irA(evento, enlace)}
                    >
                      {enlace.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.pie}>
            <ul className={styles.redes} aria-label="Redes sociales">
              {redes.map((red) => (
                <li key={red.label}>
                  <a
                    href={red.href}
                    className={styles.redSocial}
                    aria-label={red.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {red.icono}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
