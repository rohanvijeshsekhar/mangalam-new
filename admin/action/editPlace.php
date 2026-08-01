<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
date_default_timezone_set("Asia/Calcutta");
$current_dateTime = date('Y-m-d H:i:s');
$obj = new Query();
$response = [];
$path = "../files/place/";

$placeId = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$placeName = isset($_POST['place_name']) ? trim(htmlspecialchars($_POST['place_name'])) : '';
$destinationId = filter_input(INPUT_POST, 'destination', FILTER_VALIDATE_INT);
$meta = isset($_POST['meta']) ? trim(htmlspecialchars($_POST['meta'])) : '';
$slugUrl = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $placeName)));

if (!$placeId || !$placeName || !$destinationId) {
    $response[] = ['status' => 0, 'msg' => 'Invalid input'];
    echo json_encode($response);
    exit;
}

if (isset($_FILES['image']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
    $imageInfo = pathinfo($_FILES['image']['name']);
    $imageExt = strtolower($imageInfo['extension']);
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($imageExt, $allowedExts)) {
        $response[] = ['status' => 0, 'msg' => 'Invalid image format'];
        echo json_encode($response);
        exit;
    }

    $randImageName = genRandomString() . '.' . $imageExt;
    $info = [
        'place_name'     => $placeName,
        'image'          => $randImageName,
        'destination_id' => $destinationId,
        'meta'           => $meta,
        'slug_url'       => $slugUrl,
        'updated'        => $current_dateTime,
    ];

    if ($obj->updateData("places", $info, "WHERE place_id = $placeId")) {
        compress($_FILES['image']['tmp_name'], $path . $randImageName, 90);
        $response[] = ['status' => 1, 'msg' => 'Place updated successfully'];
    } else {
        $response[] = ['status' => 0, 'msg' => 'Something went wrong, try again'];
    }
} else {
    $info = [
        'place_name'     => $placeName,
        'destination_id' => $destinationId,
        'meta'           => $meta,
        'slug_url'       => $slugUrl,
        'updated'        => $current_dateTime,
    ];

    if ($obj->updateData("places", $info, "WHERE place_id = $placeId")) {
        $response[] = ['status' => 1, 'msg' => 'Place updated successfully'];
    } else {
        $response[] = ['status' => 0, 'msg' => 'Something went wrong, try again'];
    }
}

echo json_encode($response);

function compress($source, $destination, $quality) {
    $info = @getimagesize($source);
    if ($info === false) {
        return false;
    }

    switch ($info['mime']) {
        case 'image/jpeg':
            $image = imagecreatefromjpeg($source);
            break;
        case 'image/gif':
            $image = imagecreatefromgif($source);
            break;
        case 'image/png':
            $image = imagecreatefrompng($source);
            break;
        case 'image/webp':
            $image = imagecreatefromwebp($source);
            break;
        default:
            return false;
    }

    imagejpeg($image, $destination, $quality);
    imagedestroy($image);
    return $destination;
}


function genRandomString() {
    return strtolower('id' . bin2hex(random_bytes(5)));
}
