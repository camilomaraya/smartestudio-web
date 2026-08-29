# Smart Estudio — Brief para rediseño

Este documento describe **qué es el sitio y qué tiene que hacer**, no cómo se ve hoy. Está escrito para poder rediseñarlo desde cero en otra herramienta sin tener que leer el código ni heredar la estética actual.

Lo que sí describe el diseño vigente está en `DESIGN.md`; cómo está construido, en `ARQUITECTURA.md`. **Este archivo no depende de ninguno de los dos.**

> **Marca de contenido.** A lo largo del documento, cada texto lleva una de estas dos marcas:
> **`[REAL]`** — viene de la clienta o del material de la agencia. Es contenido definitivo, se conserva.
> **`[RELLENO]`** — lo escribí yo para poder maquetar. **Se reemplaza.** No tiene valor de contenido, solo de longitud y tono aproximados.

---

## 1. La marca

**Smart Estudio** es una agencia de marketing digital de **La Serena–Coquimbo, Chile**.

- **A quién le habla:** pymes y empresas grandes. El foco es regional, pero no excluyente — puede trabajar con clientes de cualquier parte.
- **Diferenciador principal:** cercanía y capacidad de adaptación. El servicio integral (que hace de todo bajo un mismo techo) es un factor secundario, no el argumento central.
- **Qué vende, en una frase:** que una marca deje de ser invisible para la gente que le interesa.

### Voz

Energética, directa, cercana. **Tuteo** ("puedes", "quieres"), nunca voseo. Frases cortas. **Lenguaje inclusivo** en los momentos de marca: "juntxs", "listx", "nosotrxs".

> ⚠ **La voz inclusiva no está confirmada por la clienta.** Es una decisión que quedó pendiente de revisión. Si se descarta, hay que reescribir los pocos lugares donde aparece — no es un cambio estructural.

### Equipo `[REAL]`

| Persona | Rol | Bio |
|---|---|---|
| **Abby Herrera** | Periodista y community manager | Crea el contenido mensual que permite a tu marca darse a conocer, generar confianza y atraer a su público. Siempre bajo lineamientos claros y disponible para tus solicitudes. |
| **Danae Reyes** | Diseñadora gráfica | Crea desde cero la identidad de tu marca. Su trabajo transmite ideas de forma visual, capta la atención y genera impacto. |
| **Abraham Flores** | Fotógrafo y filmmaker | Una imagen vale más que mil palabras. Saca todo el potencial de tu proyecto en cada sesión de foto y video para tus redes. |

### Datos de contacto `[REAL]`

- **WhatsApp:** +56 9 8164 9378
- **Correo:** contacto@smartestudio.cl
- **Dominio previsto:** smartestudio.cl *(sin confirmar)*
- **Redes:** Instagram, Facebook y TikTok — **las URLs no existen todavía**, hoy son enlaces vacíos.

---

## 2. Mapa del sitio

Cinco rutas. La nomenclatura es **"Proyectos"**, no "Trabajos", en URLs, menús y textos.

| Ruta | Qué es | Título principal |
|---|---|---|
| `/` | Home — recorrido largo, de presentación a conversión | Titular de marca |
| `/servicios` | Índice de los 4 servicios | Titular de la página |
| `/servicios/:slug` | Ficha de un servicio | Nombre del servicio |
| `/proyectos` | Índice de casos de clientes | Titular de la página |
| `/proyectos/:slug` | Ficha de un caso | Nombre del cliente |

**Por qué solo estos dos tienen página propia:** son los únicos con suficiente contenido para sostener un índice y fichas. Planes, Equipo y Contacto viven en el home y no justifican una página aparte.

**Presentes en todas las páginas:** navegación, formulario de contacto y pie. El formulario en todas las rutas es deliberado — el visitante puede convertir desde donde esté.

---

## 3. Qué tiene que hacer cada página

Descrito por función, no por maquetación.

### Home

Es un recorrido: de "no sé quiénes son" a "quiero hablar con ellos". El orden actual funciona y responde a una lógica de venta, no de estética:

