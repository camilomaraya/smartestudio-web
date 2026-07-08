// Servicios principales (tarjetas) y complementarios (bloque secundario).
export const serviciosPrincipales = [
  {
    id: 'community-management',
    titulo: 'Community Management',
    descripcion:
      'Contenido mensual que da a conocer tu marca, genera confianza y atrae a tu público. Gestión de redes con lineamientos claros y métricas.',
  },
  {
    id: 'diseno-grafico',
    titulo: 'Diseño gráfico e identidad',
    descripcion:
      'Creamos desde cero tu línea gráfica e identidad de marca para transmitir tus ideas y captar la atención.',
  },
  {
    id: 'foto-video',
    titulo: 'Fotografía y video',
    descripcion:
      'Producciones audiovisuales: sesiones de foto y reels profesionales que muestran lo mejor de tu negocio.',
  },
  {
    id: 'publicidad-digital',
    titulo: 'Publicidad digital',
    descripcion:
      'Campañas en Meta Business Suite y Google Ads, inversión publicitaria e informes con métricas para que tus metas se cumplan.',
  },
]

// Servicios complementarios (nivel 2), agrupados. "Coordinamos" es el único externo.
export const complementarios = [
  {
    grupo: 'Web y tecnología',
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
    items: ['Tomas aéreas con dron DJI'],
  },
]
