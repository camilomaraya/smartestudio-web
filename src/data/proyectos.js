/*
 * Piezas de la cinta del home (sections/Proyectos.jsx) y de Servicios (índice
 * y fichas), agrupadas por el trabajo para el que se hicieron. Ya no hay
 * índice ni fichas de proyecto: el sitio no promociona clientes, así que
 * `nombre` y `rubro` son de uso interno y no se muestran en ningún lado.
 * Lo que se ve de cada pieza es su tipo, su título y el texto `detras`.
 *
 * Las piezas salen de lo que Smart publicó en Instagram (ago 2023 – ago
 * 2026): cada una corresponde a un formato que de verdad se hizo para ese
 * cliente. Los `detras` NO pueden nombrar al cliente ni dar pistas que lo
 * identifiquen (marcas, personajes, direcciones), y no llevan cifras.
 * El copy es una propuesta: validarlo con Abby.
 * El sitio TUTEA ("puedes", "quieres"), no vosea.
 *
 * `servicio` (slug de data/servicios.js) dice en qué ficha de servicio cae
 * cada pieza. Es por pieza y no por proyecto: un mismo trabajo tiene piezas
 * de foto, de diseño y de redes. Las piezas web van en `null`: salen en la
 * cinta, pero en ninguna ficha, hasta que se decida si la web es un servicio
 * principal.
 *
 * PENDIENTE de contenido: TODAS las imágenes son marcadores de posición
 * (`public/placeholders/`, generados por `scripts/generar-placeholders.mjs`).
 * Reemplazarlas es copiar los archivos reales y cambiar las rutas de acá.
 *
 * ⚠ PERMISOS (DESIGN.md §8): aunque el cliente no aparezca, las piezas son
 * suyas. Solo está confirmado lo hecho por Camilo (Villa Verla y la web de
 * GoAnimal); el resto está en `permiso: true` para maquetar y cada uno lleva
 * su `TODO PERMISO`. ANTES DE PUBLICAR: confirmarlos o poner en `false` los
 * que no tengan autorización; `proyectosPublicables()` los saca de la cinta.
 */

const P = '/placeholders'

