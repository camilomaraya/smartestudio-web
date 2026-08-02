import EnlaceRuta from '../components/EnlaceRuta'
import CabeceraPagina from '../components/CabeceraPagina'
import styles from './Pagina.module.css'

/*
 * Con el rewrite del .htaccess, cualquier URL desconocida llega igual a
 * index.html. Sin esta ruta el visitante vería una página en blanco.
 */
export default function NoEncontrada() {
  return (
    <>
      <CabeceraPagina
        lineas={['Esta página', 'no existe', 'o se mudó']}
        bajada="Revisa la dirección o vuelve al inicio para seguir explorando."
      />
      <div className={`container ${styles.cuerpo}`}>
        <EnlaceRuta to="/" className={styles.volver}>
          ← Volver al inicio
        </EnlaceRuta>
      </div>
    </>
  )
}
