# DESIGN.md — Smart Estudio

Sistema de diseño del sitio **multipágina** de **Smart Estudio**, agencia de marketing digital de La Serena–Coquimbo.
Este documento es la referencia al agregar páginas, secciones o componentes, para que todo siga leyéndose como una sola pieza.

> **Cómo leer este documento.** La mayoría describe lo que el código ya implementa. Lo que todavía no está construido va marcado con **`[pendiente]`** y el número de fase. Si algo lleva `[pendiente]`, **no existe en el código todavía**: es la regla que debe cumplir cuando se construya, no algo que se pueda importar hoy.
>
> **Estado:** rama `rediseno-editorial`. Hecho: tokens, nav mínima, hero editorial, interstitial Manifiesto, **sección F** (la frase que se corrige, con pin + scrub), CTA amplificado, grano global, toda la **infraestructura multipágina** —rutas y layout compartido (3a), transición entre páginas (3b), prerender + SEO por ruta (3c)— **Servicios** (5), **Proyectos** (6), **Planes** (7) y **Equipo + Contacto** (8). **El rediseño está completo: ya no queda ninguna sección de la versión anterior ni ninguna página stub.** Lo que falta para publicar es contenido y configuración, no diseño: ver §12. Cuando este documento describe un patrón nuevo, ese patrón manda por sobre lo que hoy haga una sección vieja.

---

## 1. Concepto

**Spotlight dorado sobre negro.** Un lienzo oscuro casi neutro donde el dorado aparece con cuentagotas y siempre significa algo: acento de marca, foco de atención o llamada a la acción. Nada decorativo compite con el contenido; el "brillo" es un recurso escaso.

Tres ideas que gobiernan las decisiones:

1. **Contraste, no ornamento.** Fondos planos, bordes de 1px, tipografía enorme. El impacto viene de la escala y del vacío, no de gradientes ni sombras de color.
2. **El dorado es información.** Si algo es dorado, es porque es acento, estado activo, dato clave o acción. Nunca relleno.
3. **El movimiento acompaña la lectura.** Cada animación existe para dirigir la mirada de arriba hacia abajo. Si se apaga el JS o el usuario pide menos movimiento, el sitio sigue completo y legible.

**Voz de marca:** energética, directa, cercana, con lenguaje inclusivo ("juntxs", "listx"). Tuteo. Frases cortas. No neutralizar el tono al escribir copy nuevo.

---

## 2. Tokens

Fuente única de verdad: `src/styles/tokens.css`. **Ningún valor de color, espaciado, radio o tipografía debe escribirse a mano en un módulo CSS** — si falta un token, se agrega ahí.

### Color

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#0a0a0a` | Fondo base y color de texto sobre dorado |
| `--bg-soft` | `#141414` | Acento puntual de superficie (hoy solo el CTA) y relleno de inputs |
| `--gold` | `#f3c13a` | Acento principal: acento de titular, botón primario, foco, hovers |
| `--gold-deep` | `#c9992e` | Dorado apagado para jerarquías terciarias |
| `--gold-soft` | `#ffe39a` | Dorado claro: hover del botón primario, labels sobre media |
| `--gold-echo` | `rgba(243,193,58,.25)` | Dorado fantasma. Solo para el eco de los interstitiales: texto que reverbera detrás del statement, no información |
| `--white` | `#ffffff` | Texto principal |
| `--muted` | `#8e8e8e` | Texto secundario, bajadas, listas de apoyo |
| `--gray-dim` | `#6b6459` | Gris apagado de la palabra tachada de F: texto que ya no vale. No es `--muted`, que es información secundaria pero vigente. Nunca lleva información |
| `--line` | `rgba(255,255,255,.1)` | Todos los bordes y separadores |

El único color fuera de la paleta es el rojo de error del formulario (`#f2685c`, en `Contacto.module.css`).

### Tipografía

Cuatro familias, cargadas desde Google Fonts en `index.html`. Hay una jerarquía de voces y no se saltan escalones:

- **`--font-titular` · Big Shoulders Display Black (900)** — la voz monumental. Solo para momentos que ocupan la pantalla completa: el titular del hero, los statements de interstitial, la frase de la sección F y el headline del CTA. Se aplica con la clase global `.titular`, no repitiendo la familia por módulo. Si algo lleva Big Shoulders, es porque esa pantalla existe para decir esa frase. **No tiene itálica** (sus ejes son peso, ancho y óptico): el acento dentro de un titular se hace con color, nunca con cursiva.
- **`--font-display` · Archivo** — titulares de sección y de página: `h1` de índice y ficha, `h2`, `h3`. Instancia fija: variable Expanded (`font-stretch: 125%`) + Black (`font-weight: 900`), mayúsculas, `letter-spacing: -0.02em`, `line-height: 1.04`. Aplicado globalmente a `h1, h2, h3` en `global.css`.
- **`--font-body` · Inter** — párrafos y textos largos. `line-height: 1.6`.
- **`--font-utility` · Space Grotesk** — la "letra chica con carácter": labels, botones, precios, badges, enlaces de nav, listas de servicios prestados en fichas. Casi siempre en mayúsculas con `letter-spacing` entre `0.04em` y `0.18em`.

Escala fluida con `clamp()`: `--text-xs` → `--text-3xl`, más:

| Token | Valor | Uso |
| --- | --- | --- |
| `--text-hero` | `clamp(2rem, 8.8vw, 7rem)` | Escala grande en Archivo Expanded, calibrada para que dos líneas no se partan |
| `--text-display` | `clamp(3rem, 10vw, 9rem)` | Escala monumental para `.titular` |
| `--lh-display` | `0.90` | Interlineado apretado del display; las líneas se tocan y forman bloque |

### Espaciado y layout

- Escala `--space-1` (4px) → `--space-9` (96px). No usar píxeles sueltos para separaciones.
- `--space-section: clamp(80px, 12vh, 160px)` es el `padding-block` de las secciones de contenido. Las secciones full-viewport (ver §4) no lo usan: se resuelven con `min-height: 100svh` y centrado.
- `--container: 1200px` con la utilidad `.container` (`width: min(var(--container), 100% - var(--gutter)*2)`); `--container-narrow: 820px` para bloques de lectura.
- `--gutter: clamp(1rem, 4vw, 2.5rem)`, `--nav-height: 70px` (también es el `scroll-padding-top` del documento). No existe una barra de nav: el token es el espacio que reservan los elementos fijos de la esquina superior.

### Grano global

- `--opacidad-grano: 0.03` (`tokens.css:78`).
- La capa vive en `body::before` (`global.css:30-48`): fija, sobre todo el sitio, con un SVG `feTurbulence` inline como data-URI.
- `baseFrequency: 0.8` y **`stitchTiles="stitch"` es obligatorio** — sin eso aparecen costuras cada 200px.
- Palancas de calibración: `baseFrequency` cambia el tamaño del grano, `--opacidad-grano` la intensidad. No se toca nada más de esa capa.

### Radios, sombras, easing

- Radios: `--radius-sm` 8px (inputs), `--radius-md` 14px (tarjetas), `--radius-lg` 22px (bloques anchos), `--radius-pill` (botones, badges, labels).
- `--ease-out: cubic-bezier(.22,1,.36,1)` y `--transition-fast: 220ms` para todas las micro-interacciones CSS.
- Sombras: `--shadow-lift` (elevación neutra) y `--shadow-gold` (glow del botón primario). Nunca sombras nuevas ad hoc.

---

## 3. Arquitectura del sitio

El sitio es **multipágina**. Servicios y Proyectos tienen índice y ficha propia; Planes, Equipo y Contacto viven en el home y no justifican página propia.

| Ruta | Qué | `h1` de la página |
| --- | --- | --- |
| `/` | Home (scroll largo) | Titular del hero |
| `/servicios` | Índice de servicios | Titular de página |
| `/servicios/:slug` | Ficha de servicio | Nombre del servicio |
| `/proyectos` | Índice de proyectos | Titular de página |
| `/proyectos/:slug` | Ficha de proyecto | Nombre del cliente |

La nomenclatura es **"Proyectos"**, no "Trabajos" — en URLs, en el nav, en los nombres de archivo y en el copy. La sección `Trabajos` de la versión anterior queda obsoleta (ver §5).

