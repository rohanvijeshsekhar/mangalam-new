<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
header('Content-Type: application/json; charset=utf-8');

$obj = new Query();
$response = [];

// Allowed file types and max size
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$max_size      = 2 * 1024 * 1024; // 2MB

if (
    !isset($_FILES['destinationCardImage'], $_FILES['destinationInnerImage'], $_FILES['destinationIcon'], $_POST['destinationName']) ||
    $_FILES['destinationCardImage']['error'] !== UPLOAD_ERR_OK ||
    $_FILES['destinationInnerImage']['error'] !== UPLOAD_ERR_OK ||
    $_FILES['destinationIcon']['error'] !== UPLOAD_ERR_OK
) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid or missing destination images']]);
    exit;
}

$path = realpath(__DIR__ . '/../files/destinations');
if ($path === false) {
    echo json_encode([['status' => 0, 'msg' => 'Destination upload directory not found']]);
    exit;
}

$destinationName = trim($_POST['destinationName']);
$slugUrl = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $destinationName)));

$cardTmp  = $_FILES['destinationCardImage']['tmp_name'];
$innerTmp = $_FILES['destinationInnerImage']['tmp_name'];
$iconTmp = $_FILES['destinationIcon']['tmp_name'];
$cardType = mime_content_type($cardTmp);
$innerType = mime_content_type($innerTmp);
$iconType = mime_content_type($iconTmp);

if (!in_array($cardType, $allowed_types, true) || !in_array($innerType, $allowed_types, true) || !in_array($iconType, $allowed_types, true)) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid image type']]);
    exit;
}

if (
    $_FILES['destinationCardImage']['size'] > $max_size ||
    $_FILES['destinationInnerImage']['size'] > $max_size ||
    $_FILES['destinationIcon']['size'] > $max_size
) {
    echo json_encode([['status' => 0, 'msg' => 'Image size exceeds 2MB']]);
    exit;
}

$cardExt  = strtolower(pathinfo($_FILES['destinationCardImage']['name'], PATHINFO_EXTENSION));
$innerExt = strtolower(pathinfo($_FILES['destinationInnerImage']['name'], PATHINFO_EXTENSION));
$iconExt = strtolower(pathinfo($_FILES['destinationIcon']['name'], PATHINFO_EXTENSION));
$randCardImageName  = genRandomString() . '.' . $cardExt;
$randInnerImageName = genRandomString() . '.' . $innerExt;
$randIconName = genRandomString() . '.' . $iconExt;
$info = [
    'destination_name' => $destinationName,
    'card_image'       => $randCardImageName,
    'Inner_image'      => $randInnerImageName,
    'icon'             => $randIconName,
    'discription'      => $_POST['discription'] ?? '',
    'featured'         => $_POST['featured'] ?? '',
    'meta'             => $_POST['meta'] ?? '',
    'slug_url'         => $slugUrl,
];

if (
    !compress($cardTmp, $path . DIRECTORY_SEPARATOR . $randCardImageName, 90) ||
    !compress($innerTmp, $path . DIRECTORY_SEPARATOR . $randInnerImageName, 90) ||
    !compress($iconTmp, $path . DIRECTORY_SEPARATOR . $randIconName, 90)
) {
    echo json_encode([['status' => 0, 'msg' => 'Error while uploading images']]);
    exit;
}

$insertdestination = $obj->insertData("destinations", $info);
if ($insertdestination) {
    $response[] = ['status' => 1, 'msg' => 'Destination Created Successfully'];
} else {
    $response[] = ['status' => 0, 'msg' => 'Error while inserting destination data'];
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
