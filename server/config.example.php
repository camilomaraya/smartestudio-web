<?php

/**
 * Copia este archivo como "config.php" (en la misma carpeta) y rellena
 * los valores reales. "config.php" NUNCA se sube al repo (ver .gitignore).
 */

return [
    // Datos del buzón SMTP autenticado que envía los correos.
    'smtp_host' => 'smtp.tu-hosting.cl',
    'smtp_port' => 587, // 587 = STARTTLS, 465 = SSL implícito
    'smtp_secure' => 'tls', // 'tls' para 587, 'ssl' para 465
    'smtp_user' => 'contacto@smartestudio.cl',
    'smtp_pass' => 'TU_PASSWORD_AQUI',

    // Remitente con el que sale el correo (normalmente el mismo buzón SMTP).
    'from_email' => 'contacto@smartestudio.cl',
    'from_name' => 'Smart Estudio — Web',

    // Destinatarios: principal + copia de respaldo (failsafe).
    'dest_principal' => 'contacto@smartestudio.cl',
    'dest_backup' => 'TU_GMAIL_DE_RESPALDO@gmail.com',

    // Cloudflare Turnstile — secret key del sitio (dashboard.cloudflare.com > Turnstile).
    'turnstile_secret' => 'TU_TURNSTILE_SECRET_AQUI',
];
