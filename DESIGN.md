# DESIGN.md — Smart Estudio

Sistema de diseño del sitio one-page de **Smart Estudio**, agencia de marketing digital de La Serena–Coquimbo.
Este documento describe lo que el código ya implementa: sirve como referencia al agregar secciones o componentes nuevos, para que todo siga leyéndose como una sola pieza.

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
| `--bg-soft` | `#141414` | Fondo de secciones alternas, relleno de inputs |
| `--gold` | `#f3c13a` | Acento principal: eyebrows, botón primario, foco, hovers |
| `--gold-deep` | `#c9992e` | Dorado apagado para jerarquías terciarias |
| `--gold-soft` | `#ffe39a` | Dorado claro: hover del botón primario, labels sobre media |
| `--white` | `#ffffff` | Texto principal |
| `--muted` | `#8e8e8e` | Texto secundario, bajadas, listas de apoyo |
| `--line` | `rgba(255,255,255,.1)` | Todos los bordes y separadores |

El único color fuera de la paleta es el rojo de error del formulario (`#f2685c`, en `Contacto.module.css`).

### Tipografía

Tres familias, cargadas desde Google Fonts en `index.html`:

- **`--font-display` · Archivo** — solo titulares. Se usa en una instancia fija: variable Expanded (`font-stretch: 125%`) + Black (`font-weight: 900`), mayúsculas, `letter-spacing: -0.02em`, `line-height: 1.04`. Aplicado globalmente a `h1, h2, h3` en `global.css`; no hace falta repetirlo por módulo.
- **`--font-body` · Inter** — párrafos y textos largos. `line-height: 1.6`.
- **`--font-utility` · Space Grotesk** — la "letra chica con carácter": eyebrows, labels, botones, precios, badges, enlaces de nav. Casi siempre en mayúsculas con `letter-spacing` entre `0.04em` y `0.18em`.

Escala fluida con `clamp()`: `--text-xs` → `--text-3xl`, más `--text-hero` (`clamp(2rem, 8.8vw, 7rem)`), calibrado para que las dos líneas del hero en Archivo Expanded no se partan.

### Espaciado y layout

- Escala `--space-1` (4px) → `--space-9` (96px). No usar píxeles sueltos para separaciones.
- `--space-section: clamp(80px, 12vh, 160px)` es el `padding-block` de **toda** sección.
- `--container: 1200px` con la utilidad `.container` (`width: min(var(--container), 100% - var(--gutter)*2)`); `--container-narrow: 820px` para bloques de lectura.
- `--gutter: clamp(1rem, 4vw, 2.5rem)`, `--nav-height: 70px` (también es el `scroll-padding-top` del documento). Ya no existe una barra de nav: el token es el espacio que reservan los círculos fijos.

### Radios, sombras, easing

- Radios: `--radius-sm` 8px (inputs), `--radius-md` 14px (tarjetas), `--radius-lg` 22px (bloques anchos), `--radius-pill` (botones, badges, labels).
- `--ease-out: cubic-bezier(.22,1,.36,1)` y `--transition-fast: 220ms` para todas las micro-interacciones CSS.
- Sombras: `--shadow-lift` (elevación neutra) y `--shadow-gold` (glow del botón primario). Nunca sombras nuevas ad hoc.

---

## 3. Ritmo de la página

Las secciones alternan fondo para marcar respiración, y las de fondo suave llevan `border-block: 1px solid var(--line)`:

| Sección | Fondo |
| --- | --- |
| Hero | `--bg` |
| Manifiesto (interstitial) | `--bg` |
| Proceso | `--bg` |
| Servicios | `--bg-soft` |
| Trabajos | `--bg` |
| Planes | `--bg-soft` |
| Equipo | `--bg` |
| CTA (cierre) | `--bg-soft` |
| Contacto | `--bg` |

**Regla derivada:** dentro de una sección `--bg-soft`, las tarjetas invierten el relleno a `--bg` (ver `.tarjeta` en `Servicios.module.css` y `Planes.module.css`). Así la tarjeta siempre contrasta con su fondo, en cualquier posición del ritmo.

**Estructura de sección estándar:**

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

- **`.eyebrow`** — etiqueta de sección: Space Grotesk, mayúsculas, `letter-spacing: .18em`, dorada, con una línea dorada de 28×2px antes vía `::before`. Aparece en todas las secciones salvo el interstitial, que abre directo con el contexto.
- **`.card`** — fondo `--bg-soft`, borde `--line`, radio `md`, padding `--space-6`. Al hover: `translateY(-4px)`, borde dorado y `--shadow-lift`.
- **`.card-numero`** — numeración/etiqueta dorada en Space Grotesk.
- **`.visually-hidden`** — texto solo para lectores de pantalla.

### Componentes