1. **Quiénes somos** y qué se puede esperar (impacto de marca)
2. **Qué hacemos**, en una idea (por qué existe la agencia)
3. **Reencuadre del problema**: el visitante llega pidiendo una cosa y necesita otra
4. **Qué servicios ofrecemos**, con salida al detalle
5. **Prueba de trabajo real**, con salida a los casos
6. **Cuánto cuesta** (planes)
7. **Quiénes lo hacen** (equipo — pone cara al servicio)
8. **Cierre y llamada a la acción**
9. **Formulario**

El punto 3 es el que más diferencia al sitio: en vez de listar servicios de entrada, primero corrige una expectativa equivocada del visitante. Conviene conservar esa idea aunque cambie la forma (ver §7).

### `/servicios` y `/servicios/:slug`

**El índice** responde "¿hacen lo que necesito?". Cada servicio necesita mostrar: nombre, una frase que lo explique en lenguaje del cliente (no técnico), qué incluye concretamente, y salida a su ficha.

**La ficha** responde "¿cómo trabajan esto?". Necesita: el mismo párrafo del índice, cómo es el proceso, qué incluye, qué servicios complementarios se le pueden sumar, y salida a los otros servicios.

### `/proyectos` y `/proyectos/:slug`

**El índice** responde "¿a quién le han hecho esto y cómo les quedó?". Cada caso necesita **varias imágenes visibles antes de entrar a la ficha** — el visitante tiene que poder juzgar la calidad del trabajo sin hacer clic. Más nombre del cliente, servicios prestados y un párrafo humano sobre el trabajo.

**La ficha** responde "¿qué hicieron exactamente?". Es material visual con contexto: piezas reales, cada una acompañada del **criterio que hay detrás** — por qué se hizo así y qué problema resolvía.

> **Regla de contenido:** las fichas **no llevan métricas ni porcentajes**. Le conviene a Smart, que no tiene números que mostrar, y evita prometer resultados que después hay que sostener.

---

## 4. Contenido actual, transcrito

### Home — bloques de marca

| Bloque | Texto | Marca |
|---|---|---|
| Etiqueta superior | Agencia de marketing digital | `[REAL]` |
| Titular principal | **De aquí salen buenas ideas** | `[REAL]` |
| Bajada | Creamos relaciones entre tu marca y tu público. Tus metas son las nuestras. | `[REAL]` |
| Botones | "Conversemos" / "Nuestros planes" | `[REAL]` |
| Interstitial | "Nuestro trabajo es" → **Conectar** → "Tu marca con tu público" | `[REAL]` |
| Reencuadre | "Quiero más seguidores" → **"No queremos más seguidores. Queremos más clientes."** | `[RELLENO]` — la idea es buena, el texto exacto está sin aprobar |
| Cierre | **Comencemos a trabajar** | `[REAL]` |
| Frase del cierre | ¿Listx para despegar tus ideas? | `[REAL]` |

### Servicios

Los cuatro principales, con la descripción original del material de la agencia:

| Servicio | Descripción `[REAL]` |
|---|---|
| **Community Management** | Contenido mensual que da a conocer tu marca, genera confianza y atrae a tu público. Gestión de redes con lineamientos claros y métricas. |
| **Diseño gráfico e identidad** | Creamos desde cero tu línea gráfica e identidad de marca para transmitir tus ideas y captar la atención. |
| **Fotografía y video** | Producciones audiovisuales: sesiones de foto y reels profesionales que muestran lo mejor de tu negocio. |
| **Publicidad digital** | Campañas en Meta Business Suite y Google Ads, inversión publicitaria e informes con métricas para que tus metas se cumplan. |

> En el sitio actual estas descripciones **fueron reemplazadas** por versiones más largas que escribí yo (`[RELLENO]`), junto con listas de "qué incluye" y párrafos de "cómo trabajamos". **Las de la tabla de arriba son las auténticas**; si hay que elegir, mandan estas.

**Servicios complementarios** `[REAL]` — no llevan página propia, refleja la jerarquía real del negocio:

- **Web y tecnología:** tiendas online, mantención web/hosting/dominios, SEO local y Google Business Profile, SEO técnico y velocidad, medición y analítica (GA4, GTM), reportería y dashboards, automatizaciones e integraciones (WhatsApp, CRM), email marketing.
- **Estrategia y publicidad:** auditoría y diagnóstico digital, plan de estrategia de contenidos, TikTok Ads, gestión de influencers y colaboraciones, gestión de reputación y reseñas.
- **Coordinamos** (único servicio con terceros, y se dice explícitamente): tomas aéreas con dron DJI.

