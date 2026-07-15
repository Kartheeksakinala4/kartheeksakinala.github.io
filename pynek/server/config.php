<?php
/**
 * Pynek API configuration — EDIT THIS FILE ON THE SERVER ONLY.
 *
 * IMPORTANT: never commit real credentials to the git repository.
 * Upload this folder to your hosting, then fill in the values below
 * directly on the server (cPanel File Manager or FTP).
 */

// ---- MySQL (from cPanel -> MySQL Databases) ----
define('DB_HOST', 'localhost');
define('DB_NAME', 'YOUR_DB_NAME');        // e.g. pynekco_website
define('DB_USER', 'YOUR_DB_USER');        // e.g. pynekco_webuser
define('DB_PASS', 'YOUR_DB_PASSWORD');

// ---- Google reCAPTCHA v3 (from https://www.google.com/recaptcha/admin) ----
// The SECRET key lives only here on the server. The SITE key goes into
// the website's assets/js/main.js.
define('RECAPTCHA_SECRET', 'YOUR_RECAPTCHA_V3_SECRET_KEY');
define('RECAPTCHA_MIN_SCORE', 0.5);

// ---- CORS: origins allowed to call this API ----
// Add every domain the website is served from.
$ALLOWED_ORIGINS = [
  'https://www.pynek.com',
  'https://pynek.com',
  'https://kartheeksakinala.me',
];

// ---- Optional: e-mail a copy of each contact message ----
define('NOTIFY_EMAIL', 'contact@pynek.com');   // set to '' to disable
