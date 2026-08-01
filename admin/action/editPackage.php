<?php
require_once __DIR__ . '/requireAdminAuth.php';
require_once '../../_class/query.php';
$obj = new Query();
date_default_timezone_set("Asia/Calcutta");
$current_dateTime = date('Y-m-d H:i:s');
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

$id = intval($_POST['id']);
$title = sanitizeInput($_POST['title']);
$slug_url = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
$path = "../files/packages/";

$infoPackage = [
    'title'                => $title,
    'destination_id'       => intval($_POST['destination']),
    'category'             => isset($_POST['category']) ? $_POST['category'] : 'curated_itineraries',
    'fixed_departure_date' => isset($_POST['fixed_departure_date']) ? $_POST['fixed_departure_date'] : '',
    'duration'             => sanitizeInput($_POST['duration']),
    'hotel_type'           => sanitizeInput($_POST['hotel_type']),
    'description'          => sanitizeInput($_POST['description']),
    'no_of_activites'      => intval($_POST['activities']),
    'cancellation'         => sanitizeInput($_POST['cancellation']),
    'transportation'       => sanitizeInput($_POST['transportation']),
    'amount'               => floatval($_POST['amount']),
    'meta'                 => sanitizeInput($_POST['meta']),
    'slug_url'             => $slug_url,
    'updated'              => $current_dateTime,
];

if (isset($_FILES['card_image']) && is_uploaded_file($_FILES['card_image']['tmp_name'])) {
    $cardImageExt = strtolower(pathinfo($_FILES['card_image']['name'], PATHINFO_EXTENSION));
    if (in_array($cardImageExt, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $randCardImageName = genRandomString() . time() . '.' . $cardImageExt;
        $infoPackage['card_image'] = $randCardImageName;
    }
}

$updatePackage = $obj->updateData("packages", $infoPackage, "WHERE package_id = $id");
if ($updatePackage) {
    if (isset($randCardImageName)) {
        compress($_FILES['card_image']['tmp_name'], $path . $randCardImageName, 90);
    }
    $infoDelete = ['status' => 0];

    if (isset($_FILES['images'])) {
        $obj->updateData("package_images", $infoDelete, "WHERE package_id = $id");
        foreach ($_FILES['images']['name'] as $key => $name) {
            $ImageExt = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (in_array($ImageExt, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                $randImageName = genRandomString() . '.' . $ImageExt;
                $obj->insertData("package_images", ['package_id' => $id, 'image_name' => $randImageName]);
                compress($_FILES['images']['tmp_name'][$key], $path . $randImageName, 90);
            }
        }
    }

    $obj->updateData("package_highlights", $infoDelete, "WHERE package_id = $id");
    foreach (json_decode($_POST['highlights']) as $item) {
        if (!empty($item)) {
            $obj->insertData("package_highlights", ['package_id' => $id, 'highlights' => sanitizeInput($item)]);
        }
    }

    $obj->updateData("package_include", $infoDelete, "WHERE package_id = $id");
    foreach (json_decode($_POST['includes']) as $item) {
        if (!empty($item)) {
            $obj->insertData("package_include", ['package_id' => $id, 'includes' => sanitizeInput($item)]);
        }
    }

    $obj->updateData("package_exclude", $infoDelete, "WHERE package_id = $id");
    foreach (json_decode($_POST['excludes']) as $item) {
        if (!empty($item)) {
            $obj->insertData("package_exclude", ['package_id' => $id, 'excludes' => sanitizeInput($item)]);
        }
    }

    $obj->updateData("thinks_to_know", $infoDelete, "WHERE package_id = $id");
    foreach (json_decode($_POST['thinks_to_know']) as $item) {
        if (!empty($item)) {
            $obj->insertData("thinks_to_know", ['package_id' => $id, 'data' => sanitizeInput($item)]);
        }
    }

    /* Soft-delete itinerary days removed from the form (even if X only cleared the DOM) */
    $keepIds = [];
    if (!empty($_POST['id_array']) && is_array($_POST['id_array'])) {
        foreach ($_POST['id_array'] as $keepId) {
            if ($keepId !== 'new' && $keepId !== '' && ctype_digit((string) $keepId)) {
                $keepIds[] = intval($keepId);
            }
        }
    }
    if (!empty($keepIds)) {
        $idsList = implode(',', $keepIds);
        $obj->updateData(
            "package_itineary",
            $infoDelete,
            "WHERE package_id = $id AND itineary_id NOT IN ($idsList)"
        );
    } else {
        $obj->updateData("package_itineary", $infoDelete, "WHERE package_id = $id");
    }

    if (!empty($_POST['itineary_title']) && is_array($_POST['itineary_title'])) {
        foreach ($_POST['itineary_title'] as $i => $title) {
            $it_id = isset($_POST['id_array'][$i]) ? $_POST['id_array'][$i] : 'new';
            $itineraryInfo = [
                'package_id'  => $id,
                'title'       => sanitizeInput($title),
                'description' => sanitizeInput($_POST['itineary_description'][$i]),
                'status'      => 1,
            ];
            if (!empty($_FILES['itineary_images']['name'][$i])) {
                $ext = strtolower(pathinfo($_FILES['itineary_images']['name'][$i], PATHINFO_EXTENSION));
                if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $randName = md5(uniqid(rand(), true)) . '.' . $ext;
                    $itineraryInfo['image'] = $randName;
                    if (move_uploaded_file($_FILES['itineary_images']['tmp_name'][$i], "../files/itineary/" . $randName)) {
                        if ($it_id != 'new' && ctype_digit((string) $it_id)) {
                            $obj->updateData("package_itineary", $itineraryInfo, "WHERE itineary_id = " . intval($it_id));
                        } else {
                            $obj->insertData("package_itineary", $itineraryInfo);
                        }
                    }
                }
            } else {
                if ($it_id != 'new' && ctype_digit((string) $it_id)) {
                    $obj->updateData("package_itineary", $itineraryInfo, "WHERE itineary_id = " . intval($it_id));
                } else {
                    $itineraryInfo['image'] = '';
                    $obj->insertData("package_itineary", $itineraryInfo);
                }
            }
        }
    }

    $obj->updateData("faq_package", $infoDelete, "WHERE package_id = $id");
    foreach (json_decode($_POST['faq']) as $faqItem) {
        if (!empty($faqItem->question)) {
            $obj->insertData("faq_package", [
                'package_id' => $id,
                'question'   => sanitizeInput($faqItem->question),
                'answer'     => sanitizeInput($faqItem->answer),
            ]);
        }
    }

    $response[] = ['status' => 1, 'msg' => "Package updated successfully"];
} else {
    $response[] = ['status' => 0, 'msg' => "Technical Issue Contact Developers"];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