### Arquitectura elegida: React Router + prerender

Se descartaron:

- **SPA pura** — el HTML que sube al hosting queda vacío y se cae el SEO. Inaceptable para una agencia de marketing.
- **MPA estático puro** (múltiples entradas HTML en Vite) — SEO perfecto pero se pierde Lenis entre páginas y cada navegación es un refresh completo.

El prerender genera un HTML real por ruta al hacer build. Igual hace falta `.htaccess` con rewrite como fallback en DirectAdmin.

### Prerender: script propio, no plugin

`scripts/prerender.mjs` es **el único comando de build** (`npm run build`): construye el bundle de cliente, después un bundle **SSR** de `src/prerender.jsx`, lo ejecuta una vez por ruta e inyecta el HTML y el `<head>` en el `index.html` generado.

**Por qué no un plugin.** Se probó `vite-prerender-plugin` —el único del ecosistema que sigue mantenido y declara soporte de Vite 8— y **generaba el HTML correctamente**, incluso sobre Rolldown. El problema es su estrategia: ejecuta el bundle de **cliente** dentro de Node. El *scheduler* de React, en su build de navegador, abre un `MessageChannel` al cargarse; en Node ese `MessagePort` queda como handle activo y **`vite build` nunca termina** — el HTML sale bien y el proceso se cuelga para siempre (`EXIT 124`, no un error). Reproducido aislado: importar el chunk generado deja `handles: 1 ["MessagePort"]`.

Intentar esconder `globalThis.MessageChannel` durante el import **empeora la cosa**: sin él, el render toma otra rama que toca `window` y el build pasa de colgarse a fallar. No insistir por ahí.

Un bundle SSR no tiene ese problema: Vite externaliza las dependencias, Node resuelve `react-dom/server` a **`react-dom/server.node`**, que programa con `setImmediate` en vez de `MessageChannel` y no deja el event loop vivo.

> Si alguien vuelve a evaluar esto —y va a pasar, porque un plugin es menos código—: el criterio no es si genera bien el HTML (el plugin lo hace), es **si el build termina**.

**El build falla con código distinto de cero** si una ruta no se genera, sale vacía, no tiene `<h1>` o el contenido no queda dentro de `#root`. Un prerender que falla en silencio sube HTML vacíos al hosting sin que nadie se entere.

**Las rutas a generar viven en `src/lib/rutasPrerender.js`**, no en la configuración. La Fase 6 reemplaza esas dos constantes por los slugs de `src/data/` y no toca nada más. El catch-all no se prerenderiza: no es una página, es la respuesta a una URL que no existe.

### Lo que hay que excluir del prerender: nada

La sospecha inicial era que el hero WebGL, `three`, el canvas 2D de `atlasIconos`, Lenis, la cortina y `useRutaScroll` iban a necesitar guardas. **Ninguno resultó ser problema**, y el motivo es el principio del §6: *todo lo que toca el navegador se monta en efectos, y los efectos no corren en el servidor*.

- `HeroCanvas` es `lazy()` y `FondoIconos` devuelve `null` hasta que corre su efecto → `three` nunca se importa.
- `atlasIconos.js` sí se evalúa en Node, pero su nivel superior son constantes; el canvas se dibuja dentro de funciones que solo llaman los efectos.
- `new Lenis()` es lo único que revienta fuera del navegador, y vive en `initLenis()` ← `useLenis()` ← efecto.
- La cortina consulta `matchMedia` y `requestAnimationFrame` dentro de callbacks, no en render.

El único ajuste que hizo falta fue cambiar `useLayoutEffect` por su variante isomórfica en `useRutaScroll`, y solo para no emitir un warning de React en cada build.

**Ese hallazgo vale más que la lista de sospechosos: confirma que la regla 1 del §6 se paga sola.** Si algo revienta el prerender en el futuro, la corrección es moverlo a un efecto, no envolverlo en `typeof window !== 'undefined'`.

### Layout compartido

Envuelve todas las rutas y contiene, en este orden: **nav** (§5) → `<main>` con la ruta → **quiz de contacto** → **footer**.

**El cuestionario de contacto aparece en todas las páginas**, no solo en el home. Consecuencia: `server/contacto.php` recibe `origen` con la ruta desde la que se envió, para saber qué página convierte, y `servicio` con la respuesta del primer paso, que va también en el asunto del correo. Los dos son opcionales en el backend a propósito: un envío sin JavaScript puede no traerlos y eso no debe impedir el mensaje.

Lenis es instancia única y vive en el layout, no en las páginas: no se destruye al cambiar de ruta.

### SEO por ruta

`src/lib/seo.js` define `title`, `meta description` y `canonical` por ruta. **El título no se define ahí**: reutiliza el mismo `tituloDeRuta()` que usa el cliente al navegar (`hooks/useRutaScroll.js`), para que la pestaña y el HTML generado nunca digan cosas distintas.

Las descripciones de ficha son placeholders con la estructura final. En la Fase 6, la `meta description` de una ficha pasa a ser **el mismo párrafo de 2-3 líneas del cliente o servicio** que se usa en el índice y en la cabecera de la ficha (§8). Un párrafo escrito, tres lugares servidos.

Open Graph y Twitter siguen pendientes: falta la imagen social. El dominio de las canónicas (`https://smartestudio.cl`) está marcado con TODO hasta confirmarlo.

---

## 4. Ritmo de la página

**El ritmo no lo marca el fondo.** La alternancia `--bg` / `--bg-soft` fue el sistema de la versión anterior y quedó descartada: hoy casi todo el sitio es `--bg` y `--bg-soft` sobrevive como acento único de superficie en el CTA. Lo que marca la respiración es **la alternancia entre secciones de contenido y secciones full-viewport**: una pantalla completa con una sola idea tipográfica corta el scroll, deja aire y separa bloques mucho más fuerte de lo que lo hacía un cambio de gris.

### Ritmo del home

| Sección | Fondo | Tipo | Estado |
| --- | --- | --- | --- |
| Hero | `--bg` | Full-viewport (WebGL) | Hecho |
| Manifiesto (interstitial) | `--bg` | Full-viewport tipográfico | Hecho |
| **F** — la frase que se corrige | `--bg` | Full-viewport tipográfico, **fijada (pin)** | Hecho |
| Servicios | `--bg` | Contenido | Hecho |
| **E** — preview del "detrás" | `--bg` | Contenido (columna central) | Hecho |
| Planes | `--bg` | Contenido | Hecho |
| Equipo | `--bg` | Contenido | Hecho |
| CTA (cierre) | `--bg-soft` | Full-viewport tipográfico | Hecho |
| Contacto (cuestionario) | `--bg` | Contenido | Hecho |

**F reemplazó a la antigua sección Proceso** (el acrónimo SMART), ya eliminada del código junto con su ancla en nav y footer: se llamaba "Proceso" pero no describía ningún proceso, eran cinco adjetivos sin secuencia. Si el juego con el nombre de la agencia importa, puede sobrevivir como una línea en el footer o dentro de Servicios, sin ocupar pantalla.

**E reemplaza a la antigua sección Trabajos.**

### Ritmo de un índice (`/servicios`, `/proyectos`) `[pendiente]`

Cabecera de página (titular partido, ver abajo) → **lista vertical**, un bloque por ítem, uno debajo del otro → enlace de vuelta al home → quiz.

**No es una grilla.** Cada bloque de proyecto lleva su propio carrusel de 3-5 imágenes, de modo que el visitante ya vio varias fotos del caso antes de entrar a la ficha. Composición del bloque: carrusel → nombre del cliente (`h2`) → lista corta de servicios prestados en Space Grotesk (varía por cliente) → párrafo de 2-3 líneas en tono humano → doble enlace a la ficha.

### Ritmo de una ficha (`/proyectos/:slug`) `[pendiente]`

Cabecera (nombre `h1` + servicio `h2` + el mismo párrafo del índice) → carrusel grande → frase destacada en negrita + párrafo que la desarrolla → video con controles → imagen a ancho completo → párrafo de contexto (qué pidió el cliente, para qué se usó, qué formatos se entregaron) → más carruseles y videos alternados → "Explorar otros proyectos" con enlaces al resto → quiz.

