<?php
/** Contact form endpoint. POST: name, email, phone, service, message, captcha_token */

require __DIR__ . '/common.php';

send_cors_headers($ALLOWED_ORIGINS);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  json_response(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$name = clean('name', 120);
$email = clean('email', 190);
$phone = clean('phone', 24);
$service = clean('service', 120);
$message = clean('message', 5000);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  json_response(422, ['ok' => false, 'error' => 'invalid_input']);
}

$score = verify_captcha($_POST['captcha_token'] ?? null, 'contact');

try {
  $stmt = db()->prepare(
    'INSERT INTO contact_messages (name, email, phone, service, message, captcha_score)
     VALUES (:name, :email, :phone, :service, :message, :score)'
  );
  $stmt->execute([
    ':name' => $name,
    ':email' => $email,
    ':phone' => $phone !== '' ? $phone : null,
    ':service' => $service !== '' ? $service : null,
    ':message' => $message,
    ':score' => $score,
  ]);
} catch (PDOException $e) {
  error_log('contact.php: ' . $e->getMessage());
  json_response(500, ['ok' => false, 'error' => 'server_error']);
}

// Optional e-mail notification
if (NOTIFY_EMAIL !== '') {
  $subject = '[Pynek website] ' . ($service !== '' ? $service : 'General enquiry') . ' - ' . $name;
  $body = "Name: $name\nEmail: $email\nPhone: $phone\nService: $service\n\n$message";
  @mail(NOTIFY_EMAIL, $subject, $body, 'From: no-reply@pynek.com' . "\r\n" . 'Reply-To: ' . $email);
}

json_response(200, ['ok' => true]);
