import { gsap, useGSAP } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'
import styles from './Trabajos.module.css'

// Placeholders: las imágenes y videos reales se cargan más adelante.
const trabajos = [
  { id: 1, label: 'Reel' },
  { id: 2, label: 'Sesión' },
  { id: 3, label: 'Campaña' },
  { id: 4, label: 'Reel' },
  { id: 5, label: 'Sesión' },
  { id: 6, label: 'Campaña' },
]

export default function Trabajos() {
  const scope = useReveal()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Reveal de la grilla: fade + leve scale, en cascada.
        const tarjetas = gsap.utils.toArray('[data-trabajos-grilla] > *')
        gsap.set(tarjetas, { opacity: 0, y: 24, scale: 0.96 })
        gsap.to(tarjetas, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '[data-trabajos-grilla]',
            start: 'top 85%',
            once: true,
          },
        })

        // Parallax sutil del fondo de cada placeholder (±5%), listo
        // para cuando lleguen las imágenes reales.
        gsap.utils.toArray('[data-trabajos-fondo]').forEach((fondo) => {
          gsap.fromTo(
            fondo,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: fondo.closest('li'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="trabajos" className={styles.trabajos}>
      <div className="container">
        <div className={styles.encabezado} data-reveal-group>
          <p className="eyebrow">Showcase</p>
          <h2 className={styles.titulo}>Trabajos</h2>
        </div>

        <ul className={styles.grilla} data-trabajos-grilla>
          {trabajos.map((trabajo) => (
            <li key={trabajo.id} className={styles.tarjeta}>
              {/* .media hace el zoom de hover; .mediaFondo (sobredimensionado)
                  recibirá la imagen/video real y lleva el parallax */}
              <div className={styles.media} aria-hidden="true">
                <div className={styles.mediaFondo} data-trabajos-fondo />
              </div>
              <span className={styles.label}>{trabajo.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
