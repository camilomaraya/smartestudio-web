# DESIGN.md — Smart Estudio

Sistema de diseño del sitio one-page de **Smart Estudio**, agencia de marketing digital de La Serena–Coquimbo.
Este documento describe lo que el código ya implementa: sirve como referencia al agregar secciones o componentes nuevos, para que todo siga leyéndose como una sola pieza.

> **Estado:** el sitio está en medio de un rediseño editorial (rama `rediseno-editorial`). Hero, nav, interstitial y CTA ya siguen el lenguaje nuevo. Proceso, Servicios, Trabajos, Planes, Equipo y Contacto todavía son secciones de la versión anterior y se van a reconstruir. Cuando este documento describe un patrón nuevo, ese patrón manda por sobre lo que hoy haga una sección vieja.

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
| `--gold` | `#f3c13a` | Acento principal: eyebrows, botón primario, foco, hovers |
| `--gold-deep` | `#c9992e` | Dorado apagado para jerarquías terciarias |
| `--gold-soft` | `#ffe39a` | Dorado claro: hover del botón primario, labels sobre media |
| `--gold-echo` | `rgba(243,193,58,.25)` | Dorado fantasma. Solo para el eco de los interstitiales: texto que reverbera detrás del statement, no información |
| `--white` | `#ffffff` | Texto principal |
| `--muted` | `#8e8e8e` | Texto secundario, bajadas, listas de apoyo |
| `--line` | `rgba(255,255,255,.1)` | Todos los bordes y separadores |

El único color fuera de la paleta es el rojo de error del formulario (`#f2685c`, en `Contacto.module.css`).

### Tipografía

Cuatro familias, cargadas desde Google Fonts en `index.html`. Hay una jerarquía de voces y no se saltan escalones:

- **`--font-titular` · Big Shoulders Display Black (900)** — la voz monumental. Solo para momentos que ocupan la pantalla completa: el titular del hero, los statements de interstitial y el headline del CTA. Se aplica con la clase global `.titular`, no repitiendo la familia por módulo. Si algo lleva Big Shoulders, es porque esa pantalla existe para decir esa frase.
- **`--font-display` · Archivo** — titulares de escala media: `h2`, `h3`, encabezados de sección. Instancia fija: variable Expanded (`font-stretch: 125%`) + Black (`font-weight: 900`), mayúsculas, `letter-spacing: -0.02em`, `line-height: 1.04`. Aplicado globalmente a `h1, h2, h3` en `global.css`.
- **`--font-body` · Inter** — párrafos y textos largos. `line-height: 1.6`.
- **`--font-utility` · Space Grotesk** — la "letra chica con carácter": eyebrows, labels, botones, precios, badges, enlaces de nav. Casi siempre en mayúsculas con `letter-spacing` entre `0.04em` y `0.18em`.

Escala fluida con `clamp()`: `--text-xs` → `--text-3xl`, más:

| Token | Valor | Uso |
| --- | --- | --- |
| `--text-hero` | `clamp(2rem, 8.8vw, 7rem)` | Escala grande en Archivo Expanded, calibrada para que dos líneas no se partan |
| `--text-display` | `clamp(3rem, 10vw, 9rem)` | Escala monumental para `.titular` |
| `--lh-display` | `0.90` | Interlineado apretado del display; las líneas se tocan y forman bloque |

### Espaciado y layout

- Escala `--space-1` (4px) → `--space-9` (96px). No usar píxeles sueltos para separaciones.
- `--space-section: clamp(80px, 12vh, 160px)` es el `padding-block` de las secciones de contenido. Las secciones full-viewport (ver §3) no lo usan: se resuelven con `min-height: 100svh` y centrado.
- `--container: 1200px` con la utilidad `.container` (`width: min(var(--container), 100% - var(--gutter)*2)`); `--container-narrow: 820px` para bloques de lectura.
- `--gutter: clamp(1rem, 4vw, 2.5rem)`, `--nav-height: 70px` (también es el `scroll-padding-top` del documento). Ya no existe una barra de nav: el token es el espacio que reservan los elementos fijos de la esquina superior.

### Radios, sombras, easing

- Radios: `--radius-sm` 8px (inputs), `--radius-md` 14px (tarjetas), `--radius-lg` 22px (bloques anchos), `--radius-pill` (botones, badges, labels).
- `--ease-out: cubic-bezier(.22,1,.36,1)` y `--transition-fast: 220ms` para todas las micro-interacciones CSS.
- Sombras: `--shadow-lift` (elevación neutra) y `--shadow-gold` (glow del botón primario). Nunca sombras nuevas ad hoc.

