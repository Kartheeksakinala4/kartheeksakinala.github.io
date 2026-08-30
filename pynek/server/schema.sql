-- Pynek website database schema
-- Run this once in phpMyAdmin (cPanel) after creating the database.

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  mobile VARCHAR(24) NOT NULL,
  captcha_score DECIMAL(3,2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_subscriptions_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(24) NULL,
  service VARCHAR(120) NULL,
  message TEXT NOT NULL,
  terms_accepted TINYINT(1) NOT NULL DEFAULT 0,
  captcha_score DECIMAL(3,2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- If contact_messages already exists from an earlier install, add the new
-- column instead of re-running the CREATE above:
--   ALTER TABLE contact_messages
--     ADD COLUMN terms_accepted TINYINT(1) NOT NULL DEFAULT 0 AFTER message;