### Secciones full-viewport

`min-height: 100svh` (no `100vh` — la barra del navegador móvil rompe el segundo), contenido centrado, sin encabezado estándar, sin `border-block`. Abren directo con el contenido. Llevan timeline propia (§6), no el reveal genérico.

### Estructura de sección de contenido (estándar nuevo)

Este patrón **reemplaza al estándar anterior** (`eyebrow` → `h2` → bajada → contenido). Viene del análisis de Agence Foudre e invierte el orden: la bajada explicativa va **después** del contenido, no antes.

```
<section id="…" class="{seccion}">
  <div class="container">
    <h2 class="{titularSeccion}" data-reveal-group>
      <span class="mascara"><span>Primera línea</span></span>
      <span class="mascara"><span>Segunda línea</span></span>
      <span class="mascara"><span class="acento">Fragmento final</span></span>
    </h2>

    … contenido …

    <p class="{bajada}">Bajada explicativa, opcional.</p>
  </div>
</section>
```

Reglas del titular de sección:

1. **Partido en 3-4 líneas cortas, una idea por línea.** No es un párrafo que hace wrap: cada línea es una decisión.
2. **El último fragmento va dorado** (`--gold`). Foudre lo hace en cursiva; acá el acento es color, porque Big Shoulders no tiene itálica y porque el dorado ya es el mecanismo de acento del sistema (el hero lo hace igual con "BUENAS IDEAS").
3. **Sin eyebrow.** El titular se sostiene solo. Foudre lo apoya con un tríptico de emojis; Smart no puede usar emojis (no calzan con oro-sobre-negro), así que la escala y el corte de línea tienen que hacer todo el trabajo.
4. **Familia:** `--font-display` (Archivo Expanded Black), a la escala de `h2` que ya define `global.css`. Si una sección necesita más peso sube a `--text-hero`; **no** sube a `.titular`, que está reservada para las full-viewport.
5. **Entrada:** una `.mascara` por línea, con stagger. Es el gesto por defecto, no un gesto "con carácter" (§6).
6. La bajada es `--muted`, `--font-body`, dentro de `--container-narrow`, y es opcional. Si no aporta nada, no va.

**Regla derivada de tarjetas:** las `.card` usan `--bg-soft` sobre fondo `--bg`, e invierten a `--bg` si alguna vez quedan sobre `--bg-soft`. La tarjeta siempre contrasta con su fondo.

---

## 5. Piezas compartidas

Viven en `src/styles/global.css` y se componen con la clase del módulo (`class="card ${styles.tarjeta}"`), no se duplican:

- **`.titular`** — la voz monumental: `--font-titular`, `font-weight: 900`, `font-size: var(--text-display)`, `line-height: var(--lh-display)`, mayúsculas. Para escalar un titular puntual por encima o por debajo de la escala base, **no se pelea especificidad contra `.titular`**: se **redefine `--text-display` en el propio elemento** (`.miTitular { --text-display: clamp(2rem, 7vw, 5rem) }`). El token es local al elemento y `.titular` lo lee. Este es el mecanismo oficial de ajuste de escala del display.
- **`.mascara`** — patrón de reveal por línea. Contenedor con `overflow: hidden` y `padding/margin-block: ±0.08em` (para no cortar acentos ni descendentes); adentro, un `<span>` por línea que entra con `yPercent: 110 → 0`, `power4.out`. Se usa en hero, interstitial, CTA y en los titulares de sección: **es el gesto estándar de entrada de cualquier titular.** Los elementos dentro de `.mascara` son la excepción a la regla de `clearProps` (§6). **Resuelve líneas, no palabras sueltas:** para revelar un `span` inline dentro de una línea va `clip-path`, no una máscara (el porqué, en "La sección F" del §6).
- **`.card`** — fondo `--bg-soft`, borde `--line`, radio `md`, padding `--space-6`. Al hover: `translateY(-4px)`, borde dorado y `--shadow-lift`.
- **`.card-numero`** — numeración/etiqueta dorada en Space Grotesk.
- **`.visually-hidden`** — texto solo para lectores de pantalla. **Todo contenedor con scroll horizontal que la contenga necesita `position: relative`.** Usa `position: absolute`, así que sin un ancestro posicionado se ancla al viewport y toma las coordenadas de su posición estática dentro del contenido desplazable: los 25 spans de la tabla de Planes llegaban a `right: 715` y metían scroll horizontal en toda la página, con el contenedor recortando bien y `body` midiendo lo correcto. Ver el comentario de `Planes.module.css`, que documenta el síntoma completo.
- **`.eyebrow`** — *deprecada como encabezado de sección.* El estándar nuevo (§4) no la usa. Se conserva porque sirve como etiqueta de bloques menores dentro de fichas (por ejemplo, "SERVICIOS PRESTADOS"). Si al cerrar la Fase 8 no quedó ningún uso, se elimina de `global.css`.

### Patrón statement / eco

El gesto propio de los interstitiales tipográficos, ya implementado en Manifiesto y reutilizable en los interstitiales que falten:

1. **Contexto** — línea corta en Archivo, `--muted`, escala chica ("NUESTRO TRABAJO ES").
2. **Statement** — una palabra o frase brevísima en `.titular` dorada, a escala monumental, entrando desde `.mascara`. Es el motivo de existir de la pantalla.
3. **Eco** — la continuación de la frase en `--gold-echo`, escala media, entrando después y más lento. No es información: es reverberación. Si el usuario no lo lee, no se pierde nada.

### Componentes

- **`Button`** (`src/components/ui/Button.jsx`) — dos variantes: `primary` (fondo dorado, texto `--bg`, glow al hover) y `ghost` (transparente, borde `--line`, se vuelve dorado al hover). Píldora, Space Grotesk 600, `min-height: 44px`, `translateY(-2px)` al hover y `scale(.98)` al presionar. Renderiza `<a>` si recibe `href`, si no `<button>`. **Al haber rutas, los enlaces internos pasan por el `Link` del router**, no por `<a href>` crudo: un `<a>` recarga la página entera y mata Lenis.
- **`Nav`** (`src/components/Nav.jsx`) — sin barra: el logo suelto a la izquierda (sin contenedor, porque es apaisado y blanco) y un único círculo dorado de 50px con la hamburguesa a la derecha, ambos fijos a `--gutter` de las esquinas superiores y alineados por centro óptico. No cambian con el scroll. La hamburguesa abre un panel fullscreen `--bg` sólido con los enlaces en Archivo Expanded 900 a `clamp(2rem, 5vw, 3.5rem)`, centrados verticalmente y alineados a la izquierda del container, más un pie con CTA y redes en Space Grotesk. Igual en desktop y mobile; bajo 375px los círculos bajan a 44px. El panel entra con fade (0.4s) + stagger de enlaces (0.08s, `y: 30 → 0`) y sale con fade de 0.3s; cierra con `Escape`, al scrollear o al elegir un enlace, con focus trap sobre círculos + panel.
  El nav tiene **tres tipos de enlace**: anclas que solo existen en el home (pasan por `irAAncla`, que navega primero si estás en otra ruta), la sección de contacto (scroll directo siempre, porque vive en el Layout y está en todas las rutas) y rutas reales (`/proyectos`, vía `EnlaceRuta`). El logo lleva al inicio del home. Footer aplica el mismo criterio.
