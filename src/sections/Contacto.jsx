import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import Button from '../components/ui/Button'
import styles from './Contacto.module.css'

const estadoInicial = { nombre: '', email: '', empresa: '', mensaje: '' }

export default function Contacto() {
  const scope = useReveal()
  const [formulario, setFormulario] = useState(estadoInicial)

  const actualizar = (event) => {
    const { name, value } = event.target
    setFormulario((previo) => ({ ...previo, [name]: value }))
  }

  // El envío real (PHP) se conecta en Etapa 5.
  const enviar = (event) => {
    event.preventDefault()
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

        <form className={styles.formulario} onSubmit={enviar} data-reveal-group>
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
            />
          </div>

          <Button type="submit">Enviar mensaje</Button>
        </form>
      </div>
    </section>
  )
}