---

## 3. Ritmo de la página

**El ritmo ya no lo marca el fondo.** La alternancia `--bg` / `--bg-soft` fue el sistema de la versión anterior y quedó descartada: hoy casi todo el sitio es `--bg` y `--bg-soft` sobrevive como acento único de superficie en el CTA. Lo que marca la respiración ahora es **la alternancia entre secciones de contenido y secciones full-viewport**: una pantalla completa con una sola idea tipográfica corta el scroll, deja aire y separa bloques mucho más fuerte de lo que lo hacía un cambio de gris.

| Sección | Fondo | Tipo |
| --- | --- | --- |
| Hero | `--bg` | Full-viewport (WebGL) |
| Manifiesto (interstitial) | `--bg` | Full-viewport tipográfico |
| Proceso | `--bg` | Contenido |
| Servicios | `--bg` | Contenido |
| Trabajos | `--bg` | Contenido |
| Planes | `--bg` | Contenido |
| Equipo | `--bg` | Contenido |
| CTA (cierre) | `--bg-soft` | Full-viewport tipográfico |
| Contacto | `--bg` | Contenido |

**Secciones full-viewport:** `min-height: 100svh` (no `100vh` — la barra del navegador móvil rompe el segundo), contenido centrado, sin `.eyebrow`, sin `border-block`, sin encabezado estándar. Abren directo con el contenido. Llevan timeline propia (§5), no el reveal genérico.

**Regla derivada de tarjetas:** las `.card` usan `--bg-soft` sobre fondo `--bg`, e invierten a `--bg` si alguna vez quedan sobre `--bg-soft`. La tarjeta siempre contrasta con su fondo.

**Estructura de sección de contenido (estándar):**

```
<section id="…" class="{seccion}">
  <div class="container">
    <div class="{encabezado}" data-reveal-group>
      <p class="eyebrow">Etiqueta</p>
      <h2 class="{titulo}">Título</h2>
      <p>Bajada opcional</p>
    </div>
    … contenido …
  </div>
</section>
```

El encabezado usa `flex-direction: column` con `gap: var(--space-3)` y `margin-bottom: var(--space-7)`.

---

## 4. Piezas compartidas

Viven en `src/styles/global.css` y se componen con la clase del módulo (`class="card ${styles.tarjeta}"`), no se duplican:

- **`.titular`** — la voz monumental: `--font-titular`, `font-weight: 900`, `font-size: var(--text-display)`, `line-height: var(--lh-display)`, mayúsculas. Para escalar un titular puntual por encima o por debajo de la escala base, **no se pelea especificidad contra `.titular`**: se **redefine `--text-display` en el propio elemento** (`.miTitular { --text-display: clamp(2rem, 7vw, 5rem) }`). El token es local al elemento y `.titular` lo lee. Este es el mecanismo oficial de ajuste de escala del display.
- **`.mascara`** — patrón de reveal por línea. Contenedor con `overflow: hidden` y `padding/margin-block: ±0.08em` (para no cortar acentos ni descendentes); adentro, un `<span>` por línea que entra con `yPercent: 110 → 0`, `power4.out`. Ya se usa en hero, interstitial y CTA: **es el gesto estándar de entrada de cualquier titular grande.** Los elementos dentro de `.mascara` son la excepción a la regla de `clearProps` (§5).
- **`.eyebrow`** — etiqueta de sección: Space Grotesk, mayúsculas, `letter-spacing: .18em`, dorada, con una línea dorada de 28×2px antes vía `::before`. Aparece en las secciones de contenido; las full-viewport abren directo, sin eyebrow.
- **`.card`** — fondo `--bg-soft`, borde `--line`, radio `md`, padding `--space-6`. Al hover: `translateY(-4px)`, borde dorado y `--shadow-lift`.
- **`.card-numero`** — numeración/etiqueta dorada en Space Grotesk.
- **`.visually-hidden`** — texto solo para lectores de pantalla.

### Patrón statement / eco

El gesto propio de los interstitiales tipográficos, ya implementado en Manifiesto y reutilizable en los interstitiales que falten:

