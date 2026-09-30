import { useEffect, useId, useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { OPCIONES_SERVICIO, useFormularioContacto } from './useFormularioContacto'
import { Avisos, Exito, Honeypot, Turnstile } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './ContactoActual.module.css'

/*
 * TEMPORAL — variante «Actual pulido»: el cuestionario de 3 pasos de
 * Contacto.jsx con la misma mecánica, pero con aire entre el indicador y
 * el título del paso (C1) y una barra que hace legible el avance.
 */
const PASOS = [
  { n: 1, titulo: '¿Qué necesitas?', campos: ['servicio'] },
  { n: 2, titulo: '¿Quién eres?', campos: ['nombre', 'email', 'empresa'] },
  { n: 3, titulo: 'Cuéntanos', campos: ['mensaje'] },
]

export default function ContactoActual({ id, etiqueta }) {
  const scope = useReveal()
  const idBase = useId()
  const f = useFormularioContacto()
  const [paso, setPaso] = useState(1)
  const [aviso, setAviso] = useState('')
  const tituloPasoRef = useRef(null)
  const tocado = useRef(false)

  const faltaEnPaso = (n) => {
    for (const campo of PASOS[n - 1].campos) {
      const falta = f.faltaEn(campo)
      if (falta) return falta
    }
    return null
  }

  const avanzar = () => {
    const falta = faltaEnPaso(paso)
    if (falta) return setAviso(falta)
    setAviso('')
    tocado.current = true
    setPaso((p) => Math.min(p + 1, 3))
  }

  const retroceder = () => {
    setAviso('')
    tocado.current = true
    setPaso((p) => Math.max(p - 1, 1))
  }

  // Foco al título del paso nuevo, solo después de que el visitante avanzó
  // (en el montaje robaría el scroll).
  useEffect(() => {
    if (tocado.current) tituloPasoRef.current?.focus({ preventScroll: true })
  }, [paso])

  const alEnviar = async (evento) => {
    evento.preventDefault()
    if (f.interactivo && paso < 3) return avanzar()
    const problema = await f.enviar(evento.currentTarget)
    if (problema) {
      setPaso(PASOS.find((p) => p.campos.includes(problema.campo)).n)
      setAviso(problema.falta)
    }
  }

  if (f.estado === 'exito') {
    return (
      <section ref={scope} id={id} className={styles.contacto}>
        <div className="container">
          <Exito nombre={f.formulario.nombre} />
        </div>
        <Etiqueta>{etiqueta}</Etiqueta>
      </section>
    )
  }

  const visible = (n) => !f.interactivo || paso === n
  const campo = (nombre, texto, props = {}) => (
    <div className={styles.campo}>
      <label htmlFor={`${idBase}-${nombre}`}>{texto}</label>
      <input
        id={`${idBase}-${nombre}`}
        name={nombre}
        value={f.formulario[nombre]}
        onChange={f.actualizar}
        disabled={f.enviando}
        {...props}
      />
    </div>
  )

  return (
    <section ref={scope} id={id} className={styles.contacto}>
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

        <form className={styles.formulario} onSubmit={alEnviar} noValidate={f.interactivo} data-reveal>
          {f.interactivo && (
            <div className={styles.progreso}>
              <div className={styles.progresoFila}>
                <ol className={styles.pasos}>
                  {PASOS.map((p) => (
                    <li
                      key={p.n}
                      className={`${styles.pasoMarca} ${p.n === paso ? styles.pasoActual : ''} ${
                        p.n < paso ? styles.pasoHecho : ''
                      }`}
                    >
                      <span aria-hidden="true">{String(p.n).padStart(2, '0')}</span>
                      <span className={styles.pasoNombre}>{p.titulo}</span>
                    </li>
                  ))}
                </ol>
                <p className={styles.progresoTexto} aria-live="polite">
                  Paso {paso} de 3
                </p>
              </div>
              <div className={styles.barra} aria-hidden="true">
                <span style={{ transform: `scaleX(${paso / 3})` }} />
              </div>
            </div>
          )}

          <fieldset className={styles.paso} hidden={!visible(1)}>
            <legend className={styles.pasoTitulo} tabIndex={-1} ref={paso === 1 ? tituloPasoRef : null}>
              {PASOS[0].titulo}
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
                    onChange={() => {
                      f.fijar('servicio', op)
                      setAviso('')
                    }}
                    className={styles.radio}
                  />
                  <span>{op}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.paso} hidden={!visible(2)}>
            <legend className={styles.pasoTitulo} tabIndex={-1} ref={paso === 2 ? tituloPasoRef : null}>
              {PASOS[1].titulo}
            </legend>
            {campo('nombre', 'Nombre', { type: 'text', autoComplete: 'name', required: true })}
            {campo('email', 'Email', { type: 'email', autoComplete: 'email', required: true })}
            {campo(
              'empresa',
              <>
                Empresa <span className={styles.opcional}>(opcional)</span>
              </>,
              { type: 'text', autoComplete: 'organization' },
            )}
          </fieldset>

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
                value={f.formulario.mensaje}
                onChange={f.actualizar}
                disabled={f.enviando}
              />
            </div>
            <Turnstile refTurnstile={f.turnstileRef} conTurnstile={f.conTurnstile} />
          </fieldset>

          <Honeypot idBase={idBase} />
          <Avisos aviso={aviso} estado={f.estado} errorMsg={f.errorMsg} />

          <div className={styles.acciones}>
            {f.interactivo && paso > 1 && (
              <button type="button" onClick={retroceder} className={styles.botonSecundario}>
                ← Atrás
              </button>
            )}
            {f.interactivo && paso < 3 ? (
              <button type="button" onClick={avanzar} className={styles.botonPrimario}>
                Siguiente
              </button>
            ) : (
              <button type="submit" className={styles.botonPrimario} disabled={f.enviando}>
                {f.enviando ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            )}
          </div>
        </form>
      </div>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
