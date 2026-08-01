<?php
require_once '../_class/query.php';
require_once './otpHelper.php';

header('Content-Type: application/json; charset=utf-8');

function careerRandomFilename($extension)
{
    return bin2hex(random_bytes(8)) . '.' . strtolower($extension);
}

$position    = trim((string) ($_POST['position'] ?? ''));
$name        = trim((string) ($_POST['name'] ?? ''));
$email       = trim((string) ($_POST['email'] ?? ''));
$phone       = trim((string) ($_POST['phone'] ?? ''));
$coverLetter = trim((string) ($_POST['cover_letter'] ?? ''));

if ($position === '' || $position === 'Select a position') {
    echo json_encode(['success' => false, 'message' => 'Please select a position.']);
    exit;
}

if ($name === '' || $email === '' || $phone === '') {
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

$resumeFile = '';
if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
    $allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    $allowedExtensions = ['pdf', 'doc', 'docx'];
    $maxSize = 5 * 1024 * 1024;

    $tmpPath = $_FILES['resume']['tmp_name'];
    $mimeType = mime_content_type($tmpPath);
    $extension = strtolower(pathinfo($_FILES['resume']['name'], PATHINFO_EXTENSION));

    if (!in_array($mimeType, $allowedTypes, true) || !in_array($extension, $allowedExtensions, true)) {
        echo json_encode(['success' => false, 'message' => 'Resume must be a PDF, DOC, or DOCX file.']);
        exit;
    }

    if ($_FILES['resume']['size'] > $maxSize) {
        echo json_encode(['success' => false, 'message' => 'Resume size must be 5MB or less.']);
        exit;
    }

    $uploadDir = realpath(__DIR__ . '/../admin/files/career-resumes');
    if ($uploadDir === false) {
        $uploadDir = __DIR__ . '/../admin/files/career-resumes';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $uploadDir = realpath($uploadDir) ?: $uploadDir;
    }

    $resumeFile = careerRandomFilename($extension);
    if (!move_uploaded_file($tmpPath, $uploadDir . DIRECTORY_SEPARATOR . $resumeFile)) {
        echo json_encode(['success' => false, 'message' => 'Failed to upload resume. Please try again.']);
        exit;
    }
}

$obj = new Query();
$insertEnq = $obj->insertData('enquiry_career', [
    'position'     => $position,
    'name'         => $name,
    'email'        => $email,
    'phone'        => $phone,
    'resume'       => $resumeFile,
    'cover_letter' => $coverLetter,
    'date'         => date('Y-m-d H:i:s'),
    'status'       => 1,
]);

if ($insertEnq) {
    clearSmsOtpVerification();
    echo json_encode(['success' => true, 'message' => 'Application submitted successfully.']);
    exit;
}

error_log('submitCareerEnquiry insert failed: ' . mysqli_error($obj->con));
echo json_encode(['success' => false, 'message' => 'Failed to submit application. Please try again.']);