- **Logo** — `public/logo-smart.png` (512×512, logotipo en la franja central del lienzo). Se usa en nav, footer y favicon. Token `--ancho-logo: clamp(140px, 17vw, 240px)`. **Ojo:** el `img { max-width: 100% }` global rompe los márgenes negativos que compensan el aire del PNG; los módulos que lo usan necesitan `max-width: none`.
- **Cuestionario de contacto** (`sections/Contacto.jsx`) — **sin JavaScript sigue siendo un formulario completo.** Los tres pasos están siempre en el DOM y el modo paso a paso se activa recién en un efecto, así que el HTML prerenderizado muestra los tres bloques seguidos con un único botón de envío. El cuestionario se suma encima; no es la condición para poder escribir (regla 1 del §6).
  > ⚠ **`.paso[hidden] { display: none }` es obligatorio.** El atributo `hidden` oculta con un `display: none` de la hoja del navegador, y **cualquier** regla de autor que declare `display` —acá, el `display: flex` del propio `.paso`— lo pisa. Sin esa línea los tres pasos se ven a la vez aunque el indicador diga "Paso 2 de 3". Se detectó mirándolo: por JS el atributo estaba correctamente puesto y la comprobación daba bien.

  Validación por paso antes de avanzar, con aviso en `role="alert"`; el foco va al título del paso nuevo (si no, el lector de pantalla se queda en el botón y no anuncia la pregunta); el progreso se comunica **también en texto**, porque los números dorados no le dicen nada a un lector de pantalla; y lo escrito se conserva al volver atrás. El honeypot y Turnstile siguen intactos: el contrato con el backend no cambió, solo se le sumaron dos campos.
- **`Carrusel`** (`components/Carrusel.jsx`) — implementado a mano, sin librería. La pista es **scroll horizontal nativo con `scroll-snap`**, no un transform manejado por JS: sin JS las piezas siguen visibles y arrastrables, y los controles se suman encima. La posición se lee del `scrollLeft` real —el hijo cuyo `offsetLeft` está más cerca del borde—, no de un índice que el JS crea tener, así que el dedo, la rueda y los botones dejan siempre el mismo estado. **No se calcula por ancho promedio a propósito:** las piezas tienen proporciones distintas (un reel 9:16 y un post 4:5 no miden igual) y esa cuenta se desalinea. Sin autoplay; posición anunciada como texto además de los puntos, porque un punto dorado no le dice nada a un lector de pantalla.
- **Tarjeta de trabajo** (`Trabajos.module.css`) — **obsoleta.** El formato `aspect-ratio: 4/5` en grilla no se usa en el diseño nuevo: el índice es lista vertical con carrusel y el home muestra E. Lo que **sí se rescata** es su mecanismo de parallax —capa `.media` con zoom `scale(1.06)` al hover y capa interna `.mediaFondo` sobredimensionada (`inset: -8% 0`) que lleva el `scrub`—, reutilizable en las piezas de E y en los carruseles. El módulo se elimina o se renombra a `Proyectos.module.css` cuando se construya la Fase 6.

---

## 6. Movimiento

Stack: **Lenis** (scroll suave) + **GSAP/ScrollTrigger**. Instancia única de Lenis en `src/lib/lenis.js`, manejada por el ticker de GSAP (`gsap.ticker.add`) y sincronizada con `lenis.on('scroll', ScrollTrigger.update)`, con `lagSmoothing(0)`. La navegación interna usa `scrollToSection()`, que cae al `scrollIntoView` nativo cuando Lenis está desactivado.

### Reglas no negociables

1. **Todo lo animado nace visible.** El estado oculto se aplica con `gsap.set()`, nunca con CSS. Si el JS falla, la página se ve completa.
2. **Todo va dentro de `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`.** Con movimiento reducido: sin Lenis, sin reveals, sin marquee, sin el pin de F (`global.css` además recorta transiciones y animaciones a 0.01ms). Se verifica **ejecutando** ese camino, no deduciéndolo: la forma barata es invertir la consulta a `reduce` en el componente, mirar el resultado y revertir.
3. **`clearProps: 'opacity,transform'` al terminar**, para que los estilos inline no pisen los hovers CSS. **Excepción:** los `<span>` dentro de `.mascara` conservan su transform final; limpiarlos los devuelve al `yPercent` del CSS.
4. **Reveals una sola vez** (`once: true`, `start: 'top 85%'`). Nada re-anima al volver a subir. Las secciones full-viewport disparan más tarde (`start: 'top 70%'`), porque su contenido está centrado y no arriba.

### Ciclo de vida entre rutas

1. **Cada sección monta su animación dentro de un `gsap.context()`** con el ref de la sección como scope, y revierte en el cleanup. `useGSAP()` de `@gsap/react` ya hace exactamente esto: no hace falta escribirlo a mano.
2. **Al cambiar de ruta:** `useRutaScroll` resetea el scroll a 0 (`immediate`) en `useLayoutEffect`, antes de pintar la ruta nueva.
3. **Después de montar la ruta nueva**, tras doble `rAF`: `ScrollTrigger.refresh()`.
4. **Lenis no se destruye** al navegar: vive en el layout compartido (§3).
5. **Las anclas del home desde otra ruta** navegan con `state.scrollTo` y `Home` hace el scroll al montar (`lib/navegacion.js`).

### Cuatro trampas que ya costaron caro

Encontradas depurando las fases 3a, 3b y 5. Las cuatro reaparecen solas en cuanto se anima o se navega algo nuevo:

1. **`fromTo` con `y: 0` explícito en los titulares con `.mascara`, nunca `set` + `to` de solo `yPercent`.** GSAP guarda `y` (px) y `yPercent` como componentes separadas **y las suma**: bajo el doble montaje de StrictMode, la segunda pasada lee el `translateY` que dejó la primera como `y` y le suma otra vez el porcentaje. El titular termina al doble de desplazamiento, invisible detrás de su propia máscara.
2. **Después de cambiar de ruta, cualquier `scrollTo` necesita `getLenis()?.resize()` antes.** Lenis cachea el límite de scroll y **clampea todo destino a ese valor**; al llegar desde otra ruta ese límite es el que midió en la ruta anterior, así que el scroll se detiene siempre en el mismo punto sin importar la sección pedida. **Esto va a reaparecer en la Fase 6** con los enlaces internos de las fichas.
3. **El reset de scroll entre rutas necesita `lenis.resize()` + `force: true`, no solo `scrollTo(0)`.** Lenis cachea el límite de scroll y su estado interno sigue apuntando a la posición de la ruta anterior; sin remedir, su siguiente frame reescribe esa posición —clampeada al alto nuevo— encima del reset.
*Síntoma:* entrar a una ficha desde un home scrolleado deja al visitante a mitad de la página nueva, sin haber visto la cabecera, y el número no es azaroso: es exactamente `altoNuevo − viewport`. Encontrado y corregido en la Fase 5 (`useRutaScroll.js`); estaba desde la 3a. Como `ScrollTrigger.refresh()` restaura la posición que encontró al empezar, el reset se **reafirma después** del refresh, salvo cuando la ruta pide un ancla.
4. **La transición se salta si `document.hidden`, y `visibilitychange` salta la timeline a su estado final.** Con la pestaña en segundo plano el navegador congela los `rAF`: sin esto la timeline queda a medias, la navegación sin completar y el flag de "en curso" trabado, con lo que ningún enlace vuelve a responder.

### Transición entre páginas

`src/components/Transicion.jsx` — **cubrir, después navegar**. La cortina entra desde abajo (420 ms), y recién con la pantalla cubierta se llama `navigate()`: ahí ocurren el reset de scroll y el `refresh()` sin que se vea el salto. Después sale hacia arriba (420 ms).

**La duración no siempre es la misma, y el porqué importa:**

- **Navegación normal** (a `/proyectos`, a una ficha): **900 ms fijos** — 420 + 60 de respiro + 420. La salida va encadenada en la misma timeline; no espera nada. Este es el camino por defecto.
- **Navegación a un ancla del home**: **variable, con tope de ~1300 ms.** Acá la página nueva tiene que montar *y* saltar a la sección antes de que se levante la cortina, y esa cadena —montar, esperar el `refresh` de ScrollTrigger, esperar a que la sección deje de moverse, `resize` de Lenis, saltar— tarda del orden de 430 ms después de cubrir. Con la duración fija de 900 ms el salto caía **fuera** de la ventana cubierta y se veía. Por eso `Home` emite una señal (`avisarScrollListo()`) cuando terminó de saltar, y la cortina espera esa señal para destapar.

**Reglas de esa espera:**

