/*
 * Proyectos — fuente única para la sección E del home, el índice /proyectos
 * y las fichas.
 *
 * DOS COSAS PENDIENTES, las dos de contenido, ninguna de código:
 *
 * 1. TODAS las imágenes son marcadores de posición (`public/placeholders/`,
 *    generados por `scripts/generar-placeholders.mjs`). Reemplazarlas es
 *    copiar los archivos reales y cambiar las rutas de acá.
 * 2. `resumen` es copy PLACEHOLDER en la voz de marca, no texto aprobado.
 *    El sitio TUTEA ("puedes", "quieres"), no vosea.
 *
 * ⚠ PERMISOS — BLOQUEANTE DE LANZAMIENTO (DESIGN.md §8): cada cliente
 * necesita permiso explícito para aparecer con nombre. Solo **Villa Verla**
 * está confirmado (es proyecto propio de Camilo). Los otros cuatro son de
 * Abby y están en `permiso: true` únicamente para poder maquetar el índice
 * completo — cada uno lleva su `TODO PERMISO`.
 *
 * ANTES DE PUBLICAR: confirmar los cuatro, o poner en `false` los que no
 * tengan autorización. `proyectosPublicables()` los filtra de todo el sitio
 * —home, índice, fichas y rutas del prerender— con solo cambiar ese
 * booleano; no hay ningún otro lugar que tocar.
 *
 * Regla de contenido (§8): `resumen` se escribe una vez y sirve en tres
 * lugares —índice, cabecera de ficha y meta description—.
 * Las fichas NO llevan métricas ni porcentajes: material y contexto.
 */

const P = '/placeholders'

