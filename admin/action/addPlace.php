<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();
$response = [];

// Validate place name
if (empty($_POST['place_name']) || !is_string($_POST['place_name'])) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid place name']]);
    exit;
}

$placeName = trim($_POST['place_name']);
$slugUrl   = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $placeName)));

// Validate destination ID
if (!isset($_POST['destination']) || !ctype_digit($_POST['destination'])) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid destination ID']]);
    exit;
}
$destinationId = (int) $_POST['destination'];

// Validate meta
$meta = isset($_POST['meta']) ? trim($_POST['meta']) : '';

$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$max_size = 2 * 1024 * 1024; // 2MB

$upload_dir = realpath(__DIR__ . '/../files/place');
if ($upload_dir === false) {
    echo json_encode([['status' => 0, 'msg' => 'Upload directory not found']]);
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid place image']]);
    exit;
}

// Validate uploaded image
$tmp_name = $_FILES['image']['tmp_name'];
$type = mime_content_type($tmp_name);
$size = $_FILES['image']['size'];

if (!in_array($type, $allowed_types, true) || $size > $max_size) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid image type or size exceeded']]);
    exit;
}

$ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
$randImageName = genRandomString() . '.' . $ext;
$destination_path = $upload_dir . DIRECTORY_SEPARATOR . $randImageName;

$info = [
    'place_name'     => $placeName,
    'destination_id' => $destinationId,
    'meta'           => $meta,
    'image'          => $randImageName,
    'slug_url'       => $slugUrl,
];

// Insert into DB
$insertPlace = $obj->insertData("places", $info);
if ($insertPlace && compress($tmp_name, $destination_path, 90)) {
    $response[] = ['status' => 1, 'msg' => 'Place Created Successfully'];
} else {
    $response[] = ['status' => 0, 'msg' => 'Something went wrong, try again'];
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

    $image_types = [
        'image/jpeg' => 'imagecreatefromjpeg',
        'image/gif'  => 'imagecreatefromgif',
        'image/png'  => 'imagecreatefrompng',
        'image/webp' => 'imagecreatefromwebp',
    ];

    if (!isset($image_types[$info['mime']])) {
        return false;
    }

    $image = @$image_types[$info['mime']]($source);
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