1. **Tope de seguridad obligatorio.** Si la señal no llega, la cortina se levanta igual. Ninguna cortina puede quedar colgada esperando un evento que no llegó — mismo criterio que el respaldo de 500 ms del scroll al ancla. El primero que llegue (señal o tope) cancela al otro: `destapar()` es idempotente por bandera y limpia el `setTimeout`.
2. **Solo cuando hay ancla.** Se detecta por `opciones.state.scrollTo` en `navegarCon`. Una navegación normal no espera nada.
3. **La señal es opcional por diseño.** `avisarScrollListo()` es seguro de llamar siempre: si no había espera —navegación normal, o `prefers-reduced-motion`, donde nunca se montó cortina— no hace nada. El camino sin cortina **no puede depender de ella en absoluto**.

**Al llegar por ancla desde otra ruta, la sección destino aparece ya revelada.** Es intencional: el reveal es para descubrir algo al scrollear hacia ello, y acá el usuario pidió ir. No se acopla el reveal a la cortina — esa independencia se preserva a propósito, y el reveal debe seguir funcionando igual sin transición alguna.

- El nombre de la ruta destino va centrado en `.titular` **blanco, no dorado**: esto pasa en cada navegación y el dorado es escaso. La cortina entera es `aria-hidden`; el cambio de página lo anuncian el `document.title` y el foco al `<main>`.
- **`EnlaceRuta`** renderiza un `<a href>` real con `preventDefault` encima, y **no intercepta** con `meta`/`ctrl`/`shift`/`alt` ni con botones que no sean el izquierdo — si no, se rompen "abrir en pestaña nueva" y el click con la rueda. El `href` real además lo necesita el prerender para rastrear rutas.
- Una transición a la vez: lo que se dispare durante otra se ignora, no se encola. `POP` (atrás/adelante) es instantáneo y corta cualquier transición en curso.
- **La cortina nace oculta desde CSS.** Si el JS falla, nunca aparece y los `<a href>` navegan igual: la transición se suma encima, no es la condición para ver la página.
- **El salto a un ancla del home desde otra ruta es instantáneo** (`scrollToSection(target, { inmediato: true })`), porque ocurre detrás de la cortina y el usuario no vio el arranque: no hay continuidad espacial que preservar. Las anclas *dentro* del home siguen con scroll suave, donde el recorrido sí comunica distancia.

### Reveal estándar

Hook `useReveal()` (`src/hooks/useReveal.js`): fade + `y: 24 → 0`, `0.8s`, `power3.out`, stagger `0.12`. Se marca con atributos en el JSX:

```jsx
const scope = useReveal()
<section ref={scope}>
  <p data-reveal>…</p>              {/* elemento individual */}
  <div data-reveal-group>…</div>    {/* anima sus hijos directos en cascada */}
</section>
```

Las secciones full-viewport **no** usan este hook: llevan timeline propia, porque necesitan control de tiempos entre piezas.

### Momentos con carácter

Cada sección tiene, como mucho, un gesto propio por encima del reveal base:

- **Hero** — intro al montar: eyebrow → titular → bajada → CTAs. El titular sube por línea desde `.mascara`. Copy: "DE AQUÍ SALEN BUENAS IDEAS", con "BUENAS IDEAS" en dorado (split de color dentro del mismo titular). **Imán:** el titular va partido letra por letra (el `aria-label` del `h1` conserva la frase) y, al terminar la intro, las letras a menos de 220px del cursor se levantan hasta un 25% de su alto y se inclinan hasta 12° hacia él (`gsap.quickTo`, posiciones cacheadas y re-medidas en resize). Recién ahí se libera el `overflow` de las máscaras, para que las letras puedan salirse. Solo con hover y sin reduced-motion. Se descartaron resorte, chispazo, linterna y decodificado.
- **Manifiesto** — interstitial tipográfico full-viewport, patrón statement/eco. Timeline propia con `start: 'top 70%'`, `once`. Timing calibrado: statement `duration: 1.4` en `t=0.4` (lento a propósito, para darle peso), eco en `t=1.5`.
- **F** — la sección **se fija y la frase se corrige atada al scroll**. Tres estados en dos bloques de texto apilados en la misma celda de grid (`grid-area: 1/1`, para que la sección mida lo que el más alto y el cambio no produzca reflow): el bloque A son los estados 1 y 2 —"QUIERO MÁS SEGUIDORES", donde SEGUIDORES se tacha y queda en `--gray-dim` mientras CLIENTES entra en dorado— y el bloque B es el estado 3, la frase que reemplaza a la anterior. Dos columnas: texto a la izquierda, **espacio reservado** a la derecha. Las decisiones que la sostienen están abajo, en "La sección F"; ninguna es cosmética.
- **Servicios** — el gesto es **el índice trazándose**: cada regla horizontal se dibuja de izquierda a derecha (`scaleX: 0 → 1`) y su fila entra un beat después. La precedencia importa: primero la línea, después el contenido — al revés el gesto no se lee, parece un reveal más. Cuatro filas de nombre grande, no tarjetas: la grilla de `.card` era el formato viejo y compite con el vacío. La regla es un `<span>` propio y no un `border-top` porque un borde no se puede escalar desde un origen.
- **E** `[pendiente — Fase 6]` — columna central angosta por donde pasan piezas reales de contenido (post, reel, historia, informe, web), con texto tipográfico alternando izquierda y derecha que explica el trabajo invisible detrás de cada una. El zigzag es el gesto; parallax leve sobre las piezas. Cierra con enlace a `/proyectos`.
- **Índice de proyectos** `[pendiente]` — el carrusel por bloque es el gesto; nada más compite.
- **Equipo** — tres **retratos verticales grandes sin caja**, con el texto debajo; ya no es una grilla de `.card` con avatares circulares. En una agencia de tres personas el equipo *es* el producto, y un círculo de 80px con iniciales no comunica eso. El marco ya tiene su proporción 3:4 y hoy lo ocupa un placeholder con iniciales sobre trama diagonal —misma familia visual que los placeholders de proyectos, para que se lea como "material pendiente" y no como un error—: cuando lleguen las fotos se reemplaza el contenido del marco y el layout no se mueve. **El gesto:** cada retrato se descubre de abajo hacia arriba con `clip-path` y su texto entra después.
- **Contacto** — **cuestionario de 3 pasos** (qué necesitas / quién eres / contanos). Un formulario de cuatro campos en blanco pide un esfuerzo que mucha gente no hace; tres preguntas cortas bajan el costo de empezar, y la primera respuesta ya dice a qué servicio apunta el interesado. Detalles en §5.
- **Planes** — **tabla comparativa**, no cuatro tarjetas: los planes describen las mismas categorías con distintas cantidades, y lo que alguien hace frente a planes escalonados es compararlos; en tarjetas hay que ir y volver cuatro veces para responder "¿cuántos reels trae cada uno?". Es una `<table>` real con `th scope` —son datos tabulares y un lector de pantalla debe poder anunciar "Reels profesionales, Smart, 3"—, dentro de un marco desplazable que recibe foco para poder recorrerla con teclado. El gesto se conserva de la versión anterior: las columnas entran escalonadas y **la destacada un beat después**, porque la jerarquía se comunica con el tiempo en vez de sumando otro color.
- **Equipo** — avatares con `scale: .85 → 1`. *(Sección de la versión anterior.)*
- **CTA** — cierre full-viewport: headline "Comencemos a trabajar" ("trabajar" en dorado) en `.titular`, subiendo desde `.mascara` (`power4.out`, 0.9s), botón 0.4s después, y debajo el marquee infinito de 30s (`translateX(-50%)` sobre 4 copias = loop perfecto), con `playbackRate` modulado por `lenis.velocity` vía Web Animations API. Las frases alternan blanco y dorado.
- **Hero 3D** — ver §7.

### La sección F (`components/Correccion.jsx`)

Es la pieza más cargada de trampas del sitio y **el primer pin del proyecto**. Cada punto de acá se documenta con el síntoma, no solo con la regla: sin el síntoma, el siguiente que pase lo deshace porque "se ve igual".

**1. El estado en reposo del CSS es el estado FINAL, no el inicial.** El bloque B nace visible y el bloque A nace en `opacity: 0`; el JS invierte eso con `gsap.set()` al inicializar y la timeline vuelve al reposo. Es al revés que en todo el resto del sitio, y es la única excepción real a "todo nace visible" (§6, regla 1).
*Síntoma si se invierte:* con el JS caído, el visitante se queda leyendo **"QUIERO MÁS SEGUIDORES"** —exactamente el mensaje contrario al que la sección existe para dar— y nada indica que estaba por corregirse. Un fallo silencioso que además publicita lo opuesto al servicio.

