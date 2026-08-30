import { useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { serviciosPrincipales } from '../data/servicios'
import { useReveal } from '../hooks/useReveal'
import styles from './Contacto.module.css'

/*
 * Contacto — cuestionario de 3 pasos (DESIGN.md §12).
 *
 * Un formulario de cuatro campos en blanco pide un esfuerzo que mucha gente
 * no hace. Partirlo en tres preguntas cortas —qué necesitas, quién eres, qué
 * nos querés contar— baja el costo de empezar, y la primera respuesta ya nos
 * dice a qué servicio apunta el interesado.
 *
 * SIN JAVASCRIPT SIGUE SIENDO UN FORMULARIO COMPLETO. Los tres pasos están
 * siempre en el DOM; el modo paso a paso se activa recién en un efecto, así
 * que el HTML prerenderizado muestra los tres bloques seguidos y se puede
 * enviar de una sola vez. El cuestionario se suma encima, no es la condición
 * para poder escribir (regla 1 del §6).
 *
 * El backend no cambia de contrato: mismo endpoint, mismo honeypot, mismo
 * Turnstile. Se suman dos campos, `servicio` y `origen`.
 */

const estadoInicial = { servicio: '', nombre: '', email: '', empresa: '', mensaje: '' }

// Ruta relativa al endpoint PHP. En prod queda en el mismo dominio que el
// build (same-origin, sin CORS). En dev el PHP no corre salvo que apuntes
// `php -S` a server/ y ajustes esto.
const ENDPOINT_CONTACTO = '/contacto.php'

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ''

const OPCION_SIN_DECIDIR = 'Todavía no lo sé'

const PASOS = [
  { n: 1, titulo: '¿Qué necesitas?' },
  { n: 2, titulo: '¿Quién eres?' },
  { n: 3, titulo: 'Contanos' },
]

function mensajeWhatsApp(nombre) {
  const texto = nombre
    ? `Hola Smart Estudio, soy ${nombre}. Les escribí por el formulario del sitio y quería seguir la conversación por acá.`
    : 'Hola Smart Estudio, les escribí por el formulario del sitio y quería seguir la conversación por acá.'
  return `https://wa.me/56981649378?text=${encodeURIComponent(texto)}`
}

export default function Contacto() {
  const scope = useReveal()
  const { pathname } = useLocation()
  const idBase = useId()

  const [formulario, setFormulario] = useState(estadoInicial)
  const [estado, setEstado] = useState('idle') // idle | enviando | exito | error
  const [errorMsg, setErrorMsg] = useState('')
  const [paso, setPaso] = useState(1)
  const [avisoPaso, setAvisoPaso] = useState('')

  /*
   * Arranca en false y solo pasa a true en el efecto: durante el prerender
   * —y si el JS nunca llega— quedan los tres pasos visibles y el formulario
   * es utilizable de una sola vez.
   */
  const [porPasos, setPorPasos] = useState(false)
  useEffect(() => setPorPasos(true), [])

  const turnstileRef = useRef(null)
  const turnstileWidgetId = useRef(null)
  const turnstileToken = useRef('')
  const tituloPasoRef = useRef(null)

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return undefined

    let cancelado = false

    const montar = () => {
      if (cancelado || !window.turnstile || turnstileWidgetId.current) return
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: (token) => {
          turnstileToken.current = token
        },
        'expired-callback': () => {
          turnstileToken.current = ''
        },
        'error-callback': () => {
          turnstileToken.current = ''
        },
      })
    }

    if (window.turnstile) {
      montar()
      return undefined
    }

    const intervalo = setInterval(() => {
      if (window.turnstile) {
        clearInterval(intervalo)
        montar()
      }
    }, 150)

    return () => {
      cancelado = true
      clearInterval(intervalo)
    }
  }, [])

  const actualizar = (event) => {
    const { name, value } = event.target
    setFormulario((previo) => ({ ...previo, [name]: value }))
  }

  const elegirServicio = (valor) => {
    setFormulario((previo) => ({ ...previo, servicio: valor }))
    setAvisoPaso('')
  }

  // Qué falta para poder avanzar. Devuelve null si el paso está completo.
  const faltaEnPaso = (n) => {
    if (n === 1 && !formulario.servicio) return 'Elige una opción para seguir.'
    if (n === 2) {
      if (!formulario.nombre.trim()) return 'Necesitamos tu nombre.'
      if (!formulario.email.trim()) return 'Necesitamos tu email.'
      // Validación mínima, la de verdad la hace el backend con FILTER_VALIDATE_EMAIL.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) return 'Revisa el email.'
    }
    if (n === 3 && !formulario.mensaje.trim()) return 'Escribe tu mensaje.'
    return null
  }

  const avanzar = () => {
    const falta = faltaEnPaso(paso)
    if (falta) {
      setAvisoPaso(falta)
      return
    }
    setAvisoPaso('')
    setPaso((p) => Math.min(p + 1, 3))
  }

  const retroceder = () => {
    setAvisoPaso('')
    setPaso((p) => Math.max(p - 1, 1))
  }

  // Al cambiar de paso el foco va a su título: sin esto el lector de
  // pantalla se queda en el botón y no anuncia la pregunta nueva.
  useEffect(() => {
    if (!porPasos || estado === 'exito') return
    tituloPasoRef.current?.focus({ preventScroll: true })
  }, [paso, porPasos, estado])

  const enviar = async (event) => {
    event.preventDefault()
    if (estado === 'enviando') return

    // Con JS activo, el submit solo procede desde el último paso; los
    // anteriores avanzan. Sin JS, el navegador envía todo junto.
    if (porPasos && paso < 3) {
      avanzar()
      return
    }

    for (const n of [1, 2, 3]) {
      const falta = faltaEnPaso(n)
      if (falta) {
        setPaso(n)
        setAvisoPaso(falta)
        return
      }
    }

    setEstado('enviando')
    setErrorMsg('')

    try {
      const respuesta = await fetch(ENDPOINT_CONTACTO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formulario.nombre,
          email: formulario.email,
          empresa: formulario.empresa,
          mensaje: formulario.mensaje,
          servicio: formulario.servicio,
          // Desde qué página se envió: sirve para saber qué convierte.
          origen: pathname,
          sitio: event.target.elements.sitio.value, // honeypot
          turnstileToken: turnstileToken.current,
        }),
      })

      const datos = await respuesta.json().catch(() => null)

      if (respuesta.ok && datos?.ok) {
        setEstado('exito')
      } else {
        setEstado('error')
        setErrorMsg(datos?.mensaje || 'No pudimos enviar tu mensaje. Intenta de nuevo.')
      }
    } catch {
      // Sin backend PHP disponible (p. ej. en dev) o error de red: no rompemos la UI.
      setEstado('error')
      setErrorMsg(
        'No pudimos conectar con el servidor. Intenta de nuevo o escríbenos por WhatsApp.',
      )
    } finally {
      if (window.turnstile && turnstileWidgetId.current !== null) {
        window.turnstile.reset(turnstileWidgetId.current)
      }
      turnstileToken.current = ''
    }
  }

  if (estado === 'exito') {
    return (
      <section ref={scope} id="contacto" className={styles.contacto}>
        <div className="container">
          <div className={styles.exito} data-reveal-group>
            <h2 className={styles.titular}>
              <span className={styles.acento}>Gracias</span> por escribirnos
            </h2>
            <p className={styles.exitoTexto}>
              Recibimos tu mensaje y te vamos a responder a la brevedad. Si quieres avanzar
              más rápido, seguimos la conversación por WhatsApp.
            </p>
            <a
              className={styles.botonPrimario}
              href={mensajeWhatsApp(formulario.nombre)}
              target="_blank"
              rel="noreferrer"
            >
              Continuar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    )
  }

  // Un paso se ve si el modo por pasos está apagado (sin JS) o es el actual.
  const visible = (n) => !porPasos || paso === n

  return (
    <section ref={scope} id="contacto" className={styles.contacto}>
      <div className="container">
        <div className={styles.cabecera} data-reveal-group>
          <h2 className={styles.titular}>
            Conversemos, <span className={styles.acento}>sin compromiso</span>
          </h2>
          <ul className={styles.datos}>
            <li>
              <span className={styles.datoLabel}>WhatsApp</span>
              <a href="https://wa.me/56981649378" target="_blank" rel="noreferrer">
                +56 9 8164 9378
              </a>
            </li>
            <li>
              <span className={styles.datoLabel}>Email</span>
              <a href="mailto:contacto@smartestudio.cl">contacto@smartestudio.cl</a>
            </li>
          </ul>
        </div>

        <form className={styles.formulario} onSubmit={enviar} data-reveal>
          {porPasos && (
            <div className={styles.progreso}>
              <ol className={styles.pasos}>
                {PASOS.map((p) => (
                  <li
                    key={p.n}
                    className={`${styles.pasoMarca} ${p.n === paso ? styles.pasoActual : ''} ${
                      p.n < paso ? styles.pasoHecho : ''
                    }`}
                  >
                    <span aria-hidden="true">{String(p.n).padStart(2, '0')}</span>
                  </li>
                ))}
              </ol>
              {/* El progreso también en texto: los números dorados no le
                  dicen nada a un lector de pantalla. */}
              <p className={styles.progresoTexto} aria-live="polite">
                Paso {paso} de 3
              </p>
            </div>
          )}

          {/* PASO 1 — servicio */}
          <fieldset className={styles.paso} hidden={!visible(1)}>
            <legend className={styles.pasoTitulo} tabIndex={-1} ref={paso === 1 ? tituloPasoRef : null}>
              {PASOS[0].titulo}
            </legend>
            <div className={styles.opciones}>
              {[...serviciosPrincipales.map((s) => s.titulo), OPCION_SIN_DECIDIR].map((op) => (
                <label
                  key={op}
                  className={`${styles.opcion} ${formulario.servicio === op ? styles.opcionElegida : ''}`}
                >
                  <input
                    type="radio"
                    name="servicio"
                    value={op}
                    checked={formulario.servicio === op}
                    onChange={() => elegirServicio(op)}
                    className={styles.radio}
                  />
                  <span>{op}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* PASO 2 — datos */}
          <fieldset className={styles.paso} hidden={!visible(2)}>
            <legend className={styles.pasoTitulo} tabIndex={-1} ref={paso === 2 ? tituloPasoRef : null}>
              {PASOS[1].titulo}
            </legend>

            <div className={styles.campo}>
              <label htmlFor={`${idBase}-nombre`}>Nombre</label>
              <input
                id={`${idBase}-nombre`}
                name="nombre"
                type="text"
                autoComplete="name"
                required
                value={formulario.nombre}
                onChange={actualizar}
                disabled={estado === 'enviando'}
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor={`${idBase}-email`}>Email</label>
              <input
                id={`${idBase}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formulario.email}
                onChange={actualizar}
                disabled={estado === 'enviando'}
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor={`${idBase}-empresa`}>
                Empresa <span className={styles.opcional}>(opcional)</span>
              </label>
              <input
                id={`${idBase}-empresa`}
                name="empresa"
                type="text"
                autoComplete="organization"
                value={formulario.empresa}
                onChange={actualizar}
                disabled={estado === 'enviando'}
              />
            </div>
          </fieldset>

          {/* PASO 3 — mensaje */}
          <fieldset className={styles.paso} hidden={!visible(3)}>
            <legend className={styles.pasoTitulo} tabIndex={-1} ref={paso === 3 ? tituloPasoRef : null}>
              {PASOS[2].titulo}
            </legend>

            <div className={styles.campo}>
              <label htmlFor={`${idBase}-mensaje`}>
                Cuéntanos de tu proyecto, tu marca o lo que necesitas
              </label>
              <textarea
                id={`${idBase}-mensaje`}
                name="mensaje"
                rows="5"
                required
                value={formulario.mensaje}
                onChange={actualizar}
                disabled={estado === 'enviando'}
              />
            </div>

            {TURNSTILE_SITE_KEY && <div ref={turnstileRef} className={styles.turnstile} />}
          </fieldset>

          {/* Honeypot: campo señuelo, invisible y fuera del tab para personas. */}
          <div className={styles.hpCampo} aria-hidden="true">
            <label htmlFor={`${idBase}-sitio`}>Sitio web</label>
            <input
              id={`${idBase}-sitio`}
              name="sitio"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {avisoPaso && (
            <p className={styles.aviso} role="alert">
              {avisoPaso}
            </p>
          )}
          {estado === 'error' && (
            <p className={styles.error} role="alert">
              {errorMsg}
            </p>
          )}

          <div className={styles.acciones}>
            {porPasos && paso > 1 && (
              <button type="button" onClick={retroceder} className={styles.botonSecundario}>
                ← Atrás
              </button>
            )}

            {porPasos && paso < 3 ? (
              <button type="button" onClick={avanzar} className={styles.botonPrimario}>
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className={styles.botonPrimario}
                disabled={estado === 'enviando'}
              >
                {estado === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
