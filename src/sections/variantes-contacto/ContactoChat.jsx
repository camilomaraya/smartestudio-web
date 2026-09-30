import { useEffect, useId, useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { CAMPOS, OPCIONES_SERVICIO, useFormularioContacto } from './useFormularioContacto'
import { Avisos, Exito, Honeypot, Turnstile } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './ContactoChat.module.css'

/*
 * TEMPORAL — variante «Chat»: el formulario como una conversación por
 * mensaje directo, en la misma estética del celular de la sección F. Smart
 * pregunta de a una, tus respuestas quedan como burbujas propias y se
 * pueden tocar para corregirlas.
 *
 * Sin JS: el chat no existe y se ven los cinco campos seguidos, con la
 * pregunta como etiqueta. Se envía igual.
 *
 * Las preguntas son placeholder en la voz de marca.
 */
const PREGUNTAS = {
  servicio: () => '¡Hola! 👋 ¿En qué te podemos ayudar?',
  nombre: () => 'Buenísimo. ¿Cómo te llamas?',
  email: (f) => `Un gusto, ${f.nombre.trim().split(' ')[0]}. ¿A qué email te escribimos?`,
  empresa: () => '¿Tu marca o empresa tiene nombre? Si no, te la puedes saltar.',
  mensaje: () => 'Último: cuéntanos de tu proyecto, tu marca o lo que necesitas.',
}
const ETIQUETAS = {
  servicio: '¿En qué te podemos ayudar?',
  nombre: 'Tu nombre',
  email: 'Tu email',
  empresa: 'Tu marca o empresa (opcional)',
  mensaje: 'Cuéntanos de tu proyecto, tu marca o lo que necesitas',
}
const LISTO = CAMPOS.length
const PAUSA_ESCRIBIENDO = 700

export default function ContactoChat({ id, etiqueta }) {
  const scope = useReveal()
  const idBase = useId()
  const f = useFormularioContacto()
  const [paso, setPaso] = useState(0)
  const [respondidos, setRespondidos] = useState(() => CAMPOS.map(() => false))
  const [escribiendo, setEscribiendo] = useState(false)
  const [aviso, setAviso] = useState('')
  const listaRef = useRef(null)
  const composerRef = useRef(null)
  const tocado = useRef(false)

  // Entre respuesta y pregunta, Smart «escribe». Con movimiento reducido
  // la pregunta llega directo.
  useEffect(() => {
    if (!tocado.current) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    setEscribiendo(true)
    const t = setTimeout(() => setEscribiendo(false), PAUSA_ESCRIBIENDO)
    return () => clearTimeout(t)
  }, [paso])

  // La conversación siempre muestra lo último; el foco va al campo nuevo
  useEffect(() => {
    const lista = listaRef.current
    if (lista) lista.scrollTo({ top: lista.scrollHeight, behavior: 'smooth' })
    if (tocado.current && !escribiendo) {
      composerRef.current
        ?.querySelector('[data-activo] :is(input, textarea, button)')
        ?.focus({ preventScroll: true })
    }
  }, [paso, escribiendo])

  const responder = (i, valor) => {
    const campo = CAMPOS[i]
    const falta = f.faltaEn(campo, valor)
    if (falta) return setAviso(falta)
    setAviso('')
    tocado.current = true
    const nuevos = respondidos.map((r, j) => (j === i ? true : r))
    setRespondidos(nuevos)
    // Sigue en la primera pregunta sin responder: si venía de corregir
    // una respuesta vieja, vuelve directo al final
    const siguiente = nuevos.findIndex((r) => !r)
    setPaso(siguiente === -1 ? LISTO : siguiente)
  }

  const corregir = (i) => {
    setAviso('')
    tocado.current = true
    setPaso(i)
  }

  const alEnviar = async (evento) => {
    evento.preventDefault()
    if (f.interactivo && paso < LISTO) return responder(paso)
    const problema = await f.enviar(evento.currentTarget)
    if (problema) {
      setPaso(CAMPOS.indexOf(problema.campo))
      setAviso(problema.falta)
    }
  }

  // Enter envía la burbuja; Shift+Enter hace salto de línea en el mensaje
  const alTeclaMensaje = (evento) => {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault()
      evento.currentTarget.form.requestSubmit()
    }
  }

  if (f.estado === 'exito') {
    return (
      <section ref={scope} id={id} className={styles.chat}>
        <div className="container">
          <Exito nombre={f.formulario.nombre} />
        </div>
        <Etiqueta>{etiqueta}</Etiqueta>
      </section>
    )
  }

  const respuesta = (campo) => {
    const valor = f.formulario[campo].trim()
    if (campo === 'empresa' && !valor) return 'Me la salto'
    return valor
  }
  const visible = (i) => !f.interactivo || paso === i
  const activo = (i) => (f.interactivo && paso === i ? { 'data-activo': true } : {})

  const texto = (campo, props) => (
    <div className={styles.campo} hidden={!visible(CAMPOS.indexOf(campo))} {...activo(CAMPOS.indexOf(campo))}>
      <label
        htmlFor={`${idBase}-${campo}`}
        className={f.interactivo ? 'visually-hidden' : styles.etiquetaCampo}
      >
        {ETIQUETAS[campo]}
      </label>
      <div className={styles.entrada}>
        <input
          id={`${idBase}-${campo}`}
          name={campo}
          value={f.formulario[campo]}
          onChange={f.actualizar}
          disabled={f.enviando}
          placeholder="Escribe aquí…"
          {...props}
        />
        {f.interactivo && (
          <button type="submit" className={styles.enviarBurbuja} aria-label="Responder">
            ↑
          </button>
        )}
      </div>
      {campo === 'empresa' && f.interactivo && (
        <button
          type="button"
          className={styles.saltar}
          onClick={() => {
            f.fijar('empresa', '')
            responder(3, '')
          }}
        >
          Saltar
        </button>
      )}
    </div>
  )

  return (
    <section ref={scope} id={id} className={styles.chat}>
      <div className={`container ${styles.grilla}`}>
        <div className={styles.intro} data-reveal-group>
          <h2 className={styles.titular}>
            Conversemos, <span className={styles.acento}>como por chat</span>
          </h2>
          <p className={styles.bajada}>
            Cinco preguntas cortas y listo. Si prefieres, escríbenos directo por{' '}
            <a href="https://wa.me/56981649378" target="_blank" rel="noreferrer">
              WhatsApp
            </a>{' '}
            o a <a href="mailto:contacto@smartestudio.cl">contacto@smartestudio.cl</a>.
          </p>
        </div>

        <form className={styles.ventana} onSubmit={alEnviar} noValidate={f.interactivo} data-reveal>
          <div className={styles.cabecera}>
            <span className={styles.avatar} aria-hidden="true">
              S
            </span>
            <span>
              <span className={styles.cuenta}>smartestudio</span>
              <span className={styles.estado}>Activo ahora</span>
            </span>
          </div>

          {f.interactivo && (
            <ol className={styles.mensajes} ref={listaRef} aria-live="polite" data-lenis-prevent>
              {CAMPOS.slice(0, Math.min(paso, LISTO)).map((campo, i) => (
                <li key={campo} className={styles.par}>
                  <p className={styles.bot}>{PREGUNTAS[campo](f.formulario)}</p>
                  <button
                    type="button"
                    className={styles.yo}
                    onClick={() => corregir(i)}
                    aria-label={`Tu respuesta: ${respuesta(campo)}. Tocar para corregir`}
                  >
                    {respuesta(campo)}
                  </button>
                </li>
              ))}
              {paso === LISTO && respondidos.every(Boolean) && (
                <li className={styles.par}>
                  {escribiendo ? (
                    <Escribiendo />
                  ) : (
                    <p className={styles.bot}>Listo, eso es todo. ¿Lo enviamos?</p>
                  )}
                </li>
              )}
              {paso < LISTO && (
                <li className={styles.par}>
                  {escribiendo ? (
                    <Escribiendo />
                  ) : (
                    <p className={styles.bot}>{PREGUNTAS[CAMPOS[paso]](f.formulario)}</p>
                  )}
                </li>
              )}
            </ol>
          )}

          <div className={styles.composer} ref={composerRef}>
            <fieldset className={styles.campo} hidden={!visible(0)} {...activo(0)}>
              <legend className={f.interactivo ? 'visually-hidden' : styles.etiquetaCampo}>
                {ETIQUETAS.servicio}
              </legend>
              <div className={styles.opciones}>
                {OPCIONES_SERVICIO.map((op) => (
                  <label
                    key={op}
                    className={`${styles.opcion} ${f.formulario.servicio === op ? styles.opcionElegida : ''}`}
                  >
                    <input
                      type="radio"
                      name="servicio"
                      value={op}
                      checked={f.formulario.servicio === op}
                      onChange={() => f.fijar('servicio', op)}
                      // Tocar una respuesta rápida la manda, como en un chat.
                      // detail 0 = click sintético de las flechas del
                      // teclado: ahí solo se elige, y Enter la manda.
                      onClick={(e) => f.interactivo && e.detail > 0 && responder(0, op)}
                      className={styles.radio}
                    />
                    <span>{op}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {texto('nombre', { type: 'text', autoComplete: 'name', required: true })}
            {texto('email', { type: 'email', autoComplete: 'email', required: true })}
            {texto('empresa', { type: 'text', autoComplete: 'organization' })}

            <div className={styles.campo} hidden={!visible(4)} {...activo(4)}>
              <label
                htmlFor={`${idBase}-mensaje`}
                className={f.interactivo ? 'visually-hidden' : styles.etiquetaCampo}
              >
                {ETIQUETAS.mensaje}
              </label>
              <div className={styles.entrada}>
                <textarea
                  id={`${idBase}-mensaje`}
                  name="mensaje"
                  rows={f.interactivo ? 2 : 5}
                  required
                  value={f.formulario.mensaje}
                  onChange={f.actualizar}
                  onKeyDown={f.interactivo ? alTeclaMensaje : undefined}
                  disabled={f.enviando}
                  placeholder="Escribe aquí…"
                />
                {f.interactivo && (
                  <button type="submit" className={styles.enviarBurbuja} aria-label="Responder">
                    ↑
                  </button>
                )}
              </div>
            </div>

            <div className={styles.final} hidden={f.interactivo && paso !== LISTO} {...activo(LISTO)}>
              <Turnstile refTurnstile={f.turnstileRef} conTurnstile={f.conTurnstile} />
              <button type="submit" className={styles.enviar} disabled={f.enviando}>
                {f.enviando ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            </div>

            <Honeypot idBase={idBase} />
            <Avisos aviso={aviso} estado={f.estado} errorMsg={f.errorMsg} />
          </div>
        </form>
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}

function Escribiendo() {
  return (
    <p className={`${styles.bot} ${styles.escribiendo}`} aria-label="Escribiendo">
      <span />
      <span />
      <span />
    </p>
  )
}