**2. `aria-hidden="true"` en el bloque A completo, no solo en la palabra tachada.** La corrección es un gesto **puramente visual**: el tacho es una línea dibujada, no tiene equivalente sonoro.
*Síntoma si se expone:* un lector de pantalla lee el mensaje **dos veces, con dos redacciones distintas y sin ninguna señal de que la primera quedó superada** — "quiero más clientes… no queremos más seguidores, queremos más clientes". Suena a error de contenido, no a recurso retórico. Solo el bloque B (el `h2`) queda expuesto.
El `aria-hidden` de `.tachada` **se conserva aunque hoy sea redundante por herencia**: si alguna vez el bloque A dejara de estar oculto entero, la palabra tachada tiene que seguir fuera del árbol por sí sola.

**3. `clip-path` para la palabra dorada, no `.mascara`.** `.mascara` es `display: block` y resuelve el reveal **a nivel de línea**; la palabra que entra es un `span` inline en medio de una línea.
*Síntoma si se usa `.mascara`:* convertir el span en bloque lo saca del flujo de la línea y descuadra la baseline contra la palabra tachada de al lado. Con `clip-path` la palabra ocupa su espacio desde el principio y solo se revela: **cero reflow al aparecer**.

**4. Dos ScrollTriggers separados, y no se pueden fusionar.** Uno de entrada (`once`, máscaras por línea, conserva su `clearProps: 'transform'`) y otro de `pin` + `scrub`. La timeline del scrub **no lleva `clearProps` en ninguna parte**.
*Síntoma si se mezclan:* el scrub reproduce la timeline **hacia atrás** al subir, y `clearProps` borra los estilos inline al terminar — la timeline se queda sin estado que revertir y al subir la frase no vuelve, queda congelada en el último estado.

**5. Los colores se resuelven con `getComputedStyle`, no se pasan como `var()` al tween.** GSAP no interpola custom properties de color.
*Síntoma si se pasa `var(--gray-dim)` directo:* el color no se interpola, **salta de golpe al final del tween**; con scrub ese salto queda amarrado a un punto exacto del scroll y se ve entero, en vez de la transición gradual que el gesto necesita. Los tokens siguen siendo la fuente de verdad: se **leen** al inicializar y se pasan ya resueltos.

**6. En el marco reservado manda la ALTURA; el ancho sale de la proporción.** `height: min(56svh, 520px)` + `aspect-ratio` + `justify-self: center` (que lo libera del stretch de la grilla).
*Síntoma al revés:* con `aspect-ratio` aplicado sobre el ancho de columna, el marco medía 720px y **empujaba la sección a 886px contra un viewport de 639px**. Con el pin en `start: 'top top'`, la sección fijada excede el viewport y **el contenido de abajo queda cortado bajo el fold, sin forma de scrollear hasta él** porque justamente está pinneada.

**7. El pin depende de que ningún ancestro tenga `transform`, `filter`, `will-change` ni `contain`.** No agregar ninguno a `main`, `#root` ni `#inicio`.
*Síntoma:* cualquiera de esas propiedades crea un contexto de contención que **rompe el `position: fixed`** con el que ScrollTrigger fija la sección. No lanza error: el pin simplemente deja de pegar y la sección scrollea de largo con la timeline a medias. Verificada la cadena completa de ancestros al construir.
Lenis usa **scroll nativo** (`new Lenis()` sin wrapper, sincronizado con `lenis.on('scroll', ScrollTrigger.update)` + el ticker de GSAP), así que **no hace falta `scrollerProxy`**. Si algún día Lenis pasa a scrollear un wrapper con transform, este pin es lo primero que se cae.

**Datos y tipos de token.** El copy vive como estructura de datos (`BLOQUE_A` / `BLOQUE_B`: array de líneas, cada línea un array de tokens), para que cambiar la frase sea editar datos y no maquetado. Cuatro tipos: `estable`, `tachada`, `entra` y **`acento`** (dorado sin animación, el del bloque B). `acento` existe aparte a propósito: reusar `entra` habría enganchado las palabras del bloque B al `gsap.set` del `clip-path`.

**Movimiento reducido: sin pin y sin scrub.** Todo el bloque vive dentro de `matchMedia('(prefers-reduced-motion: no-preference)')`, así que con movimiento reducido no se crea el pin ni el `pin-spacer` y la sección queda como un bloque normal de `100svh` **mostrando el estado 3**. Es la decisión, no un olvido: el mensaje final ya es el reposo. **Probado en ejecución**, no deducido.

**Escala.** La columna de texto es ~mitad de ancho, así que la sección define su propio `--text-display-f` y lo aplica vía `--text-display` en el elemento (§5). **No se toca `--text-display` global**, que lo usa Manifiesto.

### Nota de composición pendiente

Hero e interstitial quedaron **centrados**. F es la primera pantalla que usa la **asimetría editorial** —texto corrido a la izquierda, contrapeso vacío a la derecha— y confirma que la palanca funciona a esta escala. Sigue disponible para cualquier pantalla que necesite más tensión sin sumar elementos.

---

## 7. Fondo del hero (WebGL)

`src/sections/hero3d/` — campo de íconos de marketing que reacciona al cursor. Es el único elemento "rico" del sitio y está construido para no costar nada cuando no aplica.

- **`FondoIconos.jsx`** — decide si el dispositivo califica y hace lazy import del chunk de three.
- **`HeroCanvas.jsx`** — Canvas de R3F, `dpr` máximo 1.75, con IntersectionObserver que congela el frameloop cuando el hero sale del viewport. Si el FPS promedio cae bajo 45, baja el `dpr` a 1 una sola vez (`VigilanteRendimiento`, hecho a mano: drei se sacó porque nunca se usó).
- **`CampoIconos.jsx`** — un `InstancedMesh` de ~390 quads (**1 draw call**), repartidos en tres capas de profundidad con una grilla con jitter por capa (un ícono por celda, corrido al azar dentro de ella): sin huecos grandes ni amontonamientos. El total sale de las grillas según el aspecto, con tope `CANTIDAD_MAX = 480`. Drift ambiente y reacción al cursor se calculan en el vertex shader; la CPU solo lerpea tres valores por frame.
- **`atlasIconos.js`** — atlas 1024×512 (8×4 celdas de 128px, 28 íconos) dibujado en canvas 2D con glyphs de Font Awesome, todos siluetas sólidas: a ese tamaño y opacidad los de trazo fino se deshacen. **No debe importar three**: lo comparte el fallback y arrastraría three al bundle principal. `crearPatronIconos()` genera además un PNG tileable con los mismos íconos, sin WebGL.
- **Fallback** (`TexturaEstatica.jsx`) para mobile ≤860px, táctiles de baja potencia, sin WebGL o con movimiento reducido: tile PNG generado en canvas repetido + drift CSS + brillo radial.
- **Sustrato CSS**: `.canvasFondo` lleva un `radial-gradient` dorado al 8% que queda debajo del canvas y funciona como versión mínima si nada se monta.

**Diales del spotlight** (uniforms en `crearMaterial`): `uRadio 2.4`, `uFalloff 1.8`, `uIntensidad 0.85`, `uEscalaCursor 0.3`, `uAlfaExtra 1.4`, base `#6a6a6a` a `uOpacidad 0.45`, tiñendo hacia `--gold` y, en el centro, `--gold-soft`. Estos valores son el punto a tocar para calibrar la sensación; el resto del shader no debería necesitar cambios.

El canvas tiene `pointer-events: none`: el tracking del cursor se hace en `window` y el glow DOM se mueve con `gsap.quickTo`, sin draw calls extra.

**El campo de íconos es momento único del hero.** No se replica como fondo de otras secciones: el vacío del resto del sitio se resuelve con escala, asimetría y color de superficie, no llenando el fondo de marca.

> El gris base `#6a6a6a` está **hardcodeado en dos lugares que deben quedar sincronizados**: `atlasIconos.js:135` (`ctx.fillStyle`) y `CampoIconos.jsx:44` (`uColor`). Si alguna vez se cambia el tono, se cambian los dos.

