import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { serviciosPrincipales } from '../data/servicios'
import EnlaceRuta from '../components/EnlaceRuta'
import styles from './Servicios.module.css'

/*
 * Servicios en el home — sección de contenido del estándar nuevo (DESIGN.md §4):
 * titular partido con el fragmento final dorado, sin eyebrow, bajada al final.
 *
 * El gesto propio es el índice: cuatro filas que se trazan de a una, con su
 * línea dibujándose antes de que entre el texto. No son tarjetas — la grilla
 * de `.card` era el formato de la versión anterior y compite con el vacío que
 * el rediseño busca. Cada fila entera es el enlace a la ficha.
 */
export default function Servicios() {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lineas = scope.current.querySelectorAll('[data-serv="linea"]')
        const reglas = scope.current.querySelectorAll('[data-serv="regla"]')
        const filas = scope.current.querySelectorAll('[data-serv="fila"]')
        const bajada = scope.current.querySelector('[data-serv="bajada"]')

        // Estado inicial vía JS: si el JS falla, la sección queda completa.
        gsap.set(lineas, { yPercent: 110, y: 0 })
        gsap.set(reglas, { scaleX: 0, transformOrigin: 'left center' })
        gsap.set(filas, { opacity: 0, y: 18 })
        gsap.set(bajada, { opacity: 0, y: 20 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: 'top 75%', once: true },
        })

        /*
         * fromTo con `y: 0` explícito, no `to` de solo yPercent: GSAP suma
         * `y` y `yPercent`, y bajo el doble montaje de StrictMode la segunda
         * pasada leería el transform de la primera como `y` y duplicaría el
         * desplazamiento. Las líneas conservan su transform (la máscara es
         * estructura, ver DESIGN.md §6).
         */
        tl.fromTo(
          lineas,
          { yPercent: 110, y: 0 },
          { yPercent: 0, y: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
        )
          // La regla se traza antes que su fila: el índice se dibuja y
          // después se llena. Sin esa precedencia el gesto no se lee.
          .to(
            reglas,
            { scaleX: 1, duration: 0.7, stagger: 0.09, ease: 'power2.inOut' },
            0.5,
          )
          .to(
            filas,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.09,
              ease: 'power3.out',
              // Los hovers CSS de la fila vuelven a mandar al terminar.
              clearProps: 'opacity,transform',
            },
            0.68,
          )
          .to(
            bajada,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            },
            '>-0.3',
          )
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="servicios" className={styles.servicios}>
      <div className="container">
        <h2 className={styles.titular}>
          <span className={styles.mascara}>
            <span className={styles.linea} data-serv="linea">
              Lo que hacemos
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={styles.linea} data-serv="linea">
              por tu marca,
            </span>
          </span>
          <span className={styles.mascara}>
            <span className={`${styles.linea} ${styles.acento}`} data-serv="linea">
              en concreto
            </span>
          </span>
        </h2>

        <ul className={styles.lista}>
          {serviciosPrincipales.map((servicio, indice) => (
            <li key={servicio.slug} className={styles.item}>
              {/* La regla es decorativa y se anima aparte de la fila */}
              <span className={styles.regla} data-serv="regla" aria-hidden="true" />
              <EnlaceRuta
                to={`/servicios/${servicio.slug}`}
                className={styles.fila}
                data-serv="fila"
              >
                <span className={styles.numero} aria-hidden="true">
                  {String(indice + 1).padStart(2, '0')}
                </span>
                <span className={styles.cuerpo}>
                  <h3 className={styles.nombre}>{servicio.titulo}</h3>
                  <span className={styles.gancho}>{servicio.gancho}</span>
                </span>
                <span className={styles.flecha} aria-hidden="true">
                  →
                </span>
              </EnlaceRuta>
            </li>
          ))}
        </ul>

        <p className={styles.bajada} data-serv="bajada">
          Cada servicio funciona solo, pero se potencian juntos: la identidad le da
          forma al contenido, el contenido alimenta la pauta y la pauta trae a
          quienes todavía no te conocen.{' '}
          <EnlaceRuta to="/servicios" className={styles.verTodo}>
            Ver los servicios en detalle
          </EnlaceRuta>
        </p>
      </div>
    </section>
  )
}
