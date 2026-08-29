# Smart Estudio — Arquitectura

Cómo está construido el sitio. Para retomar el código, no para rediseñarlo.

- **`DESIGN.md`** — el sistema de diseño vigente: tokens, patrones, decisiones visuales y las trampas de cada sección.
- **`BRIEF-REDISENO.md`** — qué es el sitio y qué debe hacer, sin atarse a esta implementación.
- **Este archivo** — el mapa técnico. Donde algo ya está explicado en `DESIGN.md`, se referencia en vez de repetirlo.

---

## 1. Stack

| Pieza | Por qué está |
|---|---|
| **Vite 8** + **React 19** (JSX, sin TypeScript) | Build estático rápido. TypeScript quedó como migración opcional post-lanzamiento. |
| **React Router 8** | Multipágina sin recarga. |
| **CSS Modules** | Sin Tailwind ni librerías de UI: el sistema es propio y vive en tokens. |
| **GSAP + ScrollTrigger** | Todas las animaciones y el único pin del sitio. |
| **Lenis** | Scroll suave, sincronizado con ScrollTrigger. |
| **three + React Three Fiber** | Solo el fondo del hero. Se carga aparte y nunca entra al bundle principal. |
| **PHPMailer 7.1.1** (vendorizado) | Envío SMTP del formulario. Sin Composer en el hosting: los tres archivos del core se incluyen a mano. |

**Node ≥ 20.19** (Vite 8 lo exige). Fijado en `.nvmrc` y en `engines`.

### Estructura

```
src/
  paginas/      Home, Servicios, FichaServicio, Proyectos, FichaProyecto, NoEncontrada
  sections/     Secciones del home (Hero, Manifiesto, Servicios, Detras, Planes, Equipo, CTA, Contacto)
    hero3d/     El fondo WebGL, aislado
  components/   Nav, Footer, Transicion, Carrusel, CabeceraPagina, Correccion, EnlaceRuta, ui/Button
  data/         servicios.js, proyectos.js, planes.js, equipo.js — contenido separado del maquetado
  hooks/        useReveal, useRutaScroll, useLenis, useTransicion
  lib/          gsap, lenis, navegacion, seo, rutasPrerender
  styles/       tokens.css, global.css
scripts/        prerender.mjs (el build), generar-placeholders.mjs (assets temporales)
server/         contacto.php, config.example.php, vendor/phpmailer/
public/         logo, .htaccess, _headers, _redirects, placeholders/
```

**Convenciones:** nombres en español (clases, componentes, rutas, variables, tokens). Un módulo CSS por componente, junto a su `.jsx`. Comentarios que explican el *porqué*, no el *qué*.

---

## 2. El build

`npm run build` **no ejecuta `vite build`**: ejecuta `scripts/prerender.mjs`, que es el build real.

Lo que hace, en orden:
1. Construye el bundle de cliente.
2. Construye un bundle **SSR** de `src/prerender.jsx`.
3. Lo ejecuta una vez por ruta e inyecta el HTML resultante y el `<head>` en el `index.html` generado.

Salida: 12 HTML reales, uno por ruta.

**El build falla con código distinto de cero** si una ruta no se genera, sale vacía, no tiene `<h1>` o su contenido no quedó dentro de `#root`. Es deliberado: un prerender que falla en silencio sube HTML vacíos al hosting sin que nadie se entere.

### Por qué un script y no un plugin

Se probó `vite-prerender-plugin` y **generaba el HTML correctamente**. El problema es su estrategia: ejecuta el bundle de **cliente** dentro de Node. El scheduler de React, en su build de navegador, abre un `MessageChannel` al cargarse; en Node ese puerto queda como handle activo y **`vite build` nunca termina** — el HTML sale bien y el proceso se cuelga para siempre. Esconder `globalThis.MessageChannel` lo empeora: el render toma otra rama que toca `window` y el build pasa de colgarse a fallar.

