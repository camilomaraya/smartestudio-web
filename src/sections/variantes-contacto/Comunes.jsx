import { mensajeWhatsApp } from './useFormularioContacto'
import styles from './Comunes.module.css'

/*
 * TEMPORAL — piezas compartidas por las variantes del formulario.
 */

// Honeypot: campo señuelo, invisible y fuera del tab para personas.
export function Honeypot({ idBase }) {
  return (
    <div className={styles.hpCampo} aria-hidden="true">
      <label htmlFor={`${idBase}-sitio`}>Sitio web</label>
      <input id={`${idBase}-sitio`} name="sitio" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}

export function Turnstile({ refTurnstile, conTurnstile }) {
  if (!conTurnstile) return null
  return <div ref={refTurnstile} className={styles.turnstile} />
}

// Aviso de validación y error del envío
export function Avisos({ aviso, estado, errorMsg }) {
  return (
    <>
      {aviso && (
        <p className={styles.aviso} role="alert">
          {aviso}
        </p>
      )}
      {estado === 'error' && (
        <p className={styles.error} role="alert">
          {errorMsg}
        </p>
      )}
    </>
  )
}

export function Exito({ nombre }) {
  return (
    <div className={styles.exito}>
      <h2 className={styles.exitoTitular}>
        <span className={styles.acento}>Gracias</span> por escribirnos
      </h2>
      <p className={styles.exitoTexto}>
        Recibimos tu mensaje y te vamos a responder a la brevedad. Si quieres avanzar más rápido,
        seguimos la conversación por WhatsApp.
      </p>
      <a className={styles.whatsapp} href={mensajeWhatsApp(nombre)} target="_blank" rel="noreferrer">
        Continuar por WhatsApp
      </a>
    </div>
  )
}