export const proyectos = [
  {
    slug: 'villa-verla',
    nombre: 'Villa Verla',
    permiso: true,
    rubro: 'Arriendo de espacios para eventos',
    servicios: ['diseno-grafico', 'foto-video', 'community-management'],
    resumen:
      'Un lugar para celebrar en el valle, que hasta entonces se conocía de boca en boca. Armamos la identidad, la web y el material para que se pudiera encontrar sin que alguien tuviera que recomendarlo.',
    portada: `${P}/villa-verla-portada.svg`,
    piezas: [
      {
        tipo: 'web',
        formato: 'imagen',
        src: `${P}/villa-verla-web-1.svg`,
        titulo: 'Sitio con reserva directa',
        detras:
          'Antes había que escribir por Instagram y esperar. La web contesta las tres preguntas que todos hacían —capacidad, qué incluye, cuánto sale— y deja el contacto a un toque.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/villa-verla-post-1.svg`,
        titulo: 'Anuncio de temporada',
        detras:
          'La foto es de un evento real, no de banco. Se nota, y es justamente lo que hace que alguien se imagine su propia fiesta ahí.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/villa-verla-reel-1.svg`,
        titulo: 'Recorrido del lugar',
        detras:
          'Grabado en vertical desde el principio. Un recorrido de treinta segundos ahorra las diez fotos que nadie termina de mirar.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/villa-verla-post-2.svg`,
        titulo: 'Preguntas frecuentes',
        detras:
          'Las dudas que llegaban por mensaje, convertidas en contenido. Menos mensajes repetidos, más tiempo para atender a quien de verdad va a reservar.',
      },
      {
        tipo: 'informe',
        formato: 'imagen',
        src: `${P}/villa-verla-informe-1.svg`,
        titulo: 'Informe mensual',
        detras:
          'Lo que pasó en el mes, en dos páginas y sin jerga: qué se publicó, qué se movió y qué conviene hacer distinto.',
      },
    ],
  },
  {
    slug: 'automotriz-carmona',
    nombre: 'Automotriz Carmona',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Taller y servicio automotriz',
    servicios: ['community-management', 'foto-video', 'publicidad-digital'],
    resumen:
      'Un taller donde la confianza se construye en persona, mostrando ese mismo oficio en pantalla. Contenido que explica en vez de vender, para que llegue gente que ya sabe por qué eligió.',
    portada: `${P}/automotriz-carmona-portada.svg`,
    piezas: [
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/automotriz-carmona-post-1.svg`,
        titulo: 'Explicando un servicio',
        detras:
          'Nadie busca "mantención preventiva". Buscan que no se les quede el auto. El texto arranca por ahí, no por el nombre técnico.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/automotriz-carmona-reel-1.svg`,
        titulo: 'El taller por dentro',
        detras:
          'Mostrar el lugar y las manos que trabajan hace más por la confianza que cualquier frase sobre calidad.',
      },
      {
        tipo: 'historia',
        formato: 'imagen',
        src: `${P}/automotriz-carmona-historia-1.svg`,
        titulo: 'Antes y después',
        detras:
          'El formato más simple del catálogo y el que más se comparte. Se graba en dos minutos mientras el trabajo ya se está haciendo.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/automotriz-carmona-post-2.svg`,
        titulo: 'Pauta local',
        detras:
          'Segmentada por comuna y por kilómetros a la redonda. A un taller no le sirve que lo vea alguien a dos horas de distancia.',
      },
    ],
  },
  {
    slug: 'la-rusia',
    nombre: 'La Rusia Barra Nikkei',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Gastronomía',
    servicios: ['foto-video', 'community-management'],
    resumen:
      'Cocina nikkei en una barra donde el plato entra por los ojos antes que por la boca. El trabajo fue sostener ese nivel también en la pantalla, plato por plato.',
    portada: `${P}/la-rusia-portada.svg`,
    piezas: [
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/la-rusia-post-1.svg`,
        titulo: 'Plato del mes',
        detras:
          'Luz lateral y fondo oscuro, siempre igual. La consistencia es lo que hace que el feed se lea como una carta y no como un álbum suelto.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/la-rusia-reel-1.svg`,
        titulo: 'El plato armándose',
        detras:
          'Diez segundos de emplatado retienen más que cualquier foto final. El formato pide movimiento y acá sobraba.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/la-rusia-reel-2.svg`,
        titulo: 'La barra en hora punta',
        detras:
          'El ambiente también es producto. Se graba sin guion, en el servicio real, con permiso de la gente que aparece.',
      },
      {
        tipo: 'historia',
        formato: 'imagen',
        src: `${P}/la-rusia-historia-1.svg`,
        titulo: 'Disponibilidad del día',
        detras:
          'Lo efímero va a historias, no al feed. Sirve hoy y mañana no molesta a nadie en el perfil.',
      },
    ],
  },
  {
    slug: 'veterinaria-larrain',
    nombre: 'Veterinaria Larraín',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Salud animal',
    servicios: ['community-management', 'diseno-grafico'],
    resumen:
      'Una veterinaria de barrio que quería explicar sin asustar. Contenido que informa con calma, en un rubro donde la gente llega preocupada y buscando respuestas rápidas.',
    portada: `${P}/veterinaria-larrain-portada.svg`,
    piezas: [
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/veterinaria-larrain-post-1.svg`,
        titulo: 'Calendario de vacunas',
        detras:
          'Información que la gente guarda y vuelve a mirar. Ese tipo de post trabaja durante meses, no durante un día.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/veterinaria-larrain-post-2.svg`,
        titulo: 'Señales de alerta',
        detras:
          'Escrito con la vet, revisado por ella. En salud no se improvisa el contenido, y decirlo así también construye confianza.',
      },
      {
        tipo: 'historia',
        formato: 'imagen',
        src: `${P}/veterinaria-larrain-historia-1.svg`,
        titulo: 'Pacientes del día',
        detras:
          'Con permiso de cada familia. Es el contenido que más cariño genera y el que menos esfuerzo cuesta: ya está pasando.',
      },
    ],
  },
  {
    slug: 'alfalfa-cakes',
    nombre: 'Alfalfa Cakes',
    permiso: true, // TODO PERMISO: confirmar con el cliente ANTES de publicar
    rubro: 'Pastelería por encargo',
    servicios: ['foto-video', 'community-management'],
    resumen:
      'Pastelería por encargo que vivía de las recomendaciones y de las fotos que sacaban los clientes. Le dimos material propio para que el encargo entre por el perfil y no por el boca a boca.',
    portada: `${P}/alfalfa-cakes-portada.svg`,
    piezas: [
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/alfalfa-cakes-post-1.svg`,
        titulo: 'Catálogo de tortas',
        detras:
          'Cada torta fotografiada igual: mismo fondo, misma altura de cámara. Así el catálogo se ve como una colección y no como fotos sueltas.',
      },
      {
        tipo: 'reel',
        formato: 'video',
        src: `${P}/alfalfa-cakes-reel-1.svg`,
        titulo: 'El decorado',
        detras:
          'La parte que a la gente le gusta mirar. No hace falta mostrar la receta entera: alcanza con el momento en que la cosa toma forma.',
      },
      {
        tipo: 'post',
        formato: 'imagen',
        src: `${P}/alfalfa-cakes-post-2.svg`,
        titulo: 'Cómo encargar',
        detras:
          'Plazos, tamaños y cómo se reserva. Las tres cosas que frenaban un pedido, resueltas en una sola imagen.',
      },
    ],
  },
]

/*
 * Solo los proyectos con permiso confirmado se publican. Sin este filtro, un
 * cliente podría terminar con su nombre en internet sin haberlo autorizado —
 * y esa es una decisión suya, no del código.
 */
export function proyectosPublicables() {
  return proyectos.filter((proyecto) => proyecto.permiso)
}

export function proyectoPorSlug(slug) {
  return proyectosPublicables().find((proyecto) => proyecto.slug === slug)
}

export const SLUGS_PROYECTOS = proyectosPublicables().map((proyecto) => proyecto.slug)

/*
 * Piezas para la sección E del home.
 *
 * Regla de contenido 3 (§8): E usa piezas de clientes DISTINTOS a los de las
 * fichas, para que el sitio no se sienta más chico de lo que es. Mientras
 * haya un solo proyecto publicable eso no se puede cumplir, así que cae al
 * único disponible; en cuanto haya varios, toma una pieza por cliente
 * empezando por los que no tienen ficha propia.
 */
export function piezasDestacadas(cantidad = 5) {
  const publicables = proyectosPublicables()
  if (publicables.length === 0) return []

  const seleccion = []
  // Una pieza por cliente antes de repetir cliente: variedad primero.
  for (let vuelta = 0; seleccion.length < cantidad; vuelta += 1) {
    let sumoEnEstaVuelta = false
    for (const proyecto of publicables) {
      const pieza = proyecto.piezas[vuelta]
      if (!pieza) continue
      seleccion.push({ ...pieza, proyecto: proyecto.nombre, slug: proyecto.slug })
      sumoEnEstaVuelta = true
      if (seleccion.length === cantidad) break
    }
    if (!sumoEnEstaVuelta) break
  }
  return seleccion
}
