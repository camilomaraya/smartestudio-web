import { useId, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { OPCIONES_SERVICIO, useFormularioContacto } from './useFormularioContacto'
import { Avisos, Exito, Honeypot, Turnstile } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './ContactoFrase.module.css'

/*
 * TEMPORAL — variante «Frase para completar»: el formulario es una carta
 * en tipografía grande con los huecos dentro del texto. Leerla ya es
 * llenarla; no hay pasos ni etiquetas sueltas.
 *
 * Cada hueco tiene su etiqueta real (oculta a la vista) para lectores de
 * pantalla. Es un formulario normal: funciona igual sin JS.
 */
export default function ContactoFrase({ id, etiqueta }) {
  const scope = useReveal()
  const idBase = useId()
  const f = useFormularioContacto()
  const [aviso, setAviso] = useState('')
  const [invalido, setInvalido] = useState(null)

  const alEnviar = async (evento) => {
    evento.preventDefault()
    const problema = await f.enviar(evento.currentTarget)
    if (problema) {
      setAviso(problema.falta)
      setInvalido(problema.campo)
      document.getElementById(`${idBase}-${problema.campo}`)?.focus()
    } else {
      setAviso('')
      setInvalido(null)
    }
  }

  const alCambiar = (evento) => {
    f.actualizar(evento)
    if (evento.target.name === invalido) {
      setInvalido(null)
      setAviso('')
    }
  }

  if (f.estado === 'exito') {
    return (
      <section ref={scope} id={id} className={styles.frase}>
        <div className="container">
          <Exito nombre={f.formulario.nombre} />
        </div>
        <Etiqueta>{etiqueta}</Etiqueta>
      </section>
    )
  }

  // Hueco de texto que crece con lo que se escribe (ver .hueco en el CSS)
  const hueco = (campo, texto, placeholder, props = {}) => (
    <span className={styles.hueco} data-valor={f.formulario[campo] || placeholder}>
      <label htmlFor={`${idBase}-${campo}`} className="visually-hidden">
        {texto}
      </label>
      <input
        id={`${idBase}-${campo}`}
        name={campo}
        value={f.formulario[campo]}
        onChange={alCambiar}
        placeholder={placeholder}
        disabled={f.enviando}
        aria-invalid={invalido === campo || undefined}
        size={1}
        {...props}
      />
    </span>
  )

  const primerNombre = f.formulario.nombre.trim().split(' ')[0]

  return (
    <section ref={scope} id={id} className={styles.frase}>
      <div className="container">
        <div className={styles.cabecera} data-reveal-group>
          <h2 className={styles.titular}>
            Conversemos. <span className={styles.acento}>Completa la carta</span>
          </h2>
          <p className={styles.datos}>
            O escríbenos directo:{' '}
            <a href="https://wa.me/56981649378" target="_blank" rel="noreferrer">
              WhatsApp
            </a>{' '}
            · <a href="mailto:contacto@smartestudio.cl">contacto@smartestudio.cl</a>
          </p>
        </div>

        <form className={styles.carta} onSubmit={alEnviar} noValidate={f.interactivo} data-reveal>
          <p>Hola, Smart Estudio:</p>
          <p>
            Soy {hueco('nombre', 'Tu nombre', 'tu nombre', { type: 'text', autoComplete: 'name', required: true })}
            , de{' '}
            {hueco('empresa', 'Tu marca o empresa (opcional)', 'tu marca (opcional)', {
              type: 'text',
              autoComplete: 'organization',
            })}
            . Necesito ayuda con{' '}
            <span
              className={`${styles.hueco} ${styles.huecoSelect}`}
              data-valor={f.formulario.servicio || 'elige una opción'}
            >
              <label htmlFor={`${idBase}-servicio`} className="visually-hidden">
                ¿Con qué necesitas ayuda?
              </label>
              <select
                id={`${idBase}-servicio`}
                name="servicio"
                value={f.formulario.servicio}
                onChange={alCambiar}
                disabled={f.enviando}
                required
                aria-invalid={invalido === 'servicio' || undefined}
                className={f.formulario.servicio ? '' : styles.vacio}
              >
                <option value="" disabled>
                  elige una opción
                </option>
                {OPCIONES_SERVICIO.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </span>
            . Pueden escribirme a{' '}
            {hueco('email', 'Tu email', 'tu@email.com', { type: 'email', autoComplete: 'email', required: true })}
            .
          </p>
          <p className={styles.cuento}>
            <label htmlFor={`${idBase}-mensaje`}>Les cuento:</label>
          </p>
          <textarea
            id={`${idBase}-mensaje`}
            name="mensaje"
            rows="4"
            required
            value={f.formulario.mensaje}
            onChange={alCambiar}
            disabled={f.enviando}
            aria-invalid={invalido === 'mensaje' || undefined}
            placeholder="tu proyecto, tu marca o lo que necesitas…"
            className={styles.mensaje}
          />
          <p className={styles.firma}>
            Saludos,
            <br />
            <span className={styles.firmaNombre}>{primerNombre || '—'}</span>
          </p>

          <Honeypot idBase={idBase} />
          <Turnstile refTurnstile={f.turnstileRef} conTurnstile={f.conTurnstile} />
          <Avisos aviso={aviso} estado={f.estado} errorMsg={f.errorMsg} />

          <button type="submit" className={styles.enviar} disabled={f.enviando}>
            {f.enviando ? 'Enviando…' : 'Enviar carta'}
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
