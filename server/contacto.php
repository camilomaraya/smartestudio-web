<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'mensaje' => 'Método no permitido.']);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    error_log('contacto.php: falta server/config.php (copiar desde config.example.php y rellenar)');
    http_response_code(500);
    echo json_encode(['ok' => false, 'mensaje' => 'El formulario no está configurado todavía.']);
    exit;
}

$config = require $configPath;

require __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';

use PHPMailer\PHPMailer\PHPMailer;

/**
 * Acepta tanto JSON (fetch con Content-Type application/json) como form-urlencoded.
 */
function leerEntrada(): array
{
    $raw = file_get_contents('php://input');
    if ($raw !== false && $raw !== '') {
        $json = json_decode($raw, true);
        if (is_array($json)) {
            return $json;
        }
    }
    return $_POST;
}

/**
 * Quita saltos de línea y espacios sobrantes. Evita header injection en
 * campos que PHPMailer podría usar en cabeceras (nombre, email, empresa).
 */
function limpiar(string $valor): string
{
    $valor = str_replace(["\r", "\n"], '', $valor);
    return trim($valor);
}

function verificarTurnstile(string $token, string $secret, ?string $ip): bool
{
    $payload = [
        'secret' => $secret,
        'response' => $token,
    ];
    if ($ip) {
        $payload['remoteip'] = $ip;
    }

    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    $respuesta = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($respuesta === false) {
        error_log('contacto.php: error de red verificando Turnstile: ' . $error);
        return false;
    }

    $data = json_decode($respuesta, true);
    return is_array($data) && ($data['success'] ?? false) === true;
}

$entrada = leerEntrada();

// Honeypot: campo oculto que solo un bot rellenaría. Si viene con contenido,
// respondemos "ok" en silencio y no enviamos nada ni damos pistas.
$honeypot = isset($entrada['sitio']) ? trim((string) $entrada['sitio']) : '';
if ($honeypot !== '') {
    echo json_encode(['ok' => true, 'mensaje' => 'Mensaje enviado.']);
    exit;
}

$nombre = limpiar((string) ($entrada['nombre'] ?? ''));
$email = limpiar((string) ($entrada['email'] ?? ''));
$empresa = limpiar((string) ($entrada['empresa'] ?? ''));
$mensaje = trim((string) ($entrada['mensaje'] ?? ''));
$turnstileToken = (string) ($entrada['turnstileToken'] ?? '');

if ($nombre === '' || $email === '' || $mensaje === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'mensaje' => 'Completa nombre, email y mensaje.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'mensaje' => 'El email no es válido.']);
    exit;
}

if ($turnstileToken === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'mensaje' => 'Verificación anti-spam faltante.']);
    exit;
}

if (!verificarTurnstile($turnstileToken, $config['turnstile_secret'], $_SERVER['REMOTE_ADDR'] ?? null)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'mensaje' => 'No pudimos verificar que eres humano. Intenta de nuevo.']);
    exit;
}

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->Port = $config['smtp_port'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_user'];
    $mail->Password = $config['smtp_pass'];
    $mail->SMTPSecure = $config['smtp_secure']; // 'tls' (587) o 'ssl' (465)
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['dest_principal']);
    if (!empty($config['dest_backup'])) {
        $mail->addBCC($config['dest_backup']);
    }
    $mail->addReplyTo($email, $nombre);

    $mail->Subject = 'Nuevo contacto desde el sitio — ' . $nombre;
    $cuerpo = "Nombre: {$nombre}\nEmail: {$email}\n";
    if ($empresa !== '') {
        $cuerpo .= "Empresa: {$empresa}\n";
    }
    $cuerpo .= "\nMensaje:\n{$mensaje}\n";

    $mail->isHTML(false);
    $mail->Body = $cuerpo;

    $mail->send();

    echo json_encode(['ok' => true, 'mensaje' => 'Tu mensaje fue enviado. ¡Gracias por escribirnos!']);
} catch (\Throwable $e) {
    error_log('contacto.php: error enviando correo: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'mensaje' => 'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.',
    ]);
}
