<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj      = new Query();
$response = [];
date_default_timezone_set("Asia/Calcutta");
$current_dateTime = date('Y-m-d H:i:s');

function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$slug_url   = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', sanitizeInput($_POST['title'] ?? ''))));
$activityId = intval($_POST['id'] ?? 0);

if ($activityId <= 0) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid activity ID']]);
    exit;
}

$path = "../files/activities/";

$infoActivity = [
    'title'           => sanitizeInput($_POST['title'] ?? ''),
    'short_title'     => sanitizeInput($_POST['short_title'] ?? ''),
    'destination_id'  => intval($_POST['destination'] ?? 0),
    'duration'        => sanitizeInput($_POST['duration'] ?? ''),
    'hotel_type'      => sanitizeInput($_POST['hotel_type'] ?? ''),
    'description'     => sanitizeInput($_POST['description'] ?? ''),
    'adult_msg'       => sanitizeInput($_POST['adult_msg'] ?? ''),
    'children_msg'    => sanitizeInput($_POST['children_msg'] ?? ''),
    'child_amount'    => floatval($_POST['children_amount'] ?? 0),
    'cancellation'    => sanitizeInput($_POST['cancellation'] ?? ''),
    'transportation'  => sanitizeInput($_POST['transportation'] ?? ''),
    'discount_amount' => floatval($_POST['discount_amount'] ?? 0),
    'meta'            => sanitizeInput($_POST['meta'] ?? ''),
    'validity'        => sanitizeInput($_POST['validity'] ?? ''),
    'display_amount'  => floatval($_POST['display_amount'] ?? 0),
    'featured'        => intval($_POST['featured'] ?? 0),
    'slug_url'        => $slug_url,
    'updated'         => $current_dateTime,
];

if (isset($_FILES['card_image']) && $_FILES['card_image']['error'] === UPLOAD_ERR_OK) {
    $cardImageExt = strtolower(pathinfo($_FILES['card_image']['name'], PATHINFO_EXTENSION));
    if (in_array($cardImageExt, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $randCardImageName = genRandomString() . time() . '.' . $cardImageExt;
        $infoActivity['card_image'] = $randCardImageName;
    }
}

$updateActivity = $obj->updateData("activities", $infoActivity, "WHERE activity_id = {$activityId}");
if ($updateActivity) {
    $statusReset = ['status' => 0];

    if (!empty($infoActivity['card_image'])) {
        compress($_FILES['card_image']['tmp_name'], $path . $infoActivity['card_image'], 90);
    }

    if (isset($_FILES['images']['name']) && is_array($_FILES['images']['name'])) {
        $obj->updateData("activity_images", $statusReset, "WHERE activity_id = {$activityId}");
        foreach ($_FILES['images']['name'] as $i => $name) {
            if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
                if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $randImageName = genRandomString() . time() . '.' . $ext;
                    $obj->insertData("activity_images", ['activity_id' => $activityId, 'image' => $randImageName]);
                    compress($_FILES['images']['tmp_name'][$i], $path . $randImageName, 90);
                }
            }
        }
    }

    $sections = [
        'activity_highlights'      => json_decode($_POST['highlights'] ?? '[]', true),
        'activity_includes'        => json_decode($_POST['includes'] ?? '[]', true),
        'activity_excludes'        => json_decode($_POST['excludes'] ?? '[]', true),
        'activity_thinks_to_know'  => json_decode($_POST['thinks_to_know'] ?? '[]', true),
    ];

    foreach ($sections as $table => $items) {
        $obj->updateData($table, $statusReset, "WHERE activity_id = {$activityId}");
        foreach ($items as $value) {
            if (!empty($value)) {
                $column = $table === 'activity_highlights' ? 'highlights' : ($table === 'activity_includes' ? 'includes' : ($table === 'activity_excludes' ? 'excludes' : 'data'));
                $obj->insertData($table, ['activity_id' => $activityId, $column => sanitizeInput($value)]);
            }
        }
    }

    $faqItems = json_decode($_POST['faq'] ?? '[]');
    $obj->updateData("faq_activity", $statusReset, "WHERE activity_id = {$activityId}");
    foreach ($faqItems as $item) {
        if (!empty($item->question)) {
            $obj->insertData("faq_activity", [
                'activity_id' => $activityId,
                'question'    => sanitizeInput($item->question),
                'answer'      => sanitizeInput($item->answer ?? ''),
            ]);
        }
    }

    $response[] = ['status' => 1, 'msg' => 'Activity updated successfully'];
} else {
    $response[] = ['status' => 0, 'msg' => 'Technical Issue Contact Developers'];
}

echo json_encode($response);

function compress($source, $destination, $quality) {
    $info = @getimagesize($source);
    if (!$info) return false;
    $createFunc = [
        'image/jpeg' => 'imagecreatefromjpeg',
        'image/gif'  => 'imagecreatefromgif',
        'image/png'  => 'imagecreatefrompng',
        'image/webp' => 'imagecreatefromwebp'
    ];
    if (!isset($createFunc[$info['mime']])) return false;
    $image = @$createFunc[$info['mime']]($source);
    if ($image) imagejpeg($image, $destination, $quality);
    return $destination;
}

function genRandomString() {
    $characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $string = "id";
    for ($p = 0; $p < 10; $p++) {
        $string .= $characters[random_int(0, strlen($characters) - 1)];
    }
    return strtolower($string);
}
?>