export const proyectos = [
  {
    slug: 'villa-verla',
    nombre: 'Villa Verla',
    permiso: true,
    rubro: 'Centro de eventos: matrimonios y eventos corporativos',
    piezas: [
      {
        tipo: 'web',
        formato: 'imagen',
        src: `${P}/villa-verla-web-1.svg`,
        titulo: 'Sitio con cotización directa',
        servicio: null,
        detras:
          'Antes había que escribir por Instagram y esperar. La web contesta lo que todos preguntaban —capacidad, qué incluye, cómo se cotiza— y deja el contacto a un toque.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/villa-verla-reel-1.svg`,
        titulo: 'Recorrido del espacio',
        servicio: 'foto-video',
        detras:
          'Grabado en vertical desde el principio. Un recorrido de pocos segundos ahorra las diez fotos que nadie termina de mirar.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/villa-verla-reel-2.svg`,
        titulo: 'Un matrimonio en treinta segundos',
        servicio: 'foto-video',
        detras:
          'Se graba durante la celebración, sin interrumpirla. Quien está eligiendo dónde casarse quiere ver el lugar con gente y con fiesta, no vacío.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/villa-verla-reel-3.svg`,
        titulo: 'Backstage del montaje',
        servicio: 'foto-video',
        detras:
          'Lo que no se ve el día del evento: el armado, las pruebas, el equipo trabajando. Muestra el cuidado sin tener que decirlo.',
      },
    ],
  },
  {
    slug: 'automotriz-carmona',
    nombre: 'Automotriz Carmona',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Concesionario automotriz multimarca',
    piezas: [
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/automotriz-carmona-reel-1.svg`,
        titulo: 'Test drive',
        servicio: 'foto-video',
        detras:
          'El auto en movimiento, por calles que la gente conoce. Responde lo que una ficha técnica no alcanza a contar: cómo se siente manejarlo.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/automotriz-carmona-reel-2.svg`,
        titulo: 'El equipo en tendencia',
        servicio: 'community-management',
        detras:
          'Vendedores y mecánicos en un formato que ya está circulando. La marca deja de ser un catálogo de autos y pasa a tener caras.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/automotriz-carmona-reel-3.svg`,
        titulo: 'Testimonio de cliente',
        servicio: 'community-management',
        detras:
          'Alguien que ya compró, contando cómo le fue con sus palabras. Pesa más que cualquier cosa que la marca pueda decir de sí misma.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/automotriz-carmona-post-1.svg`,
        titulo: 'Fechas del calendario',
        servicio: 'community-management',
        detras:
          'Navidad, Fiestas Patrias, Halloween: excusas para aparecer con algo propio y no con el saludo genérico que publican todos ese día.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/automotriz-carmona-reel-4.svg`,
        titulo: 'Servicio técnico por dentro',
        servicio: 'foto-video',
        detras:
          'Mostrar el taller y las manos que trabajan hace más por la confianza que cualquier frase sobre calidad.',
      },
    ],
  },
  {
    slug: 'la-rusia',
    nombre: 'La Rusia Barra Nikkei',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Restaurante nikkei',
    piezas: [
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/la-rusia-post-1.svg`,
        titulo: 'Fotografía de carta',
        servicio: 'foto-video',
        detras:
          'La misma luz y el mismo encuadre en cada plato. La consistencia es lo que hace que el feed se lea como una carta y no como un álbum suelto.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/la-rusia-reel-1.svg`,
        titulo: 'El plato armándose',
        servicio: 'foto-video',
        detras:
          'Diez segundos de emplatado retienen más que cualquier foto final. El formato pide movimiento y acá sobraba.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/la-rusia-reel-2.svg`,
        titulo: 'Video de marca',
        servicio: 'foto-video',
        detras:
          'La barra, la cocina y la gente que las hace funcionar, contadas en un solo video. Sirve para el perfil, para la web y para quien pregunta cómo es el lugar.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/la-rusia-post-2.svg`,
        titulo: 'Retrato del equipo',
        servicio: 'foto-video',
        detras:
          'Las personas detrás de la barra, fotografiadas con el mismo cuidado que los platos. Un restaurante también se elige por quién te atiende.',
      },
      {
        tipo: 'historia',
        formato: 'imagen',
        src: `${P}/la-rusia-historia-1.svg`,
        titulo: 'Backstage de producción',
        servicio: 'foto-video',
        detras:
          'Cómo se arma una sesión en pleno local: la luz, el plato que se repite hasta que sale. Lo efímero va a historias, no al feed.',
      },
    ],
  },
  {
    slug: 'veterinaria-larrain',
    nombre: 'Centro Veterinario Larraín',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Hospital veterinario con urgencias 24/7',
    piezas: [
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/veterinaria-larrain-reel-1.svg`,
        titulo: 'Lo que tu mascota no puede comer',
        servicio: 'community-management',
        detras:
          'Información que la gente guarda y comparte. Se escribe con el equipo veterinario: en salud no se improvisa el contenido.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/veterinaria-larrain-post-1.svg`,
        titulo: 'Caso clínico, de la urgencia al alta',
        servicio: 'community-management',
        detras:
          'La historia de un paciente, contada con permiso de su familia. Muestra lo que hace el hospital mejor que cualquier lista de servicios.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/veterinaria-larrain-post-2.svg`,
        titulo: 'Campaña de donación de sangre',
        servicio: 'diseno-grafico',
        detras:
          'Un carrusel que explica en orden qué se necesita, quién puede donar y cómo hacerlo. El diseño está para que la gente actúe, no solo para que mire.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/veterinaria-larrain-post-3.svg`,
        titulo: 'Campaña de adopción',
        servicio: 'diseno-grafico',
        detras:
          'Cada animal con su foto, su nombre y lo que hay que saber de él, siempre en la misma estructura. Así una adopción se compara y se comparte fácil.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/veterinaria-larrain-reel-2.svg`,
        titulo: 'Un personaje propio',
        servicio: 'community-management',
        detras:
          'Un gato que vuelve semana a semana. Un personaje recurrente hace que la gente espere el próximo video en vez de pasarlo de largo.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/veterinaria-larrain-reel-3.svg`,
        titulo: 'Humor de clínica',
        servicio: 'community-management',
        detras:
          'Lo que pasa en un día de clínica, contado con humor. Equilibra el contenido serio y le da a la cuenta una voz que se reconoce.',
      },
    ],
  },
  {
    slug: 'alfalfa-cakes',
    nombre: 'Alfalfa Cakes',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Pastelería de autor y cafetería',
    piezas: [
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/alfalfa-cakes-post-1.svg`,
        titulo: 'Fotografía de producto',
        servicio: 'foto-video',
        detras:
          'Cada pieza fotografiada igual: mismo fondo, misma altura de cámara. Así la vitrina se ve como una colección y no como fotos sueltas.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/alfalfa-cakes-reel-1.svg`,
        titulo: 'Reel de producto',
        servicio: 'foto-video',
        detras:
          'La parte que a la gente le gusta mirar. No hace falta mostrar la receta entera: alcanza con el momento en que la cosa toma forma.',
      },
    ],
  },
  {
    slug: 'corleone-cafeteria',
    nombre: 'Corleone Cafetería',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Cafetería de especialidad',
    piezas: [
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/corleone-cafeteria-reel-1.svg`,
        titulo: 'Carta de verano',
        servicio: 'community-management',
        detras:
          'Una carta nueva merece un lanzamiento, no un post con la foto del menú. El reel la presenta producto por producto.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/corleone-cafeteria-post-1.svg`,
        titulo: 'Fotografía de producto',
        servicio: 'foto-video',
        detras:
          'Bebidas y pastelería casera fotografiadas en el local, con la luz que tiene. Lo que ves en la foto es lo que te llega a la mesa.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/corleone-cafeteria-post-2.svg`,
        titulo: 'Dinámica',
        servicio: 'community-management',
        detras:
          'Una invitación a comentar y a etiquetar a alguien. La cuenta llega a quien todavía no la sigue, y la conversación arranca sola.',
      },
    ],
  },
  {
    slug: 'optica-vision-global',
    nombre: 'Óptica Visión Global',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Óptica',
    piezas: [
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/optica-vision-global-post-1.svg`,
        titulo: 'Sesión con modelos',
        servicio: 'foto-video',
        detras:
          'Los lentes puestos, no sobre una mesa. Así se entiende cómo queda cada marco en una cara de verdad.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/optica-vision-global-reel-1.svg`,
        titulo: 'Lentes de sol',
        servicio: 'foto-video',
        detras:
          'Temporada de sol, formato vertical y ritmo rápido: varios modelos en pocos segundos, para que cada uno encuentre el suyo.',
      },
    ],
  },
  {
    slug: 'perfumeria-dreams',
    nombre: 'Perfumería Dreams',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Perfumería',
    piezas: [
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/perfumeria-dreams-post-1.svg`,
        titulo: 'Fotografía de producto',
        servicio: 'foto-video',
        detras:
          'Un perfume se elige por lo que evoca. La foto trabaja el frasco, la luz y lo que lo rodea para contar eso sin poder olerlo.',
      },
    ],
  },
  {
    slug: 'la-casita-del-molle',
    nombre: 'La Casita del Molle',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Tetería y pastelería de tradición chilena',
    piezas: [
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/la-casita-del-molle-reel-1.svg`,
        titulo: 'Detrás de una sesión',
        servicio: 'foto-video',
        detras:
          'Foto y video en la misma jornada: la luz, el armado de cada toma, la mesa que se arregla una y otra vez. De una sesión sale material para meses.',
      },
    ],
  },
  {
    slug: 'crece-activo',
    nombre: 'Crece Activo',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Centro médico familiar y pediátrico',
    piezas: [
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/crece-activo-reel-1.svg`,
        titulo: 'Apertura del centro',
        servicio: 'community-management',
        detras:
          'Un lugar nuevo tiene que mostrarse antes de que alguien le confíe su salud: quiénes atienden, cómo es por dentro y dónde queda.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/crece-activo-reel-2.svg`,
        titulo: 'Pediatría explicada',
        servicio: 'community-management',
        detras:
          'Información clara para familias, revisada por el equipo médico. Responder dudas antes de la consulta también es atender.',
      },
    ],
  },
  {
    slug: 'goanimal',
    nombre: 'GoAnimal',
    permiso: true, // TODO PERMISO: confirmar con el cliente el reel (la web es de Camilo)
    rubro: 'Centro de especialidades veterinarias e imagenología',
    piezas: [
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/goanimal-reel-1.svg`,
        titulo: 'Tomas descartadas',
        servicio: 'community-management',
        detras:
          'Lo que quedó fuera de la grabación, convertido en contenido. Muestra a las personas detrás de la marca y le baja el tono a un rubro serio.',
      },
      {
        tipo: 'web',
        formato: 'imagen',
        src: `${P}/goanimal-web-1.svg`,
        titulo: 'Sitio de especialidades',
        servicio: null,
        detras:
          'Las especialidades y cómo pedir hora, ordenadas para quien llega buscando algo puntual. Encontrar el dato no debería tomar más que leerlo.',
      },
    ],
  },
  {
    slug: 'los-perdedores',
    nombre: 'Los Perdedores',
    permiso: true, // TODO PERMISO: confirmar con el autor ANTES de publicar
    rubro: 'Novela gráfica',
    piezas: [
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/los-perdedores-post-1.svg`,
        titulo: 'Fotografía editorial',
        servicio: 'foto-video',
        detras:
          'Un libro también es un objeto. La sesión muestra la edición, el papel y las páginas por dentro, no solo la portada.',
      },
    ],
  },
]

/*
 * Solo los proyectos con permiso confirmado se publican. Sin este filtro, un
 * cliente podría terminar con su trabajo en internet sin haberlo autorizado
 * — y esa es una decisión suya, no del código.
 */
export function proyectosPublicables() {
  return proyectos.filter((proyecto) => proyecto.permiso)
}

/*
 * Todas las piezas publicables, aplanadas. Intercala trabajos (una pieza de
 * cada uno por vuelta) para que ninguna secuencia quede con tres piezas
 * seguidas del mismo.
 */
export function piezasPublicables() {
  const publicables = proyectosPublicables()
  const salida = []
  const maximo = Math.max(0, ...publicables.map((p) => p.piezas.length))
  for (let vuelta = 0; vuelta < maximo; vuelta += 1) {
    for (const proyecto of publicables) {
      const pieza = proyecto.piezas[vuelta]
      if (pieza) salida.push(pieza)
    }
  }
  return salida
}

// Las piezas de un servicio, en el mismo orden intercalado
export function piezasDeServicio(slug) {
  return piezasPublicables().filter((pieza) => pieza.servicio === slug)
}
