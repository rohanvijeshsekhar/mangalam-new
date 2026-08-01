<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();
$response = [];

// Allowed image types and max size
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$max_size      = 2 * 1024 * 1024; // 2 MB

if (!isset($_FILES['logo']) || $_FILES['logo']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([['status' => 'error', 'msg' => 'No image uploaded or upload error']]);
    exit;
}

$tmp_name  = $_FILES['logo']['tmp_name'];
$file_type = mime_content_type($tmp_name);
$file_size = $_FILES['logo']['size'];

if (!in_array($file_type, $allowed_types, true) || $file_size > $max_size) {
    echo json_encode([['status' => 'error', 'msg' => 'Invalid file type or size exceeds 2MB']]);
    exit;
}

$upload_dir = realpath(__DIR__ . '/../files/partners');
if ($upload_dir === false) {
    echo json_encode([['status' => 'error', 'msg' => 'Upload directory not found']]);
    exit;
}

$file_extension = strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION));
$randName       = genRandomString() . time() . '.' . $file_extension;
$destination    = $upload_dir . DIRECTORY_SEPARATOR . $randName;

$info = ['logo' => $randName];
$insert = $obj->insertData("partners", $info);

if ($insert) {
    if (!compress($tmp_name, $destination, 90)) {
        echo json_encode([['status' => 'error', 'msg' => 'Image compression failed']]);
        exit;
    }
    $response[] = ['status' => 'success', 'msg' => 'Created Successfully'];
} else {
    $response[] = ['status' => 'fail', 'msg' => 'Technical issue, contact developers'];
}

echo json_encode($response);
exit;

/* ----------------------------- compress image ----------------------------- */
function compress($source, $destination, $quality)
{
    $info = getimagesize($source);
    $image_types = [
        'image/jpeg' => 'imagecreatefromjpeg',
        'image/gif'  => 'imagecreatefromgif',
        'image/png'  => 'imagecreatefrompng',
        'image/webp' => 'imagecreatefromwebp',
    ];
    if (!isset($image_types[$info['mime']])) {
        return false;
    }

    $image = $image_types[$info['mime']]($source);

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
