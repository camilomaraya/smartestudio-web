import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { serviciosPrincipales } from '../../data/servicios'
import EnlaceRuta from '../../components/EnlaceRuta'
import { Titular, Bajada, revelarTitular } from './Comunes'
import { imagenServicio } from './imagenes'
import Etiqueta from './Etiqueta'
import styles from './ServiciosPreview.module.css'

/*
 * TEMPORAL — variante «Índice con vista previa»: nombres enormes y, al
 * pasar el mouse, una imagen del trabajo que sigue al cursor inclinándose
 * según la velocidad. Las demás filas se apagan (CSS :has). En táctil o
 * con movimiento reducido no hay imagen flotante: cada fila lleva su
 * miniatura fija.
 */
export default function ServiciosPreview({ id, etiqueta }) {
  const scope = useRef(null)
  const flotante = useRef(null)
  const [activo, setActivo] = useState(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        revelarTitular(raiz)
        const filas = raiz.querySelectorAll('[data-sp="fila"]')
        gsap.set(filas, { opacity: 0, y: 30 })
        gsap.to(filas, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
        })
      })

      // La imagen flotante solo existe con mouse y movimiento permitido
      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const el = flotante.current
        const lista = scope.current.querySelector('[data-sp="lista"]')
        // A la derecha del cursor, no encima: el nombre que se está leyendo
        // queda a la vista
        gsap.set(el, { xPercent: 12, yPercent: -50, autoAlpha: 0, scale: 0.85 })
        const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
        const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
        const rot = gsap.quickTo(el, 'rotation', { duration: 0.6, ease: 'power3.out' })

        let ultimoX = null
        const mover = (e) => {
          x(e.clientX)
          y(e.clientY)
          // Inclinación según la velocidad horizontal, con tope
          const dx = ultimoX === null ? 0 : e.clientX - ultimoX
          ultimoX = e.clientX
          rot(gsap.utils.clamp(-10, 10, dx * 0.6))
        }
        const entrar = (e) => {
          gsap.set(el, { x: e.clientX, y: e.clientY })
          gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' })
        }
        const salir = () => {
          ultimoX = null
          gsap.to(el, { autoAlpha: 0, scale: 0.85, duration: 0.25, ease: 'power2.in' })
        }

        lista.addEventListener('pointermove', mover)
        lista.addEventListener('pointerenter', entrar)
        lista.addEventListener('pointerleave', salir)
        return () => {
          lista.removeEventListener('pointermove', mover)
          lista.removeEventListener('pointerenter', entrar)
          lista.removeEventListener('pointerleave', salir)
        }
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.preview}>
      <div className="container">
        <Titular />
        <ul className={styles.lista} data-sp="lista">
          {serviciosPrincipales.map((servicio, i) => (
            <li key={servicio.slug} className={styles.item}>
              <EnlaceRuta
                to={`/servicios/${servicio.slug}`}
                className={styles.fila}
                data-sp="fila"
                onPointerEnter={() => setActivo(i)}
                onFocus={() => setActivo(i)}
              >
                <span className={styles.numero} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={`titular ${styles.nombre}`}>{servicio.titulo}</h3>
                <span className={styles.gancho}>{servicio.gancho}</span>
                <img
                  className={styles.miniatura}
                  src={imagenServicio[servicio.slug]}
                  alt=""
                  loading="lazy"
                />
              </EnlaceRuta>
            </li>
          ))}
        </ul>
        <Bajada />
      </div>

      {/* Una sola imagen flotante: cambia la visible según la fila activa */}
      <div ref={flotante} className={styles.flotante} aria-hidden="true">
        {serviciosPrincipales.map((servicio, i) => (
          <img
            key={servicio.slug}
            src={imagenServicio[servicio.slug]}
            alt=""
            className={i === activo ? styles.visible : undefined}
          />
        ))}
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
