/*
 * Red del Manifiesto — los canales alrededor de CONECTAR y la card que
 * abre cada uno (hover, foco o toque).
 *
 * PENDIENTE, de contenido:
 * 1. Las imágenes son marcadores de posición (`public/placeholders/`).
 *    Los archivos reales van en `public/red/`; reemplazarlos es cambiar
 *    las rutas de acá.
 * 2. Reels no tiene video todavía: con `src` vacío la card muestra solo
 *    el `poster`. Al llegar el mp4, poner su ruta en `src`.
 * 3. Los `texto` son copy PLACEHOLDER en la voz de marca (tuteo).
 *
 * x / y son porcentajes de la sección. Tipos de card:
 *   imagen        { src, alt }
 *   video         { src, poster }
 *   mensaje       { autor, mensaje }   dibujada en código, sin foto
 *   notificacion  { app, mensaje }     dibujada en código, sin foto
 * Regla: las cards dibujadas no llevan cifras inventadas.
 */

const P = '/placeholders'

export const NODOS = [
  {
    texto: 'Tu marca',
    x: 12,
    y: 18,
    card: {
      tipo: 'imagen',
      src: `${P}/villa-verla-portada.svg`,
      alt: 'Identidad visual de Villa Verla',
      texto: 'Una identidad que se reconoce antes de leer el nombre.',
    },
  },
  {
    texto: 'Instagram',
    x: 50,
    y: 10,
    card: {
      tipo: 'imagen',
      src: `${P}/veterinaria-larrain-post-1.svg`,
      alt: 'Post de Instagram para Veterinaria Larraín',
      texto: 'Un feed que se ve como tu negocio, no como una plantilla.',
    },
  },
  {
    texto: 'Tu público',
    x: 88,
    y: 20,
    card: {
      tipo: 'mensaje',
      autor: 'camila.rojas',
      mensaje: '¿Tienen fecha libre en marzo? Somos 80 🙌',
      texto: 'Personas reales que te escriben, no solo seguidores.',
    },
  },
  {
    texto: 'Reels',
    x: 13,
    y: 52,
    card: {
      tipo: 'video',
      src: '',
      poster: `${P}/la-rusia-reel-1.svg`,
      texto: 'Lo que pasa detrás, contado en segundos.',
    },
  },
  {
    texto: 'Comunidad',
    x: 88,
    y: 54,
    card: {
      tipo: 'imagen',
      src: `${P}/alfalfa-cakes-post-1.svg`,
      alt: 'Publicación de Alfalfa Cakes con comentarios',
      texto: 'Comentarios y mensajes que no quedan en visto.',
    },
  },
  {
    texto: 'Campañas',
    x: 22,
    y: 86,
    card: {
      tipo: 'imagen',
      src: `${P}/automotriz-carmona-post-1.svg`,
      alt: 'Pieza de campaña para Automotriz Carmona',
      texto: 'Pauta con un objetivo claro y un mensaje que lo sostiene.',
    },
  },
  {
    texto: 'Ventas',
    x: 78,
    y: 86,
    card: {
      tipo: 'notificacion',
      app: 'WhatsApp',
      mensaje: 'Vi el reel, ¿cómo reservo?',
      texto: 'Del contenido a la consulta concreta.',
    },
  },
]