1. **Contexto** — línea corta en Archivo, `--muted`, escala chica ("NUESTRO TRABAJO ES").
2. **Statement** — una palabra o frase brevísima en `.titular` dorada, a escala monumental, entrando desde `.mascara`. Es el motivo de existir de la pantalla.
3. **Eco** — la continuación de la frase en `--gold-echo`, escala media, entrando después y más lento. No es información: es reverberación. Si el usuario no lo lee, no se pierde nada.

### Componentes

- **`Button`** (`src/components/ui/Button.jsx`) — dos variantes: `primary` (fondo dorado, texto `--bg`, glow al hover) y `ghost` (transparente, borde `--line`, se vuelve dorado al hover). Píldora, Space Grotesk 600, `min-height: 44px`, `translateY(-2px)` al hover y `scale(.98)` al presionar. Renderiza `<a>` si recibe `href`, si no `<button>`.
- **`Nav`** (`src/components/Nav.jsx`) — sin barra: el logo suelto a la izquierda (sin contenedor, porque es apaisado y blanco) y un único círculo dorado de 50px con la hamburguesa a la derecha, ambos fijos a `--gutter` de las esquinas superiores y alineados por centro óptico. No cambian con el scroll. La hamburguesa abre un panel fullscreen `--bg` sólido con los enlaces en Archivo Expanded 900 a `clamp(2rem, 5vw, 3.5rem)`, centrados verticalmente y alineados a la izquierda del container, más un pie con CTA y redes en Space Grotesk. Igual en desktop y mobile; bajo 375px los círculos bajan a 44px. El panel entra con fade (0.4s) + stagger de enlaces (0.08s, `y: 30 → 0`) y sale con fade de 0.3s; cierra con `Escape`, al scrollear o al elegir un enlace, con focus trap sobre círculos + panel.
- **Logo** — `public/logo-smart.png` (512×512, logotipo en la franja central del lienzo). Se usa en nav, footer y favicon. Token `--ancho-logo: clamp(140px, 17vw, 240px)`. **Ojo:** el `img { max-width: 100% }` global rompe los márgenes negativos que compensan el aire del PNG; los módulos que lo usan necesitan `max-width: none`.
- **Tarjeta de trabajo** (`Trabajos.module.css`) — `aspect-ratio: 4/5`, overflow oculto, capa `.media` que hace zoom `scale(1.06)` al hover y capa interna `.mediaFondo` sobredimensionada (`inset: -8% 0`) que lleva el parallax. Ahí van las imágenes/videos reales. Overlay inferior con gradiente para legibilidad del label.

---

## 5. Movimiento

Stack: **Lenis** (scroll suave) + **GSAP/ScrollTrigger**. Instancia única de Lenis en `src/lib/lenis.js`, manejada por el ticker de GSAP (`gsap.ticker.add`) y sincronizada con `lenis.on('scroll', ScrollTrigger.update)`, con `lagSmoothing(0)`. La navegación interna usa `scrollToSection()`, que cae al `scrollIntoView` nativo cuando Lenis está desactivado.

### Reglas no negociables

1. **Todo lo animado nace visible.** El estado oculto se aplica con `gsap.set()`, nunca con CSS. Si el JS falla, la página se ve completa.
2. **Todo va dentro de `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`.** Con movimiento reducido: sin Lenis, sin reveals, sin marquee (`global.css` además recorta transiciones y animaciones a 0.01ms).
3. **`clearProps: 'opacity,transform'` al terminar**, para que los estilos inline no pisen los hovers CSS. **Excepción:** los `<span>` dentro de `.mascara` conservan su transform final; limpiarlos los devuelve al `yPercent` del CSS.
4. **Reveals una sola vez** (`once: true`, `start: 'top 85%'`). Nada re-anima al volver a subir. Las secciones full-viewport disparan más tarde (`start: 'top 70%'`), porque su contenido está centrado y no arriba.

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