> **Prerender:** este bloque queda excluido del prerender (§3). `three` no corre en Node.

---

## 8. Contenido y datos

### Modelo de datos `[pendiente — Fase 6]`

**`src/data/proyectos.js`**

| Campo | Qué |
| --- | --- |
| `slug` | `villa-verla` |
| `nombre` | Villa Verla |
| `servicios` | Array de slugs de servicio |
| `resumen` | 2-3 líneas — sirve para índice, ficha y `meta description` |
| `portada` | Imagen del índice |
| `piezas` | Array de `{ tipo, formato, src, titulo, detras }` |

`tipo`: post / reel / historia / informe / web. `formato`: imagen o video. `detras`: el texto del zigzag de la sección E.

**`src/data/servicios.js`** `[hecho — Fase 5]` — `slug`, `titulo`, `gancho` (línea corta para la fila del home, donde no cabe el resumen), `resumen`, `incluye` (array) y `detalle`. Expone además `servicioPorSlug()`, `complementariosDe()` y `SLUGS_SERVICIOS`, que es de donde el prerender saca las rutas.

> **`rutasPrerender.js` importa con extensión `.js` explícita**, a diferencia del resto del código: `scripts/prerender.mjs` lo carga con Node directamente, sin pasar por Vite, y el resolvedor de ESM de Node no completa extensiones. Sin ella el build muere en `ERR_MODULE_NOT_FOUND` antes de compilar nada. Vale para cualquier módulo que ese script llegue a importar.

Los complementarios llevan un campo `servicio` que los ancla a la ficha donde tienen sentido; los que van en `null` cierran el índice como bloque subordinado.

Los cuatro principales llevan ficha propia: community management, diseño gráfico e identidad, fotografía y video, publicidad digital. Los externalizados (web, SEO, analítica) quedan como lista dentro de la ficha que corresponda, **sin página propia** — refleja la jerarquía real del negocio.

### Reglas de contenido

1. **Un párrafo por cliente sirve para tres lugares:** índice, cabecera de ficha y `meta description`. Se escribe una vez, en tono humano —habla del rubro y de la sensación del trabajo—, y se reutiliza. No se escriben tres versiones.
2. **Las fichas no llevan métricas ni porcentajes.** Es material visual con texto de contexto. Le conviene a Smart, que no tiene números que mostrar, y evita prometer resultados que después hay que sostener.
3. **La sección E usa piezas de clientes distintos a los de las fichas.** El home muestra variedad, las fichas muestran profundidad. Si se repiten, el sitio se siente más chico de lo que es.
4. **Cada cliente necesita permiso explícito para aparecer con nombre.** Sin nombre, la ficha pierde la mitad del valor. Villa Verla es proyecto propio de Camilo y sirve de piloto; el resto son de Abby.

---

## 9. Accesibilidad

