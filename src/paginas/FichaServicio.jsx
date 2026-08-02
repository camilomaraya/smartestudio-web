import { useParams } from 'react-router'
import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import styles from './Pagina.module.css'

// Stub de la Fase 3a. El slug se muestra tal cual para comprobar que la
// ruta dinámica resuelve; en la Fase 5 sale de src/data/servicios.js.
export default function FichaServicio() {
  const { slug } = useParams()

  return (
    <>
      <CabeceraPagina lineas={['Servicio', slug]} />
      <div className={`container ${styles.cuerpo}`}>
        <p className={styles.slug}>slug: {slug}</p>
        <p className={styles.texto}>
          Ficha de servicio — pendiente de construir en la Fase 5.
        </p>
        <EnlaceRuta to="/servicios" className={styles.volver}>
          ← Volver a servicios
        </EnlaceRuta>
      </div>
    </>
  )
}
