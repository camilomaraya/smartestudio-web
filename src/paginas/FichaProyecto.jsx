import { useParams } from 'react-router'
import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import styles from './Pagina.module.css'

// Stub de la Fase 3a. El slug se muestra tal cual para comprobar que la
// ruta dinámica resuelve; en la Fase 6 sale de src/data/proyectos.js.
export default function FichaProyecto() {
  const { slug } = useParams()

  return (
    <>
      <CabeceraPagina lineas={['Proyecto', slug]} />
      <div className={`container ${styles.cuerpo}`}>
        <p className={styles.slug}>slug: {slug}</p>
        <p className={styles.texto}>
          Ficha de proyecto — pendiente de construir en la Fase 6.
        </p>
        <EnlaceRuta to="/proyectos" className={styles.volver}>
          ← Volver a proyectos
        </EnlaceRuta>
      </div>
    </>
  )
}
