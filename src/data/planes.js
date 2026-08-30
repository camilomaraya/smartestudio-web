/*
 * Planes de Smart Estudio. Precios referenciales "desde", sin IVA.
 *
 * CONTENIDO REAL de la agencia: los precios, los nombres y las cantidades
 * salen de su material. Lo único que cambió respecto de la versión anterior
 * es la ORGANIZACIÓN: antes cada plan era una lista suelta de frases, y como
 * los cuatro describen las mismas categorías con distintas cantidades, ahora
 * están normalizados en filas comparables. No se agregó ni se quitó nada.
 *
 * `valores` usa tres formas:
 *   'texto'  → se muestra tal cual (una cantidad, o una aclaración)
 *   true     → incluido, sin cantidad que mostrar
 *   null     → no incluido en ese plan
 */

export const planes = [
  {
    id: 'despega',
    nombre: 'Despega',
    precio: '$400.000',
    tagline: 'El inicio del marketing',
    destacado: false,
  },
  {
    id: 'smart',
    nombre: 'Smart',
    precio: '$550.000',
    tagline: 'De aquí salen buenas ideas',
    destacado: true,
  },
  {
    id: 'marketing-360',
    nombre: 'Marketing 360°',
    precio: '$750.000',
    tagline: '',
    destacado: false,
  },
  {
    id: 'full-marketing',
    nombre: 'Full Marketing',
    precio: '$1.290.000',
    tagline: '',
    destacado: false,
  },
]

/*
 * Orden de las filas: primero lo que más se compara (volumen de contenido),
 * después producción, después pauta, y al final lo que está en todos los
 * planes. Una fila que dice lo mismo en las cuatro columnas no ayuda a
 * decidir, así que no puede ir arriba.
 */
export const categoriasPlanes = [
  {
    id: 'posts',
    etiqueta: 'Posts mensuales',
    valores: { despega: '10', smart: '12', 'marketing-360': '14', 'full-marketing': '18' },
  },
  {
    id: 'reels',
    etiqueta: 'Reels profesionales',
    valores: { despega: '2', smart: '3', 'marketing-360': '4', 'full-marketing': '6' },
  },
  {
    id: 'sesiones-foto',
    etiqueta: 'Sesiones fotográficas',
    valores: {
      despega: '1 mensual',
      smart: '1 mensual',
      'marketing-360': '2 mensuales',
      'full-marketing': '3 mensuales',
    },
  },
  {
    id: 'graficas',
    etiqueta: 'Gráficas de libre uso',
    valores: { despega: '6', smart: '8', 'marketing-360': '10', 'full-marketing': '12' },
  },
  {
    id: 'historias',
    etiqueta: 'Historias',
    valores: {
      despega: null,
      smart: null,
      'marketing-360': null,
      'full-marketing': 'Visita semanal',
    },
  },
  {
    id: 'campanas-meta',
    etiqueta: 'Campañas en Meta',
    valores: { despega: '1', smart: '1', 'marketing-360': '2', 'full-marketing': '3' },
  },
  {
    id: 'campanas-google',
    etiqueta: 'Campañas en Google Ads',
    valores: {
      despega: null,
      smart: '1 (si se requiere)',
      'marketing-360': '1',
      'full-marketing': '2',
    },
  },
  {
    id: 'dron',
    etiqueta: 'Sesiones con dron y piloto',
    valores: { despega: null, smart: null, 'marketing-360': '1', 'full-marketing': '2' },
  },
  {
    id: 'eventos',
    etiqueta: 'Eventos',
    valores: {
      despega: null,
      smart: null,
      'marketing-360': 'Cobertura',
      'full-marketing': 'Organización y cobertura',
    },
  },
  {
    /*
     * TODO CONFIRMAR CON LA AGENCIA: en el material original la grilla de
     * contenido aparece SOLO en Despega, el plan más barato. Lo más probable
     * es que sea un olvido al redactar los otros tres, pero se refleja tal
     * como está: corregirlo por cuenta propia sería inventar una condición
     * comercial. Si se confirma que va en todos, esta fila pasa a `true` en
     * las cuatro columnas y baja junto a las demás incluidas.
     */
    id: 'grilla-contenido',
    etiqueta: 'Grilla de contenido',
    valores: { despega: true, smart: null, 'marketing-360': null, 'full-marketing': null },
  },
  {
    id: 'identidad',
    etiqueta: 'Línea gráfica e identidad de marca',
    valores: { despega: true, smart: true, 'marketing-360': true, 'full-marketing': true },
  },
  {
    id: 'informe',
    etiqueta: 'Informe de métricas mensual',
    valores: { despega: true, smart: true, 'marketing-360': true, 'full-marketing': true },
  },
]

export const notaPlanes =
  'Valores referenciales desde el monto indicado. No incluyen IVA. Todos los planes son adaptables.'
