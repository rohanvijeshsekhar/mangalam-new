<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();
$response = [];

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
if (!$id) {
    echo json_encode([['status' => 'fail', 'msg' => 'Valid testimonial ID is required']]);
    exit;
}

$name = trim(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
$role = trim(filter_input(INPUT_POST, 'role', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
$description = trim(filter_input(INPUT_POST, 'description', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

if (isset($_FILES['image']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
    $uploadDir = realpath(__DIR__ . '/../files/testimonials');
    if ($uploadDir === false) {
        echo json_encode([['status' => 'fail', 'msg' => 'Upload directory not found']]);
        exit;
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 5 * 1024 * 1024; // 5MB

    $tmpName = $_FILES['image']['tmp_name'];
    $fileType = mime_content_type($tmpName);
    $fileSize = $_FILES['image']['size'];

    if (!in_array($fileType, $allowedTypes, true) || $fileSize > $maxSize) {
        echo json_encode([['status' => 'fail', 'msg' => 'Please upload a valid image file (JPEG, PNG, GIF, or WEBP) up to 5MB in size.']]);
        exit;
    }

    $imageExt = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));

    $randImageName = genRandomString() . time() . '.' . $imageExt;
    $destinationPath = $uploadDir . DIRECTORY_SEPARATOR . $randImageName;

    $info = [
        'name'        => $name,
        'role'        => $role,
        'image'       => $randImageName,
        'description' => $description,
    ];

    if ($obj->updateData("testimonials", $info, "WHERE id = $id") && compress($tmpName, $destinationPath, 90)) {
        $response[] = ['status' => 'success', 'msg' => 'Updated successfully'];
    } else {
        $response[] = ['status' => 'fail', 'msg' => 'Failed to update. Please try again.'];
    }
} else {
    $info = [
        'name'        => $name,
        'role'        => $role,
        'description' => $description,
    ];

    if ($obj->updateData("testimonials", $info, "WHERE id = $id")) {
        $response[] = ['status' => 'success', 'msg' => 'Updated successfully'];
    } else {
        $response[] = ['status' => 'fail', 'msg' => 'Failed to update. Please try again.'];
    }
}

echo json_encode($response);
exit;

/* ----------------------------- compress image ----------------------------- */
function compress($source, $destination, $quality)
{
    $info = @getimagesize($source);
    if (!$info) {
        return false;
    }

    $createFuncs = [
        'image/jpeg' => 'imagecreatefromjpeg',
        'image/gif'  => 'imagecreatefromgif',
        'image/png'  => 'imagecreatefrompng',
        'image/webp' => 'imagecreatefromwebp',
    ];

    if (!isset($createFuncs[$info['mime']])) {
        return false;
    }

    $image = @$createFuncs[$info['mime']]($source);
    if (!$image) {
        return false;
    }

    switch ($info['mime']) {
        case 'image/png':
            imagepng($image, $destination, 9);
            break;
        case 'image/webp':
            imagewebp($image, $destination, $quality);
            break;
        default:
            imagejpeg($image, $destination, $quality);
    }

    imagedestroy($image);
    return true;
}

/* ------------------------------- random name ------------------------------ */
function genRandomString($length = 10)
{
    $characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWZYZ";
    $string = "id";
    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[random_int(0, strlen($characters) - 1)];
    }
    return strtolower($string);
}
