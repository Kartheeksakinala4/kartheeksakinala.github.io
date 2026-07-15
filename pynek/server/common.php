<?php
/** Shared helpers for the Pynek API endpoints. */

require __DIR__ . '/config.php';

function send_cors_headers(array $allowedOrigins): void {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
  }
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
  }
}

function json_response(int $status, array $payload): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($payload);
  exit;
}

function db(): PDO {
  static $pdo = null;
  if ($pdo === null) {
    $pdo = new PDO(
      'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
      DB_USER,
      DB_PASS,
      [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
      ]
    );
  }
  return $pdo;
}

/**
 * Verifies a reCAPTCHA v3 token. Returns the score (float) on success,
 * null when captcha is not configured yet, or exits with 403 on failure.
 */
function verify_captcha(?string $token, string $expectedAction): ?float {
  if (RECAPTCHA_SECRET === '' || strpos(RECAPTCHA_SECRET, 'YOUR_') === 0) {
    return null; // captcha not configured yet — accept, store NULL score
  }
  if (!$token) {
    json_response(403, ['ok' => false, 'error' => 'captcha_missing']);
  }
  $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
      'secret' => RECAPTCHA_SECRET,
      'response' => $token,
      'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
  ]);
  $body = curl_exec($ch);
  curl_close($ch);
  $result = $body ? json_decode($body, true) : null;

  $ok = $result
    && !empty($result['success'])
    && (($result['action'] ?? '') === $expectedAction)
    && (($result['score'] ?? 0) >= RECAPTCHA_MIN_SCORE);

  if (!$ok) {
    json_response(403, ['ok' => false, 'error' => 'captcha_failed']);
  }
  return (float) $result['score'];
}

function clean(string $key, int $maxLen): string {
  $v = trim((string) ($_POST[$key] ?? ''));
  return mb_substr($v, 0, $maxLen);
}
