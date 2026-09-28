/*
 * Redes sociales — fuente única para el menú y el footer.
 *
 * TODO: el número de WhatsApp es provisorio; Camilo manda el definitivo.
 * Cuando llegue, cambiarlo también en CTA.jsx y Contacto.jsx.
 */

export const redes = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/smartestudio_/',
    icono: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/smart-estudio-spa/',
    icono: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="8.2" cy="8.1" r="1.2" fill="currentColor" />
        <path d="M8.2 10.8v5.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M11.6 16.5v-5.7m0 2.6c0-1.5 1-2.7 2.4-2.7s2.2.9 2.2 2.5v3.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/56981649378',
    icono: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9.3 8.2c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c.5 1 1.4 1.9 2.4 2.4l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.6c0 .6-.5 1.1-1.1 1-3.3-.3-6-2.9-6.4-6.2 0-.3 0-.7.1-1z"
          fill="currentColor"
        />
      </svg>
    ),
  },
]