Un bundle SSR no tiene el problema: Node resuelve `react-dom/server.node`, que programa con `setImmediate`.

> Si alguien vuelve a evaluar esto —y va a pasar, porque un plugin es menos código— el criterio no es si genera bien el HTML, es **si el build termina**.

### Qué hay que excluir del prerender: nada

La sospecha inicial era que el hero WebGL, `three`, Lenis y la cortina necesitarían guardas. Ninguno resultó problema, y el motivo es el principio de §4: **todo lo que toca el navegador se monta en efectos, y los efectos no corren en el servidor**. Si algo revienta el prerender en el futuro, la corrección es moverlo a un efecto, no envolverlo en `typeof window !== 'undefined'`.

### Las rutas salen de los datos

`lib/rutasPrerender.js` arma la lista desde `data/servicios.js` y `data/proyectos.js`. Agregar un servicio o un proyecto no requiere tocar configuración.

> ⚠ **Ese archivo importa con extensión `.js` explícita**, a diferencia del resto del código: lo carga `scripts/prerender.mjs` con Node directamente, sin pasar por Vite, y el resolvedor de ESM de Node no completa extensiones. Sin ella el build muere en `ERR_MODULE_NOT_FOUND` antes de compilar nada. Vale para cualquier módulo que ese script llegue a importar.

---

## 3. Routing y ciclo de vida

Todas las rutas cuelgan de `Layout.jsx`, que contiene: navegación → `<main>` con la ruta → formulario de contacto → pie. **Lenis vive en el layout**, no en las páginas: es instancia única y no se destruye al navegar.

### Al cambiar de ruta (`hooks/useRutaScroll.js`)

1. Antes de pintar: reset del scroll a 0.
2. Se actualiza el título del documento.
3. Tras doble `requestAnimationFrame`: `ScrollTrigger.refresh()` y se reafirma el scroll arriba.
4. El foco va al `<main>`, solo en navegaciones reales (en la primera carga sería intrusivo).

> ⚠ **El reset necesita `lenis.resize()` antes y `force: true`.** Lenis cachea el límite de scroll y su estado interno sigue apuntando a la posición anterior; sin remedir, su siguiente frame reescribe esa posición —clampeada al alto nuevo— encima del reset. Síntoma: entrar a una ficha desde un home scrolleado deja al visitante a mitad de página. Y como `ScrollTrigger.refresh()` restaura la posición que encontró al empezar, el reset **se reafirma después** del refresh, salvo cuando la ruta pide un ancla.

### Anclas del home desde otra ruta

`lib/navegacion.js` → navega con el destino en el estado → `Home` lo consume al montar, espera a que el layout se asiente y salta. **El salto confirma y reintenta**: verifica en el frame siguiente que la sección quedó donde debía y repite hasta 8 veces. Entre el salto y ese frame hay varios actores que pueden mover el scroll (el reset de ruta, el refresh, el pin de la sección F, el canvas del hero tomando alto) y cuál gana depende del orden de los frames.

`#contacto` es la excepción: vive en el layout, existe en todas las rutas y por eso siempre es scroll local, nunca navegación.

### Transición entre páginas (`components/Transicion.jsx`)

**Cubrir, después navegar.** La cortina entra (420 ms), y recién con la pantalla cubierta se llama a `navigate()`: ahí ocurren el reset y el refresh sin que se vea el salto.

- **Navegación normal:** 900 ms fijos, salida encadenada.
- **Navegación a un ancla del home:** variable con tope de ~1300 ms — la página nueva tiene que montar *y* saltar antes de que se levante la cortina, así que `Home` emite una señal cuando terminó. **El tope de seguridad es obligatorio**: ninguna cortina puede quedar colgada esperando un evento que no llegó.

Otras reglas: la cortina nace oculta desde CSS (si el JS falla, los enlaces navegan igual); una transición a la vez, lo que se dispare durante otra se ignora; atrás/adelante es instantáneo y corta cualquier transición en curso; se salta entera si la pestaña está oculta, porque ahí los `requestAnimationFrame` se congelan y la timeline quedaría a medias con el flag de "en curso" trabado.

