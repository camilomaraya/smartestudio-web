import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/*
 * Reveal de titulares desde su máscara, cada uno al entrar al viewport.
 * El mismo gesto que los titulares del home y CabeceraPagina, para
 * titulares que se repiten a lo largo de una página.
 *
 * Uso:
 *   const scope = useRevealLineas()
 *   <ol ref={scope}>
 *     <span className={mascara}><span data-linea>…</span></span>
 *   </ol>
 *
 * fromTo con `y: 0` explícito: ver el comentario en CabeceraPagina.jsx.
 */
export function useRevealLineas() {
  const scope = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        scope.current.querySelectorAll('[data-linea]').forEach((linea) => {
          gsap.fromTo(
            linea,
            { yPercent: 110, y: 0 },
            {
              yPercent: 0,
              y: 0,
              duration: 0.9,
              ease: 'power4.out',
              scrollTrigger: { trigger: linea.parentElement, start: 'top 85%', once: true },
            },
          )
        })
      })
    },
    { scope },
  )

  return scope
}
