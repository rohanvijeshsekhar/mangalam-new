<?php
ob_start();

try {
    require_once __DIR__ . '/otpHelper.php';
    require_once __DIR__ . '/smsConfig.php';
    require_once __DIR__ . '/smsSend.php';

    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');

    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        echo json_encode(['success' => false, 'message' => 'Invalid request.']);
        exit;
    }

    $phone = normalizeEnquiryPhone($input['phone'] ?? '');
    $email = trim($input['email'] ?? '');

    if ($phone === '') {
        echo json_encode(['success' => false, 'message' => 'Please enter a valid 10-digit mobile number.']);
        exit;
    }

    $emailValid = filter_var($email, FILTER_VALIDATE_EMAIL);
    if (SMS_OTP_EMAIL_REQUIRED && !$emailValid) {
        echo json_encode(['success' => false, 'message' => 'Please enter your email address before sending OTP.']);
        exit;
    }

    $reusedOtp = getReusableSmsOtp($phone);
    if ($reusedOtp !== null) {
        $otp = $reusedOtp;
        echo json_encode([
            'success'    => true,
            'message'    => 'OTP already sent. Check your SMS or email.',
            'reused'     => true,
            'email_sent' => false,
            'sms_sent'   => false,
        ]);
        exit;
    }

    $otp = (string) random_int(100000, 999999);
    storePendingSmsOtp($phone, $otp);

    if (SMS_DEV_MODE || trim(SMS_TEMPLATE_ID) === '') {
        $emailSent = $emailValid && smsSendOtpEmailBackup($email, $otp, $phone);
        $response = [
            'success'    => true,
            'message'    => $emailSent ? 'OTP sent to your email.' : 'OTP generated (dev mode).',
            'email_sent' => $emailSent,
        ];
        if (defined('SMS_OTP_SHOW_IN_UI') && SMS_OTP_SHOW_IN_UI) {
            $response['display_otp'] = $otp;
        }
        echo json_encode($response);
        exit;
    }

    $emailSent = $emailValid && smsSendOtpEmailBackup($email, $otp, $phone);
    $smsResult = smsSendOtp($phone, $otp);
    $smsOk = !empty($smsResult['ok']);

    if (!$emailSent && !$smsOk) {
        echo json_encode([
            'success' => false,
            'message' => $emailValid
                ? 'Could not send OTP. Please check your email settings and try again.'
                : ($smsResult['message'] ?? 'Failed to send OTP.'),
        ]);
        exit;
    }

    if ($emailSent && $smsOk) {
        $message = 'OTP sent to your email and mobile.';
    } elseif ($emailSent) {
        $message = 'OTP sent to your email.';
    } else {
        $message = 'OTP sent to your mobile.';
    }

    $response = [
        'success'    => true,
        'message'    => $message,
        'email_sent' => $emailSent,
        'sms_sent'   => $smsOk,
    ];

    echo json_encode($response);
} catch (Throwable $e) {
    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');
    error_log('sendOTP error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
}
