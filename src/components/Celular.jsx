import { gsap } from '../lib/gsap'
import { redes } from '../data/redes'
import styles from './Celular.module.css'

/*
 * El teléfono de la sección F. Acompaña los tres estados de la frase:
 *   1. «QUIERO MÁS SEGUIDORES»: un perfil donde los seguidores suben.
 *   2. Se tacha SEGUIDORES: la pantalla pasa a los mensajes y llegan
 *      consultas de personas reales.
 *   3. «QUEREMOS MÁS CLIENTES»: baja una notificación de reserva.
 *
 * Todo es ilustrativo (cuentas, números y mensajes inventados), dibujado en
 * CSS. Reposo sin JS = estado 3: mensajes a la vista y la reserva arriba.
 */

const SEGUIDORES_INICIO = 1200
const SEGUIDORES_FIN = 48300

// Nuevos, entran uno a uno al tacharse la palabra
const MENSAJES = [
  { autor: 'fer.olivares', texto: 'Quiero reservar para 20 el sábado', color: '#d9825b' },
  { autor: 'pato_rivera', texto: '¿Hacen envíos a Coquimbo?', color: '#6fa3c7' },
  { autor: 'andrea.m', texto: '¿Tienen hora el sábado?', color: '#8fbf7f' },
]

// Viejos y leídos: el inbox ya tenía vida antes
const LEIDOS = [
  { autor: 'caro.vega', texto: 'Te mencionó en su historia', hora: '2 d', color: '#b58ad1' },
  { autor: 'nico_dg', texto: 'Le gustó tu reel', hora: '3 d', color: '#c9a45b' },
  { autor: 'meli.torres', texto: 'Tú: ¡Gracias por venir!', hora: '1 sem', color: '#d97b9c' },
  { autor: 'javi.perez', texto: 'Reaccionó con ❤️ a tu mensaje', hora: '1 sem', color: '#7f9fbf' },
  { autor: 'dani_rojas', texto: 'Vale, te aviso', hora: '2 sem', color: '#a3b86c' },
]

const iconoWhatsApp = redes.find((red) => red.label === 'WhatsApp')?.icono

// Como lo muestra Instagram: 9.845 hasta cinco cifras, después «48,3 mil»
function formatoSeguidores(n) {
  const entero = Math.round(n)
  if (entero < 10000) return entero.toLocaleString('es-CL')
  return `${(entero / 1000).toLocaleString('es-CL', { maximumFractionDigits: 1 })} mil`
}

function Avatar({ autor, color }) {
  return (
    <span className={styles.avatar} style={{ backgroundColor: color }}>
      {autor.charAt(0).toUpperCase()}
    </span>
  )
}

function Perfil() {
  return (
    <div className={styles.vista}>
      <div className={styles.barraApp}>
        <span className={styles.usuario}>
          tu_marca <span className={styles.flecha}>⌄</span>
        </span>
        <span className={styles.iconosApp}>
          <span className={styles.iconoMas} />
          <span className={styles.iconoMenu} />
        </span>
      </div>

      <div className={styles.cabeceraPerfil}>
        <span className={styles.avatarPerfil}>
          <span />
        </span>
        <dl className={styles.stats}>
          <div>
            <dt>Publicaciones</dt>
            <dd>128</dd>
          </div>
          <div>
            <dt>Seguidores</dt>
            <dd data-cel="cuenta">{formatoSeguidores(SEGUIDORES_FIN)}</dd>
          </div>
          <div>
            <dt>Seguidos</dt>
            <dd>312</dd>
          </div>
        </dl>
      </div>
      <p className={styles.nombre}>Tu Marca</p>
      <p className={styles.bio}>Hacemos las cosas bien ✨ La Serena</p>

      <div className={styles.botones}>
        <span>Editar perfil</span>
        <span>Compartir perfil</span>
      </div>

      <div className={styles.grilla}>
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  )
}

