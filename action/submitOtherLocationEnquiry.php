<?php
require_once '../_class/query.php';
require_once './otpHelper.php';

header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

$name    = trim((string) ($data['customer_name'] ?? $data['name'] ?? ''));
$email   = trim((string) ($data['customer_email'] ?? $data['email'] ?? ''));
$phone   = trim((string) ($data['customer_phone'] ?? $data['phone'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

if ($name === '' || $email === '' || $phone === '') {
    echo json_encode(['success' => false, 'message' => 'Please fill in your name, email, and phone number.']);
    exit;
}

if (!requireSmsOtpVerified($phone)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please verify your mobile number with OTP before submitting.',
    ]);
    exit;
}

$obj = new Query();
$insertEnq = $obj->insertData('enquiry', [
    'name'           => $name,
    'email'          => $email,
    'phone'          => $phone,
    'destination_id' => 0,
    'from_date'      => $message,
    'to_date'        => '',
    'adults_count'   => 1,
    'cheldren_count' => 0,
    'hotel_type'     => 'Other Location',
    'status'         => 1,
]);

if ($insertEnq) {
    clearSmsOtpVerification();
    echo json_encode(['success' => true, 'message' => 'Enquiry submitted successfully.']);
    exit;
}

error_log('submitOtherLocationEnquiry insert failed: ' . mysqli_error($obj->con));
echo json_encode(['success' => false, 'message' => 'Failed to submit enquiry. Please try again.']);
