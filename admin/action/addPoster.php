<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();
$response = [];

// Allowed file types and max size
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$max_size      = 5 * 1024 * 1024; // 5MB

if (!isset($_FILES['posterImage']) || $_FILES['posterImage']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid or missing poster image']]);
    exit;
}

$path = realpath(__DIR__ . '/../files/posters');
if ($path === false) {
    // Create directory if it doesn't exist
    $path = __DIR__ . '/../files/posters';
    if (!is_dir($path)) {
        mkdir($path, 0777, true);
        $path = realpath($path);
    } else {
        $path = realpath($path);
    }
}

$posterTmp = $_FILES['posterImage']['tmp_name'];
$posterType = mime_content_type($posterTmp);

if (!in_array($posterType, $allowed_types, true)) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid image type']]);
    exit;
}

if ($_FILES['posterImage']['size'] > $max_size) {
    echo json_encode([['status' => 0, 'msg' => 'Image size exceeds 5MB']]);
    exit;
}

$posterExt = strtolower(pathinfo($_FILES['posterImage']['name'], PATHINFO_EXTENSION));
$randImageName = genRandomString() . '.' . $posterExt;

$info = [
    'image'    => $randImageName,
    'status'   => 1
];

if (!move_uploaded_file($posterTmp, $path . DIRECTORY_SEPARATOR . $randImageName)) {
    echo json_encode([['status' => 0, 'msg' => 'Error while uploading image']]);
    exit;
}

$insertPoster = $obj->insertData("posters", $info);
if ($insertPoster) {
    $response[] = ['status' => 1, 'msg' => 'Poster Added Successfully'];
} else {
    $response[] = ['status' => 0, 'msg' => 'Error while inserting poster data'];
}

echo json_encode($response);
exit;

/* ------------------------------- random name ------------------------------ */
function genRandomString($length = 10)
{
    $characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWZYZ";
    $string = "poster";
    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[random_int(0, strlen($characters) - 1)];
    }
    return strtolower($string);
}
?>