function Mensajes() {
  return (
    <div className={styles.vista}>
      <div className={styles.barraApp}>
        <span className={styles.usuario}>
          <span className={styles.atras}>‹</span> tu_marca
        </span>
        <span className={styles.iconoEditar} />
      </div>
      <p className={styles.buscar}>Buscar</p>
      <p className={styles.tituloLista}>Mensajes</p>
      <ul className={styles.lista}>
        {MENSAJES.map((m) => (
          <li key={m.autor} className={styles.chat} data-cel="mensaje">
            <Avatar autor={m.autor} color={m.color} />
            <span className={styles.chatTexto}>
              <strong>{m.autor}</strong>
              <span>
                {m.texto} · ahora
              </span>
            </span>
            <span className={styles.noLeido} />
          </li>
        ))}
        {LEIDOS.map((m) => (
          <li key={m.autor} className={`${styles.chat} ${styles.leido}`}>
            <Avatar autor={m.autor} color={m.color} />
            <span className={styles.chatTexto}>
              <span className={styles.chatAutor}>{m.autor}</span>
              <span>
                {m.texto} · {m.hora}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Celular() {
  return (
    <div className={styles.celular} aria-hidden="true">
      <span className={styles.botonLateral} />
      <div className={styles.pantalla}>
        <div className={styles.barraEstado}>
          <span>9:41</span>
          <span className={styles.isla} />
          <span className={styles.indicadores}>
            <span className={styles.senal} />
            <span className={styles.bateria} />
          </span>
        </div>

        {/* Las dos pantallas lado a lado; el cambio es un deslizamiento */}
        <div className={styles.carril} data-cel="carril">
          <Perfil />
          <Mensajes />
        </div>

        <div className={styles.push} data-cel="push">
          <span className={styles.pushIcono}>{iconoWhatsApp}</span>
          <span className={styles.pushTexto}>
            <span className={styles.pushApp}>
              WhatsApp <span>ahora</span>
            </span>
            <strong>Nueva reserva confirmada</strong>
            <span>Sábado · 20 personas</span>
          </span>
        </div>

        <span className={styles.brillo} />
        <span className={styles.indicadorInicio} />
      </div>
    </div>
  )
}

/*
 * Suma los tweens del teléfono a la timeline de la sección, en los mismos
 * tiempos que la frase (ver Correccion.jsx): 0→1 suben los seguidores, en 1
 * se tacha la palabra, en 2.8 entra el bloque B.
 */
export function animarCelular(raiz, tl) {
  const cuenta = raiz.querySelector('[data-cel="cuenta"]')
  const carril = raiz.querySelector('[data-cel="carril"]')
  const mensajes = raiz.querySelectorAll('[data-cel="mensaje"]')
  const push = raiz.querySelector('[data-cel="push"]')
  if (!cuenta || !carril || !push) return

  // Setter en vez de onUpdate: GSAP escribe la propiedad en cada render,
  // también cuando ScrollTrigger salta la timeline con los callbacks
  // suprimidos (refresh, llegar por ancla).
  let valor = SEGUIDORES_INICIO
  const contador = {
    get n() {
      return valor
    },
    set n(v) {
      valor = v
      cuenta.textContent = formatoSeguidores(v)
    },
  }
  contador.n = SEGUIDORES_INICIO

  // Estado 1 encima del reposo
  // x: 0 además de xPercent: GSAP lee el translateX(-50%) del reposo como
  // píxeles, y sin anularlo se sumaría al porcentaje.
  gsap.set(carril, { x: 0, xPercent: 0 })
  // Los chats nuevos no ocupan lugar hasta que llegan: entran creciendo y
  // empujan a los viejos hacia abajo, como en la app
  gsap.set(mensajes, { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 })
  gsap.set(push, { yPercent: -160, opacity: 0 })

  tl.to(contador, { n: SEGUIDORES_FIN, duration: 1, ease: 'power2.in' }, 0)
    // Al tacharse SEGUIDORES, la pantalla desliza a los mensajes
    .to(carril, { xPercent: -50, duration: 0.45, ease: 'power3.inOut' }, 1)
    // Desde abajo: el más nuevo, arriba, llega último
    .to(
      mensajes,
      {
        opacity: 1,
        height: 'auto',
        paddingTop: 5,
        paddingBottom: 5,
        duration: 0.35,
        ease: 'power3.out',
        stagger: { each: 0.35, from: 'end' },
      },
      1.4,
    )
    .to(push, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }, 2.8)
}