- **`Button`** (`src/components/ui/Button.jsx`) — dos variantes: `primary` (fondo dorado, texto `--bg`, glow al hover) y `ghost` (transparente, borde `--line`, se vuelve dorado al hover). Píldora, Space Grotesk 600, `min-height: 44px`, `translateY(-2px)` al hover y `scale(.98)` al presionar. Renderiza `<a>` si recibe `href`, si no `<button>`.
- **`Nav`** (`src/components/Nav.jsx`) — sin barra: el logo suelto a la izquierda (sin contenedor, porque es apaisado y blanco) y un único círculo dorado de 50px con la hamburguesa a la derecha, ambos fijos a `--gutter` de las esquinas superiores y alineados por centro óptico. No cambian con el scroll. La hamburguesa abre un panel fullscreen `--bg` sólido con los enlaces en Archivo Expanded 900 a `clamp(2rem, 5vw, 3.5rem)`, centrados verticalmente y alineados a la izquierda del container, más un pie con CTA y redes en Space Grotesk. Igual en desktop y mobile; bajo 375px los círculos bajan a 44px. El panel entra con fade (0.4s) + stagger de enlaces (0.08s, `y: 30 → 0`) y sale con fade de 0.3s; cierra con `Escape`, al scrollear o al elegir un enlace, con focus trap sobre círculos + panel.
- **Tarjeta de trabajo** (`Trabajos.module.css`) — `aspect-ratio: 4/5`, overflow oculto, capa `.media` que hace zoom `scale(1.06)` al hover y capa interna `.mediaFondo` sobredimensionada (`inset: -8% 0`) que lleva el parallax. Ahí van las imágenes/videos reales. Overlay inferior con gradiente para legibilidad del label.

---

## 5. Movimiento

Stack: **Lenis** (scroll suave) + **GSAP/ScrollTrigger**. Instancia única de Lenis en `src/lib/lenis.js`, manejada por el ticker de GSAP (`gsap.ticker.add`) y sincronizada con `lenis.on('scroll', ScrollTrigger.update)`, con `lagSmoothing(0)`. La navegación interna usa `scrollToSection()`, que cae al `scrollIntoView` nativo cuando Lenis está desactivado.

### Reglas no negociables

1. **Todo lo animado nace visible.** El estado oculto se aplica con `gsap.set()`, nunca con CSS. Si el JS falla, la página se ve completa.
2. **Todo va dentro de `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`.** Con movimiento reducido: sin Lenis, sin reveals, sin marquee (`global.css` además recorta transiciones y animaciones a 0.01ms).
3. **`clearProps: 'opacity,transform'` al terminar**, para que los estilos inline no pisen los hovers CSS (el lift de `.card`, el `scale` de la tarjeta destacada).
4. **Reveals una sola vez** (`once: true`, `start: 'top 85%'`). Nada re-anima al volver a subir.

### Reveal estándar

Hook `useReveal()` (`src/hooks/useReveal.js`): fade + `y: 24 → 0`, `0.8s`, `power3.out`, stagger `0.12`. Se marca con atributos en el JSX:

```jsx
const scope = useReveal()
<section ref={scope}>
  <p data-reveal>…</p>              {/* elemento individual */}
  <div data-reveal-group>…</div>    {/* anima sus hijos directos en cascada */}
</section>
```

### Momentos con carácter

Cada sección tiene, como mucho, un gesto propio por encima del reveal base:

- **Hero** — intro al montar: eyebrow → titular → bajada → CTAs. El titular sube por línea desde una máscara con `overflow: hidden` (`yPercent: 110 → 0`, `power4.out`); el `padding/margin-block: ±0.08em` de `.mascara` evita cortar acentos y descendentes.
- **Manifiesto** — interstitial tipográfico a viewport completo: "Conectar" en `--font-titular` sube desde una máscara (`yPercent: 110 → 0`, `power4.out`) después de que entran el eyebrow y el contexto, y el eco en `--gold-echo` llega 0.4s más tarde y más lento, como reverberación. Dispara con `start: 'top 70%'`, una sola vez.
- **Proceso** — acrónimo SMART en cascada: cada letra dorada entra 0.1s antes que su texto, con filas escalonadas cada 0.14s.
- **Trabajos** — reveal con `scale: .96 → 1` y parallax `scrub` de ±5% sobre `.mediaFondo`.
- **Planes** — el plan destacado entra un beat después que el resto (stagger por función).
- **Equipo** — avatares con `scale: .85 → 1`.
- **CTA** — cierre a viewport completo: headline en `--font-titular` que sube desde la máscara (`power4.out`, 0.9s) al entrar, botón 0.4s después, y debajo el marquee infinito de 30s (`translateX(-50%)` sobre 4 copias = loop perfecto), con `playbackRate` modulado por `lenis.velocity` vía Web Animations API. Las frases alternan blanco y dorado.
- **Hero 3D** — ver abajo.

---

## 6. Fondo del hero (WebGL)

`src/sections/hero3d/` — campo de íconos de marketing que reacciona al cursor. Es el único elemento "rico" del sitio y está construido para no costar nada cuando no aplica.

