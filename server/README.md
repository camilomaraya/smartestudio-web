# Backend del formulario de contacto

Endpoint PHP que recibe el formulario de la sección Contacto y envía el correo
por SMTP autenticado, con verificación anti-spam (honeypot + Cloudflare Turnstile).

El sitio es **estático** (build de React). Este `.php` corre en el hosting, junto
a los archivos del build, en el **mismo dominio** → same-origin, sin CORS.

## Archivos

| Archivo | ¿Se commitea? | Qué es |
|---|---|---|
| `contacto.php` | Sí | El endpoint. Solo acepta POST. |
| `config.example.php` | Sí | Plantilla de configuración (placeholders, sin secretos). |
| `config.php` | **No** (`.gitignore`) | Config real con las credenciales. La creás vos. |
| `vendor/phpmailer/` | Sí | PHPMailer 7.1.1 vendorizado (sin composer en runtime). |

## Requisitos del hosting

- **PHP 7.0 o superior** (el endpoint usa `strict_types`, `??`, `\Throwable`).
  PHPMailer en sí soporta PHP ≥ 5.5, pero `contacto.php` necesita 7.0+.
- Extensión **`curl`** habilitada (se usa para verificar Turnstile).
- Extensiones estándar `ctype`, `filter`, `hash` (siempre presentes).

## Configuración (qué rellenar)

1. Copiá `config.example.php` a `config.php`.
2. Rellená en `config.php`:
   - `smtp_host`, `smtp_port` (587 STARTTLS o 465 SSL), `smtp_secure`
     (`tls` para 587, `ssl` para 465).
   - `smtp_user` / `smtp_pass` → credenciales del buzón `contacto@smartestudio.cl`.
   - `from_email` / `from_name` → remitente (normalmente el mismo buzón SMTP,
     para no romper SPF/DKIM).
   - `dest_principal` → `contacto@smartestudio.cl`.
   - `dest_backup` → Gmail de respaldo (llega como copia oculta / BCC).
   - `turnstile_secret` → **secret key** de Cloudflare Turnstile.
3. En el frontend, la **site key** de Turnstile va en `.env` del proyecto
   (variable `VITE_TURNSTILE_SITE_KEY`, ver `.env.example` en la raíz).
   La site key es pública; el secret NUNCA sale del servidor.

`config.php` y `.env` no se suben al repo. No pongas secretos en archivos versionados.

## Despliegue por SFTP (DirectAdmin)

Al subir a `public_html` (la raíz que sirve el dominio) van, **juntos**:

```
public_html/
├── index.html            ← de dist/
├── assets/               ← de dist/
├── (demás archivos)      ← de dist/
├── contacto.php          ← de server/
├── config.php            ← de server/ (el real, con credenciales)
└── vendor/               ← de server/ (PHPMailer)
```

Es decir: **el contenido de `dist/` + el contenido de `server/`** (no la carpeta
`server/` en sí), de modo que el endpoint quede accesible como `/contacto.php`,
que es la ruta que usa el frontend (`ENDPOINT_CONTACTO` en `Contacto.jsx`).

Recordá regenerar el build (`npm run build`) con el `.env` ya configurado, así
la site key de Turnstile queda incrustada en el bundle.

## Dev vs producción

- En `npm run dev` **el PHP no corre**: Vite solo sirve el frontend. Un POST a
  `/contacto.php` no encuentra backend, así que el formulario mostrará el estado
  de **error** (es tolerante, no se rompe). El envío real solo funciona donde hay PHP.
- Para probar el endpoint localmente con PHP instalado:
  ```bash
  php -S localhost:8000 -t server/
  ```
  Eso sirve `server/` en `http://localhost:8000/contacto.php`. Si lo llamás desde
  el dev de Vite (otro puerto/origen) habría **CORS**; en producción no, porque
  build y `.php` comparten dominio. Para una prueba local cruzada tendrías que
  agregar cabeceras CORS temporales o apuntar el fetch al mismo origen.
