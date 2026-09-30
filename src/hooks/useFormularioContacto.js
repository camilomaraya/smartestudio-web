import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { serviciosPrincipales } from '../data/servicios'

/*
 * Lógica del formulario de contacto (sections/Contacto.jsx), con el
 * contrato de server/contacto.php: endpoint, payload (con `servicio` y
 * `origen`), honeypot `sitio` y Turnstile. El componente decide solo la
 * forma de preguntar.
 */

const ENDPOINT_CONTACTO = '/contacto.php'
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ''

export const OPCION_SIN_DECIDIR = 'Todavía no lo sé'
export const OPCIONES_SERVICIO = [...serviciosPrincipales.map((s) => s.titulo), OPCION_SIN_DECIDIR]

// Orden en que se preguntan. `empresa` es la única opcional.
export const CAMPOS = ['servicio', 'nombre', 'email', 'empresa', 'mensaje']

const estadoInicial = { servicio: '', nombre: '', email: '', empresa: '', mensaje: '' }

export function mensajeWhatsApp(nombre) {
  const texto = nombre
    ? `Hola Smart Estudio, soy ${nombre}. Les escribí por el formulario del sitio y quería seguir la conversación por acá.`
    : 'Hola Smart Estudio, les escribí por el formulario del sitio y quería seguir la conversación por acá.'
  return `https://wa.me/56981649378?text=${encodeURIComponent(texto)}`
}

export function useFormularioContacto() {
  const { pathname, search } = useLocation()

  const [formulario, setFormulario] = useState(estadoInicial)
  const [estado, setEstado] = useState('idle') // idle | enviando | exito | error
  const [errorMsg, setErrorMsg] = useState('')

  /*
   * Arranca en false y pasa a true en el efecto. En el prerender —o si el
   * JS nunca llega— el formulario muestra todos sus campos juntos y se
   * puede enviar de una vez.
   */
  const [interactivo, setInteractivo] = useState(false)
  useEffect(() => setInteractivo(true), [])

  // Solo en dev: ?exito muestra el estado final sin depender del PHP.
  useEffect(() => {
    if (import.meta.env.DEV && new URLSearchParams(search).has('exito')) setEstado('exito')
  }, [search])

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

  const fijar = (campo, valor) => setFormulario((previo) => ({ ...previo, [campo]: valor }))
  const actualizar = (evento) => fijar(evento.target.name, evento.target.value)

  // Qué falta en un campo. Devuelve null si está bien. `valor` permite
  // validar un valor recién elegido que todavía no llegó al estado.
  const faltaEn = (campo, valor = formulario[campo]) => {
    if (campo === 'servicio' && !valor) return 'Elige una opción para seguir.'
    if (campo === 'nombre' && !valor.trim()) return 'Necesitamos tu nombre.'
    if (campo === 'email') {
      if (!valor.trim()) return 'Necesitamos tu email.'
      // Validación mínima, la de verdad la hace el backend con FILTER_VALIDATE_EMAIL.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Revisa el email.'
    }
    if (campo === 'mensaje' && !valor.trim()) return 'Escribe tu mensaje.'
    return null
  }

  // Primer campo con problemas, en el orden en que se preguntan.
  const primeraFalta = () => {
    for (const campo of CAMPOS) {
      const falta = faltaEn(campo)
      if (falta) return { campo, falta }
    }
    return null
  }

  /*
   * Envía. Valida todo antes: si algo falta devuelve { campo, falta } para
   * que el formulario lleve al visitante hasta ahí, y no envía.
   */
  const enviar = async (formElement) => {
    if (estado === 'enviando') return null
    const problema = primeraFalta()
    if (problema) return problema

    setEstado('enviando')
    setErrorMsg('')

    try {
      const respuesta = await fetch(ENDPOINT_CONTACTO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formulario,
          // Desde qué página se envió: sirve para saber qué convierte.
          origen: pathname,
          sitio: formElement.elements.sitio.value, // honeypot
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
      // Sin backend PHP disponible (p. ej. en dev) o error de red.
      setEstado('error')
      setErrorMsg('No pudimos conectar con el servidor. Intenta de nuevo o escríbenos por WhatsApp.')
    } finally {
      if (window.turnstile && turnstileWidgetId.current !== null) {
        window.turnstile.reset(turnstileWidgetId.current)
      }
      turnstileToken.current = ''
    }
    return null
  }

  return {
    formulario,
    fijar,
    actualizar,
    faltaEn,
    enviar,
    estado,
    errorMsg,
    interactivo,
    turnstileRef,
    conTurnstile: Boolean(TURNSTILE_SITE_KEY),
    enviando: estado === 'enviando',
  }
}
