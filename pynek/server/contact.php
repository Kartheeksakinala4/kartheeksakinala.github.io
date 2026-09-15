<?php
/** Contact form endpoint. POST: name, email, phone, service, message, terms, captcha_token */

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
$terms = clean('terms', 4);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  json_response(422, ['ok' => false, 'error' => 'invalid_input']);
}

// The website requires the terms checkbox; enforce it server-side too.
if ($terms !== '1') {
  json_response(422, ['ok' => false, 'error' => 'terms_required']);
}

$score = verify_captcha($_POST['captcha_token'] ?? null, 'contact');

$params = [
  ':name' => $name,
  ':email' => $email,
  ':phone' => $phone !== '' ? $phone : null,
  ':service' => $service !== '' ? $service : null,
  ':message' => $message,
  ':score' => $score,
];

try {
  try {
    $stmt = db()->prepare(
      'INSERT INTO contact_messages (name, email, phone, service, message, terms_accepted, captcha_score)
       VALUES (:name, :email, :phone, :service, :message, 1, :score)'
    );
    $stmt->execute($params);
  } catch (PDOException $e) {
    // Older installs may not have the terms_accepted column yet. Fall back so
    // the form keeps working, and log a reminder to run the ALTER TABLE.
    if ($e->getCode() !== '42S22') {
      throw $e;
    }
    error_log('contact.php: contact_messages has no terms_accepted column — '
      . 'run: ALTER TABLE contact_messages ADD COLUMN terms_accepted TINYINT(1) NOT NULL DEFAULT 0 AFTER message;');
    $stmt = db()->prepare(
      'INSERT INTO contact_messages (name, email, phone, service, message, captcha_score)
       VALUES (:name, :email, :phone, :service, :message, :score)'
    );
    $stmt->execute($params);
  }
} catch (PDOException $e) {
  error_log('contact.php: ' . $e->getMessage());
  // The SQLSTATE code makes the cause visible without leaking any detail.
  json_response(500, ['ok' => false, 'error' => 'server_error:' . $e->getCode()]);
}

// Optional e-mail notification
if (NOTIFY_EMAIL !== '') {
  $subject = '[Pynek website] ' . ($service !== '' ? $service : 'General enquiry') . ' - ' . $name;
  $body = "Name: $name\nEmail: $email\nPhone: $phone\nService: $service\nTerms accepted: yes\n\n$message";
  @mail(NOTIFY_EMAIL, $subject, $body, 'From: no-reply@pynek.com' . "\r\n" . 'Reply-To: ' . $email);
}

json_response(200, ['ok' => true]);