- **Objetivos táctiles de 44px mínimo** en botones, enlaces de nav, enlaces de contacto e inputs (48px).
- **Foco visible global**: `outline: 2px solid var(--gold)` con `offset: 3px` en `:focus-visible`. Los inputs lo reemplazan por borde dorado; no se quita el foco sin sustituto.
- **Jerarquía de encabezados:** **un `h1` por ruta** (ver la tabla del §3), `h2` por sección o por bloque de índice. Los statements de interstitial son decorativos a nivel semántico o `h2` según su rol; no compiten con el `h1`.
- **Cambio de ruta**: `useRutaScroll` mueve el foco al `<main>` (`tabIndex={-1}`, con `preventScroll` para no pelear con el reset de scroll) y actualiza el `document.title`. Solo en navegaciones reales, no en la primera carga: ahí robar el foco sería intrusivo.
- Elementos decorativos (canvas, separadores, eco del interstitial, marco reservado de F) marcados `aria-hidden="true"`. En F **el bloque tachado entero** queda fuera del árbol, no solo la palabra: ver el punto 2 de "La sección F" (§6).
- El **carrusel** debe ser navegable con teclado y anunciar posición (§5).
- `::selection` dorada con texto oscuro.
- El contraste se apoya en blanco/`--muted` sobre negro; `--muted` (#8e8e8e) no debe usarse por debajo de `--text-sm` ni para información crítica. `--gold-echo` **nunca** lleva información: no cumple contraste y es puramente decorativo.

---

## 10. Convenciones de código

- **Stack:** Vite + React 19 (JSX, sin TypeScript por ahora), CSS Modules, GSAP/ScrollTrigger + Lenis, R3F/three solo en el hero. **Sin Tailwind ni librerías de UI** — el sistema es propio.
- **Routing:** React Router + prerender (§3). Enlaces internos siempre con el `Link` del router.
- **Nomenclatura en español** para clases, componentes, rutas y variables (`.tarjeta`, `.mascara`, `CampoIconos`, `useReveal`, `/proyectos`). Los tokens también.
- **Páginas en `src/paginas/`**: `Home.jsx`, `Servicios.jsx`, `FichaServicio.jsx`, `Proyectos.jsx`, `FichaProyecto.jsx`. Las secciones del home siguen en `src/sections/`.
- **Un módulo CSS por sección/componente**, junto al archivo `.jsx`. Lo compartido va a `global.css`.
- **Contenido en `src/data/`** (`servicios.js`, `proyectos.js`, `planes.js`, `equipo.js`), separado del maquetado.
- **Media queries por componente**, con breakpoints según lo que el layout necesita (habituales: 1080, 900, 860, 720, 640, 560px). 860px es el corte de "mobile" para nav y hero 3D.
- **Comentarios en español** explicando el porqué de las decisiones no obvias, no el qué.
- **Build estático** (`vite build`) para subir por SFTP a hosting DirectAdmin; sin SSR, con prerender por ruta y `.htaccess` con rewrite como fallback. El backend es un único `server/contacto.php`.

---

## 11. Al agregar algo nuevo

1. ¿Existe ya un token, una `.card`, un `Button`, una `.mascara` o `.titular` que sirva? Úsalo antes de crear nada.
2. **¿Sección del home o página propia?** Página propia solo si tiene índice y fichas (hoy: servicios y proyectos). Todo lo demás vive en el home.
3. **Fondo: `--bg` por defecto.** No hay alternancia que continuar. `--bg-soft` solo si hay una razón concreta para que esa superficie se despegue, y sabiendo que hoy el único caso es el CTA.
4. Decidí el **tipo de sección**: contenido (`--space-section` + `.container` + titular partido + `useReveal`) o full-viewport (`100svh`, centrado, timeline propia).
5. Si es sección de contenido, seguí el estándar del §4: **sin eyebrow, titular en 3-4 líneas con el fragmento final dorado, bajada después del contenido**.
6. Un momento con carácter por sección, como máximo. El `.mascara` del titular no cuenta: es el piso, no el gesto.
7. Escala del display: **redefiní `--text-display` en el elemento**, no pelees especificidad contra `.titular`.
8. Toda animación dentro de `matchMedia` de reduced-motion, con estado inicial vía `gsap.set`, dentro de un `gsap.context()` con `revert()` en el cleanup, y `clearProps` al terminar (salvo dentro de `.mascara`).
9. Dorado solo si comunica algo. `--gold-echo` solo para eco decorativo.
10. Si el bloque muestra trabajo de un cliente, revisá las reglas de contenido del §8 antes de escribir copy.
11. Verificá el layout en 1440 / 1024 / 768 / 375px antes de dar por cerrado, y que no aparezca scroll horizontal.

---

## 12. Pendientes

### Infraestructura

| Fase | Qué | Estado |
| --- | --- | --- |
| 3a | Rutas, layout compartido, ciclo de vida Lenis/ScrollTrigger, `.htaccess` | **Hecha** |
| 3b | Transición entre páginas | **Hecha** |
| 3c | Prerender + SEO por ruta | **Hecha** |
| 4 | Sección F en el home (pin + scrub, tres estados) | **Hecha** |
| 5 | Servicios: sección home + `/servicios` + fichas | **Hecha** |
| 6 | Sección E en el home + `/proyectos` + las cinco fichas + carrusel | **Hecha** |
| 7 | Planes: tabla comparativa | **Hecha** |
| 8 | Equipo + Contacto (cuestionario de 3 pasos, en todas las páginas) | **Hecha** |

### Contenido (no bloquea la infraestructura, sí bloquea el lanzamiento)

- **Párrafo de 2-3 líneas por cliente** — 5 en total (Villa Verla, Automotriz Carmona, La Rusia Barra Nikkei, Veterinaria Larraín, Alfalfa Cakes).
- **Copy definitivo de la frase de F.** Lo que hay hoy en el código es placeholder: "QUIERO MÁS SEGUIDORES" → "NO QUEREMOS MÁS SEGUIDORES. QUEREMOS MÁS CLIENTES." Cambiarlo es editar `BLOQUE_A` / `BLOQUE_B` en `Correccion.jsx`, nada más.
- **Qué va en la columna derecha de F.** Hoy es un **espacio reservado**: un marco vacío a propósito, no un hueco por llenar de apuro. La decisión de contenido está abierta —una pieza real de cliente, un dato, o nada— y hasta tomarla el marco se sostiene solo. Si se resuelve que va vacío, el marco se queda; si entra contenido, revisar que no empuje la sección más allá del viewport (punto 6 de "La sección F", §6).
- **Copy definitivo de los servicios.** La Fase 5 dejó `resumen`, `gancho`, `incluye` y `detalle` escritos como **placeholder en la voz de marca** (`src/data/servicios.js`), para poder calibrar el maquetado con largos reales. Reemplazarlos es editar datos: ningún componente se toca. Ojo con el registro — el sitio **tutea** ("puedes", "quieres"), no vosea.
- **⚠ Permisos de clientes — BLOQUEANTE.** Solo **Villa Verla** está confirmado (es proyecto propio de Camilo). Los otros cuatro están en `permiso: true` en `src/data/proyectos.js` **solo para poder maquetar**, cada uno con su `TODO PERMISO`. Antes de publicar hay que confirmarlos o ponerlos en `false`: `proyectosPublicables()` los filtra de todo el sitio —home, índice, fichas y rutas del prerender— con ese solo booleano. Confirmar también si hay más clientes de los cinco listados, y los logos.
- **Piezas reales de los proyectos.** Hoy son 24 SVG de relleno en `public/placeholders/`, generados por `scripts/generar-placeholders.mjs` con las proporciones reales de cada formato (4:5, 9:16, 16:9, A4). Reemplazarlos es copiar los archivos reales y cambiar las rutas en `src/data/proyectos.js`; al terminar, borrar esa carpeta y el script.
- **Copy de los proyectos.** `resumen` y los `detras` de cada pieza son placeholder en la voz de marca. Mismo criterio de registro que servicios: el sitio **tutea**.
- **Piezas reales**: posts, reels, historias, informes y webs, en imagen y video. El informe se puede editar para que se vea más profesional.
- **Fotos del equipo** (hoy son iniciales en círculo).

### Cómo verificar un reveal sin perder una tarde

Dos falsos negativos que ya costaron un diagnóstico entero cada uno. Los dos hacen que **todo quede en `opacity: 0` y parezca roto cuando no lo está**:

1. **Un `scrollIntoView()` o `window.scrollTo()` desde la consola no dispara ningún ScrollTrigger.** ScrollTrigger se entera del scroll por `lenis.on('scroll', …)` (`lib/lenis.js`), y Lenis ignora los scrolls nativos que no pasaron por él. Hay que scrollear de verdad: rueda, barra, o un enlace de ancla (que usa `scrollToSection()`).
2. **Con la pestaña en segundo plano el navegador congela los `requestAnimationFrame`.** Como Lenis corre sobre el ticker de GSAP, el scroll deja de avanzar y ningún trigger dispara. Se detecta contando frames: si un bucle de `rAF` no llega a ~5 en medio segundo, la pestaña no se está pintando y **cualquier medición de animación de esa sesión no vale**. Los síntomas colaterales son capturas en negro y timeouts del renderer.

### Errores conocidos

- **Anclas del home desde otra ruta: fallo intermitente NO reproducible.** Durante la Fase 5 se observaron varias veces navegaciones a `#planes` que llegaban al home y aterrizaban arriba en vez de en la sección. Al instrumentar para diagnosticarlo **dejó de reproducirse**, y el control contra el `Home.jsx` original pasó 8/8 igual que la versión endurecida: **no hay evidencia de que el cambio de la Fase 5 lo haya corregido, porque no se logró provocar el fallo a voluntad**. La sospecha que queda es que los fallos fueron artefactos del HMR de Vite en dev —módulos recargados en caliente dejando triggers del pin de F duplicados—, no del código que se publica: en el build de producción da 9/9 en tres anclas distintas. Lo que sí se hizo es quitarle filo al mecanismo (ver abajo). Si el síntoma reaparece **en producción**, esto vuelve a ser un error abierto y el punto de partida es que el reintento de `saltar()` no está confirmando.

> **El salto al ancla confirma y reintenta, no salta a ciegas.** `Home.jsx` verifica en el frame siguiente que la sección quedó donde debía y repite hasta 8 veces si no. El motivo es que entre el `scrollTo` y el frame siguiente hay varios actores que pueden mover el scroll —el reset de ruta, el `refresh()` de ScrollTrigger restaurando lo que midió, el pin de F creando su `pin-spacer`, el canvas del hero tomando alto— y cuál gana depende del orden de los frames. Confirmar es barato e idempotente; adivinar el instante correcto no funciona. Dos correcciones de paso: una posición `null` (sección aún sin montar) ya no cuenta como "estable" —antes cuatro frames sin elemento disparaban el salto contra una posición inexistente— y las cadenas de `rAF` se cancelan en el cleanup, para que el doble montaje de StrictMode no deje una pasada huérfana peleando por el scroll con la siguiente.

### Diseño

- **Componente carrusel** — no existe (§5).
- **Íconos del hero en móvil `[v2]`** — en septiembre de 2026 el atlas pasó de 11 a 28 íconos (índices 11–27: comentario, compartir, megáfono, LinkedIn, like, estrella, notificación, enviar, imagen, video, alcance, ubicación, idea, lanzamiento, tendencia, YouTube, Spotify) y se subió `uOpacidad` de 0.3 a 0.45 en `CampoIconos.jsx`. **Los dos cambios son solo de escritorio.** El fondo de móvil no es WebGL: es un PNG estático que genera `crearPatronIconos()` en `atlasIconos.js`, con una distribución hecha a mano (`DISTRIBUCION_PATRON`, 12 posiciones) que referencia solo los once íconos originales (0–10) **por índice** y lleva sus propias opacidades, mucho más bajas (0.11–0.16). Para que el teléfono acompañe hay que tejer algunos de los índices 11–27 en esa distribución y subirle el alfa. No se hizo ahora porque la distribución está calibrada a mano para que el tile repita sin cortes y no se quiso pisar.
- **Interstitiales**: se contemplan 1–2 más como transición. Candidato: post-E, antes de Planes.
- **Prueba social**: Smart no tiene testimonios. La competencia directa de la región (Agencia Óptima) sí los tiene, con nombre y empresa. Es un hueco identificado, sin decisión todavía sobre si se llena y dónde.
- **El acrónimo SMART**: si a Abby le importa el juego con el nombre, decidir si sobrevive como línea de footer o dentro de Servicios. Como sección está descartado.
- **Etiquetas Open Graph / Twitter** — no existen; falta la imagen social. El favicon ya usa el logo.
- **Asimetría editorial** — estrenada en F (§6); hero e interstitial siguen centrados y podrían aprovecharla.
- **Calibración fina** de los diales del spotlight del hero.
- **Decisión sobre preloader** — sin resolver. Con transición entre páginas (Fase 3b) la pregunta cambia: puede que el preloader sobre.
- **Revisión de la voz inclusiva** por parte de la clienta.
- **Migración a TypeScript** — opcional, post-lanzamiento.

> **Nota de proceso:** un rediseño visual grande no se da por aprobado ni se construye completo sin que el sitio se vea renderizado (navegador o capturas) en checkpoints intermedios. Ya se intentó una vez de otra forma y hubo que revertir todo.