---

## 4. Movimiento

Reglas completas en `DESIGN.md` §6. Las cuatro que gobiernan todo:

1. **Todo lo animado nace visible.** El estado oculto se aplica con `gsap.set()`, nunca desde CSS.
2. **Todo va dentro de `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`.**
3. **`clearProps` al terminar**, para que los estilos inline no pisen los hovers CSS.
4. **Reveals una sola vez.**

Cada sección monta su animación en un `gsap.context()` con scope, que se revierte al desmontar — `useGSAP()` de `@gsap/react` ya lo hace.

### Dos formas de obtener un falso negativo

Las dos hacen que **todo quede invisible y parezca roto cuando no lo está**. Las dos ya costaron un diagnóstico entero:

1. **Un `scrollIntoView()` o `window.scrollTo()` desde la consola no dispara ningún ScrollTrigger.** ScrollTrigger se entera del scroll por `lenis.on('scroll', …)`, y Lenis ignora los scrolls nativos que no pasaron por él. Hay que scrollear de verdad: rueda, barra, o un enlace de ancla.
2. **Con la pestaña en segundo plano el navegador congela los `requestAnimationFrame`.** Como Lenis corre sobre el ticker de GSAP, el scroll deja de avanzar y ningún trigger dispara. Se detecta contando frames: si un bucle de `rAF` no llega a ~5 en medio segundo, la pestaña no se está pintando y **ninguna medición de esa sesión vale**. Síntomas colaterales: capturas en negro y timeouts del renderer.

### El pin

La sección de la frase que se corrige (`components/Correccion.jsx`) es el **único pin del proyecto**. Depende de que ningún ancestro tenga `transform`, `filter`, `will-change` ni `contain`: cualquiera de esas crea un contexto de contención que rompe el `position: fixed` con el que ScrollTrigger fija la sección. No lanza error — el pin simplemente deja de pegar. **No agregar ninguna de esas propiedades a `main`, `#root` ni `#inicio`.**

Lenis usa scroll nativo, así que no hace falta `scrollerProxy`. Si algún día pasa a scrollear un wrapper con transform, este pin es lo primero que se cae.

---

## 5. Componentes con lógica propia

- **`Carrusel`** — pista de scroll horizontal nativo con `scroll-snap`. Sin JS las piezas siguen visibles y arrastrables. La posición se lee del `scrollLeft` real —el hijo cuyo `offsetLeft` está más cerca del borde—, **no por división de ancho promedio**: las piezas tienen proporciones distintas y esa cuenta se desalinea.
- **`EnlaceRuta`** — `<a href>` real con `preventDefault` encima. **No intercepta** con `meta`/`ctrl`/`shift`/`alt` ni con botones que no sean el izquierdo, para no romper "abrir en pestaña nueva". El `href` real lo necesita el prerender para rastrear rutas.
- **`Nav`** — tres tipos de enlace: anclas que solo existen en el home, la sección de contacto (scroll directo siempre), y rutas reales. Panel fullscreen con foco atrapado, cierre con Escape, al scrollear o al elegir un enlace.
- **`CabeceraPagina`** — el encabezado de las páginas internas, con reveal por línea.
- **`Correccion`** — la sección con pin. La pieza más cargada de trampas del sitio; cada una está documentada con su síntoma en `DESIGN.md` §6.

---

## 6. Datos

`src/data/` es la fuente única. Alimenta maquetado, rutas del prerender, descripciones para buscadores y títulos.

- **`servicios.js`** — 4 principales con `slug`, `titulo`, `gancho`, `resumen`, `incluye`, `detalle`; más los complementarios, que llevan un campo que los ancla a la ficha donde tienen sentido.
- **`proyectos.js`** — 5 clientes con `slug`, `nombre`, `rubro`, `servicios`, `resumen`, `portada`, `piezas` y **`permiso`**.
- **`planes.js`**, **`equipo.js`** — contenido real de la agencia.

