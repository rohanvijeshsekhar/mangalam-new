<?php
require_once '../_class/query.php';
require_once './otpHelper.php';

header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

$name      = trim((string) ($data['name'] ?? $data['customer_name'] ?? ''));
$email     = trim((string) ($data['email'] ?? $data['customer_email'] ?? ''));
$phone     = trim((string) ($data['phone'] ?? $data['customer_phone'] ?? ''));
$notes     = trim((string) ($data['notes'] ?? ''));
$packageId = (int) ($data['package_id'] ?? 0);

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
$insertEnq = $obj->insertData('enquiry_package', [
    'name'           => $name,
    'email'          => $email,
    'phone'          => $phone,
    'package_id'     => $packageId,
    'notes'          => $notes,
    'date'           => date('Y-m-d H:i:s'),
    'adults_count'   => 1,
    'children_count' => 0,
    'status'         => 1,
]);

if ($insertEnq) {
    clearSmsOtpVerification();
    echo json_encode(['success' => true, 'message' => 'Enquiry submitted successfully.']);
    exit;
}

error_log('submitPackageEnquiry insert failed: ' . mysqli_error($obj->con));
echo json_encode(['success' => false, 'message' => 'Failed to submit enquiry. Please try again.']);
