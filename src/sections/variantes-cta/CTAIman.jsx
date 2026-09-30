import { Fragment, useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import Button from '../../components/ui/Button'
import { FRASE, WHATSAPP } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './CTAIman.module.css'

/*
 * TEMPORAL — variante «Titular gigante + imán»: el cierre ocupa la pantalla
 * con «Comencemos a trabajar» letra por letra, y las letras se levantan
 * hacia el cursor igual que en el hero. El botón también se deja atraer.
 * Sin marquee: la frase de cierre queda como bajada.
 *
 * La lógica del imán es copia de Hero.jsx a propósito (no se refactoriza
 * el hero por una variante que puede descartarse).
 */
const TITULAR = 'Comencemos a trabajar'
const LINEAS = [
  { texto: 'Comencemos a', dorado: false },
  { texto: 'trabajar', dorado: true },
]
const RADIO_IMAN = 260
// Hasta dónde llega el tirón del botón (px desde su centro)
const RADIO_BOTON = 180

export default function CTAIman({ id, etiqueta }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        const mascaras = gsap.utils.toArray('[data-cti="mascara"]', raiz)
        const letras = gsap.utils.toArray('[data-letra]', raiz)
        const boton = raiz.querySelector('[data-cti="boton"]')
        const conHover = window.matchMedia('(hover: hover)').matches

        gsap.set('[data-cti="linea"]', { yPercent: 110 })
        gsap.set(['[data-cti="bajada"]', boton], { opacity: 0, y: 24 })

        let centros = []
        const medirLetras = () => {
          centros = letras.map((letra) => {
            const rect = letra.getBoundingClientRect()
            return {
              x: rect.left + rect.width / 2 + window.scrollX,
              y: rect.top + rect.height / 2 + window.scrollY,
              alto: rect.height,
              moverY: gsap.quickTo(letra, 'y', { duration: 0.45, ease: 'power3' }),
              rotar: gsap.quickTo(letra, 'rotation', { duration: 0.45, ease: 'power3' }),
            }
          })
        }

        gsap
          .timeline({
            defaults: { ease: 'power4.out' },
            scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
          })
          .to('[data-cti="linea"]', { yPercent: 0, duration: 1, stagger: 0.14 })
          .to('[data-cti="bajada"]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
          .to(boton, { opacity: 1, y: 0, duration: 0.6, clearProps: 'opacity' }, '-=0.45')
          .call(() => {
            // Las letras que se inclinan salen de la máscara: se libera al final
            gsap.set(mascaras, { overflow: 'visible' })
            medirLetras()
          })

        if (!conHover) return

        const botonX = gsap.quickTo(boton, 'x', { duration: 0.5, ease: 'power3' })
        const botonY = gsap.quickTo(boton, 'y', { duration: 0.5, ease: 'power3' })

        const alMover = (evento) => {
          const px = evento.clientX + window.scrollX
          const py = evento.clientY + window.scrollY
          centros.forEach((c) => {
            const dx = px - c.x
            const cercania = Math.max(0, 1 - Math.hypot(dx, py - c.y) / RADIO_IMAN)
            c.moverY(-c.alto * 0.2 * cercania)
            c.rotar(gsap.utils.clamp(-1, 1, dx / RADIO_IMAN) * 10 * cercania)
          })

          // El botón se mide en vivo: son dos lecturas, no una por letra
          const rect = boton.getBoundingClientRect()
          const bx = evento.clientX - (rect.left + rect.width / 2 - gsap.getProperty(boton, 'x'))
          const by = evento.clientY - (rect.top + rect.height / 2 - gsap.getProperty(boton, 'y'))
          const tiron = Math.max(0, 1 - Math.hypot(bx, by) / RADIO_BOTON)
          botonX(bx * 0.35 * tiron)
          botonY(by * 0.35 * tiron)
        }
        const alSalir = () => {
          centros.forEach((c) => {
            c.moverY(0)
            c.rotar(0)
          })
          botonX(0)
          botonY(0)
        }
        const alRedimensionar = () => {
          if (centros.length) medirLetras()
        }
        // Lenis mueve la página sin mover el cursor: se vuelve a medir al
        // parar, o las letras reaccionan a posiciones viejas
        const alScroll = () => {
          if (centros.length) medirLetras()
        }

        raiz.addEventListener('pointermove', alMover)
        raiz.addEventListener('pointerleave', alSalir)
        window.addEventListener('resize', alRedimensionar)
        window.addEventListener('scrollend', alScroll)

        return () => {
          raiz.removeEventListener('pointermove', alMover)
          raiz.removeEventListener('pointerleave', alSalir)
          window.removeEventListener('resize', alRedimensionar)
          window.removeEventListener('scrollend', alScroll)
        }
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.iman} aria-label="Llamado a la acción">
      <div className={`container ${styles.contenido}`}>
        <h2 className={`titular ${styles.titular}`} aria-label={TITULAR}>
          {LINEAS.map((linea) => (
            <span
              key={linea.texto}
              className={styles.mascara}
              data-cti="mascara"
              aria-hidden="true"
            >
              <span
                className={`${styles.linea} ${linea.dorado ? styles.dorado : ''}`}
                data-cti="linea"
              >
                {linea.texto.split(' ').map((palabra, indice) => (
                  <Fragment key={palabra}>
                    {indice > 0 && ' '}
                    <span className={styles.palabra}>
                      {[...palabra].map((letra, i) => (
                        <span key={i} className={styles.letra} data-letra>
                          {letra}
                        </span>
                      ))}
                    </span>
                  </Fragment>
                ))}
              </span>
            </span>
          ))}
        </h2>

        <p className={styles.bajada} data-cti="bajada">
          {FRASE}
        </p>

        <div className={styles.accion}>
          <Button href={WHATSAPP} target="_blank" rel="noreferrer" data-cti="boton">
            Escríbenos por WhatsApp
          </Button>
        </div>
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