> ⚠ **El campo `permiso` es un control de publicación, no un detalle.** `proyectosPublicables()` filtra por él en **todo** el sitio: home, índice, fichas y rutas del prerender. Un cliente sin autorización no puede terminar publicado por descuido. Hoy solo Villa Verla está confirmado; los otros cuatro están en `true` con un `TODO PERMISO` cada uno, únicamente para poder maquetar.

**Regla de contenido:** un mismo `resumen` sirve para índice, cabecera de ficha y descripción para buscadores. Se escribe una vez.

---

## 7. Backend del formulario

Un solo archivo: `server/contacto.php`. Documentación completa en `server/README.md`.

**Flujo:** POST desde el formulario → valida campo trampa (`sitio`) → verifica el token de Turnstile contra Cloudflare → sanitiza y **quita saltos de línea para evitar inyección de cabeceras** → envía por SMTP autenticado con PHPMailer al destinatario principal, con copia oculta al de respaldo → responde JSON.

**Seguridad:** solo acepta POST. El `catch` no filtra detalles del error al cliente. La clave secreta de Turnstile nunca sale del servidor; la pública se incrusta en el bundle.

**Requisitos del hosting:** PHP 7+ con la extensión `curl`.

**Configuración pendiente:** `server/config.php` (desde `config.example.php`) y `.env` con la clave pública de Turnstile. **Ninguno de los dos se versiona** — ya están en `.gitignore`.

En desarrollo el PHP no corre: un envío deja la interfaz en estado de error, que es tolerante y no rompe nada.

---

## 8. Deploy

Dos destinos con reglas distintas.

### Staging — Cloudflare Pages

Conectado al repo, publica desde la rama `rediseno-editorial`. Build: `npm run build`, salida `dist`, preset **None**.

- **`public/_headers`** — `X-Robots-Tag: noindex, nofollow`. Un staging no se indexa, menos con contenido de relleno y clientes sin permiso. Va ahí y **no** en un `<meta robots>` ni en `robots.txt` porque esos viajarían al build de producción y dejarían el sitio real fuera de los buscadores sin que nadie lo note.
- **`public/_redirects`** — el equivalente del `.htaccess`, que Cloudflare no lee. Los archivos estáticos se evalúan antes, así que solo alcanza a las URLs inexistentes.
- **El formulario no funciona acá**: no hay PHP.

### Producción — DirectAdmin por SFTP

Al directorio que sirve el dominio van **juntos** el contenido de `dist/` y el de `server/` (no la carpeta `server/` en sí), de modo que el endpoint quede en `/contacto.php`. `public/.htaccess` resuelve el enrutado de las URLs desconocidas.

Regenerar el build con `.env` ya configurado: la clave pública de Turnstile se incrusta en el bundle.

---

## 9. Estado

| Fase | Qué | Estado |
|---|---|---|
| 1–4 | Scaffold, pulido, movimiento, hero WebGL | Hecha |
| 5 (etapa) | Formulario de contacto | Hecha — faltan credenciales |
| 0–4 (rediseño) | Tokens, nav, interstitial, CTA, multipágina, sección F | Hecha |
| 5 | Servicios: home + índice + 4 fichas | Hecha |
| 6 | Proyectos: sección E + índice + 5 fichas + carrusel | Hecha |
| 7 | Planes | Pendiente |
| 8 | Equipo + Contacto como cuestionario de 3 pasos | Pendiente |

**Planes, Equipo y Contacto siguen siendo secciones de la versión anterior**: funcionan, pero no siguen el sistema del rediseño.

**Ramas:** `main` está en la etapa 5 (sitio anterior, intacto como referencia). Todo el rediseño vive en `rediseno-editorial`.

El inventario de lo que falta para publicar está en `BRIEF-REDISENO.md` §8, y los pendientes de diseño en `DESIGN.md` §12.
