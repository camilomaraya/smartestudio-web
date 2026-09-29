import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, Draggable } from '../../lib/gsap'
import { Titular, Cierre, Pieza, todasLasPiezas, revelarTitular } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './ProyectosCarrusel.module.css'

/*
 * TEMPORAL — variante «Carrusel arrastrable»: una fila de piezas que se
 * arrastra con inercia (Draggable + InertiaPlugin). En pantalla avanza sola
 * y lento; al tocarla se detiene y retoma después de un rato quieta. Las
 * piezas se inclinan con la velocidad del arrastre.
 *
 * El arrastre y las flechas funcionan siempre; el avance automático y la
 * inclinación solo con movimiento permitido.
 */
const piezas = todasLasPiezas()
const VELOCIDAD_AUTO = 40 // px por segundo
const ESPERA_AUTO = 4 // segundos quieto antes de retomar

export default function ProyectosCarrusel({ id, etiqueta }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      const raiz = scope.current
      const ventana = raiz.querySelector('[data-vr="ventana"]')
      const pista = raiz.querySelector('[data-vr="pista"]')
      const relleno = raiz.querySelector('[data-vr="relleno"]')
      const fotos = raiz.querySelectorAll('[data-vr="foto"]')
      const [atras, adelante] = raiz.querySelectorAll('[data-vr="flecha"]')
      const conMovimiento = window.matchMedia('(prefers-reduced-motion: no-preference)').matches

      let minX = 0
      let auto = null
      let espera = null
      let enPantalla = false
      let movido = false

      const x = () => gsap.getProperty(pista, 'x')
      const actualizar = () => {
        const progreso = minX < 0 ? x() / minX : 0
        gsap.set(relleno, { scaleX: gsap.utils.clamp(0.04, 1, progreso) })
      }
      const medir = () => {
        minX = Math.min(0, ventana.clientWidth - pista.scrollWidth)
      }
      medir()

      const detenerAuto = () => {
        auto?.kill()
        auto = null
        espera?.kill()
      }
      const arrancarAuto = () => {
        detenerAuto()
        medir()
        if (!conMovimiento || !enPantalla || minX === 0) return
        const faltan = Math.abs(minX - x())
        // Llega al final, vuelve al principio y sigue
        auto = gsap
          .timeline({ onComplete: arrancarAuto })
          .to(pista, {
            x: minX,
            duration: faltan / VELOCIDAD_AUTO,
            ease: 'none',
            onUpdate: actualizar,
          })
          .to(pista, { x: 0, duration: 1.4, ease: 'power2.inOut', onUpdate: actualizar }, '+=1')
      }
      const retomarLuego = () => {
        espera?.kill()
        espera = gsap.delayedCall(ESPERA_AUTO, arrancarAuto)
      }

      // Inclinación según la velocidad del arrastre, con tope
      const inclinar = conMovimiento
        ? gsap.quickTo(fotos, 'skewX', { duration: 0.4, ease: 'power3.out' })
        : () => {}

      const [arrastre] = Draggable.create(pista, {
        type: 'x',
        inertia: true,
        bounds: { minX, maxX: 0 },
        edgeResistance: 0.85,
        dragClickables: true,
        onPress() {
          movido = false
          detenerAuto()
          // Se re-mide en cada toque: al montar la fila todavía puede no
          // tener su ancho final, y con límites viejos el arrastre rebota a 0
          medir()
          this.applyBounds({ minX, maxX: 0 })
        },
        onDrag() {
          movido = true
          inclinar(gsap.utils.clamp(-8, 8, -this.deltaX * 0.4))
          actualizar()
        },
        onThrowUpdate() {
          inclinar(gsap.utils.clamp(-8, 8, -this.deltaX * 0.4))
          actualizar()
        },
        onRelease() {
          inclinar(0)
          retomarLuego()
        },
        onThrowComplete() {
          inclinar(0)
        },
      })

      // Soltar después de arrastrar no tiene que abrir la pieza: EnlaceRuta
      // respeta defaultPrevented
      const frenarClick = (e) => {
        if (movido) e.preventDefault()
      }
      pista.addEventListener('click', frenarClick, true)

      const mover = (sentido) => {
        detenerAuto()
        medir()
        const paso = fotos[0].offsetWidth + parseFloat(getComputedStyle(pista).columnGap || 0)
        gsap.to(pista, {
          x: gsap.utils.clamp(minX, 0, x() - sentido * paso),
          duration: 0.6,
          ease: 'power3.out',
          onUpdate: actualizar,
          onComplete: retomarLuego,
        })
      }
      const irAtras = () => mover(-1)
      const irAdelante = () => mover(1)
      atras.addEventListener('click', irAtras)
      adelante.addEventListener('click', irAdelante)

      const alRedimensionar = () => {
        medir()
        arrastre.applyBounds({ minX, maxX: 0 })
        gsap.set(pista, { x: gsap.utils.clamp(minX, 0, x()) })
        actualizar()
      }
      window.addEventListener('resize', alRedimensionar)

      // Solo avanza sola mientras la sección está en pantalla
      const disparo = ScrollTrigger.create({
        trigger: raiz,
        start: 'top 80%',
        end: 'bottom 20%',
        onToggle: (self) => {
          enPantalla = self.isActive
          if (enPantalla) arrancarAuto()
          else detenerAuto()
        },
      })

      if (conMovimiento) revelarTitular(raiz)
      actualizar()

      return () => {
        detenerAuto()
        disparo.kill()
        arrastre.kill()
        pista.removeEventListener('click', frenarClick, true)
        atras.removeEventListener('click', irAtras)
        adelante.removeEventListener('click', irAdelante)
        window.removeEventListener('resize', alRedimensionar)
      }
    },
    { scope },
  )

  return (
    <section ref={scope} id={id} className={styles.carrusel}>
      <div className="container">
        <Titular />
      </div>

      <div className={styles.ventana} data-vr="ventana">
        <div className={styles.pista} data-vr="pista">
          {piezas.map((pieza) => (
            <div key={pieza.src} className={styles.foto} data-vr="foto">
              <Pieza pieza={pieza} credito="siempre" />
            </div>
          ))}
        </div>
      </div>

      <div className={`container ${styles.controles}`}>
        <div className={styles.barra} aria-hidden="true">
          <span className={styles.relleno} data-vr="relleno" />
        </div>
        <div className={styles.flechas}>
          <button type="button" className={styles.flecha} data-vr="flecha" aria-label="Anteriores">
            ←
          </button>
          <button type="button" className={styles.flecha} data-vr="flecha" aria-label="Siguientes">
            →
          </button>
        </div>
      </div>

      <Cierre />
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