### Planes `[REAL]`

Precios referenciales "desde", **sin IVA**, todos adaptables. El plan **Smart** es el destacado.

| Plan | Desde | Incluye |
|---|---|---|
| **Despega**<br>*El inicio del marketing* | $400.000 | 10 posts · 1 sesión mensual · 6 gráficas de libre uso · línea gráfica e identidad · grilla de contenido · 1 campaña Meta · 2 reels · informe mensual |
| **Smart** ⭐<br>*De aquí salen buenas ideas* | $550.000 | 12 posts · 1 sesión fotográfica · 8 gráficas · línea gráfica e identidad · 1 campaña Meta · 1 campaña Google Ads (si se requiere) · 3 reels · informe mensual |
| **Marketing 360°** | $750.000 | 14 posts · 2 sesiones fotográficas · 10 gráficas · línea gráfica e identidad · 2 campañas Meta · 1 campaña Google Ads · 4 reels · sesión con dron y piloto · informe mensual · cobertura de eventos |
| **Full Marketing** | $1.290.000 | 18 posts · visita semanal para historias · 3 sesiones fotográficas · 12 gráficas · línea gráfica e identidad · 3 campañas Meta · 2 campañas Google Ads · 6 reels · 2 sesiones con dron · informe mensual · organización y cobertura de evento |

Nota al pie obligatoria: *"Valores referenciales desde el monto indicado. No incluyen IVA. Todos los planes son adaptables."*

### Proyectos

Cinco clientes. **Solo los nombres y rubros son reales**; todos los textos descriptivos y todas las imágenes son `[RELLENO]`.

| Cliente | Rubro | Permiso para publicar |
|---|---|---|
| **Villa Verla** | Arriendo de espacios para eventos | ✅ Sí — proyecto propio de Camilo |
| **Automotriz Carmona** | Taller y servicio automotriz | ❌ **Sin confirmar** |
| **La Rusia Barra Nikkei** | Gastronomía | ❌ **Sin confirmar** |
| **Veterinaria Larraín** | Salud animal | ❌ **Sin confirmar** |
| **Alfalfa Cakes** | Pastelería por encargo | ❌ **Sin confirmar** |

> ⚠ **Mostrar un cliente con nombre requiere su autorización.** Cuatro de los cinco no la tienen todavía. En el sitio actual están habilitados solo para poder maquetar, y hay un mecanismo de un solo interruptor por cliente que los saca de todo el sitio. **Cualquier rediseño debe conservar esa capacidad de ocultar un cliente sin romper nada.**

### Textos del formulario `[REAL]`

Título "Conversemos". Campos: nombre, email, empresa, mensaje. Al enviar bien, ofrece seguir por WhatsApp con un mensaje ya escrito.

---

## 5. Piezas funcionales obligatorias

Lo que el sitio **tiene que poder hacer**, independientemente de cómo se vea.

1. **Formulario de contacto que envía de verdad.** Backend propio en PHP con envío por SMTP autenticado, más doble anti-spam: un campo trampa oculto y verificación de Cloudflare Turnstile. Copia oculta a un correo de respaldo. Ya está construido y funcionando; **cambiar el diseño no debería obligar a rehacerlo**.
2. **Carrusel de piezas**, para el índice y las fichas de proyectos. Requisitos: navegable con teclado, posición visible y anunciada, **sin reproducción automática** (no debe competir con el scroll), y que **degrade a mostrar las imágenes** si el JavaScript falla.
3. **Navegación entre páginas** sin recarga completa.
4. **Índices y fichas** generados desde datos, no maquetados a mano: agregar un servicio o un proyecto debe ser editar un archivo de datos.
5. **Menú accesible desde cualquier página**, con enlaces a las secciones del home y a las páginas propias.

---

## 6. Requisitos no negociables

Estos condicionan la tecnología. Un rediseño que los rompa no se puede publicar.

