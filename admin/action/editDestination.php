<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
date_default_timezone_set("Asia/Calcutta");
$current_dateTime = date('Y-m-d H:i:s');
$obj = new Query();
$response = [];

function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function compress($source, $destination, $quality) {
    $info = @getimagesize($source);
    if ($info === false) {
        return false;
    }
    $imageTypes = [
        'image/jpeg' => 'imagecreatefromjpeg',
        'image/gif'  => 'imagecreatefromgif',
        'image/png'  => 'imagecreatefrompng',
        'image/webp' => 'imagecreatefromwebp',
    ];
    if (!isset($imageTypes[$info['mime']])) {
        return false;
    }
    $image = @$imageTypes[$info['mime']]($source);
    if (!$image) {
        return false;
    }
    imagejpeg($image, $destination, $quality);
    imagedestroy($image);
    return $destination;
}

function genRandomString($length = 10) {
    $characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWZYZ";
    $string = "id";
    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[random_int(0, strlen($characters) - 1)];
    }
    return strtolower($string);
}

$destinationId   = intval($_POST['id']);
$path            = "../files/destinations/";
$destinationName = sanitizeInput($_POST['destinationName']);
$slugUrl         = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $destinationName)));
$description     = sanitizeInput($_POST['discription']);
$featured        = intval($_POST['featured']);
$meta            = sanitizeInput($_POST['meta'] ?? $_POST['meata'] ?? '');

$info = [
    'destination_name' => $destinationName,
    'discription'      => $description,

    'featured'         => $featured,
    'meta'             => $meta,
    'slug_url'         => $slugUrl,
    'updated'          => $current_dateTime,
];

if (isset($_FILES['destinationCardImage']) && is_uploaded_file($_FILES['destinationCardImage']['tmp_name'])) {
    $cardImageExt = strtolower(pathinfo($_FILES['destinationCardImage']['name'], PATHINFO_EXTENSION));
    if (in_array($cardImageExt, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $randCardImageName = genRandomString() . '.' . $cardImageExt;
        $info['card_image'] = $randCardImageName;
        compress($_FILES['destinationCardImage']['tmp_name'], $path . $randCardImageName, 90);
    }
}

if (isset($_FILES['destinationInnerImage']) && is_uploaded_file($_FILES['destinationInnerImage']['tmp_name'])) {
    $innerImageExt = strtolower(pathinfo($_FILES['destinationInnerImage']['name'], PATHINFO_EXTENSION));
    if (in_array($innerImageExt, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $randInnerImageName = genRandomString() . '.' . $innerImageExt;
        $info['Inner_image'] = $randInnerImageName;
        compress($_FILES['destinationInnerImage']['tmp_name'], $path . $randInnerImageName, 90);
    }
}

if (isset($_FILES['destinationIcon']) && is_uploaded_file($_FILES['destinationIcon']['tmp_name'])) {
    $iconExt = strtolower(pathinfo($_FILES['destinationIcon']['name'], PATHINFO_EXTENSION));
    if (in_array($iconExt, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $randIconName = genRandomString() . '.' . $iconExt;
        $info['icon'] = $randIconName;
        compress($_FILES['destinationIcon']['tmp_name'], $path . $randIconName, 90);
    }
}
$updateDestination = $obj->updateData("destinations", $info, "WHERE destination_id = $destinationId");

if ($updateDestination) {
    $response[] = ['status' => 1, 'msg' => "Destination Updated Successfully"];
} else {
    $response[] = ['status' => 0, 'msg' => "Something went wrong, try again"];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
