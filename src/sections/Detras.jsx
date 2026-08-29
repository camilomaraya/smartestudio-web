import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { piezasDestacadas } from '../data/proyectos'
import { useReveal } from '../hooks/useReveal'
import EnlaceRuta from '../components/EnlaceRuta'
import styles from './Detras.module.css'

/*
 * Sección E — "el detrás" (DESIGN.md §6).
 *
 * Reemplaza a la antigua sección Trabajos, que era una grilla de tarjetas
 * 4/5. Acá pasa una columna central angosta de piezas reales —post, reel,
 * historia, informe, web— y a los lados, alternando, el texto que explica el
 * trabajo invisible que hay detrás de cada una.
 *
 * El zigzag es el gesto; el parallax es leve y va sobre las piezas, no sobre
 * el texto (mover texto mientras se lee es hostil). Cierra con el enlace a
 * /proyectos, que es donde el interés se convierte en recorrido.
 */
export default function Detras() {
  const scope = useRef(null)
  // Entrada de las filas por el hook estándar; `scope` maneja el titular y
  // el parallax (el porqué de la división está dentro de useGSAP).
  const scopeReveal = useReveal()
  const piezas = piezasDestacadas(5)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lineas = scope.current.querySelectorAll('[data-detras="linea"]')

        gsap.set(lineas, { yPercent: 110, y: 0 })

        // fromTo con `y: 0` explícito: GSAP suma `y` y `yPercent`, y bajo el
        // doble montaje de StrictMode la segunda pasada duplicaría el
        // desplazamiento dejando el titular tapado por su máscara.
        gsap.fromTo(
          lineas,
          { yPercent: 110, y: 0 },
          {
            yPercent: 0,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: { trigger: scope.current, start: 'top 75%', once: true },
          },
        )

        // Cada fila entra por su lado: la pieza desde su margen, el texto
        // desde el opuesto. El desplazamiento es corto —24px— porque el
        // gesto de la sección es el zigzag, no la entrada.
        /*
         * Parallax leve sobre la pieza. Va sobre la imagen y no sobre su
         * contenedor: el contenedor define el hueco en la grilla y moverlo
         * desplazaría también al texto de al lado.
         *
         * La ENTRADA de las filas la resuelve `useReveal` con `data-reveal`,
         * el mismo mecanismo que el resto del sitio. Se intentó además una
         * entrada direccional (pieza y texto entrando cada uno desde su
         * lado, acompañando el zigzag) y quedó pendiente: NO se pudo
         * verificar en pantalla, así que no se dejó puesta a ciegas.
         *
         * DOS TRAMPAS AL VERIFICAR ESTO, las dos ya pagadas:
         * 1. Un `scrollIntoView()` o `window.scrollTo()` desde la consola no
         *    dispara ningún reveal: ScrollTrigger se entera del scroll por
         *    `lenis.on('scroll', …)` (lib/lenis.js) y Lenis ignora los
         *    scrolls nativos que no pasaron por él. Hay que scrollear de
         *    verdad — rueda, barra o un enlace de ancla.
         * 2. Con la pestaña en segundo plano el navegador congela los
         *    `requestAnimationFrame`, y como Lenis corre sobre el ticker de
         *    GSAP, el scroll deja de avanzar y NINGÚN trigger dispara. Todo
         *    se queda en `opacity: 0` como si estuviera roto. Antes de
         *    declarar un bug de reveal, comprobar que la pestaña está
         *    visible y que los rAF corren.
         */
        scope.current.querySelectorAll('[data-detras="imagen"]').forEach((imagen) => {
          gsap.fromTo(
            imagen,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              scrollTrigger: {
                trigger: imagen.closest('[data-detras="fila"]'),
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

  // Sin piezas publicables no hay sección: mejor nada que un hueco con
  // titular y ningún contenido debajo.
  if (piezas.length === 0) return null

  return (
    <section ref={scope} id="detras" className={styles.detras}>
      <div className="container">
        <h2 className={styles.titular}>
          <span className={styles.mascara}>
            <span className={styles.linea} data-detras="linea">
              Lo que se ve
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={styles.linea} data-detras="linea">
              es la mitad
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={`${styles.linea} ${styles.acento}`} data-detras="linea">
              del trabajo
            </span>
          </span>
        </h2>

        <div className={styles.filas} ref={scopeReveal}>
          {piezas.map((pieza, indice) => (
            <article
              key={pieza.src}
              className={`${styles.fila} ${indice % 2 === 1 ? styles.invertida : ''}`}
              data-detras="fila"
              data-reveal
            >
              {/* Marco con overflow oculto: el parallax mueve la imagen
                  dentro de él y no empuja nada de la grilla. */}
              <figure className={styles.media} data-detras="media">
                <span className={styles.marco}>
                  <img
                    className={`${styles.imagen} ${styles[pieza.tipo] ?? ''}`}
                    src={pieza.src}
                    alt={pieza.titulo}
                    loading="lazy"
                    decoding="async"
                    data-detras="imagen"
                  />
                </span>
              </figure>

              <div className={styles.texto} data-detras="texto">
                <span className={styles.tipo}>{pieza.tipo}</span>
                <h3 className={styles.titulo}>{pieza.titulo}</h3>
                <p className={styles.explicacion}>{pieza.detras}</p>
                <EnlaceRuta to={`/proyectos/${pieza.slug}`} className={styles.cliente}>
                  {pieza.proyecto}
                  <span aria-hidden="true"> →</span>
                </EnlaceRuta>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.cierre}>
          Cada pieza que publicamos tiene una decisión detrás.{' '}
          <EnlaceRuta to="/proyectos" className={styles.enlaceCierre}>
            Ver todos los proyectos
          </EnlaceRuta>
        </p>
      </div>
    </section>
  )
}