- **Build estático.** El resultado son archivos que se suben por SFTP a un hosting DirectAdmin. **No hay servidor Node en producción**: lo único que corre del lado del servidor es un archivo PHP.
- **HTML real por cada ruta.** Cada página debe existir como HTML servible con su propio título, descripción y URL canónica. Una aplicación que entregue un HTML vacío y lo llene con JavaScript **no sirve**: el sitio es de una agencia de marketing y su posicionamiento no puede depender de eso.
- **Accesibilidad**, sin excepciones:
  - Objetivos táctiles de 44px mínimo (48px en campos de formulario).
  - Foco de teclado siempre visible; si se quita el contorno, hay que reemplazarlo por algo equivalente.
  - Un solo encabezado principal por página, con jerarquía coherente.
  - **Respetar `prefers-reduced-motion`**: con movimiento reducido, el sitio queda completo y legible sin animaciones.
  - Nada esencial comunicado solo por color o solo por movimiento.
- **Si el JavaScript falla, el contenido se ve igual.** Las animaciones se suman encima del contenido visible, nunca son la condición para verlo.
- **Sin dependencia de un servicio externo para funcionar.** Fuentes y assets se sirven con el sitio.
- **Español** en todo el contenido, y el sitio declara `lang="es"`.

---

## 7. Qué conviene no perder

Ideas que funcionan y costaron trabajo. **Son ideas, no maquetación**: se pueden rediseñar por completo mientras sobreviva el concepto.

- **El reencuadre del problema.** Que el sitio corrija la expectativa del visitante ("quiero más seguidores" → "queremos más clientes") en vez de limitarse a listar servicios. Es lo que diferencia el discurso de Smart del de cualquier agencia.
- **El "detrás" de cada pieza.** Mostrar trabajo acompañado del criterio que lo explica. Es lo que convierte un portafolio en un argumento de venta: cualquiera muestra fotos lindas, pocos explican por qué están hechas así.
- **La honestidad sobre lo externalizado.** El dron se coordina con terceros y el sitio lo dice. Es coherente con el diferenciador de cercanía.
- **Los servicios complementarios como nivel secundario**, no como catálogo plano: refleja la jerarquía real del negocio.
- **Un párrafo por cliente sirve para tres lugares** (índice, ficha y descripción para buscadores). Se escribe una vez. Evita mantener tres versiones que se desincronizan.
- **El plan Smart destacado** entre los cuatro.

---

## 8. Material pendiente

Nada de esto es código. Es lo que falta para que el sitio se pueda publicar de verdad.

**Bloqueante:**
- **Permisos de los 4 clientes** para aparecer con nombre.
- **Credenciales del formulario**: casilla SMTP de contacto@smartestudio.cl, correo de respaldo, y las dos claves de Cloudflare Turnstile.

**Contenido:**
- **Piezas reales de cada proyecto**: posts, reels, historias, informes y webs, en imagen y video. Hoy son 24 imágenes de relleno generadas por script.
- **Un párrafo real por cliente** (5).
- **Fotos del equipo** (3 personas). Hoy son iniciales en un círculo.
- **Textos definitivos de servicios**: qué incluye y cómo se trabaja cada uno.
- **Texto definitivo del reencuadre** del home.
- Decidir **qué va en el espacio reservado** de esa sección (hoy es un marco vacío a propósito).

**Marca y publicación:**
- **URLs de Instagram, Facebook y TikTok.**
- **Imagen para compartir en redes** y las etiquetas correspondientes: hoy compartir el link muestra un recuadro vacío.
- **Confirmar el dominio.**
- **Revisión de la voz inclusiva** por la clienta.
- Decidir si se incluyen **testimonios**: Smart no tiene, y la competencia directa de la región sí. Es un hueco identificado, sin decisión.

---

## 9. Contexto útil para decidir

- El sitio **ya pasó por un rediseño fallido** (julio 2026) que hubo que revertir entero. Se construyó completo a partir de un brief aprobado por escrito, sin que nadie viera el resultado renderizado hasta el final. La lección quedó anotada: **un cambio visual grande se valida viéndolo, en pasos, no aprobando una descripción**.
- El sitio nació como una sola página larga y se convirtió en multipágina cuando el contenido lo justificó. Volver a una sola página es posible, pero implica perder el posicionamiento por servicio y por caso, que es donde una agencia local compite.
- Hay un elemento visual pesado en la portada (un fondo animado que reacciona al cursor, con su versión liviana para móviles). **Es prescindible**: si un rediseño no lo necesita, se puede quitar sin tocar nada más.
