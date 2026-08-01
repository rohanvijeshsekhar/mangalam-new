<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();
$response = [];

// Validate destination ID
if (!isset($_POST['destination']) || !ctype_digit($_POST['destination'])) {
    echo json_encode([['status' => 'fail', 'msg' => 'Invalid destination ID']]);
    exit;
}
$destination_id = (int) $_POST['destination'];

// Fetch slug safely
$fetchSlug = $obj->selectData("slug_url", "destinations", "WHERE destination_id = {$destination_id}");
if (!$fetchSlug || $fetchSlug->num_rows === 0) {
    echo json_encode([['status' => 'fail', 'msg' => 'Destination not found']]);
    exit;
}
$slug_row = $fetchSlug->fetch_assoc();
$slug = $slug_row['slug_url'];

$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$max_size = 2 * 1024 * 1024; // 2MB
$upload_dir = realpath(__DIR__ . '/../files/marketing');
if ($upload_dir === false) {
    echo json_encode([['status' => 'fail', 'msg' => 'Upload directory not found']]);
    exit;
}

if (!isset($_FILES['images']) || !is_array($_FILES['images']['name'])) {
    echo json_encode([['status' => 'fail', 'msg' => 'No images selected']]);
    exit;
}

$current_count = $obj->selectData("id", "destination_marketing_images", "WHERE destination_id = {$destination_id} AND status != 0")->num_rows;
if ($current_count >= 4) {
    echo json_encode([['status' => 'fail', 'msg' => 'Limiting the response to four images.']]);
    exit;
}

$uploaded_count = 0;
for ($x = 0; $x < count($_FILES['images']['name']); $x++) {
    if ($_FILES['images']['error'][$x] !== UPLOAD_ERR_OK) {
        continue;
    }

    $tmp_name = $_FILES['images']['tmp_name'][$x];
    $type = mime_content_type($tmp_name);
    $size = $_FILES['images']['size'][$x];

    if (!in_array($type, $allowed_types, true) || $size > $max_size) {
        continue;
    }

    $ext = strtolower(pathinfo($_FILES['images']['name'][$x], PATHINFO_EXTENSION));
    $randImageName = genRandomString() . '.' . $ext;
    $destination_path = $upload_dir . DIRECTORY_SEPARATOR . $randImageName;

    if (compress($tmp_name, $destination_path, 90)) {
        $info = [
            'destination_id' => $destination_id,
            'slug_url'       => $slug,
            'image'          => $randImageName,
        ];

        if ($current_count + $uploaded_count < 4) {
            $obj->insertData("destination_marketing_images", $info);
            $uploaded_count++;
        }
    }
}

if ($uploaded_count > 0) {
    $response[] = ['status' => 'success', 'msg' => 'Created Successfully'];
} else {
    $response[] = ['status' => 'fail', 'msg' => 'No valid images uploaded'];
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
