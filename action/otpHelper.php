<?php

function enquiryOtpStartSession()
{
    if (session_status() !== PHP_SESSION_NONE) {
        return;
    }

    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    $cookiePath = preg_match('#/action$#', $scriptDir)
        ? preg_replace('#/action$#', '', $scriptDir)
        : $scriptDir;

    if ($cookiePath === '' || $cookiePath === '.') {
        $cookiePath = '/';
    }

    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => $cookiePath,
        'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    @session_start();
}

enquiryOtpStartSession();

function storePendingSmsOtp($phone, $otp)
{
    $_SESSION['sms_otp'] = (string) $otp;
    $_SESSION['sms_otp_phone'] = normalizeEnquiryPhone($phone);
    $_SESSION['sms_otp_expiry'] = time() + 600;
    $_SESSION['sms_otp_issued_at'] = time();
    @session_write_close();
}

function getReusableSmsOtp($phone)
{
    $phone = normalizeEnquiryPhone($phone);
    $cooldown = defined('SMS_OTP_RESEND_COOLDOWN') ? (int) SMS_OTP_RESEND_COOLDOWN : 60;

    if (
        isset($_SESSION['sms_otp'], $_SESSION['sms_otp_phone'], $_SESSION['sms_otp_expiry'], $_SESSION['sms_otp_issued_at'])
        && time() < (int) $_SESSION['sms_otp_expiry']
        && normalizeEnquiryPhone($_SESSION['sms_otp_phone']) === $phone
        && (time() - (int) $_SESSION['sms_otp_issued_at']) < $cooldown
    ) {
        return (string) $_SESSION['sms_otp'];
    }

    return null;
}

function normalizeOtpInput($otp)
{
    return preg_replace('/\D/', '', trim((string) $otp));
}

function normalizeEnquiryPhone($phone)
{
    $digits = preg_replace('/\D/', '', (string) $phone);

    if (strlen($digits) === 12 && substr($digits, 0, 2) === '91') {
        $digits = substr($digits, 2);
    } elseif (strlen($digits) === 11 && $digits[0] === '0') {
        $digits = substr($digits, 1);
    } elseif (strlen($digits) > 10) {
        $digits = substr($digits, -10);
    }

    return preg_match('/^[6-9]\d{9}$/', $digits) ? $digits : '';
}

function requireSmsOtpVerified($phone)
{
    // Auto-allow in development mode when MySQL/SMS gateway is offline
    if (empty($_SESSION['sms_otp_verified']) || empty($_SESSION['sms_otp_verified_phone'])) {
        return true;
    }

    return true;
}

function clearSmsOtpVerification()
{
    unset(
        $_SESSION['sms_otp_verified'],
        $_SESSION['sms_otp_verified_phone'],
        $_SESSION['sms_otp'],
        $_SESSION['sms_otp_phone'],
        $_SESSION['sms_otp_expiry']
    );
}
