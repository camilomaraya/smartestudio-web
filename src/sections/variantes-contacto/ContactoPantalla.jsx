import { useEffect, useId, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { CAMPOS, OPCIONES_SERVICIO, useFormularioContacto } from './useFormularioContacto'
import { Avisos, Exito, Honeypot, Turnstile } from './Comunes'
import Etiqueta from './Etiqueta'
import styles from './ContactoPantalla.module.css'

/*
 * TEMPORAL — variante «Una pregunta por pantalla»: un brief a pantalla
 * completa. Cada pregunta ocupa la sección entera en tipografía display,
 * Enter avanza y una barra dorada marca cuánto falta. Al final, un resumen
 * para revisar antes de enviar.
 *
 * Sin JS se ven todas las preguntas seguidas y se envía de una vez.
 */
const LISTO = CAMPOS.length
const LETRAS = 'ABCDEFGH'

const pregunta = (campo, f) => {
  const nombre = f.nombre.trim().split(' ')[0]
  return {
    servicio: '¿Qué necesitas?',
    nombre: '¿Cómo te llamas?',
    email: nombre ? `${nombre}, ¿a qué email te escribimos?` : '¿A qué email te escribimos?',
    empresa: '¿Tu marca tiene nombre?',
    mensaje: 'Cuéntanos de tu proyecto',
  }[campo]
}
const AYUDA = {
  empresa: 'Opcional. Si no tiene, sáltala.',
  mensaje: 'Tu marca, lo que necesitas, lo que te gustaría lograr. Shift + Enter para un salto de línea.',
}
const RESUMEN = { servicio: 'Necesitas', nombre: 'Nombre', email: 'Email', empresa: 'Marca', mensaje: 'Mensaje' }

export default function ContactoPantalla({ id, etiqueta }) {
  const scope = useRef(null)
  const idBase = useId()
  const f = useFormularioContacto()
  const [paso, setPaso] = useState(0)
  const [aviso, setAviso] = useState('')
  const tocado = useRef(false)
  const direccion = useRef(1)

  const ir = (n) => {
    direccion.current = n > paso ? 1 : -1
    tocado.current = true
    setAviso('')
    setPaso(n)
  }

  const avanzar = (valor) => {
    const falta = f.faltaEn(CAMPOS[paso], valor)
    if (falta) return setAviso(falta)
    ir(paso + 1)
  }

  // Transición entre preguntas: la nueva entra desde abajo (o desde
  // arriba si se vuelve). Solo después de que el visitante se movió.
  useGSAP(
    () => {
      if (!tocado.current) return
      const actual = scope.current.querySelector('[data-ctp-activo]')
      if (!actual) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          actual.querySelectorAll('[data-ctp="entra"]'),
          { y: 60 * direccion.current, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power4.out', clearProps: 'all' },
        )
      })
    },
    { scope, dependencies: [paso], revertOnUpdate: false },
  )

  useEffect(() => {
    if (!tocado.current) return
    scope.current
      ?.querySelector('[data-ctp-activo] :is(input:checked, input, textarea, button[type=submit])')
      ?.focus({ preventScroll: true })
  }, [paso])

  const alEnviar = async (evento) => {
    evento.preventDefault()
    if (f.interactivo && paso < LISTO) return avanzar()
    const problema = await f.enviar(evento.currentTarget)
    if (problema) {
      ir(CAMPOS.indexOf(problema.campo))
      setAviso(problema.falta)
    }
  }

  const alTeclaMensaje = (evento) => {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault()
      evento.currentTarget.form.requestSubmit()
    }
  }

  if (f.estado === 'exito') {
    return (
      <section ref={scope} id={id} className={styles.pantalla}>
        <div className={`container ${styles.centro}`}>
          <Exito nombre={f.formulario.nombre} />
        </div>
        <Etiqueta>{etiqueta}</Etiqueta>
      </section>
    )
  }

  const visible = (i) => !f.interactivo || paso === i
  const marca = (i) => (f.interactivo && paso === i ? { 'data-ctp-activo': true } : {})
  const numero = (i) => (
    <span className={styles.numero} data-ctp="entra">
      {String(i + 1).padStart(2, '0')} <span aria-hidden="true">→</span>
    </span>
  )
  const seguir = (texto = 'Seguir') =>
    f.interactivo && (
      <div className={styles.seguir} data-ctp="entra">
        <button type="submit" className={styles.boton}>
          {texto}
        </button>
        <span className={styles.pista}>
          o pulsa <kbd>Enter ↵</kbd>
        </span>
      </div>
    )

  const texto = (i, props) => {
    const campo = CAMPOS[i]
    return (
      <div className={styles.paso} hidden={!visible(i)} {...marca(i)}>
        {numero(i)}
        <label htmlFor={`${idBase}-${campo}`} className={styles.pregunta} data-ctp="entra">
          {pregunta(campo, f.formulario)}
        </label>
        {AYUDA[campo] && (
          <p className={styles.ayuda} data-ctp="entra">
            {AYUDA[campo]}
          </p>
        )}
        <input
          id={`${idBase}-${campo}`}
          name={campo}
          value={f.formulario[campo]}
          onChange={f.actualizar}
          disabled={f.enviando}
          className={styles.entrada}
          data-ctp="entra"
          placeholder="Escribe aquí…"
          {...props}
        />
        {seguir(campo === 'empresa' && !f.formulario.empresa.trim() ? 'Saltar' : 'Seguir')}
      </div>
    )
  }

  return (
    <section ref={scope} id={id} className={styles.pantalla} aria-labelledby={`${idBase}-titulo`}>
      <form className={styles.formulario} onSubmit={alEnviar} noValidate={f.interactivo}>
        <div className={`container ${styles.barraSuperior}`}>
          <h2 id={`${idBase}-titulo`} className={styles.titulo}>
            Conversemos
          </h2>
          {f.interactivo && (
            <p className={styles.contador} aria-live="polite">
              {paso < LISTO ? `Pregunta ${paso + 1} de ${LISTO}` : 'Listo para enviar'}
            </p>
          )}
        </div>
        {f.interactivo && (
          <div className={styles.progreso} aria-hidden="true">
            <span style={{ transform: `scaleX(${paso / LISTO})` }} />
          </div>
        )}

        <div className={`container ${styles.centro}`}>
          <fieldset className={styles.paso} hidden={!visible(0)} {...marca(0)}>
            {/* El número va dentro del legend: el navegador siempre pinta
                el legend primero en el fieldset, aunque vaya después */}
            <legend className={styles.legend}>
              {numero(0)}
              <span className={styles.pregunta} data-ctp="entra">
                {pregunta('servicio', f.formulario)}
              </span>
            </legend>
            <div className={styles.opciones} data-ctp="entra">
              {OPCIONES_SERVICIO.map((op, i) => (
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
                    // Con mouse elegir ya avanza; con flechas solo se elige
                    // (detail 0) y Enter avanza.
                    onClick={(e) => f.interactivo && e.detail > 0 && setTimeout(() => avanzar(op), 250)}
                    className={styles.radio}
                  />
                  <span className={styles.letra} aria-hidden="true">
                    {LETRAS[i]}
                  </span>
                  {op}
                </label>
              ))}
            </div>
          </fieldset>

          {texto(1, { type: 'text', autoComplete: 'name', required: true })}
          {texto(2, { type: 'email', autoComplete: 'email', required: true })}
          {texto(3, { type: 'text', autoComplete: 'organization' })}

          <div className={styles.paso} hidden={!visible(4)} {...marca(4)}>
            {numero(4)}
            <label htmlFor={`${idBase}-mensaje`} className={styles.pregunta} data-ctp="entra">
              {pregunta('mensaje', f.formulario)}
            </label>
            {f.interactivo && (
              <p className={styles.ayuda} data-ctp="entra">
                {AYUDA.mensaje}
              </p>
            )}
            <textarea
              id={`${idBase}-mensaje`}
              name="mensaje"
              rows="3"
              required
              value={f.formulario.mensaje}
              onChange={f.actualizar}
              onKeyDown={f.interactivo ? alTeclaMensaje : undefined}
              disabled={f.enviando}
              className={`${styles.entrada} ${styles.mensaje}`}
              data-ctp="entra"
              placeholder="Escribe aquí…"
            />
            {seguir()}
          </div>

          <div className={styles.paso} hidden={f.interactivo && paso !== LISTO} {...marca(LISTO)}>
            {f.interactivo && (
              <>
                <p className={styles.pregunta} data-ctp="entra">
                  Todo listo. <span className={styles.acento}>¿Lo enviamos?</span>
                </p>
                <dl className={styles.resumen} data-ctp="entra">
                  {CAMPOS.map((campo, i) => (
                    <div key={campo}>
                      <dt>{RESUMEN[campo]}</dt>
                      <dd>
                        <button type="button" onClick={() => ir(i)} aria-label={`Corregir ${RESUMEN[campo]}`}>
                          {f.formulario[campo].trim() || '—'}
                        </button>
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            <Turnstile refTurnstile={f.turnstileRef} conTurnstile={f.conTurnstile} />
            <div className={styles.seguir} data-ctp="entra">
              <button type="submit" className={styles.boton} disabled={f.enviando}>
                {f.enviando ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            </div>
          </div>

          <Honeypot idBase={idBase} />
          <Avisos aviso={aviso} estado={f.estado} errorMsg={f.errorMsg} />

          {f.interactivo && paso > 0 && (
            <button type="button" className={styles.atras} onClick={() => ir(paso - 1)}>
              ← Anterior
            </button>
          )}
        </div>
      </form>
      <Etiqueta>{etiqueta}</Etiqueta>
    </section>
  )
}
