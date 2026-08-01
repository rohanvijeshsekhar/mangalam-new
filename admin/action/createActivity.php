<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj               = new Query();
$respose           = [];
$slug_url          = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $_POST['title'])));
$path              = "../files/activities/";
$allowedImageExts  = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$card_image_name   = $_FILES['card_image']['name'];
$cardImageExt      = strtolower(pathinfo($card_image_name, PATHINFO_EXTENSION));
if (!in_array($cardImageExt, $allowedImageExts, true) || !@getimagesize($_FILES['card_image']['tmp_name'])) {
    echo json_encode([['status' => 0, 'msg' => 'Invalid card image']]);
    exit;
}
$randCardImageName = genRandomString() . time() . '.' . $cardImageExt;
$random_number     = mt_rand(1000, 9999);

$infoActivity = [
    'title'           => $_POST['title'],
    'short_title'     => $_POST['short_title'],
    'destination_id'  => $_POST['destination'],
    'rand_id'         => $random_number,
    'duration'        => $_POST['duration'],
    'hotel_type'      => $_POST['hotel_type'],
    'description'     => $_POST['description'],
    'adult_msg'       => $_POST['adult_msg'],
    'children_msg'    => $_POST['children_msg'],
    'cancellation'    => $_POST['cancellation'],
    'transportation'  => $_POST['transportation'],
    'discount_amount' => $_POST['discount_amount'],
    'meta'            => $_POST['meta'],
    'validity'        => $_POST['validity'],
    'display_amount'  => $_POST['display_amount'],
    'child_amount'    => $_POST['children_amount'],
    'featured'        => $_POST['featured'],
    'card_image'      => $randCardImageName,
    'slug_url'        => $slug_url,
];
/* ---------------------------- inserting activity data ---------------------------- */
$createActivity = $obj->insertData("activities", $infoActivity);
if ($createActivity) {
    compress($_FILES['card_image']['tmp_name'], $path . $randCardImageName, 90);
    $fetchTicketId = $obj->selectData("activity_id", "activities", "where status != 0 order by activity_id desc limit 1");
    $activityRow   = mysqli_fetch_array($fetchTicketId);
    $activity_id   = $activityRow['activity_id'];

    /* ------------------------ inserting ticket images ------------------------ */
    if (isset($_FILES['images'])) {
        for ($i = 0; $i < sizeof($_FILES['images']['name']); $i++) {
            $ImageName     = $_FILES['images']['name'][$i];
            $ImageExt      = strtolower(pathinfo($ImageName, PATHINFO_EXTENSION));
            if (!in_array($ImageExt, $allowedImageExts, true) || !@getimagesize($_FILES['images']['tmp_name'][$i])) {
                continue;
            }
            $randImageName = genRandomString() . time() . '.' . $ImageExt;
            $infoImages    = ['activity_id' => $activity_id, 'image' => $randImageName];
            $insertImages  = $obj->insertData("activity_images", $infoImages);
            compress($_FILES['images']['tmp_name'][$i], $path . $randImageName, 90);
        }
    }

    /* -------------------------- inserting highlights -------------------------- */
    $highlight = json_decode($_POST['highlights']);
    for ($i = 0; $i < sizeof($highlight); $i++) {
        if ($highlight[$i] != '') {
            $infoHighlight = [
                'activity_id' => $activity_id,
                'highlights'  => $highlight[$i],
            ];
            $insertHighlight = $obj->insertData("activity_highlights", $infoHighlight);
        }
    }

    /* ----------------------- inserting includes ----------------------- */
    $includes = json_decode($_POST['includes']);
    for ($i = 0; $i < sizeof($includes); $i++) {
        if ($includes[$i] != '') {
            $infoInclude = [
                'activity_id' => $activity_id,
                'includes'    => $includes[$i],
            ];
            $insertInclude = $obj->insertData("activity_includes", $infoInclude);
        }
    }

    /* --------------------------- inserting excludes --------------------------- */
    $excludes = json_decode($_POST['excludes']);
    for ($i = 0; $i < sizeof($excludes); $i++) {
        if ($excludes[$i] != '') {
            $infoExcludes = [
                'activity_id' => $activity_id,
                'excludes'    => $excludes[$i],
            ];
            $insertExcludes = $obj->insertData("activity_excludes", $infoExcludes);
        }
    }

    /* ------------------------ inserting thinks to know ------------------------ */
    $thinks_to_know = json_decode($_POST['thinks_to_know']);
    for ($i = 0; $i < sizeof($thinks_to_know); $i++) {
        if ($thinks_to_know[$i] != '') {
            $infoThinks_to_know = [
                'activity_id' => $activity_id,
                'data'        => $thinks_to_know[$i],
            ];
            $insertThinks_to_know = $obj->insertData("activity_thinks_to_know", $infoThinks_to_know);
        }
    }

    /* --------------------------- inserting faq --------------------------- */
    $faq = json_decode($_POST['faq']); // Decode the faq object
    foreach ($faq as $item) {
        // Check if the title is not empty
        if (!empty($item->question)) {
            // Create an array of faq information
            $faqInfo = [
                'activity_id' => $activity_id,
                'question'    => $item->question,
                'answer'      => $item->answer,
            ];
            // Insert the faq info into the database
            $obj->insertData("faq_activity", $faqInfo);
        }
    }

    $respose[0]['status'] = 1;
    $respose[0]['msg']    = "Activity created successfully";
} else {
    $respose[0]['status'] = 0;
    $respose[0]['msg']    = "Technical Issue Contact Developers";
}

echo json_encode($respose);

/* ----------------------------- compress image ----------------------------- */
function compress($source, $destination, $quality)
{
    $info = getimagesize($source);
    if ($info['mime'] == 'image/jpeg') {
        $image = imagecreatefromjpeg($source);
    } elseif ($info['mime'] == 'image/gif') {
        $image = imagecreatefromgif($source);
    } elseif ($info['mime'] == 'image/png') {
        $image = imagecreatefrompng($source);
    } elseif ($info['mime'] == 'image/webp') {
        $image = imagecreatefromwebp($source);
    } else {
        // Debugging statement
        echo "Unsupported image type: " . $info['mime'] . "\n";
    }

    // Debugging statement
    $error = error_get_last();
    if ($error !== null) {
        echo "Error: " . $error['message'] . "\n";
    }

    imagejpeg($image, $destination, $quality);
    return $destination;
}

function genRandomString()
{
    $length             = 10;
    $characters         = "0123456789ABCDEFGHIJKLMNOPQRSTUVWZYZ";
    $real_string_length = strlen($characters);
    $string             = "id";
    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[mt_rand(0, $real_string_length - 1)];
    }
    return strtolower($string);
}
