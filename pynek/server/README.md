# Pynek API — cPanel setup

These files receive the website's newsletter subscriptions and contact
messages and store them in MySQL. **Do not put real credentials in the
git repository** — fill them in on the server after uploading.

## One-time setup

1. **Create the database** (cPanel → MySQL Databases):
   - Create a database (e.g. `pynekco_website`) and a user with a strong
     password; grant the user ALL privileges on that database.
2. **Create the tables**: open phpMyAdmin, select the database, and run
   the contents of `schema.sql`.
3. **Upload this folder** to your hosting, e.g. to `public_html/api/`
   so the endpoints become:
   - `https://YOUR-DOMAIN/api/subscribe.php`
   - `https://YOUR-DOMAIN/api/contact.php`
4. **Edit `config.php` on the server**: database name/user/password,
   reCAPTCHA v3 secret key, and the allowed website origins.
5. **reCAPTCHA v3 keys** (https://www.google.com/recaptcha/admin):
   register the site with type "score based (v3)" and add every domain
   the website runs on. Put the **secret key** in `config.php` (server)
   and the **site key** in the website's `assets/js/main.js`.
6. In `assets/js/main.js`, set `API.subscribe` / `API.contact` to the
   URLs from step 3 and `RECAPTCHA_SITE_KEY` to the v3 site key.

## Where the data lands

- Newsletter: table `subscriptions` (duplicate e-mails update the
  existing row instead of erroring).
- Contact form: table `contact_messages`; a copy is also e-mailed to
  `NOTIFY_EMAIL` if configured.
- Both store the reCAPTCHA score so low-quality submissions are easy to
  spot; requests below the minimum score are rejected with HTTP 403.

View the data anytime in phpMyAdmin, or export to CSV/Excel from there.
