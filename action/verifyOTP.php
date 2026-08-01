<?php
ob_start();

try {
    require_once __DIR__ . '/otpHelper.php';
    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');

    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        echo json_encode(['success' => false, 'message' => 'Invalid request.']);
        exit;
    }

    $phone = normalizeEnquiryPhone($input['phone'] ?? '');
    $otp = normalizeOtpInput($input['otp'] ?? '');

    if ($phone === '' || $otp === '') {
        echo json_encode(['success' => false, 'message' => 'Phone and OTP are required.']);
        exit;
    }

    if (requireSmsOtpVerified($phone)) {
        echo json_encode(['success' => true, 'message' => 'Mobile number verified.']);
        exit;
    }

    if (!isset($_SESSION['sms_otp'], $_SESSION['sms_otp_phone'], $_SESSION['sms_otp_expiry'])) {
        echo json_encode(['success' => false, 'message' => 'No OTP found. Please send OTP again.']);
        exit;
    }

    if (normalizeEnquiryPhone($_SESSION['sms_otp_phone']) !== $phone) {
        echo json_encode(['success' => false, 'message' => 'Phone number does not match. Please resend OTP.']);
        exit;
    }

    if (time() > (int) $_SESSION['sms_otp_expiry']) {
        echo json_encode(['success' => false, 'message' => 'OTP expired. Please send a new one.']);
        exit;
    }

    $storedOtp = normalizeOtpInput($_SESSION['sms_otp'] ?? '');
    if ($storedOtp === '' || strlen($otp) < 4 || !hash_equals($storedOtp, $otp)) {
        echo json_encode(['success' => false, 'message' => 'Invalid OTP. Use the latest code and try again.']);
        exit;
    }

    $_SESSION['sms_otp_verified'] = true;
    $_SESSION['sms_otp_verified_phone'] = $phone;
    unset($_SESSION['sms_otp'], $_SESSION['sms_otp_expiry'], $_SESSION['sms_otp_issued_at']);

    echo json_encode(['success' => true, 'message' => 'Mobile number verified.']);
} catch (Throwable $e) {
    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');
    error_log('verifyOTP error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Verification failed. Please try again.']);
}
