import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { WHATSAPP, irAContacto } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './CTADosCaminos.module.css'

/*
 * TEMPORAL — variante «Dos caminos»: el cierre deja elegir cómo empezar.
 * WhatsApp para quien quiere respuesta al toque (mitad dorada) y el
 * formulario para quien prefiere contar con calma (mitad negra). La mitad
 * bajo el cursor —o con foco— se ensancha; en celular se apilan.
 *
 * Los textos de cada camino son placeholder en la voz de marca.
 */
const CAMINOS = [
  {
    id: 'whatsapp',
    numero: '01',
    canal: 'WhatsApp',
    palabra: 'Al toque',
    texto: 'Escríbenos y seguimos la conversación por chat, sin formularios de por medio.',
    accion: 'Abrir WhatsApp',
    href: WHATSAPP,
    externo: true,
  },
  {
    id: 'formulario',
    numero: '02',
    canal: 'Formulario',
    palabra: 'Con calma',
    texto: 'Cuéntanos de tu marca y lo que necesitas; te respondemos por correo.',
    accion: 'Ir al formulario',
    href: '#contacto',
    externo: false,
  },
]

export default function CTADosCaminos({ id, etiqueta }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const raiz = scope.current
        const tl = gsap.timeline({
          scrollTrigger: { trigger: raiz, start: 'top 65%', once: true },
        })
        tl.fromTo(
          raiz.querySelectorAll('[data-ctd="linea"]'),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
        ).fromTo(
          raiz.querySelectorAll('[data-ctd="camino"]'),
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            stagger: 0.12,
            ease: 'power4.inOut',
            clearProps: 'clipPath',
          },
          0.2,
        )
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.dos} aria-label="Llamado a la acción">
      <div className={`container ${styles.cabecera}`}>
        <h2 className={`titular ${styles.titular}`}>
          <span className={styles.mascara}>
            <span className={styles.linea} data-ctd="linea">
              Comencemos a <span className={styles.dorado}>trabajar</span>
            </span>
          </span>
        </h2>
        <p className={styles.pregunta}>¿Cómo prefieres empezar?</p>
      </div>

      <div className={styles.caminos}>
        {CAMINOS.map((c) => (
          <a
            key={c.id}
            href={c.href}
            className={`${styles.camino} ${styles[c.id]}`}
            data-ctd="camino"
            {...(c.externo
              ? { target: '_blank', rel: 'noreferrer' }
              : { onClick: irAContacto })}
          >
            <span className={styles.canal}>
              <span>{c.numero}</span>
              {c.canal}
            </span>
            <span className={`titular ${styles.palabra}`}>{c.palabra}</span>
            <span className={styles.texto}>{c.texto}</span>
            <span className={styles.accion}>
              {c.accion}
              <span className={styles.flecha} aria-hidden="true">
                →
              </span>
            </span>
          </a>
        ))}
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
