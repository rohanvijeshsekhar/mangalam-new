<?php
require_once '../_class/query.php';
require_once './otpHelper.php';

header('Content-Type: application/json; charset=utf-8');

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

$name    = trim((string) ($data['name'] ?? $data['customer_name'] ?? ''));
$email   = trim((string) ($data['email'] ?? $data['customer_email'] ?? ''));
$phone   = trim((string) ($data['phone'] ?? $data['customer_phone'] ?? ''));
$subject = trim((string) ($data['subject'] ?? 'General Inquiry'));
$message = trim((string) ($data['message'] ?? ''));

if ($name === '' || $email === '' || $phone === '' || $message === '') {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
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
$insertEnq = $obj->insertData('contact_enquiries', [
    'name'    => $name,
    'email'   => $email,
    'phone'   => $phone,
    'subject' => $subject,
    'message' => $message,
    'date'    => date('Y-m-d H:i:s'),
    'status'  => 1,
]);

if ($insertEnq) {
    clearSmsOtpVerification();
    echo json_encode(['success' => true, 'message' => 'Enquiry submitted successfully.']);
    exit;
}

error_log('submitContactEnquiry insert failed');
echo json_encode(['success' => false, 'message' => 'Failed to submit enquiry. Please try again.']);
