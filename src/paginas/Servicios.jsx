import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import styles from './Pagina.module.css'

// Stub de la Fase 3a: solo verifica la navegación. El índice real
// (lista vertical, un bloque por servicio) se construye en la Fase 5.
export default function Servicios() {
  return (
    <>
      <CabeceraPagina
        lineas={['Lo que hacemos', 'por tu marca', 'todos los días']}
        bajada="Índice de servicios — pendiente de construir en la Fase 5."
      />
      <div className={`container ${styles.cuerpo}`}>
        <p className={styles.texto}>
          Acá va la lista vertical de servicios, un bloque por cada uno, con enlace a su
          ficha.
        </p>
        <EnlaceRuta to="/" className={styles.volver}>
          ← Volver al inicio
        </EnlaceRuta>
      </div>
    </>
  )
}