- **`FondoIconos.jsx`** — decide si el dispositivo califica y hace lazy import del chunk de three.
- **`HeroCanvas.jsx`** — Canvas de R3F, `dpr` máximo 1.75, con IntersectionObserver que congela el frameloop cuando el hero sale del viewport.
- **`CampoIconos.jsx`** — un `InstancedMesh` de 280 quads (**1 draw call**). Drift ambiente y reacción al cursor se calculan en el vertex shader; la CPU solo lerpea tres valores por frame.
- **`atlasIconos.js`** — atlas 512×512 dibujado en canvas 2D con glyphs de Font Awesome. **No debe importar three**: lo comparte el fallback y arrastraría three al bundle principal.
- **Fallback** (`TexturaEstatica.jsx`) para mobile ≤860px, táctiles de baja potencia, sin WebGL o con movimiento reducido: tile PNG generado en canvas repetido + drift CSS + brillo radial.
- **Sustrato CSS**: `.canvasFondo` lleva un `radial-gradient` dorado al 8% que queda debajo del canvas y funciona como versión mínima si nada se monta.

**Diales del spotlight** (uniforms en `crearMaterial`): `uRadio 2.4`, `uFalloff 1.8`, `uIntensidad 0.85`, `uEscalaCursor 0.3`, `uAlfaExtra 1.4`, base `#6a6a6a` a `uOpacidad 0.3`, tiñendo hacia `--gold` y, en el centro, `--gold-soft`. Estos valores son el punto a tocar para calibrar la sensación; el resto del shader no debería necesitar cambios.

El canvas tiene `pointer-events: none`: el tracking del cursor se hace en `window` y el glow DOM se mueve con `gsap.quickTo`, sin draw calls extra.

---

## 7. Accesibilidad

- **Objetivos táctiles de 44px mínimo** en botones, enlaces de nav, enlaces de contacto e inputs (48px).
- **Foco visible global**: `outline: 2px solid var(--gold)` con `offset: 3px` en `:focus-visible`. Los inputs lo reemplazan por borde dorado; no se quita el foco sin sustituto.
- **Jerarquía de encabezados** correcta: un `h1` (hero), `h2` por sección.
- Elementos decorativos (canvas, separadores, letras del acrónimo) marcados `aria-hidden="true"`.
- `::selection` dorada con texto oscuro.
- El contraste se apoya en blanco/`--muted` sobre negro; `--muted` (#8e8e8e) no debe usarse por debajo de `--text-sm` ni para información crítica.

---

## 8. Convenciones de código

- **Stack:** Vite + React (JSX, sin TypeScript por ahora), CSS Modules. **Sin Tailwind ni librerías de UI** — el sistema es propio.
- **Nomenclatura en español** para clases, componentes y variables (`.tarjeta`, `.encabezado`, `CampoIconos`, `useReveal`). Los tokens también.
- **Un módulo CSS por sección/componente**, junto al archivo `.jsx`. Lo compartido va a `global.css`.
- **Contenido en `src/data/`** (`servicios.js`, `planes.js`, `equipo.js`), separado del maquetado.
- **Media queries por componente**, con breakpoints según lo que el layout necesita (habituales: 1080, 900, 860, 720, 640, 560px). 860px es el corte de "mobile" para nav y hero 3D.
- **Comentarios en español** explicando el porqué de las decisiones no obvias, no el qué.
- **Build estático** (`vite build`) para subir por SFTP a hosting DirectAdmin; sin SSR. El backend es un único `server/contacto.php`.

---

## 9. Al agregar algo nuevo

1. ¿Existe ya un token, una `.card`, un `.eyebrow` o un `Button` que sirva? Úsalo antes de crear nada.
2. Fondo de la sección: continúa la alternancia `--bg` / `--bg-soft`.
3. `padding-block: var(--space-section)` y contenido dentro de `.container`.
4. Envuelve el scope en `useReveal()` y marca con `data-reveal` / `data-reveal-group`. Un momento con carácter por sección, como máximo.
5. Toda animación dentro de `matchMedia` de reduced-motion, con estado inicial vía `gsap.set` y `clearProps` al terminar.
6. Dorado solo si comunica algo.
7. Verifica el layout en 1440 / 1024 / 768 / 375px antes de dar por cerrado.

---

## 10. Pendientes de diseño

- **Assets reales**: fotos del equipo (hoy iniciales en círculo) y los 6 trabajos (hoy gradientes placeholder en `.mediaFondo`). El maquetado y el parallax ya están listos para recibirlos.
- **Logo**: `public/logo-smart.png` (512×512, logotipo en la franja central del lienzo). Se usa en nav, footer y favicon. `logo-placeholder.svg` ya no se referencia y puede borrarse.
- **Etiquetas Open Graph / Twitter** — no existen todavía; falta la imagen social. El favicon ya usa el logo.
- **Calibración fina** de los diales del spotlight del hero.
- **Decisión sobre preloader** — sin resolver.
- **Revisión de la voz inclusiva** por parte de la clienta.
- **Migración a TypeScript** — opcional, post-lanzamiento.

> Nota de proceso: un rediseño visual grande no se da por aprobado ni se construye completo sin que el sitio se vea renderizado (navegador o capturas) en checkpoints intermedios. Ya se intentó una vez de otra forma y hubo que revertir todo.
