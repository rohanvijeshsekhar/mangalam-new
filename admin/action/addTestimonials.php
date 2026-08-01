<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();
$response = [];

$requiredFields = ['name', 'role', 'description'];
foreach ($requiredFields as $field) {
    if (empty($_POST[$field]) || !is_string($_POST[$field])) {
        echo json_encode([['status' => 'fail', 'msg' => 'Please fill in all required fields.']]);
        exit;
    }
}

$info = [
    'name'        => trim($_POST['name']),
    'role'        => trim($_POST['role']),
    'description' => trim($_POST['description']),
];

if (isset($_FILES['image']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
    $uploadDir = realpath(__DIR__ . '/../files/testimonials');
    if ($uploadDir === false) {
        $uploadDir = __DIR__ . '/../files/testimonials';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $uploadDir = realpath($uploadDir) ?: $uploadDir;
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 5 * 1024 * 1024;
    $tmpName = $_FILES['image']['tmp_name'];
    $fileType = mime_content_type($tmpName);
    $fileSize = $_FILES['image']['size'];

    if (!in_array($fileType, $allowedTypes, true) || $fileSize > $maxSize) {
        echo json_encode([['status' => 'fail', 'msg' => 'Please upload a valid image (JPEG, PNG, GIF, or WEBP) up to 5MB.']]);
        exit;
    }

    if (!@getimagesize($tmpName)) {
        echo json_encode([['status' => 'fail', 'msg' => 'Invalid image file.']]);
        exit;
    }

    $imageExt = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    if (!in_array($imageExt, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true)) {
        echo json_encode([['status' => 'fail', 'msg' => 'Invalid image extension.']]);
        exit;
    }

    $randImageName = 'id' . bin2hex(random_bytes(5)) . time() . '.' . $imageExt;
    $destinationPath = $uploadDir . DIRECTORY_SEPARATOR . $randImageName;
    $info['image'] = $randImageName;

    if (!move_uploaded_file($tmpName, $destinationPath)) {
        echo json_encode([['status' => 'fail', 'msg' => 'Failed to upload image.']]);
        exit;
    }
}

if ($obj->insertData("testimonials", $info)) {
    $response[] = ['status' => 'success', 'msg' => 'Created successfully'];
} else {
    $response[] = ['status' => 'fail', 'msg' => 'Failed to create testimonial. Please try again.'];
}

echo json_encode($response);
exit;
