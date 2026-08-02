import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToSection } from '../lib/lenis'
import styles from './Nav.module.css'

const enlaces = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Trabajos', href: '#trabajos' },
  { label: 'Planes', href: '#planes' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Contacto', href: '#contacto' },
]

// TODO: unificar con las redes del Footer cuando lleguen las URLs reales.
const redes = [
  { label: 'Instagram', href: '#' },
  { label: 'TikTok', href: '#' },
  { label: 'WhatsApp', href: 'https://wa.me/56981649378' },
]

export default function Nav() {
  // `abierto` es el estado lógico; `visible` mantiene el panel en el DOM
  // mientras corre el fade de salida.
  const [abierto, setAbierto] = useState(false)
  const [visible, setVisible] = useState(false)

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

  const irA = (event, href) => {
    event.preventDefault()
    cerrar()
    scrollToSection(href)
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
        className={styles.marca}
        aria-label="Smart Estudio — ir al inicio"
        onClick={(evento) => irA(evento, '#inicio')}
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
                <li key={enlace.href}>
                  <a
                    href={enlace.href}
                    className={styles.enlace}
                    data-enlace
                    onClick={(evento) => irA(evento, enlace.href)}
                  >
                    {enlace.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.pie}>
            <a
              href="#contacto"
              className={styles.pieEnlace}
              onClick={(evento) => irA(evento, '#contacto')}
            >
              Conversemos
            </a>
            <ul className={styles.redes}>
              {redes.map((red) => (
                <li key={red.label}>
                  <a
                    href={red.href}
                    className={styles.pieEnlace}
                    target={red.href.startsWith('http') ? '_blank' : undefined}
                    rel={red.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {red.label}
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
