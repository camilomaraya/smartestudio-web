import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import Button from '../components/ui/Button'
import styles from './Contacto.module.css'

const estadoInicial = { nombre: '', email: '', empresa: '', mensaje: '' }

// Ruta relativa al endpoint PHP. En prod queda en el mismo dominio que el
// build (same-origin, sin CORS). En dev el PHP no corre salvo que apuntes
// `php -S` a server/ y ajustes esto.
const ENDPOINT_CONTACTO = '/contacto.php'

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ''

function mensajeWhatsApp(nombre) {
  const texto = nombre
    ? `Hola Smart Estudio, soy ${nombre}. Les escribí por el formulario del sitio y quería seguir la conversación por acá.`
    : 'Hola Smart Estudio, les escribí por el formulario del sitio y quería seguir la conversación por acá.'
  return `https://wa.me/56981649378?text=${encodeURIComponent(texto)}`
}

export default function Contacto() {
  const scope = useReveal()
  const [formulario, setFormulario] = useState(estadoInicial)
  const [estado, setEstado] = useState('idle') // idle | enviando | exito | error
  const [errorMsg, setErrorMsg] = useState('')

  const turnstileRef = useRef(null)
  const turnstileWidgetId = useRef(null)
  const turnstileToken = useRef('')

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

  const enviar = async (event) => {
    event.preventDefault()
    if (estado === 'enviando') return

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
      setErrorMsg('No pudimos conectar con el servidor. Intenta de nuevo o escríbenos por WhatsApp.')
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
        <div className={`container ${styles.inner}`}>
          <div className={styles.exito} data-reveal-group>
            <p className="eyebrow">Contacto</p>
            <h2 className={styles.titulo}>¡Gracias por escribirnos!</h2>
            <p className={styles.exitoTexto}>
              Recibimos tu mensaje y te vamos a responder a la brevedad. Si quieres avanzar más rápido,
              seguimos la conversación por WhatsApp.
            </p>
            <Button href={mensajeWhatsApp(formulario.nombre)} target="_blank" rel="noreferrer">
              Continuar por WhatsApp
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={scope} id="contacto" className={styles.contacto}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.info} data-reveal-group>
          <p className="eyebrow">Contacto</p>
          <h2 className={styles.titulo}>Conversemos</h2>
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

        <form className={styles.formulario} onSubmit={enviar} data-reveal-group noValidate={false}>
          <div className={styles.campo}>
            <label htmlFor="contacto-nombre">Nombre</label>
            <input
              id="contacto-nombre"
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
            <label htmlFor="contacto-email">Email</label>
            <input
              id="contacto-email"
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
            <label htmlFor="contacto-empresa">
              Empresa <span className={styles.opcional}>(opcional)</span>
            </label>
            <input
              id="contacto-empresa"
              name="empresa"
              type="text"
              autoComplete="organization"
              value={formulario.empresa}
              onChange={actualizar}
              disabled={estado === 'enviando'}
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="contacto-mensaje">Mensaje</label>
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              rows="5"
              required
              value={formulario.mensaje}
              onChange={actualizar}
              disabled={estado === 'enviando'}
            />
          </div>

          {/* Honeypot: campo señuelo, invisible y fuera del tab para personas. */}
          <div className={styles.hpCampo} aria-hidden="true">
            <label htmlFor="contacto-sitio">Sitio web</label>
            <input id="contacto-sitio" name="sitio" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {TURNSTILE_SITE_KEY && <div ref={turnstileRef} className={styles.turnstile} />}

          {estado === 'error' && <p className={styles.error}>{errorMsg}</p>}

          <Button type="submit" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
          </Button>
        </form>
      </div>
    </section>
  )
}