- **Hero** — intro al montar: eyebrow → titular → bajada → CTAs. El titular sube por línea desde `.mascara`. Copy: "DE AQUÍ SALEN BUENAS IDEAS", con "BUENAS IDEAS" en dorado (split de color dentro del mismo titular).
- **Manifiesto** — interstitial tipográfico full-viewport, patrón statement/eco. Timeline propia con `start: 'top 70%'`, `once`. Timing calibrado: statement `duration: 1.4` en `t=0.4` (lento a propósito, para darle peso), eco en `t=1.5`.
- **Proceso** — acrónimo SMART en cascada: cada letra dorada entra 0.1s antes que su texto, con filas escalonadas cada 0.14s.
- **Trabajos** — reveal con `scale: .96 → 1` y parallax `scrub` de ±5% sobre `.mediaFondo`.
- **Planes** — el plan destacado entra un beat después que el resto (stagger por función).
- **Equipo** — avatares con `scale: .85 → 1`.
- **CTA** — cierre full-viewport: headline "Comencemos a trabajar" ("trabajar" en dorado) en `.titular`, subiendo desde `.mascara` (`power4.out`, 0.9s), botón 0.4s después, y debajo el marquee infinito de 30s (`translateX(-50%)` sobre 4 copias = loop perfecto), con `playbackRate` modulado por `lenis.velocity` vía Web Animations API. Las frases alternan blanco y dorado.
- **Hero 3D** — ver abajo.

### Nota de composición pendiente

Hero e interstitial quedaron **centrados**. Funciona, pero la asimetría editorial (titulares corridos al borde, contrapesos vacíos) es una palanca que todavía no se usa. Es el recurso disponible si alguna pantalla necesita más tensión sin sumar elementos.

---

## 6. Fondo del hero (WebGL)

`src/sections/hero3d/` — campo de íconos de marketing que reacciona al cursor. Es el único elemento "rico" del sitio y está construido para no costar nada cuando no aplica.

- **`FondoIconos.jsx`** — decide si el dispositivo califica y hace lazy import del chunk de three.
- **`HeroCanvas.jsx`** — Canvas de R3F, `dpr` máximo 1.75, con IntersectionObserver que congela el frameloop cuando el hero sale del viewport.
- **`CampoIconos.jsx`** — un `InstancedMesh` de 280 quads (**1 draw call**). Drift ambiente y reacción al cursor se calculan en el vertex shader; la CPU solo lerpea tres valores por frame.
- **`atlasIconos.js`** — atlas 512×512 dibujado en canvas 2D con glyphs de Font Awesome. **No debe importar three**: lo comparte el fallback y arrastraría three al bundle principal. `crearPatronIconos()` genera además un PNG tileable con los mismos íconos, sin WebGL.
- **Fallback** (`TexturaEstatica.jsx`) para mobile ≤860px, táctiles de baja potencia, sin WebGL o con movimiento reducido: tile PNG generado en canvas repetido + drift CSS + brillo radial.
- **Sustrato CSS**: `.canvasFondo` lleva un `radial-gradient` dorado al 8% que queda debajo del canvas y funciona como versión mínima si nada se monta.

**Diales del spotlight** (uniforms en `crearMaterial`): `uRadio 2.4`, `uFalloff 1.8`, `uIntensidad 0.85`, `uEscalaCursor 0.3`, `uAlfaExtra 1.4`, base `#6a6a6a` a `uOpacidad 0.3`, tiñendo hacia `--gold` y, en el centro, `--gold-soft`. Estos valores son el punto a tocar para calibrar la sensación; el resto del shader no debería necesitar cambios.

El canvas tiene `pointer-events: none`: el tracking del cursor se hace en `window` y el glow DOM se mueve con `gsap.quickTo`, sin draw calls extra.

**El campo de íconos es momento único del hero.** No se replica como fondo de otras secciones: el vacío del resto del sitio se resuelve con escala, asimetría y color de superficie, no llenando el fondo de marca.

> El gris base `#6a6a6a` está **hardcodeado en dos lugares que deben quedar sincronizados**: `atlasIconos.js:135` (`ctx.fillStyle`) y `CampoIconos.jsx:44` (`uColor`). Si alguna vez se cambia el tono, se cambian los dos.

---

## 7. Accesibilidad

