/*
 * Servicios — fuente única para el home, el índice /servicios y las fichas.
 *
 * OJO CON EL COPY: `resumen` y `detalle` son PLACEHOLDER escritos en la voz
 * de marca, no texto aprobado por la clienta. Están para que el maquetado se
 * pueda ver y calibrar con largos reales; se reemplazan por el copy
 * definitivo sin tocar ningún componente.
 *
 * Regla de contenido (DESIGN.md §8): `resumen` se escribe UNA vez y sirve en
 * tres lugares —índice, cabecera de ficha y meta description—. No hay tres
 * versiones del mismo párrafo.
 */

export const serviciosPrincipales = [
  {
    slug: 'community-management',
    titulo: 'Community Management',
    // Línea corta para la fila del home, donde no cabe el resumen entero.
    gancho: 'Tus redes, con una voz que se reconoce.',
    resumen:
      'Tus redes dejan de ser un tablón de anuncios y pasan a ser una conversación. Contenido mensual con criterio, respuestas a tiempo y una voz que se reconoce sin necesidad de ver el logo.',
    incluye: [
      'Calendario de contenidos mensual',
      'Diseño y edición de las piezas',
      'Redacción de textos con tu voz',
      'Gestión de comentarios y mensajes',
      'Informe mensual con métricas',
    ],
    detalle:
      'Partimos entendiendo a quién le hablas y qué quieres que pase cuando te lean. Con eso armamos un calendario mensual que apruebas antes de que salga nada, y desde ahí publicamos, respondemos y ajustamos. Cada mes cerramos con un informe que se entiende: qué funcionó, qué no y qué cambiamos el mes que viene.',
  },
  {
    slug: 'diseno-grafico',
    titulo: 'Diseño gráfico e identidad',
    gancho: 'Que se reconozca sin leer el nombre.',
    resumen:
      'Antes de publicar nada hay que saber cómo te ves. Construimos tu identidad desde cero —o la ordenamos si ya existe— para que todo lo que salga de tu marca se reconozca al toque.',
    incluye: [
      'Identidad de marca y logotipo',
      'Manual de uso: colores, tipografías, aplicaciones',
      'Línea gráfica para redes',
      'Piezas para impresión y señalética',
      'Plantillas editables para tu equipo',
    ],
    detalle:
      'No entregamos un logo suelto y suerte. Definimos una línea gráfica completa —colores, tipografías, cómo se combinan— y te la dejamos documentada, con plantillas que tu equipo puede usar sin que todo se desarme a los dos meses.',
  },
  {
    slug: 'foto-video',
    titulo: 'Fotografía y video',
    gancho: 'Tu producto, mejor que a contraluz.',
    resumen:
      'Tu producto merece verse mejor que en una foto de celular a contraluz. Sesiones y reels grabados y editados por nosotrxs, pensados para el formato donde van a vivir.',
    incluye: [
      'Sesiones de foto de producto y espacios',
      'Reels y video vertical para redes',
      'Edición, color y musicalización',
      'Fotografía de equipo y marca personal',
      'Cobertura de eventos',
    ],
    detalle:
      'Grabamos pensando en dónde se va a ver. Un reel no se compone igual que una foto de catálogo, y una toma que funciona en horizontal se cae en vertical. Vamos con equipo propio a tu local, tu taller o donde pase la cosa, y vuelves con material que sirve por meses.',
  },
  {
    slug: 'publicidad-digital',
    titulo: 'Publicidad digital',
    gancho: 'Pauta que no quema presupuesto.',
    resumen:
      'Pauta que no quema presupuesto. Definimos a quién le hablas, cuánto inviertes y qué esperas que pase — y después te mostramos si pasó.',
    incluye: [
      'Campañas en Meta (Instagram y Facebook)',
      'Google Ads: búsqueda y display',
      'Segmentación y públicos personalizados',
      'Gestión de la inversión publicitaria',
      'Informes con métricas que se entienden',
    ],
    detalle:
      'Antes de poner un peso definimos qué cuenta como resultado: mensajes, visitas, ventas. Después armamos las campañas, las miramos seguido y movemos el presupuesto hacia lo que rinde. Los informes no son capturas de pantalla del panel: te decimos qué pasó y qué conviene hacer.',
  },
]

/*
 * Complementarios (nivel 2). No llevan página propia — refleja la jerarquía
 * real del negocio (DESIGN.md §8).
 *
 * `servicio` los ancla a la ficha del principal donde tienen sentido; los que
 * van en `null` solo aparecen en el índice, como bloque subordinado al final.
 */
export const complementarios = [
  {
    grupo: 'Web y tecnología',
    servicio: null,
    items: [
      'Tiendas online (e-commerce)',
      'Mantención web, hosting y dominios',
      'SEO local y Google Business Profile',
      'SEO técnico y velocidad',
      'Medición y analítica (GA4, GTM)',
      'Reportería y dashboards',
      'Automatizaciones e integraciones (WhatsApp, CRM)',
      'Email marketing',
    ],
  },
  {
    grupo: 'Estrategia y publicidad',
    servicio: 'publicidad-digital',
    items: [
      'Auditoría y diagnóstico digital',
      'Plan de estrategia de contenidos',
      'TikTok Ads',
      'Gestión de influencers y colaboraciones',
      'Gestión de reputación y reseñas',
    ],
  },
  {
    grupo: 'Coordinamos',
    servicio: 'foto-video',
    // Único grupo que no ejecutamos en casa: se coordina con terceros.
    externalizado: true,
    items: ['Tomas aéreas con dron DJI'],
  },
]

export function servicioPorSlug(slug) {
  return serviciosPrincipales.find((servicio) => servicio.slug === slug)
}

export function complementariosDe(slug) {
  return complementarios.filter((bloque) => bloque.servicio === slug)
}

// Los que no cuelgan de ninguna ficha: cierran el índice.
export const complementariosSueltos = complementarios.filter((bloque) => !bloque.servicio)

export const SLUGS_SERVICIOS = serviciosPrincipales.map((servicio) => servicio.slug)
