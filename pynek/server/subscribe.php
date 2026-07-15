<?php
/** Newsletter subscription endpoint. POST: name, email, mobile, captcha_token */

require __DIR__ . '/common.php';

send_cors_headers($ALLOWED_ORIGINS);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  json_response(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$name = clean('name', 120);
$email = clean('email', 190);
$mobile = clean('mobile', 24);

if ($name === '' || $mobile === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  json_response(422, ['ok' => false, 'error' => 'invalid_input']);
}

$score = verify_captcha($_POST['captcha_token'] ?? null, 'subscribe');

try {
  $stmt = db()->prepare(
    'INSERT INTO subscriptions (name, email, mobile, captcha_score)
     VALUES (:name, :email, :mobile, :score)
     ON DUPLICATE KEY UPDATE name = VALUES(name), mobile = VALUES(mobile)'
  );
  $stmt->execute([
    ':name' => $name,
    ':email' => $email,
    ':mobile' => $mobile,
    ':score' => $score,
  ]);
} catch (PDOException $e) {
  error_log('subscribe.php: ' . $e->getMessage());
  json_response(500, ['ok' => false, 'error' => 'server_error']);
}

json_response(200, ['ok' => true]);