- **Objetivos táctiles de 44px mínimo** en botones, enlaces de nav, enlaces de contacto e inputs (48px).
- **Foco visible global**: `outline: 2px solid var(--gold)` con `offset: 3px` en `:focus-visible`. Los inputs lo reemplazan por borde dorado; no se quita el foco sin sustituto.
- **Jerarquía de encabezados** correcta: un `h1` (hero), `h2` por sección. Los statements de interstitial son decorativos a nivel semántico o `h2` según su rol; no compiten con el `h1`.
- Elementos decorativos (canvas, separadores, letras del acrónimo, eco del interstitial) marcados `aria-hidden="true"`.
- `::selection` dorada con texto oscuro.
- El contraste se apoya en blanco/`--muted` sobre negro; `--muted` (#8e8e8e) no debe usarse por debajo de `--text-sm` ni para información crítica. `--gold-echo` **nunca** lleva información: no cumple contraste y es puramente decorativo.

---

## 8. Convenciones de código

- **Stack:** Vite + React 19 (JSX, sin TypeScript por ahora), CSS Modules, GSAP/ScrollTrigger + Lenis, R3F/three solo en el hero. **Sin Tailwind ni librerías de UI** — el sistema es propio.
- **Nomenclatura en español** para clases, componentes y variables (`.tarjeta`, `.encabezado`, `.mascara`, `CampoIconos`, `useReveal`). Los tokens también.
- **Un módulo CSS por sección/componente**, junto al archivo `.jsx`. Lo compartido va a `global.css`.
- **Contenido en `src/data/`** (`servicios.js`, `planes.js`, `equipo.js`), separado del maquetado.
- **Media queries por componente**, con breakpoints según lo que el layout necesita (habituales: 1080, 900, 860, 720, 640, 560px). 860px es el corte de "mobile" para nav y hero 3D.
- **Comentarios en español** explicando el porqué de las decisiones no obvias, no el qué.
- **Build estático** (`vite build`) para subir por SFTP a hosting DirectAdmin; sin SSR. El backend es un único `server/contacto.php`.

---

## 9. Al agregar algo nuevo

1. ¿Existe ya un token, una `.card`, un `.eyebrow`, un `Button`, una `.mascara` o `.titular` que sirva? Úsalo antes de crear nada.
2. **Fondo: `--bg` por defecto.** No hay alternancia que continuar. `--bg-soft` solo si hay una razón concreta para que esa superficie se despegue, y sabiendo que hoy el único caso es el CTA.
3. Decidí primero el **tipo de sección**: contenido (`--space-section` + `.container` + encabezado estándar + `useReveal`) o full-viewport (`100svh`, centrado, sin eyebrow, timeline propia).
4. Un momento con carácter por sección, como máximo. Si el titular es grande, el gesto por defecto es `.mascara`.
5. Escala del display: **redefiní `--text-display` en el elemento**, no pelees especificidad contra `.titular`.
6. Toda animación dentro de `matchMedia` de reduced-motion, con estado inicial vía `gsap.set` y `clearProps` al terminar (salvo dentro de `.mascara`).
7. Dorado solo si comunica algo. `--gold-echo` solo para eco decorativo.
8. Verificá el layout en 1440 / 1024 / 768 / 375px antes de dar por cerrado, y que no aparezca scroll horizontal.

---

## 10. Pendientes de diseño

- **Secciones sin rediseñar**: Proceso, Servicios, Trabajos, Planes, Equipo y Contacto siguen en el lenguaje anterior. Contacto está decidido como quiz de 3 pasos (servicio / datos / mensaje) manteniendo `contacto.php` como backend. Equipo pasa de grilla de avatares a secuencia con más personalidad por persona.
- **Densidad visual**: fuera del hero el sitio se lee plano. Primer paso acordado: grano/ruido sutil global (capa fija, `feTurbulence` inline, opacidad ~0.03). El tono de los íconos y la textura por sección quedan congelados hasta terminar las secciones que faltan — es probable que el vacío se resuelva solo al reconstruirlas.
- **Interstitiales**: se contemplan 1–2 más como transición (candidato: post-Trabajos, antes de Planes).
- **Assets reales**: fotos del equipo (hoy iniciales en círculo) y los 6 trabajos (hoy gradientes placeholder en `.mediaFondo`). El maquetado y el parallax ya están listos para recibirlos.
- **Etiquetas Open Graph / Twitter** — no existen todavía; falta la imagen social. El favicon ya usa el logo.
- **Asimetría editorial** — palanca disponible, sin usar (ver §5).
- **Calibración fina** de los diales del spotlight del hero.
- **Decisión sobre preloader** — sin resolver.
- **Revisión de la voz inclusiva** por parte de la clienta.
- **Migración a TypeScript** — opcional, post-lanzamiento.

> Nota de proceso: un rediseño visual grande no se da por aprobado ni se construye completo sin que el sitio se vea renderizado (navegador o capturas) en checkpoints intermedios. Ya se intentó una vez de otra forma y hubo que revertir todo.
