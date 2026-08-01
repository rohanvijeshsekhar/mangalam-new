<?php
// FastSMS (SangamamOnline) — https://fastsms.sangamamonline.in

define('SMS_API_URL', 'https://fastsms.sangamamonline.in/api/sms/v1.0/send-sms');
define('SMS_ACCESS_TOKEN', '4LBOC269XB3U4Z8');
define('SMS_ACCESS_KEY', '7p%Nxzhd=3/[sZR;)v4A^T,6Ja@S5yW9');

// DLT (must match FastSMS panel)
define('SMS_SENDER_ID', 'MTrave');
define('SMS_ENTITY_ID', '1701177044156222476');
define('SMS_TEMPLATE_ID', '1707177917343595479');
define('SMS_OTP_MESSAGE', 'Mangalam Travel & Tours Your OTP is {#var#} for enquiry form verification. Valid for 10 minutes. Do not share this OTP with anyone. www.mangalamtravel.com');

// true = skip SMS gateway (local testing only)
define('SMS_DEV_MODE', false);

// Email OTP backup (requires MAIL_SMTP_PASS in mailConfig.php)
define('SMS_OTP_EMAIL_BACKUP', true);
define('SMS_OTP_EMAIL_REQUIRED', true);

// false = OTP only via SMS/email (not shown on website)
define('SMS_OTP_SHOW_IN_UI', false);

// Reuse same OTP if Send is clicked again within this many seconds (prevents mismatched codes)
define('SMS_OTP_RESEND_COOLDOWN', 60);
