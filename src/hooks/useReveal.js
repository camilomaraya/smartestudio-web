import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/*
 * Reveal estándar: fade + subida sutil al entrar al viewport.
 *
 * Uso:
 *   const scope = useReveal()
 *   <section ref={scope}>
 *     <p data-reveal>…</p>                 ← elemento individual
 *     <div data-reveal-group>…</div>       ← anima sus hijos directos con stagger
 *   </section>
 *
 * El estado oculto se aplica con gsap.set (no CSS): si el JS falla,
 * el contenido queda visible. Con prefers-reduced-motion no se anima nada.
 */
export function useReveal() {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const revelar = (targets, trigger) => {
          gsap.set(targets, { opacity: 0, y: 24 })
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            // Limpia los estilos inline al terminar: los hovers CSS
            // (lift de .card, escala de la tarjeta destacada) vuelven a mandar.
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger,
              start: 'top 85%',
              once: true,
            },
          })
        }

        scope.current.querySelectorAll('[data-reveal]').forEach((el) => {
          revelar(el, el)
        })

        scope.current.querySelectorAll('[data-reveal-group]').forEach((grupo) => {
          revelar(Array.from(grupo.children), grupo)
        })
      })
    },
    { scope },
  )

  return scope
}
