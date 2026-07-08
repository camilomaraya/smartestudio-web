import { gsap, useGSAP } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'
import styles from './Proceso.module.css'

const smart = [
  { letra: 'S', texto: 'Súper específicos' },
  { letra: 'M', texto: 'Medibles' },
  { letra: 'A', texto: 'Alcanzables' },
  { letra: 'R', texto: 'Realistas' },
  { letra: 'T', texto: 'Tiempos y plazos eficientes' },
]

export default function Proceso() {
  const scope = useReveal()

  // Momento firma: las filas SMART en cascada, cada letra dorada
  // entrando un instante antes que su texto.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const filas = gsap.utils.toArray('[data-smart-fila]')

        const tl = gsap.timeline({
          defaults: { duration: 0.8, ease: 'power3.out', clearProps: 'opacity,transform' },
          scrollTrigger: {
            trigger: '[data-smart-lista]',
            start: 'top 85%',
            once: true,
          },
        })

        filas.forEach((fila, indice) => {
          const letra = fila.querySelector('[data-smart-letra]')
          const texto = fila.querySelector('[data-smart-texto]')
          gsap.set([letra, texto], { opacity: 0, y: 24 })

          const inicio = indice * 0.14
          tl.to(letra, { opacity: 1, y: 0 }, inicio)
          tl.to(texto, { opacity: 1, y: 0 }, inicio + 0.1)
        })
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="proceso" className={styles.proceso}>
      <div className="container">
        <div className={styles.encabezado} data-reveal-group>
          <p className="eyebrow">Proceso</p>
          <h2 className={styles.titulo}>El inicio de todo</h2>
          <p className={styles.texto}>
            Todo parte por conocerte. En la reunión inicial escuchamos tus objetivos y entendemos
            tus necesidades para trabajar juntxs en lo que de verdad importa: que tu negocio
            crezca.
          </p>
        </div>

        {/* Acrónimo SMART como protagonista */}
        <ul className={styles.listaSmart} data-smart-lista>
          {smart.map((item) => (
            <li key={item.letra} className={styles.itemSmart} data-smart-fila>
              <span className={styles.letra} aria-hidden="true" data-smart-letra>
                {item.letra}
              </span>
              <span className={styles.detalle} data-smart-texto>
                {item.texto}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
