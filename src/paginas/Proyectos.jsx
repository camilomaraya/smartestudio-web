import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import styles from './Pagina.module.css'

// Stub de la Fase 3a: solo verifica la navegación. El índice real
// (lista vertical con carrusel por bloque) se construye en la Fase 6.
export default function Proyectos() {
  return (
    <>
      <CabeceraPagina
        lineas={['Marcas que', 'confiaron', 'en nosotrxs']}
        bajada="Índice de proyectos — pendiente de construir en la Fase 6."
      />
      <div className={`container ${styles.cuerpo}`}>
        <p className={styles.texto}>
          Acá va la lista vertical de proyectos, cada uno con su carrusel de 3 a 5
          imágenes y enlace a la ficha.
        </p>
        <p className={styles.texto}>
          Ruta dinámica de prueba: <EnlaceRuta to="/proyectos/villa-verla">villa-verla</EnlaceRuta>
        </p>
        <EnlaceRuta to="/" className={styles.volver}>
          ← Volver al inicio
        </EnlaceRuta>
      </div>
    </>
  )
}
